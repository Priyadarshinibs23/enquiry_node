const express = require('express');
const router = express.Router();
const batchContentController = require('../controllers/batchContent.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { isInstructor } = require('../middlewares/role.middleware');

// ========== ANNOUNCEMENTS ROUTES ==========

// POST - Create announcement for batch
router.post('/announcements', authenticate, isInstructor, batchContentController.createAnnouncement);

// GET - Get all announcements for a batch
router.get('/batch/:batchId/announcements', authenticate, batchContentController.getBatchAnnouncements);

// PUT - Update announcement
router.put('/announcements/:announcementId', authenticate, isInstructor, batchContentController.updateAnnouncement);

// DELETE - Delete announcement
router.delete('/announcements/:announcementId', authenticate, isInstructor, batchContentController.deleteAnnouncement);

// ========== BATCH CONTENT ROUTES ==========

// GET - Get all batch content (summary) for instructor
router.get('/batch/:batchId/content', authenticate, isInstructor, batchContentController.getBatchContent);

module.exports = router;
