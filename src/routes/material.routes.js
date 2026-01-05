const express = require('express');
const router = express.Router();
const materialController = require('../controllers/material.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

// Create a new material (only instructors can upload)
router.post(
  '/',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  uploadMiddleware.single('document'),
  materialController.createMaterial
);

// Get all materials
router.get('/', authMiddleware, materialController.getAllMaterials);

// Get materials by instructor
router.get(
  '/instructor/:instructorId',
  authMiddleware,
  materialController.getMaterialsByInstructor
);

// Get materials by batch
router.get(
  '/batch/:batchId',
  authMiddleware,
  materialController.getMaterialsByBatch
);

// Get materials by subject and batch
router.get(
  '/subject/:subjectId/batch/:batchId',
  authMiddleware,
  materialController.getMaterialsBySubjectAndBatch
);

// Get materials by instructor and batch
router.get(
  '/instructor/:instructorId/batch/:batchId',
  authMiddleware,
  materialController.getMaterialsByInstructorAndBatch
);

// Get material by ID
router.get(
  '/:id',
  authMiddleware,
  materialController.getMaterialById
);

// Update material
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  materialController.updateMaterial
);

// Delete material
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  materialController.deleteMaterial
);

module.exports = router;
