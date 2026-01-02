const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructor.controller');
const auth = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// Assign subject to instructor (ADMIN and COUNSELLOR only)
router.post(
  '/assign-subject',
  auth,
  instructorController.assignSubjectToInstructor
);

// Get all subjects for instructor (accessible by instructor, admin, and counsellor)
router.get(
  '/my-subjects',
  auth,
  instructorController.getMySubjects
);

// Get specific subject details (accessible by instructor, admin, and counsellor)
router.get(
  '/subject/:subjectId',
  auth,
  instructorController.getSubjectDetail
);

module.exports = router;
