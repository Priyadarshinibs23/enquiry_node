const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const controller = require('../controllers/subject.controller');

// subjects
router.get('/', auth, controller.getAllSubjects);
router.get('/:id', auth, controller.getSubjectById);
router.post('/', auth, upload.single('image'), controller.createSubject);
router.put('/:id', auth, upload.single('image'), controller.updateSubject);
router.delete('/:id', auth, controller.deleteSubject);

module.exports = router;
