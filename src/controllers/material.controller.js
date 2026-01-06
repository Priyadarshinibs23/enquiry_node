const db = require('../models');
const { sendResponse } = require('../utils/response');
const { Formidable } = require('formidable');
const fs = require('fs');
const { uploadImage } = require('../utils/cloudinary');

// Create a new material
exports.createMaterial = async (req, res) => {
  try {
    // Parse form data using formidable
    const form = new Formidable({
      multiples: false,
      maxFileSize: 50 * 1024 * 1024, // 50MB limit for documents
      keepExtensions: true
    });

    const [fields, files] = await form.parse(req);

    // Extract field values
    const title = fields.title ? fields.title[0] : null;
    const description = fields.description ? fields.description[0] : null;
    const subjectId = fields.subjectId ? fields.subjectId[0] : null;
    const batchId = fields.batchId ? fields.batchId[0] : null;
    const instructorId = fields.instructorId ? fields.instructorId[0] : null;

    // Validate required fields
    if (!title || !subjectId || !batchId || !instructorId) {
      return sendResponse(res, 400, false, 'Title, subject, batch, and instructor are required');
    }

    // Check if file was uploaded
    if (!files.document || files.document.length === 0) {
      return sendResponse(res, 400, false, 'Document file is required');
    }

    // Check if subject exists
    const subject = await db.Subject.findByPk(subjectId);
    if (!subject) {
      return sendResponse(res, 404, false, 'Subject not found');
    }

    // Check if batch exists
    const batch = await db.Batch.findByPk(batchId);
    if (!batch) {
      return sendResponse(res, 404, false, 'Batch not found');
    }

    // Check if instructor exists and is a valid user
    const instructor = await db.User.findByPk(instructorId);

    if (!instructor) {
      return sendResponse(res, 404, false, 'Instructor not found');
    }

    // Upload document to cloudinary
    let documentUrl = null;
    const documentFile = files.document[0];
    const fileBuffer = await fs.promises.readFile(documentFile.filepath);
    const uploadResult = await uploadImage(fileBuffer, `material-${instructorId}-${Date.now()}`);
    documentUrl = uploadResult.secure_url;
    await fs.promises.unlink(documentFile.filepath).catch(() => {});

    // Create material
    const material = await db.Material.create({
      title,
      description,
      subjectId,
      batchId,
      instructorId,
      documentUrl: documentUrl,
      documentName: documentFile.originalFilename || documentFile.filename,
      uploadedOn: new Date(),
    });

    // Fetch material with associations
    const materialWithAssociations = await db.Material.findByPk(material.id, {
      include: [
        { model: db.Subject, as: 'subject' },
        { model: db.Batch, as: 'batch' },
        { model: db.User, as: 'instructor' },
      ],
    });

    return sendResponse(res, 201, true, 'Material created successfully', materialWithAssociations);
  } catch (error) {
    console.error('Error creating material:', error);
    return sendResponse(res, 500, false, 'Error creating material', error.message);
  }
};

// Get all materials
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await db.Material.findAll({
      include: [
        { model: db.Subject, as: 'subject' },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject' }] },
        { model: db.User, as: 'instructor' },
      ],
      order: [['uploadedOn', 'DESC']],
    });

    return sendResponse(res, 200, true, 'Materials retrieved successfully', materials);
  } catch (error) {
    console.error('Error retrieving materials:', error);
    return sendResponse(res, 500, false, 'Error retrieving materials', error.message);
  }
};

// Get materials by instructor for their batch(es)
exports.getMaterialsByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;

    // Check if instructor exists
    const instructor = await db.User.findByPk(instructorId);
    if (!instructor) {
      return sendResponse(res, 404, false, 'Instructor not found');
    }

    // Get all materials created by this instructor
    const materials = await db.Material.findAll({
      where: { instructorId },
      include: [
        { model: db.Subject, as: 'subject' },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject' }] },
        { model: db.User, as: 'instructor' },
      ],
      order: [['uploadedOn', 'DESC']],
    });

    return sendResponse(res, 200, true, 'Materials retrieved successfully', materials);
  } catch (error) {
    console.error('Error retrieving materials:', error);
    return sendResponse(res, 500, false, 'Error retrieving materials', error.message);
  }
};

// Get materials by batch
exports.getMaterialsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    // Check if batch exists
    const batch = await db.Batch.findByPk(batchId);
    if (!batch) {
      return sendResponse(res, 404, false, 'Batch not found');
    }

    // Get all materials for this batch
    const materials = await db.Material.findAll({
      where: { batchId },
      include: [
        { model: db.Subject, as: 'subject' },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject' }] },
        { model: db.User, as: 'instructor' },
      ],
      order: [['uploadedOn', 'DESC']],
    });

    return sendResponse(res, 200, true, 'Materials retrieved successfully', materials);
  } catch (error) {
    console.error('Error retrieving materials:', error);
    return sendResponse(res, 500, false, 'Error retrieving materials', error.message);
  }
};

// Get materials by subject for a batch
exports.getMaterialsBySubjectAndBatch = async (req, res) => {
  try {
    const { subjectId, batchId } = req.params;

    // Verify subject and batch exist
    const subject = await db.Subject.findByPk(subjectId);
    if (!subject) {
      return sendResponse(res, 404, false, 'Subject not found');
    }

    const batch = await db.Batch.findByPk(batchId);
    if (!batch) {
      return sendResponse(res, 404, false, 'Batch not found');
    }

    // Get materials for this subject and batch
    const materials = await db.Material.findAll({
      where: { subjectId, batchId },
      include: [
        { model: db.Subject, as: 'subject' },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject' }] },
        { model: db.User, as: 'instructor' },
      ],
      order: [['uploadedOn', 'DESC']],
    });

    return sendResponse(res, 200, true, 'Materials retrieved successfully', materials);
  } catch (error) {
    console.error('Error retrieving materials:', error);
    return sendResponse(res, 500, false, 'Error retrieving materials', error.message);
  }
};

// Get material by ID
exports.getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await db.Material.findByPk(id, {
      include: [
        { model: db.Subject, as: 'subject' },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject' }] },
        { model: db.User, as: 'instructor' },
      ],
    });

    if (!material) {
      return sendResponse(res, 404, false, 'Material not found');
    }

    return sendResponse(res, 200, true, 'Material retrieved successfully', material);
  } catch (error) {
    console.error('Error retrieving material:', error);
    return sendResponse(res, 500, false, 'Error retrieving material', error.message);
  }
};

// Update material
exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, subjectId, batchId } = req.body;

    const material = await db.Material.findByPk(id);
    if (!material) {
      return sendResponse(res, 404, false, 'Material not found');
    }

    // If subject is being updated, verify it exists
    if (subjectId && subjectId !== material.subjectId) {
      const subject = await db.Subject.findByPk(subjectId);
      if (!subject) {
        return sendResponse(res, 404, false, 'Subject not found');
      }
    }

    // If batch is being updated, verify it exists
    if (batchId && batchId !== material.batchId) {
      const batch = await db.Batch.findByPk(batchId);
      if (!batch) {
        return sendResponse(res, 404, false, 'Batch not found');
      }
    }

    // Update material
    await material.update({
      title: title || material.title,
      description: description !== undefined ? description : material.description,
      subjectId: subjectId || material.subjectId,
      batchId: batchId || material.batchId,
    });

    // Fetch updated material with associations
    const updatedMaterial = await db.Material.findByPk(id, {
      include: [
        { model: db.Subject, as: 'subject' },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject' }] },
        { model: db.User, as: 'instructor' },
      ],
    });

    return sendResponse(res, 200, true, 'Material updated successfully', updatedMaterial);
  } catch (error) {
    console.error('Error updating material:', error);
    return sendResponse(res, 500, false, 'Error updating material', error.message);
  }
};

// Delete material
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await db.Material.findByPk(id);
    if (!material) {
      return sendResponse(res, 404, false, 'Material not found');
    }

    await material.destroy();

    return sendResponse(res, 200, true, 'Material deleted successfully');
  } catch (error) {
    console.error('Error deleting material:', error);
    return sendResponse(res, 500, false, 'Error deleting material', error.message);
  }
};

// Get materials for a specific instructor in a specific batch
exports.getMaterialsByInstructorAndBatch = async (req, res) => {
  try {
    const { instructorId, batchId } = req.params;

    // Verify instructor and batch exist
    const instructor = await db.User.findByPk(instructorId);
    if (!instructor) {
      return sendResponse(res, 404, false, 'Instructor not found');
    }

    const batch = await db.Batch.findByPk(batchId);
    if (!batch) {
      return sendResponse(res, 404, false, 'Batch not found');
    }

    // Get materials for this instructor and batch
    const materials = await db.Material.findAll({
      where: { instructorId, batchId },
      include: [
        { model: db.Subject, as: 'subject' },
        { model: db.Batch, as: 'batch', include: [{ model: db.Subject, as: 'subject' }] },
        { model: db.User, as: 'instructor' },
      ],
      order: [['uploadedOn', 'DESC']],
    });

    return sendResponse(res, 200, true, 'Materials retrieved successfully', materials);
  } catch (error) {
    console.error('Error retrieving materials:', error);
    return sendResponse(res, 500, false, 'Error retrieving materials', error.message);
  }
};
