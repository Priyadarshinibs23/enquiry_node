const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/log.controller');

/* READ — ALL LOGGED-IN USERS */
router.get('/:enquiryId', auth, controller.getLogsByEnquiryId);

/* WRITE — ALL LOGGED-IN USERS */
router.post('/', auth, controller.createLog);
router.put('/:id', auth, controller.updateLog);

/* DELETE — ADMIN ONLY */
router.delete('/:id', auth, role(['ADMIN']), controller.deleteLog);

module.exports = router;
