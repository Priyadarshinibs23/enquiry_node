const express = require('express');
const router = express.Router();
const batchContentController = require('../controllers/batchContent.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// ========== ANNOUNCEMENTS ROUTES ==========

// POST - Create announcement for batch
router.post('/announcements', authMiddleware, roleMiddleware('instructor', 'admin'), batchContentController.createAnnouncement);

// GET - Get all announcements for a batch
router.get('/batch/:batchId/announcements', authMiddleware, batchContentController.getBatchAnnouncements);

// PUT - Update announcement
router.put('/announcements/:announcementId', authMiddleware, roleMiddleware('instructor', 'admin'), batchContentController.updateAnnouncement);

// DELETE - Delete announcement
router.delete('/announcements/:announcementId', authMiddleware, roleMiddleware('instructor', 'admin'), batchContentController.deleteAnnouncement);

// ========== BATCH CONTENT ROUTES ==========

// GET - Get all batch content (summary) for instructor
router.get('/batch/:batchId/content', authMiddleware, roleMiddleware('instructor', 'admin'), batchContentController.getBatchContent);

module.exports = router;
