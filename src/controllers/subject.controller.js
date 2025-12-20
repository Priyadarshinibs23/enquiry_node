const { Subject } = require('../models');

/**
 * CREATE Subject (ADMIN only)
 */
exports.createSubject = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        message: 'name and code are required',
      });
    }

    const subject = await Subject.create({ name, code });

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
    const subjects = await Subject.findAll();
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
    const subject = await Subject.findByPk(req.params.id);

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
 * UPDATE subject (ADMIN only)
 */
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: 'Subject not found',
      });
    }

    await subject.update(req.body);

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
 * DELETE subject (ADMIN only)
 */
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: 'Subject not found',
      });
    }

    await subject.destroy();

    res.json({
      message: 'Subject deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
