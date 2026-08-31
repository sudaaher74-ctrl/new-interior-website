module.exports = (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    env_keys: Object.keys(process.env).filter(k => !k.includes('KEY') && !k.includes('SECRET')),
  });
};
