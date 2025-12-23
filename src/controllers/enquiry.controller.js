const { Enquiry } = require('../models');
const { Op } = require('sequelize');

/**
 * CREATE Enquiry (ADMIN only)
 */
exports.createEnquiry = async (req, res) => {
  try {
    const { email, phone } = req.body;
    // Check for existing enquiry with same email or phone
    if (!email || !phone) {
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
 * UPDATE enquiry (ADMIN and COUNSELLOR)
 */
exports.updateEnquiry = async (req, res) => {
  try {
    // Check if user role is COUNSELLOR or ADMIN
    const userrole = req.user.role;
    if (userrole !== 'COUNSELLOR' && userrole !== 'ADMIN') {
      return res.status(403).json({ message: 'Only ADMIN and COUNSELLOR can edit enquiries' });
    }

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

exports.changeEnquiryStatus = async (req, res) => {
  try {
    const userrole = req.user.role;
    const { enquiryId, newStatus } = req.body;
    const enquiry = await Enquiry.findByPk(enquiryId);

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    const currentStatus = enquiry.candidateStatus;

    // Rule 1: COUNSELLOR or ADMIN can change status to demo
    if (newStatus === 'demo') {
      if (!['COUNSELLOR', 'ADMIN'].includes(userrole)) {
        return res.status(403).json({ message: 'Only COUNSELLOR or ADMIN can change status to demo' });
      }
    }
    // Rule 2: COUNSELLOR or ADMIN can change status from demo to qualified demo
    else if (currentStatus === 'demo' && newStatus === 'qualified demo') {
      if (!['COUNSELLOR', 'ADMIN'].includes(userrole)) {
        return res.status(403).json({ message: 'Only COUNSELLOR or ADMIN can move from demo to qualified demo' });
      }
    }
    // Rule 3: ACCOUNTS or ADMIN can move from qualified demo to class or class qualified
    else if (currentStatus === 'qualified demo' && ['class', 'class qualified'].includes(newStatus)) {
      if (!['ACCOUNTS', 'ADMIN'].includes(userrole)) {
        return res.status(403).json({ message: 'Only ACCOUNTS or ADMIN can move from qualified demo to class/class qualified' });
      }
    }
    // Rule 3b: ACCOUNTS or ADMIN can move from class to class qualified
    else if (currentStatus === 'class' && newStatus === 'class qualified') {
      if (!['ACCOUNTS', 'ADMIN'].includes(userrole)) {
        return res.status(403).json({ message: 'Only ACCOUNTS or ADMIN can move from class to class qualified' });
      }
    }
    // Rule 4: HR or ADMIN can move from class qualified to placement
    else if (currentStatus === 'class qualified' && newStatus === 'placement') {
      if (!['HR', 'ADMIN'].includes(userrole)) {
        return res.status(403).json({ message: 'Only HR or ADMIN can move from class qualified to placement' });
      }
    }
    // Rule 4: HR or ADMIN can move from class to placement
    else if (currentStatus === 'class' && newStatus === 'placement') {
      if (!['HR', 'ADMIN'].includes(userrole)) {
        return res.status(403).json({ message: 'Only HR or ADMIN can move from class to placement' });
      }
    }
    // Default: Allow any role to move to enquiry stage
    else if (newStatus === 'enquiry stage') {
      // Allow all authenticated users to set enquiry stage
    }
    // Disallow unauthorized transitions
    else {
      return res.status(403).json({ message: `Invalid status transition from ${currentStatus} to ${newStatus}` });
    }

    enquiry.candidateStatus = newStatus;
    await enquiry.save();

    res.status(200).json({
      message: 'Enquiry status updated successfully',
      enquiry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};