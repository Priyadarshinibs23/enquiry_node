const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/package.controller');

// packages
router.get('/', auth, controller.getAllPackages);
router.get('/:id', auth, controller.getPackageById);
router.post('/', auth, role('ADMIN'), controller.createPackage);
router.put('/:id', auth, role('ADMIN'), controller.updatePackage);
router.delete('/:id', auth, role('ADMIN'), controller.deletePackage);

module.exports = router;
