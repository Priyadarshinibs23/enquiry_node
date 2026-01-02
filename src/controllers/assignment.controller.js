const db = require('../models');
const Batch = db.Batch;
const Subject = db.Subject;
const Assignment = db.Assignment;
const User = db.User;

// Create Assignment for a Batch
exports.createAssignment = async (req, res) => {
  try {
    const { batchId, title, description, dueDate } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log('Create assignment request:', { batchId, title, dueDate, userRole });

    if (!batchId || !title || !dueDate) {
      return res.status(400).json({
        message: 'batchId, title, and dueDate are required',
      });
    }

    // Get batch with subject details
    const batch = await Batch.findByPk(batchId, {
      include: [
        {
          model: Subject,
          attributes: ['id', 'name', 'code'],
          as: 'subject',
        },
      ],
    });

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Only instructor of that batch or admin/counsellor can create assignments
    if (userRole === 'instructor' && batch.createdBy !== userId) {
      return res.status(403).json({ 
        message: 'Access denied. You can only create assignments for your own batches.' 
      });
    }

    const assignment = await Assignment.create({
      title,
      description: description || null,
      dueDate,
      batchId,
      subjectId: batch.subjectId,
      createdBy: userId,
    });

    console.log('Assignment created:', assignment?.dataValues);

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: assignment,
    });
  } catch (error) {
    console.error('Error in createAssignment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get Assignments for a Batch
exports.getAssignmentsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const assignments = await Assignment.findAll({
      where: { batchId },
      include: [
        {
          model: Batch,
          attributes: ['id', 'name', 'code'],
          as: 'batch',
        },
        {
          model: Subject,
          attributes: ['id', 'name', 'code'],
          as: 'subject',
        },
        {
          model: User,
          attributes: ['id', 'name', 'email'],
          foreignKey: 'createdBy',
          as: 'instructor',
        },
      ],
      order: [['createdDate', 'DESC']],
    });

    res.status(200).json({
      success: true,
      total: assignments.length,
      batchName: batch.name,
      batchCode: batch.code,
      data: assignments,
    });
  } catch (error) {
    console.error('Error in getAssignmentsByBatch:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get Assignments for a Subject
exports.getAssignmentsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const assignments = await Assignment.findAll({
      where: { subjectId },
      include: [
        {
          model: Batch,
          attributes: ['id', 'name', 'code'],
          as: 'batch',
        },
        {
          model: Subject,
          attributes: ['id', 'name', 'code'],
          as: 'subject',
        },
        {
          model: User,
          attributes: ['id', 'name', 'email'],
          foreignKey: 'createdBy',
          as: 'instructor',
        },
      ],
      order: [['createdDate', 'DESC']],
    });

    res.status(200).json({
      success: true,
      total: assignments.length,
      subjectName: subject.name,
      subjectCode: subject.code,
      data: assignments,
    });
  } catch (error) {
    console.error('Error in getAssignmentsBySubject:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get Single Assignment
exports.getAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findByPk(assignmentId, {
      include: [
        {
          model: Batch,
          attributes: ['id', 'name', 'code', 'sessionDate', 'sessionTime'],
          as: 'batch',
        },
        {
          model: Subject,
          attributes: ['id', 'name', 'code', 'image'],
          as: 'subject',
        },
        {
          model: User,
          attributes: ['id', 'name', 'email'],
          foreignKey: 'createdBy',
          as: 'instructor',
        },
      ],
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error('Error in getAssignmentById:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update Assignment (only creator or admin/counsellor)
exports.updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { title, description, dueDate } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const assignment = await Assignment.findByPk(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Only creator or admin/counsellor can update
    if (assignment.createdBy !== userId && userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (title) assignment.title = title;
    if (description) assignment.description = description;
    if (dueDate) assignment.dueDate = dueDate;

    await assignment.save();

    console.log('Assignment updated:', assignment?.dataValues);

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: assignment,
    });
  } catch (error) {
    console.error('Error in updateAssignment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Assignment (only creator or admin/counsellor)
exports.deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const assignment = await Assignment.findByPk(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Only creator or admin/counsellor can delete
    if (assignment.createdBy !== userId && userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await assignment.destroy();

    console.log('Assignment deleted:', assignmentId);

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteAssignment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Assignments created by an Instructor
exports.getMyAssignments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let assignments;

    if (userRole === 'instructor') {
      // Instructor sees only their assignments
      assignments = await Assignment.findAll({
        where: { createdBy: userId },
        include: [
          {
            model: Batch,
            attributes: ['id', 'name', 'code'],
            as: 'batch',
          },
          {
            model: Subject,
            attributes: ['id', 'name', 'code'],
            as: 'subject',
          },
          {
            model: User,
            attributes: ['id', 'name', 'email'],
            foreignKey: 'createdBy',
            as: 'instructor',
          },
        ],
        order: [['createdDate', 'DESC']],
      });
    } else if (userRole === 'ADMIN' || userRole === 'COUNSELLOR') {
      // Admin/Counsellor see all assignments
      assignments = await Assignment.findAll({
        include: [
          {
            model: Batch,
            attributes: ['id', 'name', 'code'],
            as: 'batch',
          },
          {
            model: Subject,
            attributes: ['id', 'name', 'code'],
            as: 'subject',
          },
          {
            model: User,
            attributes: ['id', 'name', 'email'],
            foreignKey: 'createdBy',
            as: 'instructor',
          },
        ],
        order: [['createdDate', 'DESC']],
      });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({
      success: true,
      total: assignments.length,
      data: assignments,
    });
  } catch (error) {
    console.error('Error in getMyAssignments:', error);
    res.status(500).json({ message: error.message });
  }
};

// Submit assignment (student submits their work)
exports.submitAssignmentWork = async (req, res) => {
  try {
    const { assignmentId, submissionNotes, submissionFile } = req.body;
    const userId = req.user.id;

    if (!assignmentId) {
      return res.status(400).json({ message: 'assignmentId is required' });
    }

    const assignment = await Assignment.findByPk(assignmentId, {
      include: [
        { model: db.Batch, as: 'batch' },
        { model: db.Subject, as: 'subject' },
        { model: db.User, as: 'instructor' },
        { model: db.Enquiry, as: 'enquiry' },
      ],
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Update assignment with submission details
    await assignment.update({
      submissionNotes: submissionNotes || null,
      submissionFile: submissionFile || null,
      submittedOn: new Date(),
      status: 'submitted',
    });

    res.status(200).json({
      success: true,
      message: `Assignment submitted by ${assignment.enquiry?.name || 'Student'}`,
      data: assignment,
    });
  } catch (error) {
    console.error('Error in submitAssignmentWork:', error);
    res.status(500).json({ message: error.message });
  }
};

// Review assignment (instructor reviews and comments)
exports.reviewAssignmentSubmission = async (req, res) => {
  try {
    const { assignmentId, instructorComments } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!assignmentId) {
      return res.status(400).json({ message: 'assignmentId is required' });
    }

    // Only instructor, admin, counsellor can review
    if (userRole !== 'instructor' && userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({
        message: 'Only instructors, admin, or counsellor can review submissions',
      });
    }

    const assignment = await Assignment.findByPk(assignmentId, {
      include: [
        { model: db.Enquiry, as: 'enquiry' },
        { model: db.Batch, as: 'batch' },
        { model: db.Subject, as: 'subject' },
      ],
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Update assignment with review details
    await assignment.update({
      reviewedBy: userId,
      reviewedOn: new Date(),
      instructorComments: instructorComments || null,
      status: 'reviewed',
    });

    const updatedAssignment = await Assignment.findByPk(assignmentId, {
      include: [
        { model: db.Batch, as: 'batch', attributes: ['id', 'name', 'code'] },
        { model: db.Subject, as: 'subject', attributes: ['id', 'name', 'code'] },
        { model: db.User, as: 'instructor', attributes: ['id', 'name', 'email'] },
        { model: db.Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email'] },
        { model: db.User, as: 'reviewer', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Assignment reviewed for ${assignment.enquiry?.name || 'Student'}`,
      data: updatedAssignment,
    });
  } catch (error) {
    console.error('Error in reviewAssignmentSubmission:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get assignments pending review
exports.getSubmissionsPendingReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== 'instructor' && userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({ message: 'Access denied' });
    }

    let assignments;

    if (userRole === 'instructor') {
      // Instructors see pending submissions only for their assignments
      assignments = await Assignment.findAll({
        where: {
          createdBy: userId,
          status: 'submitted',
        },
        include: [
          { model: db.Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email'] },
          { model: db.Subject, as: 'subject', attributes: ['id', 'name'] },
        ],
        order: [['submittedOn', 'ASC']],
      });
    } else {
      // Admin/Counsellor see all pending submissions
      assignments = await Assignment.findAll({
        where: { status: 'submitted' },
        include: [
          { model: db.User, as: 'instructor', attributes: ['id', 'name', 'email'] },
          { model: db.Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email'] },
          { model: db.Subject, as: 'subject', attributes: ['id', 'name'] },
        ],
        order: [['submittedOn', 'ASC']],
      });
    }

    res.status(200).json({
      success: true,
      total: assignments.length,
      message: `Found ${assignments.length} submissions pending review`,
      data: assignments,
    });
  } catch (error) {
    console.error('Error in getSubmissionsPendingReview:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get reviewed assignments
exports.getReviewedAssignments = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    if (userRole !== 'instructor' && userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({ message: 'Access denied' });
    }

    let assignments;

    if (userRole === 'instructor') {
      // Instructors see assignments they reviewed
      assignments = await Assignment.findAll({
        where: {
          reviewedBy: userId,
          status: 'reviewed',
        },
        include: [
          { model: db.Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email'] },
          { model: db.Subject, as: 'subject', attributes: ['id', 'name'] },
        ],
        order: [['reviewedOn', 'DESC']],
      });
    } else {
      // Admin/Counsellor see all reviewed assignments
      assignments = await Assignment.findAll({
        where: { status: 'reviewed' },
        include: [
          { model: db.User, as: 'instructor', attributes: ['id', 'name', 'email'] },
          { model: db.Enquiry, as: 'enquiry', attributes: ['id', 'name', 'email'] },
          { model: db.User, as: 'reviewer', attributes: ['id', 'name', 'email'] },
        ],
        order: [['reviewedOn', 'DESC']],
      });
    }

    res.status(200).json({
      success: true,
      total: assignments.length,
      data: assignments,
    });
  } catch (error) {
    console.error('Error in getReviewedAssignments:', error);
    res.status(500).json({ message: error.message });
  }
};

// Assign an assignment to an enquiry (candidate) with "class" status
exports.assignToEnquiry = async (req, res) => {
  try {
    const { assignmentId, enquiryId } = req.body;
    const userRole = req.user.role;

    if (!assignmentId || !enquiryId) {
      return res.status(400).json({
        message: 'assignmentId and enquiryId are required',
      });
    }

    // Only admin/counsellor can assign assignments to enquiries
    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({
        message: 'Only admin or counsellor can assign assignments to enquiries',
      });
    }

    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const Enquiry = db.Enquiry;
    const enquiry = await Enquiry.findByPk(enquiryId);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    // Check if enquiry has 'class' or 'class qualified' status
    if (enquiry.candidateStatus !== 'class' && enquiry.candidateStatus !== 'class qualified') {
      return res.status(400).json({
        message: `Enquiry must have 'class' or 'class qualified' status. Current status: ${enquiry.candidateStatus}`,
      });
    }

    // Update assignment with enquiryId
    await assignment.update({ enquiryId });

    const updatedAssignment = await Assignment.findByPk(assignmentId, {
      include: [
        { model: db.Batch, attributes: ['id', 'name', 'code'], as: 'batch' },
        { model: db.Subject, attributes: ['id', 'name', 'code'], as: 'subject' },
        { model: db.User, attributes: ['id', 'name', 'email'], foreignKey: 'createdBy', as: 'instructor' },
        { model: db.Enquiry, attributes: ['id', 'name', 'email', 'candidateStatus'], as: 'enquiry' },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Assignment assigned to enquiry ${enquiry.name}`,
      data: updatedAssignment,
    });
  } catch (error) {
    console.error('Error in assignToEnquiry:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all assignments for a specific enquiry
exports.getAssignmentsByEnquiry = async (req, res) => {
  try {
    const { enquiryId } = req.params;

    if (!enquiryId) {
      return res.status(400).json({ message: 'enquiryId is required' });
    }

    const Enquiry = db.Enquiry;
    const enquiry = await Enquiry.findByPk(enquiryId);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    const assignments = await Assignment.findAll({
      where: { enquiryId },
      include: [
        { model: db.Batch, attributes: ['id', 'name', 'code'], as: 'batch' },
        { model: db.Subject, attributes: ['id', 'name', 'code'], as: 'subject' },
        { model: db.User, attributes: ['id', 'name', 'email'], foreignKey: 'createdBy', as: 'instructor' },
      ],
      order: [['dueDate', 'ASC']],
    });

    res.status(200).json({
      success: true,
      enquiryName: enquiry.name,
      candidateStatus: enquiry.candidateStatus,
      total: assignments.length,
      data: assignments,
    });
  } catch (error) {
    console.error('Error in getAssignmentsByEnquiry:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all enquiries (candidates) with 'class' status and their assignments
exports.getClassCandidatesWithAssignments = async (req, res) => {
  try {
    const userRole = req.user.role;

    // Only admin/counsellor can view this
    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({
        message: 'Only admin or counsellor can view candidates with class status',
      });
    }

    const Enquiry = db.Enquiry;
    
    // Get all enquiries with 'class' or 'class qualified' status and their assignments
    const candidates = await Enquiry.findAll({
      where: {
        candidateStatus: ['class', 'class qualified'],
      },
      include: [
        {
          model: db.Assignment,
          attributes: ['id', 'title', 'description', 'createdDate', 'dueDate'],
          as: 'assignments',
          include: [
            { model: db.Batch, attributes: ['id', 'name', 'code'], as: 'batch' },
            { model: db.Subject, attributes: ['id', 'name', 'code'], as: 'subject' },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      total: candidates.length,
      message: `Found ${candidates.length} candidates with class status`,
      data: candidates,
    });
  } catch (error) {
    console.error('Error in getClassCandidatesWithAssignments:', error);
    res.status(500).json({ message: error.message });
  }
};
