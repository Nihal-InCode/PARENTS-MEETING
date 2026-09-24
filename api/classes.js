const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

module.exports = async (req, res) => {
  try {
    if (!APPS_SCRIPT_URL) {
      return res.status(500).json({ error: 'Missing APPS_SCRIPT_URL env var' });
    }

    const r = await fetch(`${APPS_SCRIPT_URL}?action=classes`, {
      redirect: 'follow',
    });
    const data = await r.json();

    if (data && data.error) {
      return res.status(500).json({ error: data.error });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch classes' });
  }
};
