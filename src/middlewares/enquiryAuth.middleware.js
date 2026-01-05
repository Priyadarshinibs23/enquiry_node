const { verifyToken } = require('../config/jwt');

/**
 * Middleware to verify enquiry student JWT token
 * Used for endpoints accessed by enrolled students
 */
const enquiryAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = await verifyToken(token);

    if (!decoded.enquiryId) {
      return res.status(401).json({ message: 'Invalid token: Not an enquiry student token' });
    }

    // Attach enquiry info to request
    req.enquiry = decoded;
    next();
  } catch (error) {
    console.error('Enquiry auth error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = enquiryAuth;
