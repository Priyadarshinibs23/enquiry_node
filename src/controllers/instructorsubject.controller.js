const { InstructorSubject, User, Subject } = require('../models');

/**
 * Assign subject to instructor
 * POST /api/instructor-subjects
 */
exports.assignSubjectToInstructor = async (req, res) => {
  try {
    const { instructorId, subjectId } = req.body;
    const userRole = req.user.role;

    // Only ADMIN and COUNSELLOR can assign subjects to instructors
    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({
        message: 'Access denied. Only Admin and Counsellor can assign subjects to instructors.',
      });
    }

    // Validate required fields
    if (!instructorId || !subjectId) {
      return res.status(400).json({
        message: 'instructorId and subjectId are required',
      });
    }

    // Check if instructor exists
    const instructor = await User.findByPk(instructorId);
    if (!instructor) {
      return res.status(404).json({
        message: 'Instructor not found',
      });
    }

    // Check if subject exists
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({
        message: 'Subject not found',
      });
    }

    // Check if mapping already exists
    const existingMapping = await InstructorSubject.findOne({
      where: { instructorId, subjectId },
    });

    if (existingMapping) {
      return res.status(400).json({
        message: 'This instructor is already assigned to this subject',
      });
    }

    // Create mapping
    const mapping = await InstructorSubject.create({
      instructorId,
      subjectId,
    });

    res.status(201).json({
      success: true,
      message: 'Subject assigned to instructor successfully',
      data: mapping,
    });
  } catch (error) {
    console.error('Error in assignSubjectToInstructor:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all subjects assigned to an instructor
 * GET /api/instructor-subjects/instructor/:instructorId
 */
exports.getInstructorSubjects = async (req, res) => {
  try {
    const { instructorId } = req.params;

    // Check if instructor exists
    const instructor = await User.findByPk(instructorId);
    if (!instructor) {
      return res.status(404).json({
        message: 'Instructor not found',
      });
    }

    // Get all subjects for this instructor
    const subjects = await InstructorSubject.findAll({
      where: { instructorId },
      include: [
        {
          model: Subject,
          attributes: ['id', 'name', 'code'],
        },
      ],
    });

    res.json({
      success: true,
      message: 'Instructor subjects retrieved successfully',
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
      },
      subjectCount: subjects.length,
      data: subjects,
    });
  } catch (error) {
    console.error('Error in getInstructorSubjects:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all instructors assigned to a subject
 * GET /api/instructor-subjects/subject/:subjectId
 */
exports.getSubjectInstructors = async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Check if subject exists
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({
        message: 'Subject not found',
      });
    }

    // Get all instructors for this subject
    const instructors = await InstructorSubject.findAll({
      where: { subjectId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.json({
      success: true,
      message: 'Subject instructors retrieved successfully',
      subject: {
        id: subject.id,
        name: subject.name,
        code: subject.code,
      },
      instructorCount: instructors.length,
      data: instructors,
    });
  } catch (error) {
    console.error('Error in getSubjectInstructors:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Remove subject from instructor
 * DELETE /api/instructor-subjects/:id
 */
exports.removeSubjectFromInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    // Only ADMIN and COUNSELLOR can remove assignments
    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({
        message: 'Access denied. Only Admin and Counsellor can remove subject assignments.',
      });
    }

    // Check if mapping exists
    const mapping = await InstructorSubject.findByPk(id);
    if (!mapping) {
      return res.status(404).json({
        message: 'Instructor-Subject mapping not found',
      });
    }

    // Delete mapping
    await mapping.destroy();

    res.json({
      success: true,
      message: 'Subject removed from instructor successfully',
    });
  } catch (error) {
    console.error('Error in removeSubjectFromInstructor:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all instructor-subject mappings
 * GET /api/instructor-subjects
 */
exports.getAllMappings = async (req, res) => {
  try {
    const mappings = await InstructorSubject.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Subject,
          attributes: ['id', 'name', 'code'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      message: 'All instructor-subject mappings retrieved successfully',
      totalMappings: mappings.length,
      data: mappings,
    });
  } catch (error) {
    console.error('Error in getAllMappings:', error);
    res.status(500).json({ message: error.message });
  }
};
