const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/subject.controller');

// subjects
router.get('/', auth, controller.getAllSubjects);
router.get('/:id', auth, controller.getSubjectById);
router.post('/', auth, role('ADMIN'), controller.createSubject);
router.put('/:id', auth, role('ADMIN'), controller.updateSubject);
router.delete('/:id', auth, role('ADMIN'), controller.deleteSubject);

module.exports = router;
