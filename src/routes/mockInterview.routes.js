const express = require('express');
const router = express.Router();
const mockInterviewController = require('../controllers/mockInterview.controller');
const auth = require('../middlewares/auth.middleware');

// CREATE - Schedule Mock Interview
router.post(
  '/schedule',
  auth,
  mockInterviewController.scheduleMockInterview
);

// READ - Get All Mock Interviews
router.get(
  '/',
  auth,
  mockInterviewController.getAllMockInterviews
);

// READ - Get Mock Interview by ID
router.get(
  '/:id',
  auth,
  mockInterviewController.getMockInterviewById
);

// READ - Get Mock Interviews by Batch
router.get(
  '/batch/:batchId',
  auth,
  mockInterviewController.getMockInterviewsByBatch
);

// UPDATE - Update Mock Interview
router.put(
  '/:id',
  auth,
  mockInterviewController.updateMockInterview
);

// UPDATE - Mark Interview as Attended/Not Attended
router.patch(
  '/:id/status',
  auth,
  mockInterviewController.updateInterviewStatus
);

// DELETE - Delete Mock Interview
router.delete(
  '/:id',
  auth,
  mockInterviewController.deleteMockInterview
);

// STATISTICS - Get Interview Statistics for Instructor
router.get(
  '/statistics/instructor',
  auth,
  mockInterviewController.getInterviewStatistics
);

// STATISTICS - Get Interview Statistics for a Batch
router.get(
  '/statistics/batch/:batchId',
  auth,
  mockInterviewController.getBatchInterviewStatistics
);

// STATISTICS - Get System Wide Statistics (Admin/Counsellor only)
router.get(
  '/statistics/system',
  auth,
  mockInterviewController.getSystemInterviewStatistics
);

module.exports = router;
