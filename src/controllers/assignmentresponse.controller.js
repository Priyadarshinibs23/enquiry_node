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

    // Check if response exists
    const response = await AssignmentResponse.findByPk(id, {
      include: [
        {
          model: Assignment,
          as: 'assignment',
          attributes: ['id', 'title'],
        },
      ],
    });

    if (!response) {
      return res.status(404).json({
        message: 'Assignment response not found',
      });
    }

    // Only admin, counsellor, or the instructor of the batch can review
    const batch = await Batch.findByPk(response.batchId);
    if (
      userRole === 'instructor' &&
      batch.createdBy !== userId
    ) {
      return res.status(403).json({
        message: 'Access denied. You can only review assignments from your own batches.',
      });
    }

    // Update response
    await response.update({
      status: status || response.status,
      instructorComments: instructorComments || response.instructorComments,
      reviewedBy: userId,
      reviewedOn: new Date(),
    });

    res.json({
      success: true,
      message: 'Assignment reviewed successfully',
      data: response,
    });
  } catch (error) {
    console.error('Error in updateAssignmentResponse:', error);
    res.status(500).json({ message: error.message });
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
