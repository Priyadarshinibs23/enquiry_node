const express = require('express');
const router = express.Router();
const assignmentResponseController = require('../controllers/assignmentresponse.controller');
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

/**
 * CREATE - Submit assignment response
 * POST /api/assignment-responses
 */
router.post(
  '/',
  auth,
  upload.single('submissionFile'),
  assignmentResponseController.createAssignmentResponse
);

/**
 * READ - Get all assignment responses
 * GET /api/assignment-responses
 */
router.get('/', auth, assignmentResponseController.getAllAssignmentResponses);

/**
 * READ - Get assignment response by ID
 * GET /api/assignment-responses/:id
 */
router.get('/:id', auth, assignmentResponseController.getAssignmentResponseById);

/**
 * READ - Get responses for a specific assignment
 * GET /api/assignment-responses/assignment/:assignmentId
 */
router.get(
  '/assignment/:assignmentId',
  auth,
  assignmentResponseController.getAssignmentResponsesByAssignment
);

/**
 * READ - Get responses for a specific batch
 * GET /api/assignment-responses/batch/:batchId
 */
router.get(
  '/batch/:batchId',
  auth,
  assignmentResponseController.getAssignmentResponsesByBatch
);

/**
 * READ - Get responses for a specific enquiry
 * GET /api/assignment-responses/enquiry/:enquiryId
 */
router.get(
  '/enquiry/:enquiryId',
  auth,
  assignmentResponseController.getAssignmentResponsesByEnquiry
);

/**
 * UPDATE - Review/Update assignment response
 * PUT /api/assignment-responses/:id
 */
router.put('/:id', auth, assignmentResponseController.updateAssignmentResponse);

/**
 * DELETE - Delete assignment response
 * DELETE /api/assignment-responses/:id
 */
router.delete('/:id', auth, assignmentResponseController.deleteAssignmentResponse);

module.exports = router;
