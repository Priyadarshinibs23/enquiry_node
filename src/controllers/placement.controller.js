const { Placement, Enquiry } = require('../models');

// Create a new placement record (POST)
exports.createPlacement = async (req, res) => {
  try {
    const { enquiryId } = req.body;
    // Only allow for class/class qualified
    const enquiry = await Enquiry.findOne({ where: { id: enquiryId, candidateStatus: ['class', 'class qualified'] } });
    if (!enquiry) return res.status(400).json({ error: 'Invalid or ineligible enquiryId' });
    const placement = await Placement.create(req.body);
    res.status(201).json(placement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an existing placement record (PUT)
exports.updatePlacement = async (req, res) => {
  try {
    const { id } = req.params;
    const placement = await Placement.findByPk(id);
    if (!placement) return res.status(404).json({ error: 'Placement not found' });
    await placement.update(req.body);
    res.json(placement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get placement(s) (GET)
exports.getPlacements = async (req, res) => {
  try {
    const { enquiryId, id } = req.query;
    if (id) {
      const placement = await Placement.findByPk(id);
      if (!placement) return res.status(404).json({ error: 'Placement not found' });
      return res.json(placement);
    }
    let where = {};
    if (enquiryId) where.enquiryId = enquiryId;
    const placements = await Placement.findAll({ where });
    res.json(placements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
