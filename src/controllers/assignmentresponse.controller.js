const db = require('../models');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

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
    const { assignmentId, batchId, enquiryId, submissionNotes } = req.body;
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
    if (req.file) {
      const uploadResult = await uploadImage(
        req.file.buffer,
        `assignment-response-${assignmentId}-${enquiryId || userId}-${Date.now()}`
      );
      submissionFile = uploadResult.secure_url;
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
 * GET all Assignment Responses (ADMIN, COUNSELLOR, INSTRUCTOR)
 */
exports.getAllAssignmentResponses = async (req, res) => {
  try {
    const responses = await AssignmentResponse.findAll({
      include: [
        {
          model: Assignment,
          as: 'assignment',
          attributes: ['id', 'title', 'dueDate'],
        },
        {
          model: Batch,
          as: 'batch',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: Enquiry,
          as: 'enquiry',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: responses,
    });
  } catch (error) {
    console.error('Error in getAllAssignmentResponses:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET Assignment Response by ID
 */
exports.getAssignmentResponseById = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await AssignmentResponse.findByPk(id, {
      include: [
        {
          model: Assignment,
          as: 'assignment',
          attributes: ['id', 'title', 'description', 'dueDate'],
        },
        {
          model: Batch,
          as: 'batch',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: Enquiry,
          as: 'enquiry',
          attributes: ['id', 'name', 'email', 'phone'],
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!response) {
      return res.status(404).json({
        message: 'Assignment response not found',
      });
    }

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error in getAssignmentResponseById:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET Assignment Responses by Assignment ID
 */
exports.getAssignmentResponsesByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Check if assignment exists
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        message: 'Assignment not found',
      });
    }

    const responses = await AssignmentResponse.findAll({
      where: { assignmentId },
      include: [
        {
          model: Enquiry,
          as: 'enquiry',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['submittedOn', 'DESC']],
    });

    res.json({
      success: true,
      data: responses,
    });
  } catch (error) {
    console.error('Error in getAssignmentResponsesByAssignment:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET Assignment Responses by Batch ID
 */
exports.getAssignmentResponsesByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    // Check if batch exists
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({
        message: 'Batch not found',
      });
    }

    const responses = await AssignmentResponse.findAll({
      where: { batchId },
      include: [
        {
          model: Assignment,
          as: 'assignment',
          attributes: ['id', 'title', 'dueDate'],
        },
        {
          model: Enquiry,
          as: 'enquiry',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: responses,
    });
  } catch (error) {
    console.error('Error in getAssignmentResponsesByBatch:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET Assignment Responses by Enquiry ID
 */
exports.getAssignmentResponsesByEnquiry = async (req, res) => {
  try {
    const { enquiryId } = req.params;

    // Check if enquiry exists
    const enquiry = await Enquiry.findByPk(enquiryId);
    if (!enquiry) {
      return res.status(404).json({
        message: 'Enquiry not found',
      });
    }

    const responses = await AssignmentResponse.findAll({
      where: { enquiryId },
      include: [
        {
          model: Assignment,
          as: 'assignment',
          attributes: ['id', 'title', 'dueDate'],
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

    res.json({
      success: true,
      data: responses,
    });
  } catch (error) {
    console.error('Error in getAssignmentResponsesByEnquiry:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE Assignment Response (INSTRUCTOR - REVIEW)
 */
exports.updateAssignmentResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, instructorComments } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if response exists
    const response = await AssignmentResponse.findByPk(id);
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
      message: 'Assignment response updated successfully',
      data: response,
    });
  } catch (error) {
    console.error('Error in updateAssignmentResponse:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE Assignment Response
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
