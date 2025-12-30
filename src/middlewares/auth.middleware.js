const { verifyToken } = require('../config/jwt');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const payload  = await verifyToken(token);
    req.user = payload;

    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
