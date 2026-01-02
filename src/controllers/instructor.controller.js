const db = require('../models');
const User = db.User;
const Subject = db.Subject;
const Instructor = db.Instructor;

// Assign subject to instructor
exports.assignSubjectToInstructor = async (req, res) => {
  try {
    const { userId, subjectId } = req.body;
    const userRole = req.user.role;

    console.log('Request received:', { userId, subjectId, userRole });

    // Only ADMIN and COUNSELLOR can assign subjects
    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({
        message: 'Access denied. Only Admin and Counsellor can assign subjects',
      });
    }

    if (!userId || !subjectId) {
      return res.status(400).json({
        message: 'userId and subjectId are required',
      });
    }

    // Check if user exists and is an instructor
    const user = await User.findByPk(userId);
    console.log('User found:', user?.dataValues);

    if (!user || user.role !== 'instructor') {
      return res.status(404).json({
        message: 'Instructor not found or user is not an instructor',
      });
    }

    // Check if subject exists
    const subject = await Subject.findByPk(subjectId);
    console.log('Subject found:', subject?.dataValues);

    if (!subject) {
      return res.status(404).json({
        message: 'Subject not found',
      });
    }

    // Check if assignment already exists
    const existingAssignment = await Instructor.findOne({
      where: { userId, subjectId },
    });

    if (existingAssignment) {
      return res.status(400).json({
        message: 'Subject already assigned to this instructor',
      });
    }

    // Create the assignment
    const assignment = await Instructor.create({
      userId,
      subjectId,
    });

    console.log('Assignment created:', assignment?.dataValues);

    res.status(201).json({
      success: true,
      message: 'Subject assigned to instructor successfully',
      data: assignment,
    });
  } catch (error) {
    console.error('Error in assignSubjectToInstructor:', error);
    res.status(500).json({ 
      message: error.message,
      error: error.toString()
    });
  }
};

// Get all subjects for logged-in instructor (or all subjects if admin/counsellor)
exports.getMySubjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // If admin or counsellor, return all subjects with instructor information
    if (userRole === 'ADMIN' || userRole === 'COUNSELLOR') {
      const subjects = await Subject.findAll({
        attributes: ['id', 'name', 'code', 'image', 'overview', 'syllabus', 'prerequisites', 'startDate'],
        include: [{
          model: User,
          through: { attributes: [] },
          attributes: ['id', 'name', 'email'],
        }],
      });
      return res.status(200).json({
        success: true,
        message: 'All subjects with instructors',
        data: subjects || [],
      });
    }
    
    // If instructor, return only their assigned subjects
    const instructor = await User.findByPk(userId, {
      include: [{
        model: Subject,
        through: { attributes: [] },
        attributes: ['id', 'name', 'code', 'image', 'overview', 'syllabus', 'prerequisites', 'startDate'],
      }],
    });

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Your assigned subjects',
      data: instructor.Subjects || [],
    });
  } catch (error) {
    console.error('Error in getMySubjects:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single subject details for instructor (or any subject if admin/counsellor)
exports.getSubjectDetail = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // If admin or counsellor, they can view any subject with all instructors assigned to it
    if (userRole === 'ADMIN' || userRole === 'COUNSELLOR') {
      const subject = await Subject.findByPk(subjectId, {
        attributes: ['id', 'name', 'code', 'image', 'overview', 'syllabus', 'prerequisites', 'startDate'],
        include: [{
          model: User,
          through: { attributes: [] },
          attributes: ['id', 'name', 'email'],
        }],
      });

      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Subject details with all assigned instructors',
        data: { 
          subject,
          instructors: subject.Users || [],
        },
      });
    }

    // For instructors, check if subject is assigned to them
    const instructor = await Instructor.findOne({
      where: { userId, subjectId },
      include: {
        model: Subject,
        attributes: ['id', 'name', 'code', 'image', 'overview', 'syllabus', 'prerequisites', 'startDate'],
      },
    });

    if (!instructor) {
      return res.status(403).json({ message: 'Access denied. This subject is not assigned to you' });
    }

    res.status(200).json({
      success: true,
      message: 'Your subject details',
      data: {
        subject: instructor.Subject,
      },
    });
  } catch (error) {
    console.error('Error in getSubjectDetail:', error);
    res.status(500).json({ message: error.message });
  }
};
