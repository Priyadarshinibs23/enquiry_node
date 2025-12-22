module.exports = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    // Convert single role to array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    // Check if user's role matches any of the allowed roles
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
