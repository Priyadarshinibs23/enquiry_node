const db = require('../models');
const User = db.User;
const Batch = db.Batch;

// Create Batch
exports.createBatch = async (req, res) => {
  try {
    const { name, code, sessionDate, sessionTime, status, numberOfStudents, sessionLink, subjectId } = req.body;
    const userId = req.user.id;  // From authenticated User
    const userRole = req.user.role;  // Role validation

    console.log('Create batch request:', { name, code, subjectId, userRole, userId });

    if (!name || !code || !sessionDate || !sessionTime || !subjectId) {
      return res.status(400).json({
        message: 'name, code, sessionDate, sessionTime, and subjectId are required',
      });
    }

    // Check if subject exists - MANDATORY
    const subject = await db.Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create batch. The specified subject does not exist. Please create or select a valid subject first.',
      });
    }

    // For instructors: create with pending approval
    // For admin/counsellor: create directly with approved status
    const approvalStatus = (userRole === 'ADMIN' || userRole === 'COUNSELLOR') ? 'approved' : 'pending';

    const batch = await Batch.create({
      name,
      code,
      sessionDate,
      sessionTime,
      status: status || 'yet to start',
      numberOfStudents: numberOfStudents || 0,
      sessionLink: sessionLink || null,
      approvalStatus,
      createdBy: userId,
      subjectId,
    });

    console.log('Batch created:', batch?.dataValues);

    res.status(201).json({
      success: true,
      message: approvalStatus === 'pending' 
        ? 'Batch created successfully and sent for approval' 
        : 'Batch created successfully',
      data: batch,
    });
  } catch (error) {
    console.error('Error in createBatch:', error);
    res.status(500).json({
      message: error.message,
      error: error.toString(),
    });
  }
};

// Get available batches for instructor (created by admin/counsellor)
exports.getAvailableBatches = async (req, res) => {
  try {
    const userRole = req.user.role;

    // Only instructors can view available batches
    if (userRole !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can view available batches' });
    }

    const batches = await Batch.findAll({
      where: {
        approvalStatus: 'approved',
      },
      include: [
        {
          model: db.User,
          attributes: ['id', 'name', 'email'],
          foreignKey: 'createdBy',
          as: 'creator',
        },
        {
          model: db.Subject,
          attributes: ['id', 'name', 'code', 'image', 'overview', 'syllabus', 'prerequisites', 'startDate'],
          foreignKey: 'subjectId',
          as: 'subject',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Available batches created by Admin/Counsellor',
      total: batches.length,
      data: batches,
    });
  } catch (error) {
    console.error('Error in getAvailableBatches:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all batches (with filtering for instructors)
exports.getBatches = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;
    let batches;

    // Instructors can only see their own batches and approved batches
    if (userRole === 'instructor') {
      batches = await Batch.findAll({
        where: {
          [db.Sequelize.Op.or]: [
            { createdBy: userId }, // their own batches
            { approvalStatus: 'approved' }, // approved batches
          ],
        },
        include: [
          {
            model: db.User,
            attributes: ['id', 'name', 'email'],
            foreignKey: 'createdBy',
            as: 'creator',
          },
          {
            model: db.Subject,
            attributes: ['id', 'name', 'code', 'image', 'overview', 'syllabus', 'prerequisites', 'startDate'],
            foreignKey: 'subjectId',
            as: 'subject',
          },
        ],
        order: [['createdAt', 'DESC']],
      });
    } else if (userRole === 'ADMIN' || userRole === 'COUNSELLOR') {
      // Admin/Counsellor can see all batches
      batches = await Batch.findAll({
        include: [
          {
            model: db.User,
            attributes: ['id', 'name', 'email'],
            foreignKey: 'createdBy',
            as: 'creator',
          },
          {
            model: db.Subject,
            attributes: ['id', 'name', 'code', 'image', 'overview', 'syllabus', 'prerequisites', 'startDate'],
            foreignKey: 'subjectId',
            as: 'subject',
          },
        ],
        order: [['createdAt', 'DESC']],
      });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({
      success: true,
      total: batches.length,
      data: batches,
    });
  } catch (error) {
    console.error('Error in getBatches:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get batch by ID
exports.getBatchById = async (req, res) => {
  try {
    const { batchId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const batch = await Batch.findByPk(batchId, {
      include: [
        {
          model: db.User,
          attributes: ['id', 'name', 'email'],
          foreignKey: 'createdBy',
          as: 'creator',
        },
        {
          model: db.Subject,
          attributes: ['id', 'name', 'code', 'image', 'overview', 'syllabus', 'prerequisites', 'startDate'],
          foreignKey: 'subjectId',
          as: 'subject',
        },
      ],
    });

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Instructors can view:
    // 1. Their own batches (any status)
    // 2. Approved batches (created by anyone)
    if (userRole === 'instructor') {
      if (batch.createdBy !== userId && batch.approvalStatus !== 'approved') {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    console.error('Error in getBatchById:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update Batch (instructor updates go to pending, admin/counsellor can update freely)
exports.updateBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { name, code, sessionDate, sessionTime, status, numberOfStudents, sessionLink } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const batch = await Batch.findByPk(batchId);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Instructors can only update their own batches or approved batches created by admin/counsellor
    if (userRole === 'instructor') {
      if (batch.createdBy !== userId && batch.approvalStatus !== 'approved') {
        return res.status(403).json({ 
          message: 'Access denied. Only approved batches can be updated by other instructors' 
        });
      }
    }

    // Update fields
    if (name) batch.name = name;
    if (code) batch.code = code;
    if (sessionDate) batch.sessionDate = sessionDate;
    if (sessionTime) batch.sessionTime = sessionTime;
    if (status) batch.status = status;
    if (numberOfStudents !== undefined) batch.numberOfStudents = numberOfStudents;
    if (sessionLink) batch.sessionLink = sessionLink;

    // ANY instructor update requires approval
    if (userRole === 'instructor') {
      batch.approvalStatus = 'pending';
    }

    await batch.save();

    console.log('Batch updated:', batch?.dataValues);

    res.status(200).json({
      success: true,
      message: userRole === 'instructor' 
        ? 'Batch updated and sent for approval' 
        : 'Batch updated successfully',
      data: batch,
    });
  } catch (error) {
    console.error('Error in updateBatch:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update Batch Approval Status (only admin/counsellor)
exports.updateApprovalStatus = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { approvalStatus } = req.body;
    const userRole = req.user.role;

    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({ message: 'Only Admin and Counsellor can approve/reject batches' });
    }

    if (!['approved', 'rejected', 'pending'].includes(approvalStatus)) {
      return res.status(400).json({ message: 'Invalid approval status. Use: approved, rejected, or pending' });
    }

    const batch = await Batch.findByPk(batchId);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    batch.approvalStatus = approvalStatus;
    await batch.save();

    console.log('Batch approval status updated:', batch?.dataValues);

    res.status(200).json({
      success: true,
      message: `Batch ${approvalStatus} successfully`,
      data: batch,
    });
  } catch (error) {
    console.error('Error in updateApprovalStatus:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Batch (only admin/counsellor can delete, instructors cannot delete)
exports.deleteBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Only admin/counsellor can delete batches
    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({ 
        message: 'Access denied. Only Admin and Counsellor can delete batches. Instructors must request approval to delete.' 
      });
    }

    const batch = await Batch.findByPk(batchId);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    await batch.destroy();

    console.log('Batch deleted:', batchId);

    res.status(200).json({
      success: true,
      message: 'Batch deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteBatch:', error);
    res.status(500).json({ message: error.message });
  }
};
