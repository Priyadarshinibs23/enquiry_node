const db = require('../models');
const { uploadImage, deleteImage } = require('../utils/cloudinary');
const { Formidable } = require('formidable');
const fs = require('fs');

const AssignmentResponse = db.AssignmentResponse;
const Assignment = db.Assignment;
const Batch = db.Batch;
const Enquiry = db.Enquiry;
const User = db.User;

/**
 * CREATE Assignment Response (STUDENTS/ENQUIRIES)
 */
exports.createAssignmentResponse = async (req, res) => {
  try {
    // Parse form data using formidable
    const form = new Formidable({
      multiples: false,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true
    });

    const [fields, files] = await form.parse(req);

    // Extract field values
    const assignmentId = fields.assignmentId ? fields.assignmentId[0] : null;
    const batchId = fields.batchId ? fields.batchId[0] : null;
    const enquiryId = fields.enquiryId ? fields.enquiryId[0] : null;
    const submissionNotes = fields.submissionNotes ? fields.submissionNotes[0] : null;

    const userId = req.user.id;

    // Validate required fields
    if (!assignmentId || !batchId) {
      return res.status(400).json({
        message: 'assignmentId and batchId are required',
      });
    }

    // Check if assignment exists
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        message: 'Assignment not found',
      });
    }

    // Check if batch exists
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({
        message: 'Batch not found',
      });
    }

    // Check if enquiry exists (if provided)
    let submissionFile = null;
    if (enquiryId) {
      const enquiry = await Enquiry.findByPk(enquiryId);
      if (!enquiry) {
        return res.status(404).json({
          message: 'Enquiry not found',
        });
      }
    }

    // Upload submission file if provided
    if (files.submissionFile && files.submissionFile.length > 0) {
      const fileUpload = files.submissionFile[0];
      const fileBuffer = await fs.promises.readFile(fileUpload.filepath);
      const uploadResult = await uploadImage(
        fileBuffer,
        `assignment-response-${assignmentId}-${enquiryId || userId}-${Date.now()}`
      );
      submissionFile = uploadResult.secure_url;
      await fs.promises.unlink(fileUpload.filepath).catch(() => {});
    }

    // Create assignment response
    const response = await AssignmentResponse.create({
      assignmentId,
      batchId,
      enquiryId: enquiryId || null,
      submissionNotes: submissionNotes || null,
      submissionFile,
      status: 'submitted',
      submittedOn: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Assignment response submitted successfully',
      data: response,
    });
  } catch (error) {
    console.error('Error in createAssignmentResponse:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET - Instructor views all submissions for their assignment
 * GET /api/assignment-responses/instructor/submissions/:assignmentId
 */
exports.getInstructorAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if assignment exists
    const assignment = await Assignment.findByPk(assignmentId, {
      include: [
        {
          model: Batch,
          as: 'batch',
          attributes: ['id', 'name', 'code', 'createdBy'],
        },
      ],
    });

    if (!assignment) {
      return res.status(404).json({
        message: 'Assignment not found',
      });
    }

    // Only the instructor who created the assignment or admin/counsellor can view submissions
    if (
      userRole === 'instructor' &&
      assignment.createdBy !== userId
    ) {
      return res.status(403).json({
        message: 'Access denied. You can only view submissions for your own assignments.',
      });
    }

    // Get all submissions for this assignment
    const submissions = await AssignmentResponse.findAll({
      where: { assignmentId },
      include: [
        {
          model: Assignment,
          as: 'assignment',
          attributes: ['id', 'title', 'description', 'dueDate'],
        },
        {
          model: Enquiry,
          as: 'enquiry',
          attributes: ['id', 'name', 'email', 'phone'],
        },
        {
          model: Batch,
          as: 'batch',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['submittedOn', 'DESC']],
    });

    // Summary statistics
    const totalSubmissions = submissions.length;
    const submittedCount = submissions.filter(s => s.status === 'submitted').length;
    const reviewedCount = submissions.filter(s => s.status === 'reviewed').length;
    const pendingCount = submissions.filter(s => s.status === 'pending').length;

    res.json({
      success: true,
      message: 'Assignment submissions retrieved successfully',
      assignment: {
        id: assignment.id,
        title: assignment.title,
        dueDate: assignment.dueDate,
        batch: assignment.batch,
      },
      statistics: {
        total: totalSubmissions,
        submitted: submittedCount,
        reviewed: reviewedCount,
        pending: pendingCount,
      },
      submissions: submissions,
    });
  } catch (error) {
    console.error('Error in getInstructorAssignmentSubmissions:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE - Instructor reviews/grades student assignment
 * PUT /api/assignment-responses/:id
 */
exports.updateAssignmentResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, instructorComments } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Only instructor, admin, or counsellor can review
    if (userRole !== 'instructor' && userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors, admin, or counsellor can review assignments',
      });
    }

    // Check if response exists
    const response = await AssignmentResponse.findByPk(id, {
      include: [
        {
          model: Assignment,
          as: 'assignment',
          attributes: ['id', 'title', 'createdBy', 'batchId'],
        },
        {
          model: Enquiry,
          as: 'enquiry',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Assignment response not found',
      });
    }

    // Check if instructor can review this assignment
    const batch = await Batch.findByPk(response.batchId);
    if (userRole === 'instructor' && response.assignment.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only review assignments you created.',
      });
    }

    // Validate status if provided
    const validStatuses = ['assigned', 'submitted', 'reviewed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Update response with review details
    const updateData = {
      status: status || 'reviewed',
      reviewedBy: userId,
      reviewedOn: new Date(),
    };

    // Add instructor comments if provided
    if (instructorComments) {
      updateData.instructorComments = instructorComments;
    }

    await response.update(updateData);

    // Fetch updated response with reviewer info
    const updatedResponse = await AssignmentResponse.findByPk(id, {
      include: [
        {
          model: Assignment,
          as: 'assignment',
          attributes: ['id', 'title', 'description', 'dueDate'],
        },
        {
          model: Enquiry,
          as: 'enquiry',
          attributes: ['id', 'name', 'email', 'candidateStatus'],
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Assignment reviewed successfully with comments added',
      data: {
        id: updatedResponse.id,
        assignment: updatedResponse.assignment,
        enquiry: updatedResponse.enquiry,
        submissionNotes: updatedResponse.submissionNotes,
        submissionFile: updatedResponse.submissionFile,
        status: updatedResponse.status,
        instructorComments: updatedResponse.instructorComments,
        submittedOn: updatedResponse.submittedOn,
        reviewer: updatedResponse.reviewer,
        reviewedOn: updatedResponse.reviewedOn,
      },
    });
  } catch (error) {
    console.error('Error in updateAssignmentResponse:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE - Delete assignment response
 * DELETE /api/assignment-responses/:id
 */
exports.deleteAssignmentResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    // Check if response exists
    const response = await AssignmentResponse.findByPk(id);
    if (!response) {
      return res.status(404).json({
        message: 'Assignment response not found',
      });
    }

    // Only admin, counsellor can delete
    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({
        message: 'Access denied. Only Admin and Counsellor can delete responses.',
      });
    }

    // Delete submission file from Cloudinary if exists
    if (response.submissionFile) {
      const publicId = response.submissionFile.split('/').pop().split('.')[0];
      try {
        await deleteImage(`enquiry_system/${publicId}`);
      } catch (err) {
        console.error('Error deleting file from Cloudinary:', err);
      }
    }

    // Delete response
    await response.destroy();

    res.json({
      success: true,
      message: 'Assignment response deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteAssignmentResponse:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * READ - Get assignment responses by batchId and subjectId
 */
exports.getAssignmentResponsesByBatchAndSubject = async (req, res) => {
  try {
    const { batchId, subjectId } = req.query;

    // Validate required parameters
    if (!batchId || !subjectId) {
      return res.status(400).json({
        success: false,
        message: 'batchId and subjectId are required as query parameters',
      });
    }

    // Check if batch exists
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    // Get all assignments for the batch and subject
    const assignments = await Assignment.findAll({
      where: {
        batchId: batchId,
        subjectId: subjectId,
      },
      attributes: ['id'],
    });

    if (assignments.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No assignments found for this batch and subject',
        total: 0,
        data: [],
      });
    }

    const assignmentIds = assignments.map(a => a.id);

    // Get all assignment responses for these assignments
    const responses = await AssignmentResponse.findAll({
      where: {
        assignmentId: assignmentIds,
      },
      include: [
        {
          model: Assignment,
          attributes: ['id', 'title', 'description', 'dueDate', 'batchId'],
          as: 'assignment',
        },
        {
          model: Enquiry,
          attributes: ['id', 'name', 'email', 'candidateStatus'],
          as: 'enquiry',
        },
        {
          model: User,
          attributes: ['id', 'name', 'email'],
          foreignKey: 'reviewedBy',
          as: 'reviewer',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Assignment responses retrieved successfully',
      total: responses.length,
      batchId: batchId,
      subjectId: subjectId,
      data: responses,
    });
  } catch (error) {
    console.error('Error in getAssignmentResponsesByBatchAndSubject:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * READ - Get instructor comments by assignment ID
 */
exports.getInstructorCommentsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Validate required parameter
    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        message: 'assignmentId is required',
      });
    }

    // Check if assignment exists
    const assignment = await Assignment.findByPk(assignmentId, {
      attributes: ['id', 'title', 'description', 'dueDate', 'batchId'],
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Get all assignment responses with instructor comments for this assignment
    const responses = await AssignmentResponse.findAll({
      where: {
        assignmentId: assignmentId,
      },
      attributes: ['id', 'assignmentId', 'enquiryId', 'submissionNotes', 'submissionFile', 'status', 'instructorComments', 'reviewedBy', 'reviewedOn', 'submittedOn'],
      include: [
        {
          model: Enquiry,
          attributes: ['id', 'name', 'email', 'candidateStatus'],
          as: 'enquiry',
        },
        {
          model: User,
          attributes: ['id', 'name', 'email'],
          foreignKey: 'reviewedBy',
          as: 'reviewer',
        },
      ],
      order: [['reviewedOn', 'DESC']],
    });

    // Filter only responses with instructor comments
    const commentsData = responses.map(response => ({
      id: response.id,
      assignmentId: response.assignmentId,
      enquiry: response.enquiry,
      submissionNotes: response.submissionNotes,
      submissionFile: response.submissionFile,
      status: response.status,
      instructorComments: response.instructorComments,
      reviewer: response.reviewer,
      reviewedOn: response.reviewedOn,
      submittedOn: response.submittedOn,
    }));

    res.status(200).json({
      success: true,
      message: 'Instructor comments retrieved successfully',
      assignment: assignment,
      total: commentsData.filter(c => c.instructorComments).length,
      data: commentsData,
    });
  } catch (error) {
    console.error('Error in getInstructorCommentsByAssignment:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
