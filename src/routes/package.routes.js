const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const controller = require('../controllers/package.controller');

// packages
router.get('/', auth, controller.getAllPackages);
router.get('/:id', auth, controller.getPackageById);
router.post('/', auth, upload.single('image'), controller.createPackage);
router.put('/:id', auth, upload.single('image'), controller.updatePackage);
router.delete('/:id', auth, controller.deletePackage);

module.exports = router;
