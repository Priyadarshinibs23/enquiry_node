const { WorkExperience, HigherEducation, Certification, Project } = require('../models');
// -------- WorkExperience CRUD --------
exports.createWorkExperience = async (req, res) => {
  try {
    const work = await WorkExperience.create(req.body);
    res.status(201).json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWorkExperiences = async (req, res) => {
  try {
    const { userPlacementDetailId, id } = req.query;
    if (id) {
      const work = await WorkExperience.findByPk(id);
      if (!work) return res.status(404).json({ error: 'Not found' });
      return res.json(work);
    }
    let where = {};
    if (userPlacementDetailId) where.userPlacementDetailId = userPlacementDetailId;
    const works = await WorkExperience.findAll({ where });
    res.json(works);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateWorkExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const work = await WorkExperience.findByPk(id);
    if (!work) return res.status(404).json({ error: 'Not found' });
    await work.update(req.body);
    res.json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteWorkExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const work = await WorkExperience.findByPk(id);
    if (!work) return res.status(404).json({ error: 'Not found' });
    await work.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------- HigherEducation CRUD --------
exports.createHigherEducation = async (req, res) => {
  try {
    const edu = await HigherEducation.create(req.body);
    res.status(201).json(edu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHigherEducations = async (req, res) => {
  try {
    const { userPlacementDetailId, id } = req.query;
    if (id) {
      const edu = await HigherEducation.findByPk(id);
      if (!edu) return res.status(404).json({ error: 'Not found' });
      return res.json(edu);
    }
    let where = {};
    if (userPlacementDetailId) where.userPlacementDetailId = userPlacementDetailId;
    const edus = await HigherEducation.findAll({ where });
    res.json(edus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateHigherEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const edu = await HigherEducation.findByPk(id);
    if (!edu) return res.status(404).json({ error: 'Not found' });
    await edu.update(req.body);
    res.json(edu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteHigherEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const edu = await HigherEducation.findByPk(id);
    if (!edu) return res.status(404).json({ error: 'Not found' });
    await edu.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------- Certification CRUD --------
exports.createCertification = async (req, res) => {
  try {
    const cert = await Certification.create(req.body);
    res.status(201).json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCertifications = async (req, res) => {
  try {
    const { userPlacementDetailId, id } = req.query;
    if (id) {
      const cert = await Certification.findByPk(id);
      if (!cert) return res.status(404).json({ error: 'Not found' });
      return res.json(cert);
    }
    let where = {};
    if (userPlacementDetailId) where.userPlacementDetailId = userPlacementDetailId;
    const certs = await Certification.findAll({ where });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const cert = await Certification.findByPk(id);
    if (!cert) return res.status(404).json({ error: 'Not found' });
    await cert.update(req.body);
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const cert = await Certification.findByPk(id);
    if (!cert) return res.status(404).json({ error: 'Not found' });
    await cert.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------- Project CRUD --------
exports.createProject = async (req, res) => {
  try {
    const proj = await Project.create(req.body);
    res.status(201).json(proj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { userPlacementDetailId, id } = req.query;
    if (id) {
      const proj = await Project.findByPk(id);
      if (!proj) return res.status(404).json({ error: 'Not found' });
      return res.json(proj);
    }
    let where = {};
    if (userPlacementDetailId) where.userPlacementDetailId = userPlacementDetailId;
    const projs = await Project.findAll({ where });
    res.json(projs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const proj = await Project.findByPk(id);
    if (!proj) return res.status(404).json({ error: 'Not found' });
    await proj.update(req.body);
    res.json(proj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const proj = await Project.findByPk(id);
    if (!proj) return res.status(404).json({ error: 'Not found' });
    await proj.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
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
