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

// Get Batches by Instructor ID and Subject ID
router.get(
  '/batches-by-instructor-subject',
  assignmentController.getBatchesByInstructorAndSubject
);

// Get Assignments for a Batch
router.get(
  '/batch/:batchId',
  assignmentController.getAssignmentsByBatch
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
