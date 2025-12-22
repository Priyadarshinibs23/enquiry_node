const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/billing.controller');

/* READ — ALL LOGGED-IN USERS */
router.get('/', auth, controller.getAllBillings);
router.get('/enquiry/:enquiryId', auth, controller.getBillingByEnquiryId);
router.get('/:id', auth, controller.getBillingById);

/* WRITE — ALL LOGGED-IN USERS (CREATE/UPDATE COMBINED) */
router.post('/', auth, controller.createOrUpdateBilling);

/* DELETE — ADMIN ONLY */
router.delete('/:id', auth, role(['ADMIN']), controller.deleteBilling);

module.exports = router;
