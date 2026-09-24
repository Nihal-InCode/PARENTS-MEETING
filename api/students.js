const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

module.exports = async (req, res) => {
  try {
    if (!APPS_SCRIPT_URL) {
      return res.status(500).json({ error: 'Missing APPS_SCRIPT_URL env var' });
    }

    const selectedClass = req.query.class;
    if (!selectedClass) {
      return res.status(400).json({ error: 'Class query parameter is required.' });
    }

    const r = await fetch(
      `${APPS_SCRIPT_URL}?action=students&class=${encodeURIComponent(selectedClass)}`,
      { redirect: 'follow' }
    );
    const data = await r.json();

    if (data && data.error) {
      return res.status(500).json({ error: data.error });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch students' });
  }
};
