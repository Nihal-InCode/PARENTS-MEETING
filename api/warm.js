module.exports = async (req, res) => {
  try {
    const url = process.env.APPS_SCRIPT_URL;
    if (!url) return res.status(200).json({ ok: false });

    await fetch(`${url}?action=classes`, { redirect: 'follow' });
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(200).json({ ok: false });
  }
};
