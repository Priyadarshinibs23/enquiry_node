const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/enquiry.controller');

/* READ — ALL LOGGED-IN USERS */
router.get('/', auth, controller.getAllEnquiries);
router.get('/:id', auth, controller.getEnquiryById);

/* WRITE — ADMIN and COUNSELLOR*/
router.post('/', auth, role(['ADMIN','COUNSELLOR']), controller.createEnquiry);
router.put('/:id', auth, role(['ADMIN','COUNSELLOR']), controller.updateEnquiry);
router.delete('/:id', auth, role(['ADMIN','COUNSELLOR']), controller.deleteEnquiry);

module.exports = router;
