const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  try {
    if (!APPS_SCRIPT_URL) {
      return res.status(500).json({ success: false, error: 'Missing APPS_SCRIPT_URL env var' });
    }

    // text/plain avoids CORS preflight issues if called from a browser;
    // Apps Script doPost reads e.postData.contents either way.
    const r = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(req.body || {}),
    });
    const data = await r.json();

    if (data && data.success) {
      return res.status(200).json(data);
    }
    res.status(400).json({
      success: false,
      error: (data && data.error) || 'Failed to record attendance.',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to record attendance.',
    });
  }
};
