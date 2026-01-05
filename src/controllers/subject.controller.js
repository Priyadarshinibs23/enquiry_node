const { Subject } = require('../models');
const { uploadImage, deleteImage, updateImage } = require('../utils/cloudinary');

// Helper function to safely parse JSON
const safeJsonParse = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
  return null;
};

/**
 * CREATE Subject (ADMIN and COUNSELLOR)
 */
exports.createSubject = async (req, res) => {
  try {
    const { name, code, startDate, overview, syllabus, prerequisites } = req.body;
    const userRole = req.user.role;

    // Only ADMIN and COUNSELLOR can create subjects
    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({
        message: 'Access denied. Only Admin and Counsellor can create subjects',
      });
    }

    if (!name || !code) {
      return res.status(400).json({
        message: 'name and code are required',
      });
    }

    let imageUrl = null;
    let imagePublicId = null;

    // Upload image if provided
    if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer, `subject-${Date.now()}`);
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const subject = await Subject.create({ 
      name, 
      code,
      startDate: startDate || null,
      image: imageUrl,
      overview: safeJsonParse(overview),
      syllabus: safeJsonParse(syllabus),
      prerequisites: safeJsonParse(prerequisites),
    });

    res.status(201).json({
      message: 'Subject created successfully',
      subject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET all subjects (ALL ROLES)
 */
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      attributes: ['id', 'name', 'code', 'image', 'overview', 'syllabus', 'prerequisites', 'startDate', 'createdAt', 'updatedAt'],
      include: {
        model: require('../models').Package,
        attributes: ['id', 'name', 'code'],
        through: { attributes: [] },
      },
    });
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET subject by ID (ALL ROLES)
 */
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id, {
      attributes: ['id', 'name', 'code', 'image', 'overview', 'syllabus', 'prerequisites', 'startDate', 'createdAt', 'updatedAt'],
      include: {
        model: require('../models').Package,
        attributes: ['id', 'name', 'code'],
        through: { attributes: [] },
      },
    });

    if (!subject) {
      return res.status(404).json({
        message: 'Subject not found',
      });
    }

    res.json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * UPDATE subject (ADMIN and COUNSELLOR)
 */
exports.updateSubject = async (req, res) => {
  try {
    const userRole = req.user.role;

    // Only ADMIN and COUNSELLOR can update subjects
    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({
        message: 'Access denied. Only Admin and Counsellor can update subjects',
      });
    }

    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: 'Subject not found',
      });
    }

    const { name, code, startDate, overview, syllabus, prerequisites } = req.body;
    let imageUrl = subject.image;

    // Handle image update
    if (req.file) {
      // If old image exists, delete it and upload new one
      if (subject.image) {
        const publicId = subject.image.split('/').pop().split('.')[0];
        await deleteImage(`enquiry_system/${publicId}`);
      }

      const uploadResult = await uploadImage(req.file.buffer, `subject-${Date.now()}`);
      imageUrl = uploadResult.secure_url;
    }

    await subject.update({
      name: name || subject.name,
      code: code || subject.code,
      startDate: startDate || subject.startDate,
      image: imageUrl,
      overview: overview !== undefined ? safeJsonParse(overview) : subject.overview,
      syllabus: syllabus !== undefined ? safeJsonParse(syllabus) : subject.syllabus,
      prerequisites: prerequisites !== undefined ? safeJsonParse(prerequisites) : subject.prerequisites,
    });

    res.json({
      message: 'Subject updated successfully',
      subject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE subject (ADMIN and COUNSELLOR)
 */
exports.deleteSubject = async (req, res) => {
  try {
    const userRole = req.user.role;

    // Only ADMIN and COUNSELLOR can delete subjects
    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({
        message: 'Access denied. Only Admin and Counsellor can delete subjects',
      });
    }

    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: 'Subject not found',
      });
    }

    // Delete image from Cloudinary if it exists
    if (subject.image) {
      const publicId = subject.image.split('/').pop().split('.')[0];
      await deleteImage(`enquiry_system/${publicId}`);
    }

    await subject.destroy();

    res.json({
      message: 'Subject deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
