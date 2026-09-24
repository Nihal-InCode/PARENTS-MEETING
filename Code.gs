/**
 * Parents Meeting Attendance System - Google Apps Script Backend (Code.gs)
 * 
 * Features:
 * - setupSheet(): Auto-creates & formats 'Students' and 'Attendance' tabs with 159 student records.
 * - doGet(): Serves the Index.html web application UI.
 * - getClasses(): Retrieves unique, sorted list of classes.
 * - getStudentsByClass(): Retrieves students for selected class formatted as "Name (Roll No: XXX)".
 * - submitAttendance(): Appends attendance record to 'Attendance' tab with server timestamp.
 */

// Global constant array of 159 student records
const STUDENT_RECORDS = [
  ["BS1", "86", "1501", "ABDUL SALAM"],
  ["BS1", "87", "1502", "SHAMEEM"],
  ["BS1", "88", "1503", "MIKDAD TA"],
  ["BS1", "89", "1504", "ABDUL KADIR M"],
  ["BS1", "90", "1505", "NIJAD N"],
  ["BS1", "91", "1506", "JASIM CK"],
  ["BS1", "92", "1507", "MAHROOF MR"],
  ["BS1", "93", "1508", "ASHFAK SAHAF"],
  ["BS1", "94", "1509", "SHAHEER S"],
  ["BS1", "95", "1510", "AFRID"],
  ["BS1", "96", "1511", "RIFAZ"],
  ["BS1", "97", "1512", "MUHAD KA"],
  ["BS1", "98", "1513", "AHMAD SABITH"],
  ["BS1", "99", "1514", "AALAM"],
  ["BS1", "100", "1515", "NAZEEM MN"],
  ["BS1", "101", "1516", "YASEEN"],
  ["BS1", "102", "1517", "ABDUL HAKEEM"],
  ["BS1", "103", "1518", "JAWAD"],
  ["BS2", "65", "1401", "FADI AMEEN"],
  ["BS2", "66", "1402", "SALAHUDHEEN"],
  ["BS2", "67", "1403", "FAZIL"],
  ["BS2", "68", "1404", "MUAZ"],
  ["BS2", "69", "1405", "ZAHIR ABBAS AA"],
  ["BS2", "70", "1406", "MUHSIN AHMED KA"],
  ["BS2", "71", "1407", "SAIIFULLAH"],
  ["BS2", "72", "1408", "SAEED NP"],
  ["BS2", "73", "1409", "SAHL"],
  ["BS2", "74", "1410", "HAFEEZ ALI"],
  ["BS2", "76", "1412", "HARSHAD"],
  ["BS2", "77", "1413", "AA SHAMMAZ"],
  ["BS2", "78", "1414", "SALMAN FARIS M"],
  ["BS2", "79", "1415", "SHAMMAS"],
  ["BS2", "82", "1418", "BILAL"],
  ["BS3", "46", "1301", "HASSAN SAHIL KB"],
  ["BS3", "47", "1302", "ANAS"],
  ["BS3", "48", "1303", "HIBATHULLAH"],
  ["BS3", "49", "1304", "RAZIK"],
  ["BS3", "50", "1305", "IFTHIHAN"],
  ["BS3", "51", "1306", "THWAHIR"],
  ["BS3", "52", "1307", "AHMED JAWAD P"],
  ["BS3", "53", "1308", "SINAN"],
  ["BS3", "54", "1309", "YASEEN P K"],
  ["BS3", "55", "1310", "BASARI"],
  ["BS3", "56", "1311", "SALMAN MH"],
  ["BS3", "57", "1312", "NASHEEL"],
  ["BS3", "58", "1313", "MUZAMIL"],
  ["BS3", "59", "1314", "SHAHID PS"],
  ["BS3", "60", "1315", "ABDUL RAHEEM"],
  ["BS3", "61", "1316", "FAZAL"],
  ["BS3", "62", "1317", "JAVAD"],
  ["BS3", "63", "1318", "RAOOF"],
  ["BS3", "64", "1319", "MUSTHAFA MS"],
  ["BS4", "28", "1201", "HAMDAN M"],
  ["BS4", "29", "1202", "RHAUF KALASA"],
  ["BS4", "30", "1203", "AL AMEEN K.V"],
  ["BS4", "31", "1204", "NIHAL CH"],
  ["BS4", "32", "1205", "SINAN WAYANAD"],
  ["BS4", "33", "1206", "KASIM MS"],
  ["BS4", "34", "1207", "ANSAH KOLAPPARAMBIL"],
  ["BS4", "35", "1208", "FAZIL MK"],
  ["BS4", "36", "1209", "SALMANULFAREES P"],
  ["BS4", "37", "1210", "SIYADH PK"],
  ["BS4", "38", "1211", "ABDUSWAMAD . V"],
  ["BS4", "39", "1212", "HIDAYATHULLA M E"],
  ["BS4", "40", "1213", "MARSHAD IBRAHIM"],
  ["BS4", "41", "1214", "NAJIYURAHMAN K H"],
  ["BS4", "42", "1215", "SHINAN.KM"],
  ["BS4", "43", "1216", "SHAMMAS KASARAGOD"],
  ["BS4", "44", "1217", "FAZAL RAHMAN TP"],
  ["BS4", "45", "1218", "ANEESH"],
  ["BS5", "15", "1101", "FAZILURAHMAN"],
  ["BS5", "16", "1102", "UNAIS"],
  ["BS5", "17", "1103", "AAMIR SHIFAN KM"],
  ["BS5", "18", "1104", "FAHADH"],
  ["BS5", "19", "1105", "JAZEEL KK"],
  ["BS5", "20", "1106", "MISBAH P"],
  ["BS5", "21", "1107", "SHAMMAS EM"],
  ["BS5", "22", "1108", "UBAIS BA"],
  ["BS5", "23", "1109", "SALMANUL FARIS RK"],
  ["BS5", "24", "1110", "SIKANDHAR BADHUSHA NS"],
  ["BS5", "25", "1111", "IJAS K K"],
  ["BS5", "26", "1112", "MIBHAJ AHMED AK"],
  ["BS5", "27", "1113", "MUSTHAQ M"],
  ["BSU1", "107", "15001", "TAYYEB"],
  ["BSU1", "108", "15002", "SIRAJ"],
  ["BSU1", "109", "15003", "RAFI"],
  ["BSU1", "110", "15004", "MUZAMMIL"],
  ["BSU1", "111", "15005", "ABDURREHMAN"],
  ["BSU1", "112", "15006", "ALI"],
  ["BSU1", "113", "15007", "NABEEL RAZA"],
  ["BSU1", "114", "15008", "SABIR SHEIKH"],
  ["BSU1", "202", "15009", "SHAREEF RAHMAN"],
  ["HS1", "157", "1701", "AFSAL PA"],
  ["HS1", "159", "1703", "HANEEF"],
  ["HS1", "160", "1704", "ISMAIL AMANUDDHIN"],
  ["HS1", "161", "1705", "MIQDAD"],
  ["HS1", "162", "1706", "RAHIF"],
  ["HS1", "163", "1707", "SUHAIL"],
  ["HS1", "164", "1708", "AHAMMAD SAZIL"],
  ["HS1", "165", "1709", "FAHIM"],
  ["HS1", "166", "1710", "FAHIS . P U"],
  ["HS1", "167", "1711", "KAIS"],
  ["HS1", "168", "1712", "NEBEEL PP"],
  ["HS1", "169", "1713", "RISAD"],
  ["HS1", "170", "1714", "RISWAD K"],
  ["HS1", "171", "1715", "SAHABAZ"],
  ["HS1", "172", "1716", "THAWHEED M"],
  ["HS1", "173", "1717", "YASIN"],
  ["HS1", "198", "1720", "SAYEED"],
  ["HS2", "115", "1601", "midlaj"],
  ["HS2", "116", "1602", "swalih"],
  ["HS2", "117", "1603", "Shifan"],
  ["HS2", "118", "1604", "SINAN P B"],
  ["HS2", "119", "1605", "ZIYAD MA"],
  ["HS2", "120", "1606", "Fayiz"],
  ["HS2", "121", "1607", "Abdul Rahoof CM"],
  ["HS2", "122", "1608", "MUHEENUDDEEN"],
  ["HS2", "123", "1609", "MUN- ISH S M"],
  ["HS2", "124", "1610", "Ajmal"],
  ["HS2", "125", "1611", "BILAL P P"],
  ["HS2", "126", "1612", "RAMZI"],
  ["HS2", "127", "1613", "Moiden Faiz"],
  ["HS2", "128", "1614", "Navadh vn"],
  ["HS2", "129", "1615", "HAKEEM T A"],
  ["HS2", "130", "1616", "Umar Fahad M K"],
  ["HS2", "131", "1617", "Mubasshir Muhiyadeen"],
  ["HS2", "132", "1618", "Athif M"],
  ["HS2", "133", "1619", "twahir bava"],
  ["HS2", "134", "1620", "NU-AMAN"],
  ["HS2", "135", "1621", "HASHIM"],
  ["HS2", "136", "1622", "RAZEE"],
  ["HS2", "137", "1623", "Afeef"],
  ["HSU1", "199", "17001", "FARHAN"],
  ["HSU1", "175", "17002", "AMEEN SADIQ"],
  ["HSU1", "177", "17003", "ARSHAD AYYOOB"],
  ["HSU1", "178", "17004", "AYAN"],
  ["HSU1", "180", "17005", "ARIZ HASHAM"],
  ["HSU1", "181", "17006", "FAIZAN"],
  ["HSU1", "182", "17007", "GULFRAZ AHMED"],
  ["HSU1", "183", "17008", "HISHAM SHARIFF"],
  ["HSU1", "184", "17009", "MUHAMMED RAYAN"],
  ["HSU1", "185", "17010", "MUHAMMED MUHSIN"],
  ["HSU1", "187", "17012", "RIZWAN BHAT"],
  ["HSU1", "188", "17013", "SADAB ALAM"],
  ["HSU1", "190", "17015", "SHANWAZ"],
  ["HSU1", "191", "17016", "SK HUSSAIN"],
  ["HSU1", "192", "17017", "TABRIZ"],
  ["HSU1", "194", "17019", "TAWQEER"],
  ["HSU1", "201", "17020", "GULZAR"],
  ["HSU2", "145", "16001", "MUZAMMIL KHAN"],
  ["HSU2", "146", "16002", "ZIYAUDHIN"],
  ["HSU2", "147", "16003", "GHULAM YASEEN"],
  ["HSU2", "148", "16004", "MEHBOOB"],
  ["HSU2", "149", "16005", "OWAIS"],
  ["HSU2", "150", "16006", "ZAFFAR IQBAL"],
  ["HSU2", "151", "16007", "YOUNUS"],
  ["HSU2", "152", "16008", "KABIR"],
  ["HSU2", "153", "16009", "UMAR"],
  ["HSU2", "154", "16010", "HAMZA"],
];

/**
 * Programmatically initializes or formats the Google Spreadsheet.
 * Creates two tabs: 'Students' and 'Attendance'.
 * Seeds 159 complete student records into 'Students'.
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Setup 'Students' tab
  let studentsSheet = ss.getSheetByName('Students');
  if (!studentsSheet) {
    studentsSheet = ss.insertSheet('Students');
  } else {
    studentsSheet.clear(); // Clear existing content to re-seed cleanly
  }
  
  const studentHeaders = ['Class', 'Student ID', 'Roll No', 'Name'];
  studentsSheet.getRange(1, 1, 1, studentHeaders.length).setValues([studentHeaders]);
  
  // Format Students Header Row
  const studentHeaderRange = studentsSheet.getRange(1, 1, 1, studentHeaders.length);
  studentHeaderRange.setFontWeight('bold');
  studentHeaderRange.setBackground('#1e293b');
  studentHeaderRange.setFontColor('#ffffff');
  studentHeaderRange.setHorizontalAlignment('center');
  
  // Append 159 student records
  if (STUDENT_RECORDS.length > 0) {
    studentsSheet.getRange(2, 1, STUDENT_RECORDS.length, STUDENT_RECORDS[0].length).setValues(STUDENT_RECORDS);
  }
  studentsSheet.autoResizeColumns(1, studentHeaders.length);
  studentsSheet.setFrozenRows(1);
  
  // 2. Setup 'Attendance' tab
  let attendanceSheet = ss.getSheetByName('Attendance');
  if (!attendanceSheet) {
    attendanceSheet = ss.insertSheet('Attendance');
  }
  
  // Check if header exists in Attendance
  if (attendanceSheet.getLastRow() === 0) {
    const attendanceHeaders = ['Timestamp', 'Class', 'Student Name', 'Parent Name', 'Contact (Father)', 'Contact (Mother)', 'WhatsApp'];
    attendanceSheet.getRange(1, 1, 1, attendanceHeaders.length).setValues([attendanceHeaders]);
    
    // Format Attendance Header Row
    const attendanceHeaderRange = attendanceSheet.getRange(1, 1, 1, attendanceHeaders.length);
    attendanceHeaderRange.setFontWeight('bold');
    attendanceHeaderRange.setBackground('#0f172a');
    attendanceHeaderRange.setFontColor('#ffffff');
    attendanceHeaderRange.setHorizontalAlignment('center');
    attendanceSheet.autoResizeColumns(1, attendanceHeaders.length);
    attendanceSheet.setFrozenRows(1);
  }

  Logger.log('Sheet setup complete! 159 students seeded successfully.');
  return 'Sheet setup completed successfully! 159 student records seeded.';
}

/**
 * Web app entry point (GET).
 * - ?action=classes           → JSON array of class names
 * - ?action=students&class=X  → JSON array of student display strings
 * - no action                 → serves the HTML UI (legacy Apps Script host)
 */
function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : null;

  if (action === 'classes') {
    return jsonOutput(getClasses());
  }
  if (action === 'students') {
    return jsonOutput(getStudentsByClass(e.parameter.class || ''));
  }

  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Parents Meeting Attendance System')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

/**
 * Web app entry point (POST) — attendance submit from Vercel /api/submit.
 * Body: JSON formData { selectedClass, studentName, parentName, contact1, contact2, whatsapp }
 */
function doPost(e) {
  try {
    const formData = JSON.parse(e.postData.contents);
    return jsonOutput(submitAttendance(formData));
  } catch (error) {
    return jsonOutput({
      success: false,
      error: error.message || 'Invalid request body.'
    });
  }
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Retrieves a sorted list of unique classes from the 'Students' sheet.
 * @returns {Array<string>} Array of unique class names.
 */
function getClasses() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Students');
    if (!sheet) return [];
    
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return [];
    
    const classes = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
    const uniqueClasses = [...new Set(classes)].filter(c => c && c.toString().trim() !== '');
    
    // Custom sort order for standard batches
    const customOrder = ['BS1', 'BS2', 'BS3', 'BS4', 'BS5', 'BSU1', 'HS1', 'HS2', 'HSU1', 'HSU2'];
    uniqueClasses.sort((a, b) => {
      const indexA = customOrder.indexOf(a);
      const indexB = customOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
    
    return uniqueClasses;
  } catch (error) {
    Logger.log('Error in getClasses: ' + error.message);
    throw new Error('Failed to fetch classes: ' + error.message);
  }
}

/**
 * Retrieves students for a chosen class.
 * Returns array of formatted strings "Name (Roll No: XXX)"
 * @param {string} selectedClass - The chosen class name.
 * @returns {Array<string>} List of formatted student strings.
 */
function getStudentsByClass(selectedClass) {
  try {
    if (!selectedClass) return [];
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Students');
    if (!sheet) return [];
    
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return [];
    
    const data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
    const filteredStudents = [];
    
    for (let i = 0; i < data.length; i++) {
      const rowClass = data[i][0];
      const rollNo = data[i][2];
      const name = data[i][3];
      
      if (rowClass === selectedClass && name) {
        filteredStudents.push({
          rollNo: rollNo,
          name: name,
          displayText: `${name} (${rollNo})`
        });
      }
    }
    
    // Sort students by Roll No (or name if roll numbers are non-numeric)
    filteredStudents.sort((a, b) => {
      const rollA = parseInt(a.rollNo, 10);
      const rollB = parseInt(b.rollNo, 10);
      if (!isNaN(rollA) && !isNaN(rollB)) return rollA - rollB;
      return a.name.localeCompare(b.name);
    });
    
    return filteredStudents.map(s => s.displayText);
  } catch (error) {
    Logger.log('Error in getStudentsByClass: ' + error.message);
    throw new Error('Failed to fetch students: ' + error.message);
  }
}

/**
 * Submits an attendance record into the 'Attendance' sheet.
 * @param {Object} formData - Data submitted from the web frontend.
 * @returns {Object} Result object indicating success or error.
 */
function submitAttendance(formData) {
  try {
    if (!formData) throw new Error('No data provided.');
    
    const { selectedClass, studentName, parentName, contact1, contact2, whatsapp } = formData;
    
    // Server-side validations
    if (!selectedClass) throw new Error('Class selection is required.');
    if (!studentName) throw new Error('Student selection is required.');
    if (!parentName || !parentName.trim()) throw new Error('Parent Name is required.');
    if (!contact1 || !/^\d{10}$/.test(contact1.trim())) throw new Error('Primary contact must be a valid 10-digit number.');
    if (!whatsapp || !/^\d{10}$/.test(whatsapp.trim())) throw new Error('WhatsApp contact must be a valid 10-digit number.');
    if (contact2 && contact2.trim() !== '' && !/^\d{10}$/.test(contact2.trim())) {
      throw new Error('Secondary contact must be a valid 10-digit number.');
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let attendanceSheet = ss.getSheetByName('Attendance');
    
    // Create sheet if missing
    if (!attendanceSheet) {
      attendanceSheet = ss.insertSheet('Attendance');
      const headers = ['Timestamp', 'Class', 'Student Name', 'Parent Name', 'Contact (Father)', 'Contact (Mother)', 'WhatsApp'];
      attendanceSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Generate server timestamp formatted nicely
    const timeZone = Session.getScriptTimeZone();
    const formattedTimestamp = Utilities.formatDate(new Date(), timeZone, "yyyy-MM-dd hh:mm:ss a");
    
    // Append row
    const newRow = [
      formattedTimestamp,
      selectedClass.trim(),
      studentName.trim(),
      parentName.trim(),
      "'" + contact1.trim(), // Single quote forces string formatting in Sheets for phone numbers
      contact2 && contact2.trim() !== '' ? "'" + contact2.trim() : '',
      "'" + whatsapp.trim()
    ];
    
    attendanceSheet.appendRow(newRow);
    
    return {
      success: true,
      message: 'Attendance recorded successfully!',
      timestamp: formattedTimestamp
    };
  } catch (error) {
    Logger.log('Error in submitAttendance: ' + error.message);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred.'
    };
  }
}
