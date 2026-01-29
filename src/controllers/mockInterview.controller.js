const db = require('../models');
const MockInterview = db.MockInterview;
const Enquiry = db.Enquiry;
const Batch = db.Batch;
const User = db.User;
const { Formidable } = require('formidable');
const fs = require('fs').promises;
const path = require('path');
const { uploadDocument } = require('../utils/cloudinary');

// CREATE - Schedule a Mock Interview
exports.scheduleMockInterview = async (req, res) => {
  const form = new Formidable({ multiples: false, maxFileSize: 50 * 1024 * 1024, keepExtensions: true });
  
  try {
    console.log('=== Mock Interview Schedule Request Started ===');
    console.log('User ID:', req.user?.id);
    console.log('User Role:', req.user?.role);

    const [fields, files] = await form.parse(req);
    
    const batchId = fields.batchId ? fields.batchId[0] : null;
    const enquiryId = fields.enquiryId ? fields.enquiryId[0] : null;
    const interviewDate = fields.interviewDate ? fields.interviewDate[0] : null;
    const interviewTime = fields.interviewTime ? fields.interviewTime[0] : null;
    const mode = fields.mode ? fields.mode[0] : null;
    const interviewLink = fields.interviewLink ? fields.interviewLink[0] : null;

    console.log('Extracted Fields:', { batchId, enquiryId, interviewDate, interviewTime, mode, interviewLink });

    const instructorId = req.user.id;
    const userRole = req.user.role;

    // Validate required fields
    if (!batchId || !enquiryId || !interviewDate || !interviewTime || !mode) {
      console.log('Validation Failed - Missing required fields');
      return res.status(400).json({
        message: 'batchId, enquiryId, interviewDate, interviewTime, and mode are required',
      });
    }

    // Only instructors, admin, or counsellor can schedule interviews
    if (userRole !== 'instructor' && userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      console.log('Authorization Failed - User role:', userRole);
      return res.status(403).json({
        message: 'Only instructors, admin, or counsellor can schedule mock interviews',
      });
    }

    // Get enquiry details with candidate status check
    console.log('Finding Enquiry with ID:', enquiryId);
    const enquiry = await Enquiry.findByPk(enquiryId);
    if (!enquiry) {
      console.log('Enquiry not found with ID:', enquiryId);
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    console.log('Enquiry found:', { id: enquiry.id, name: enquiry.name, candidateStatus: enquiry.candidateStatus });

    if (enquiry.candidateStatus !== 'class') {
      console.log('Enquiry status check failed:', enquiry.candidateStatus);
      return res.status(400).json({
        message: 'Only candidates with "class" status can be interviewed',
      });
    }

    // Verify batch exists
    console.log('Finding Batch with ID:', batchId);
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      console.log('Batch not found with ID:', batchId);
      return res.status(404).json({ message: 'Batch not found' });
    }

    console.log('Batch found:', { id: batch.id, name: batch.name });

    // Handle document upload to Cloudinary
    let documentUploadUrl = null;
    
    if (files.document && files.document[0]) {
      console.log('Document file found, uploading to Cloudinary...');
      try {
        const file = files.document[0];
        const fileBuffer = await fs.readFile(file.filepath);
        console.log('File buffer size:', fileBuffer.length);
        
        const fileName = `mockinterview_${enquiryId}_${Date.now()}`;
        console.log('Uploading with filename:', fileName);
        
        const uploadResult = await uploadDocument(fileBuffer, fileName);
        documentUploadUrl = uploadResult.secure_url;
        console.log('Upload successful. URL:', documentUploadUrl);
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        return res.status(400).json({
          message: 'Failed to upload document',
          error: uploadError.message,
        });
      } finally {
        // Cleanup temp file
        if (files.document && files.document[0]) {
          await fs.unlink(files.document[0].filepath).catch(() => {});
          console.log('Temp file cleaned up');
        }
      }
    } else if (fields.documentUrl) {
      console.log('Document URL provided (no file)');
      documentUploadUrl = fields.documentUrl[0];
      console.log('Document URL:', documentUploadUrl);
    } else {
      console.log('No document file or URL provided');
    }

    // Create mock interview
    console.log('Creating Mock Interview record...');
    const mockInterview = await MockInterview.create({
      batchId,
      enquiryId,
      instructorId: userRole === 'instructor' ? instructorId : (fields.instructorId ? fields.instructorId[0] : instructorId),
      studentName: enquiry.name,
      studentEmail: enquiry.email,
      interviewDate,
      interviewTime,
      mode,
      interviewLink: interviewLink || null,
      documentUpload: documentUploadUrl || null,
      status: 'scheduled',
    });

    console.log('Mock Interview created successfully:', { id: mockInterview.id, status: mockInterview.status });

    // Fetch the created interview with enquiry details
    const createdInterview = await MockInterview.findByPk(mockInterview.id, {
      include: [
        { model: Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email'] },
        { model: Batch, as: 'batch', attributes: ['id', 'name', 'code'] },
        { model: User, as: 'instructor', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Mock interview scheduled successfully',
      data: createdInterview,
    });
  } catch (error) {
    console.error('=== Error in scheduleMockInterview ===');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    
    res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// READ - Get All Mock Interviews
exports.getAllMockInterviews = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    let mockInterviews;

    if (userRole === 'instructor') {
      // Instructors see only their scheduled interviews
      mockInterviews = await MockInterview.findAll({
        where: { instructorId: userId },
        include: [
          { model: Batch, as: 'batch', attributes: ['id', 'name', 'code'] },
          { model: Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email', 'candidateStatus'] },
          { model: User, as: 'instructor', attributes: ['id', 'name', 'email'] },
        ],
        order: [['interviewDate', 'DESC']],
      });
    } else {
      // Admin/Counsellor see all mock interviews
      mockInterviews = await MockInterview.findAll({
        include: [
          { model: Batch, as: 'batch', attributes: ['id', 'name', 'code'] },
          { model: Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email', 'candidateStatus'] },
          { model: User, as: 'instructor', attributes: ['id', 'name', 'email'] },
        ],
        order: [['interviewDate', 'DESC']],
      });
    }

    res.status(200).json({
      success: true,
      total: mockInterviews.length,
      data: mockInterviews,
    });
  } catch (error) {
    console.error('Error in getAllMockInterviews:', error);
    res.status(500).json({ message: error.message });
  }
};

// READ - Get Mock Interview by ID
exports.getMockInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const mockInterview = await MockInterview.findByPk(id, {
      include: [
        { model: Batch, as: 'batch', attributes: ['id', 'name', 'code'] },
        { model: Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email', 'phone', 'candidateStatus'] },
        { model: User, as: 'instructor', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!mockInterview) {
      return res.status(404).json({ message: 'Mock interview not found' });
    }

    res.status(200).json({
      success: true,
      data: mockInterview,
    });
  } catch (error) {
    console.error('Error in getMockInterviewById:', error);
    res.status(500).json({ message: error.message });
  }
};

// READ - Get Mock Interviews by Batch
exports.getMockInterviewsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const mockInterviews = await MockInterview.findAll({
      where: { batchId },
      include: [
        { model: Batch, as: 'batch', attributes: ['id', 'name'] },
        { model: Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'instructor', attributes: ['id', 'name', 'email'] },
      ],
      order: [['interviewDate', 'DESC']],
    });

    res.status(200).json({
      success: true,
      total: mockInterviews.length,
      data: mockInterviews,
    });
  } catch (error) {
    console.error('Error in getMockInterviewsByBatch:', error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE - Update Mock Interview
exports.updateMockInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { interviewDate, interviewTime, mode, interviewLink, documentUpload, status, feedback, score } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const mockInterview = await MockInterview.findByPk(id);
    if (!mockInterview) {
      return res.status(404).json({ message: 'Mock interview not found' });
    }

    // Only instructor who created it, admin, or counsellor can update
    if (userRole === 'instructor' && mockInterview.instructorId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update interview
    await mockInterview.update({
      interviewDate: interviewDate || mockInterview.interviewDate,
      interviewTime: interviewTime || mockInterview.interviewTime,
      mode: mode || mockInterview.mode,
      interviewLink: interviewLink !== undefined ? interviewLink : mockInterview.interviewLink,
      documentUpload: documentUpload !== undefined ? documentUpload : mockInterview.documentUpload,
      status: status || mockInterview.status,
      feedback: feedback !== undefined ? feedback : mockInterview.feedback,
      score: score !== undefined ? score : mockInterview.score,
    });

    res.status(200).json({
      success: true,
      message: 'Mock interview updated successfully',
      data: mockInterview,
    });
  } catch (error) {
    console.error('Error in updateMockInterview:', error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE - Mark Interview as Attended/Not Attended
exports.updateInterviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback, score } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!status || !['attended', 'not-attended', 'cancelled'].includes(status)) {
      return res.status(400).json({
        message: 'Valid status values: attended, not-attended, cancelled',
      });
    }

    if (score && (score < 0 || score > 10)) {
      return res.status(400).json({
        message: 'Score must be between 0 and 10',
      });
    }

    const mockInterview = await MockInterview.findByPk(id);
    if (!mockInterview) {
      return res.status(404).json({ message: 'Mock interview not found' });
    }

    // Only instructor who created it, admin, or counsellor can update status
    if (userRole === 'instructor' && mockInterview.instructorId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await mockInterview.update({
      status,
      feedback: feedback || null,
      score: score || null,
    });

    const updatedInterview = await MockInterview.findByPk(id, {
      include: [
        { model: Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'instructor', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Interview marked as ${status}`,
      data: updatedInterview,
    });
  } catch (error) {
    console.error('Error in updateInterviewStatus:', error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE - Delete Mock Interview
exports.deleteMockInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const mockInterview = await MockInterview.findByPk(id);
    if (!mockInterview) {
      return res.status(404).json({ message: 'Mock interview not found' });
    }

    // Only instructor who created it, admin, or counsellor can delete
    if (userRole === 'instructor' && mockInterview.instructorId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await mockInterview.destroy();

    res.status(200).json({
      success: true,
      message: 'Mock interview deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteMockInterview:', error);
    res.status(500).json({ message: error.message });
  }
};

// STATISTICS - Get Interview Statistics for Instructor
exports.getInterviewStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    let instructorId = userId;

    // If admin/counsellor, they can specify an instructor ID
    if ((userRole === 'ADMIN' || userRole === 'COUNSELLOR') && req.query.instructorId) {
      instructorId = req.query.instructorId;
    }

    // Get all interviews for the instructor
    const allInterviews = await MockInterview.findAll({
      where: { instructorId },
    });

    // Calculate statistics
    const totalScheduled = allInterviews.filter(i => i.status === 'scheduled').length;
    const totalAttended = allInterviews.filter(i => i.status === 'attended').length;
    const totalNotAttended = allInterviews.filter(i => i.status === 'not-attended').length;
    const totalCancelled = allInterviews.filter(i => i.status === 'cancelled').length;

    // Get interview details grouped by status
    const attendedInterviews = await MockInterview.findAll({
      where: { instructorId, status: 'attended' },
      include: [
        { model: Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email'] },
      ],
    });

    const notAttendedInterviews = await MockInterview.findAll({
      where: { instructorId, status: 'not-attended' },
      include: [
        { model: Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email'] },
      ],
    });

    const scheduledInterviews = await MockInterview.findAll({
      where: { instructorId, status: 'scheduled' },
      include: [
        { model: Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email'] },
      ],
      order: [['interviewDate', 'ASC']],
    });

    res.status(200).json({
      success: true,
      statistics: {
        totalInterviewsScheduled: totalScheduled,
        totalInterviewsAttended: totalAttended,
        totalInterviewsNotAttended: totalNotAttended,
        totalInterviewsCancelled: totalCancelled,
        totalOverall: allInterviews.length,
      },
      details: {
        scheduled: scheduledInterviews,
        attended: attendedInterviews,
        notAttended: notAttendedInterviews,
      },
    });
  } catch (error) {
    console.error('Error in getInterviewStatistics:', error);
    res.status(500).json({ message: error.message });
  }
};

// STATISTICS - Get Interview Statistics for a Batch
exports.getBatchInterviewStatistics = async (req, res) => {
  try {
    const { batchId } = req.params;

    const allInterviews = await MockInterview.findAll({
      where: { batchId },
    });

    if (allInterviews.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No interviews found for this batch',
        statistics: {
          totalScheduled: 0,
          totalAttended: 0,
          totalNotAttended: 0,
          totalOverall: 0,
        },
      });
    }

    const totalScheduled = allInterviews.filter(i => i.status === 'scheduled').length;
    const totalAttended = allInterviews.filter(i => i.status === 'attended').length;
    const totalNotAttended = allInterviews.filter(i => i.status === 'not-attended').length;

    const avgScore =
      attendedInterviews.length > 0
        ? (attendedInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / attendedInterviews.length).toFixed(2)
        : 0;

    const attendedInterviews = allInterviews.filter(i => i.status === 'attended');

    res.status(200).json({
      success: true,
      statistics: {
        totalScheduled,
        totalAttended,
        totalNotAttended,
        totalOverall: allInterviews.length,
        averageScore: avgScore,
      },
    });
  } catch (error) {
    console.error('Error in getBatchInterviewStatistics:', error);
    res.status(500).json({ message: error.message });
  }
};

// STATISTICS - Get Overall System Statistics
exports.getSystemInterviewStatistics = async (req, res) => {
  try {
    const userRole = req.user.role;

    // Only admin and counsellor can access system statistics
    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const allInterviews = await MockInterview.findAll();

    const statistics = {
      totalInterviewsScheduled: allInterviews.filter(i => i.status === 'scheduled').length,
      totalInterviewsAttended: allInterviews.filter(i => i.status === 'attended').length,
      totalInterviewsNotAttended: allInterviews.filter(i => i.status === 'not-attended').length,
      totalOverall: allInterviews.length,
      completionRate: allInterviews.length > 0
        ? ((allInterviews.filter(i => i.status === 'attended').length / allInterviews.length) * 100).toFixed(2)
        : 0,
    };

    // Get stats by instructor
    const instructorStats = await db.sequelize.query(
      `SELECT 
        i.id, 
        i.name,
        COUNT(m.id) as totalScheduled,
        SUM(CASE WHEN m.status = 'attended' THEN 1 ELSE 0 END) as totalAttended,
        SUM(CASE WHEN m.status = 'not-attended' THEN 1 ELSE 0 END) as totalNotAttended
      FROM users i
      LEFT JOIN mockInterviews m ON i.id = m.instructorId
      WHERE i.role = 'instructor'
      GROUP BY i.id, i.name
      ORDER BY totalScheduled DESC`,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    res.status(200).json({
      success: true,
      systemStatistics: statistics,
      instructorStatistics: instructorStats,
    });
  } catch (error) {
    console.error('Error in getSystemInterviewStatistics:', error);
    res.status(500).json({ message: error.message });
  }
};
