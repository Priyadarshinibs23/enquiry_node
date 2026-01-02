const db = require('../models');
const { sendResponse } = require('../utils/response');

// Create new feedback
exports.createFeedback = async (req, res) => {
  try {
    const { enquiryId, instructorId, batchId, feedbackText, rating } = req.body;

    // Validate required fields
    if (!enquiryId || !instructorId || !batchId || rating === undefined) {
      return sendResponse(res, 400, false, 'Enquiry, instructor, batch, and rating are required');
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return sendResponse(res, 400, false, 'Rating must be between 1 and 5');
    }

    // Validate feedback is array or convert to array
    let feedbackArray = [];
    if (feedbackText) {
      if (Array.isArray(feedbackText)) {
        feedbackArray = feedbackText;
      } else {
        feedbackArray = [feedbackText];
      }
    }

    // Verify enquiry exists and has correct candidate status
    const enquiry = await db.Enquiry.findByPk(enquiryId);
    if (!enquiry) {
      return sendResponse(res, 404, false, 'Enquiry not found');
    }

    // Check if candidate status is 'class' or 'class qualified'
    if (enquiry.candidateStatus !== 'class' && enquiry.candidateStatus !== 'class qualified') {
      return sendResponse(res, 400, false, 'Feedback can only be given for students with "class" or "class qualified" status');
    }

    // Verify instructor exists
    const instructor = await db.User.findByPk(instructorId);
    if (!instructor) {
      return sendResponse(res, 404, false, 'Instructor not found');
    }

    // Verify batch exists
    const batch = await db.Batch.findByPk(batchId);
    if (!batch) {
      return sendResponse(res, 404, false, 'Batch not found');
    }

    // Create feedback
    const feedback = await db.Feedback.create({
      enquiryId,
      instructorId,
      batchId,
      feedbackText: feedbackArray,
      rating,
    });

    // Fetch feedback with associations
    const feedbackWithAssociations = await db.Feedback.findByPk(feedback.id, {
      include: [
        { model: db.Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email', 'candidateStatus'] },
        { model: db.User, as: 'instructor', attributes: ['id', 'name', 'email'] },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject', attributes: ['id', 'name'] }] },
      ],
    });

    return sendResponse(res, 201, true, 'Feedback created successfully', feedbackWithAssociations);
  } catch (error) {
    console.error('Error creating feedback:', error);
    return sendResponse(res, 500, false, 'Error creating feedback', error.message);
  }
};

// Get all feedbacks
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await db.Feedback.findAll({
      include: [
        { model: db.Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email', 'candidateStatus'] },
        { model: db.User, as: 'instructor', attributes: ['id', 'name', 'email'] },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject', attributes: ['id', 'name'] }] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return sendResponse(res, 200, true, 'Feedbacks retrieved successfully', feedbacks);
  } catch (error) {
    console.error('Error retrieving feedbacks:', error);
    return sendResponse(res, 500, false, 'Error retrieving feedbacks', error.message);
  }
};

// Get feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await db.Feedback.findByPk(id, {
      include: [
        { model: db.Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email', 'candidateStatus'] },
        { model: db.User, as: 'instructor', attributes: ['id', 'name', 'email'] },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject', attributes: ['id', 'name'] }] },
      ],
    });

    if (!feedback) {
      return sendResponse(res, 404, false, 'Feedback not found');
    }

    return sendResponse(res, 200, true, 'Feedback retrieved successfully', feedback);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    return sendResponse(res, 500, false, 'Error retrieving feedback', error.message);
  }
};

// Get feedbacks for an instructor (all feedbacks received)
exports.getFeedbacksForInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;

    // Verify instructor exists
    const instructor = await db.User.findByPk(instructorId);
    if (!instructor) {
      return sendResponse(res, 404, false, 'Instructor not found');
    }

    const feedbacks = await db.Feedback.findAll({
      where: { instructorId },
      include: [
        { model: db.Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email', 'candidateStatus'] },
        { model: db.User, as: 'instructor', attributes: ['id', 'name', 'email'] },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject', attributes: ['id', 'name'] }] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return sendResponse(res, 200, true, 'Feedbacks retrieved successfully', feedbacks);
  } catch (error) {
    console.error('Error retrieving feedbacks:', error);
    return sendResponse(res, 500, false, 'Error retrieving feedbacks', error.message);
  }
};

// Get feedbacks by batch
exports.getFeedbacksByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    // Verify batch exists
    const batch = await db.Batch.findByPk(batchId);
    if (!batch) {
      return sendResponse(res, 404, false, 'Batch not found');
    }

    const feedbacks = await db.Feedback.findAll({
      where: { batchId },
      include: [
        { model: db.Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email', 'candidateStatus'] },
        { model: db.User, as: 'instructor', attributes: ['id', 'name', 'email'] },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject', attributes: ['id', 'name'] }] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return sendResponse(res, 200, true, 'Feedbacks retrieved successfully', feedbacks);
  } catch (error) {
    console.error('Error retrieving feedbacks:', error);
    return sendResponse(res, 500, false, 'Error retrieving feedbacks', error.message);
  }
};

// Get feedbacks by instructor and batch (instructor's feedback for a specific batch)
exports.getFeedbacksByInstructorAndBatch = async (req, res) => {
  try {
    const { instructorId, batchId } = req.params;

    // Verify instructor and batch exist
    const instructor = await db.User.findByPk(instructorId);
    if (!instructor) {
      return sendResponse(res, 404, false, 'Instructor not found');
    }

    const batch = await db.Batch.findByPk(batchId);
    if (!batch) {
      return sendResponse(res, 404, false, 'Batch not found');
    }

    const feedbacks = await db.Feedback.findAll({
      where: { instructorId, batchId },
      include: [
        { model: db.Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email', 'candidateStatus'] },
        { model: db.User, as: 'instructor', attributes: ['id', 'name', 'email'] },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject', attributes: ['id', 'name'] }] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return sendResponse(res, 200, true, 'Feedbacks retrieved successfully', feedbacks);
  } catch (error) {
    console.error('Error retrieving feedbacks:', error);
    return sendResponse(res, 500, false, 'Error retrieving feedbacks', error.message);
  }
};

// Get feedback given by a student
exports.getFeedbacksByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Verify student exists
    const student = await db.User.findByPk(studentId);
    if (!student) {
      return sendResponse(res, 404, false, 'Student not found');
    }

    const feedbacks = await db.Feedback.findAll({
      where: { studentId },
      include: [
        { model: db.Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email', 'candidateStatus'] },
        { model: db.User, as: 'instructor', attributes: ['id', 'name', 'email'] },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject', attributes: ['id', 'name'] }] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return sendResponse(res, 200, true, 'Feedbacks retrieved successfully', feedbacks);
  } catch (error) {
    console.error('Error retrieving feedbacks:', error);
    return sendResponse(res, 500, false, 'Error retrieving feedbacks', error.message);
  }
};

// Get instructor feedback statistics (average rating, count)
exports.getInstructorFeedbackStats = async (req, res) => {
  try {
    const { instructorId } = req.params;

    // Verify instructor exists
    const instructor = await db.User.findByPk(instructorId);
    if (!instructor) {
      return sendResponse(res, 404, false, 'Instructor not found');
    }

    const feedbacks = await db.Feedback.findAll({
      where: { instructorId },
      attributes: [
        [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'averageRating'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalFeedbacks'],
      ],
      raw: true,
    });

    const stats = feedbacks[0] || { averageRating: 0, totalFeedbacks: 0 };

    return sendResponse(res, 200, true, 'Instructor feedback statistics retrieved', {
      instructorId,
      averageRating: parseFloat(stats.averageRating || 0).toFixed(2),
      totalFeedbacks: parseInt(stats.totalFeedbacks || 0),
    });
  } catch (error) {
    console.error('Error retrieving feedback stats:', error);
    return sendResponse(res, 500, false, 'Error retrieving feedback statistics', error.message);
  }
};

// Update feedback
exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedbackText, rating } = req.body;

    const feedback = await db.Feedback.findByPk(id);
    if (!feedback) {
      return sendResponse(res, 404, false, 'Feedback not found');
    }

    // Validate rating if provided
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return sendResponse(res, 400, false, 'Rating must be between 1 and 5');
      }
    }

    // Handle feedback text
    let feedbackArray = feedback.feedbackText || [];
    if (feedbackText) {
      if (Array.isArray(feedbackText)) {
        feedbackArray = feedbackText;
      } else {
        feedbackArray = [feedbackText];
      }
    }

    // Update feedback
    await feedback.update({
      feedbackText: feedbackArray,
      rating: rating !== undefined ? rating : feedback.rating,
    });

    // Fetch updated feedback with associations
    const updatedFeedback = await db.Feedback.findByPk(id, {
      include: [
        { model: db.Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email', 'candidateStatus'] },
        { model: db.User, as: 'instructor', attributes: ['id', 'name', 'email'] },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject', attributes: ['id', 'name'] }] },
      ],
    });

    return sendResponse(res, 200, true, 'Feedback updated successfully', updatedFeedback);
  } catch (error) {
    console.error('Error updating feedback:', error);
    return sendResponse(res, 500, false, 'Error updating feedback', error.message);
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await db.Feedback.findByPk(id);
    if (!feedback) {
      return sendResponse(res, 404, false, 'Feedback not found');
    }

    await feedback.destroy();

    return sendResponse(res, 200, true, 'Feedback deleted successfully');
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return sendResponse(res, 500, false, 'Error deleting feedback', error.message);
  }
};

// Get students (enquiries) eligible for feedback in a batch
exports.getEligibleStudentsForBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    // Verify batch exists
    const batch = await db.Batch.findByPk(batchId);
    if (!batch) {
      return sendResponse(res, 404, false, 'Batch not found');
    }

    // Get all enquiries with 'class' or 'class qualified' status
    const eligibleStudents = await db.Enquiry.findAll({
      where: {
        candidateStatus: ['class', 'class qualified'],
      },
      attributes: ['id', 'name', 'email', 'candidateStatus'],
      order: [['name', 'ASC']],
    });

    return sendResponse(res, 200, true, 'Eligible students retrieved successfully', eligibleStudents);
  } catch (error) {
    console.error('Error retrieving eligible students:', error);
    return sendResponse(res, 500, false, 'Error retrieving eligible students', error.message);
  }
};
