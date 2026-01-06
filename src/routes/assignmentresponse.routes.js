const express = require('express');
const router = express.Router();
const assignmentResponseController = require('../controllers/assignmentresponse.controller');
const auth = require('../middlewares/auth.middleware');

/**
 * CREATE - Student submits assignment
 * POST /api/assignment-responses
 */
router.post(
  '/',
  auth,
  assignmentResponseController.createAssignmentResponse
);

/**
 * READ - Get instructor comments by assignment ID
 * GET /api/assignment-responses/:assignmentId/comments
 */
router.get(
  '/:assignmentId/comments',
  assignmentResponseController.getInstructorCommentsByAssignment
);

/**
 * READ - Get assignment responses by batchId and subjectId
 * GET /api/assignment-responses/batch-subject
 */
router.get(
  '/batch-subject',
  assignmentResponseController.getAssignmentResponsesByBatchAndSubject
);

/**
 * READ - Instructor view: Get all submissions for an assignment
 * GET /api/assignment-responses/instructor/submissions/:assignmentId
 */
router.get(
  '/instructor/submissions/:assignmentId',
  auth,
  assignmentResponseController.getInstructorAssignmentSubmissions
);

/**
 * UPDATE - Instructor reviews/grades assignment
 * PUT /api/assignment-responses/:id
 */
router.put('/:id', auth, assignmentResponseController.updateAssignmentResponse);

/**
 * DELETE - Delete assignment response
 * DELETE /api/assignment-responses/:id
 */
router.delete('/:id', auth, assignmentResponseController.deleteAssignmentResponse);

module.exports = router;
