const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// Create feedback (students give feedback)
router.post(
  '/',
  authMiddleware.authenticate,
  feedbackController.createFeedback
);

// Get all feedbacks (admin only)
router.get(
  '/',
  authMiddleware.authenticate,
  roleMiddleware.authorize('admin'),
  feedbackController.getAllFeedbacks
);

// Get feedback by ID
router.get(
  '/:id',
  authMiddleware.authenticate,
  feedbackController.getFeedbackById
);

// Get feedbacks for a specific instructor
router.get(
  '/instructor/:instructorId',
  authMiddleware.authenticate,
  feedbackController.getFeedbacksForInstructor
);

// Get feedbacks by batch
router.get(
  '/batch/:batchId',
  authMiddleware.authenticate,
  feedbackController.getFeedbacksByBatch
);

// Get feedbacks for instructor in a specific batch
router.get(
  '/instructor/:instructorId/batch/:batchId',
  authMiddleware.authenticate,
  feedbackController.getFeedbacksByInstructorAndBatch
);

// Get eligible students for feedback in a batch
router.get(
  '/batch/:batchId/eligible-students',
  authMiddleware.authenticate,
  feedbackController.getEligibleStudentsForBatch
);

// Get feedbacks given by an enquiry
router.get(
  '/enquiry/:enquiryId',
  authMiddleware.authenticate,
  feedbackController.getFeedbacksByEnquiry
);

// Get instructor feedback statistics
router.get(
  '/stats/instructor/:instructorId',
  authMiddleware.authenticate,
  feedbackController.getInstructorFeedbackStats
);

// Update feedback
router.put(
  '/:id',
  authMiddleware.authenticate,
  feedbackController.updateFeedback
);

// Delete feedback
router.delete(
  '/:id',
  authMiddleware.authenticate,
  roleMiddleware.authorize('admin'),
  feedbackController.deleteFeedback
);

module.exports = router;
