const express = require('express');
const router = express.Router();
const materialController = require('../controllers/material.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

// Create a new material (only instructors can upload)
router.post(
  '/',
  authMiddleware.authenticate,
  roleMiddleware.authorize('instructor', 'admin'),
  uploadMiddleware.single('document'),
  materialController.createMaterial
);

// Get all materials
router.get('/', authMiddleware.authenticate, materialController.getAllMaterials);

// Get materials by instructor
router.get(
  '/instructor/:instructorId',
  authMiddleware.authenticate,
  materialController.getMaterialsByInstructor
);

// Get materials by batch
router.get(
  '/batch/:batchId',
  authMiddleware.authenticate,
  materialController.getMaterialsByBatch
);

// Get materials by subject and batch
router.get(
  '/subject/:subjectId/batch/:batchId',
  authMiddleware.authenticate,
  materialController.getMaterialsBySubjectAndBatch
);

// Get materials by instructor and batch
router.get(
  '/instructor/:instructorId/batch/:batchId',
  authMiddleware.authenticate,
  materialController.getMaterialsByInstructorAndBatch
);

// Get material by ID
router.get(
  '/:id',
  authMiddleware.authenticate,
  materialController.getMaterialById
);

// Update material
router.put(
  '/:id',
  authMiddleware.authenticate,
  roleMiddleware.authorize('instructor', 'admin'),
  materialController.updateMaterial
);

// Delete material
router.delete(
  '/:id',
  authMiddleware.authenticate,
  roleMiddleware.authorize('instructor', 'admin'),
  materialController.deleteMaterial
);

module.exports = router;
