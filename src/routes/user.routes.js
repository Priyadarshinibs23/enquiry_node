const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const { createUser, changePassword } = require('../controllers/user.controller');

router.post(
  '/',
  auth,              
  role('ADMIN'),     
  createUser
);
router.post(
  '/change-password',
  auth,              
  role('ADMIN'),     
  changePassword
);
module.exports = router;
