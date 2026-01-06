const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const controller = require('../controllers/instructorsubject.controller');

/**
 * POST - Assign subject to instructor
 * POST /api/instructor-subjects
 */
router.post('/', auth, controller.assignSubjectToInstructor);

/**
 * GET - Get all instructor-subject mappings
 * GET /api/instructor-subjects
 */
router.get('/', auth, controller.getAllMappings);

/**
 * GET - Get all subjects for an instructor
 * GET /api/instructor-subjects/instructor/:instructorId
 */
router.get('/instructor/:instructorId', auth, controller.getInstructorSubjects);

/**
 * GET - Get all instructors for a subject
 * GET /api/instructor-subjects/subject/:subjectId
 */
router.get('/subject/:subjectId', auth, controller.getSubjectInstructors);

/**
 * DELETE - Remove subject from instructor
 * DELETE /api/instructor-subjects/:id
 */
router.delete('/:id', auth, controller.removeSubjectFromInstructor);

module.exports = router;
