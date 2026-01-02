const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignment.controller');
const auth = require('../middlewares/auth.middleware');

// Create Assignment for a Batch
router.post(
  '/create',
  auth,
  assignmentController.createAssignment
);

// Get all assignments created by instructor or all (admin/counsellor)
router.get(
  '/my-assignments',
  auth,
  assignmentController.getMyAssignments
);

// Get Assignments for a Batch
router.get(
  '/batch/:batchId',
  assignmentController.getAssignmentsByBatch
);

// Get Assignments for a Subject
router.get(
  '/subject/:subjectId',
  assignmentController.getAssignmentsBySubject
);

// Get Single Assignment
router.get(
  '/:assignmentId',
  assignmentController.getAssignmentById
);

// Update Assignment
router.put(
  '/:assignmentId',
  auth,
  assignmentController.updateAssignment
);

// Delete Assignment
router.delete(
  '/:assignmentId',
  auth,
  assignmentController.deleteAssignment
);

// Submit assignment (student submits their work)
router.post(
  '/:assignmentId/submit',
  auth,
  assignmentController.submitAssignmentWork
);

// Review assignment (instructor reviews and comments)
router.post(
  '/:assignmentId/review',
  auth,
  assignmentController.reviewAssignmentSubmission
);

// Get submissions pending review
router.get(
  '/submissions/pending-review',
  auth,
  assignmentController.getSubmissionsPendingReview
);

// Get reviewed assignments
router.get(
  '/submissions/reviewed',
  auth,
  assignmentController.getReviewedAssignments
);

module.exports = router;
