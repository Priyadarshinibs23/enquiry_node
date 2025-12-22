const { Enquiry } = require('../models');

/**
 * CREATE Enquiry (ADMIN only)
 */
exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);

    res.status(201).json({
      message: 'Enquiry created successfully',
      enquiry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET all enquiries (ALL ROLES)
 */
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.json(enquiries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET enquiry by ID (ALL ROLES)
 */
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByPk(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        message: 'Enquiry not found',
      });
    }

    res.json(enquiry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * UPDATE enquiry (ADMIN only)
 */
exports.updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByPk(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        message: 'Enquiry not found',
      });
    }

    await enquiry.update(req.body);

    res.json({
      message: 'Enquiry updated successfully',
      enquiry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE enquiry (ADMIN only)
 */
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByPk(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        message: 'Enquiry not found',
      });
    }

    await enquiry.destroy();

    res.json({
      message: 'Enquiry deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
