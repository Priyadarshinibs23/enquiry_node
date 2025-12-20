const { User } = require('../models');
const { comparePassword } = require('../utils/password');
const { signToken } = require('../config/jwt');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.json({
    message: 'Login successful',
    token,
    role:user.role,
  });
};

exports.validateToken = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.json({
      message: 'Token is valid',
      userId: user.userId,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
