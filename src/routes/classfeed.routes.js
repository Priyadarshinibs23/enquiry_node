const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const controller = require('../controllers/classfeed.controller');

/**
 * GET - Get all classfeeds for a specific batch
 * GET /api/classfeeds/batch/:batchId
 */
router.get('/batch/:batchId', auth, controller.getClassFeedsByBatch);

/**
 * GET - Get classfeed by type for a specific batch
 * GET /api/classfeeds/batch/:batchId/type/:type
 */
router.get('/batch/:batchId/type/:type', auth, controller.getClassFeedsByType);

/**
 * GET - Get classfeeds for a specific subject across all batches
 * GET /api/classfeeds/subject/:subjectId
 */
router.get('/subject/:subjectId', auth, controller.getClassFeedsBySubject);

module.exports = router;
