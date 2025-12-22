const { Enquiry } = require('../models');
const { Op } = require('sequelize');

/**
 * CREATE Enquiry (ADMIN only)
 */
exports.createEnquiry = async (req, res) => {
  try {
    const { email, phone } = req.body;
    // Check for existing enquiry with same email or phone
    if(!email || !phone) {
      return res.status(400).json({ message: 'Email and phone are required' });
    }
    
    const existing = await Enquiry.findOne({
      where: {
        [Op.or]: [
          { email },
          { phone }
        ]
      }
    });
    if (existing) {
      return res.status(400).json({ message: 'Email or phone already exists' });
    }
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

    const { email, phone } = req.body;
    if (email || phone) {
      const existing = await Enquiry.findOne({
        where: {
          [Op.or]: [
            email ? { email } : {},
            phone ? { phone } : {}
          ],
          id: { [Op.ne]: enquiry.id }
        }
      });
      if (existing) {
        return res.status(400).json({ message: 'Email or phone already exists' });
      }
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
