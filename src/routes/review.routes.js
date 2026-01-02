const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const auth = require('../middlewares/auth.middleware');

// Subject Reviews
router.post(
  '/subject/:subjectId/review',
  auth,
  reviewController.createSubjectReview
);

router.get(
  '/subject/:subjectId/reviews',
  reviewController.getSubjectReviews
);

// Package Reviews
router.post(
  '/package/:packageId/review',
  auth,
  reviewController.createPackageReview
);

router.get(
  '/package/:packageId/reviews',
  reviewController.getPackageReviews
);

// Review Management
router.get(
  '/:reviewId',
  reviewController.getReviewById
);

router.put(
  '/:reviewId',
  auth,
  reviewController.updateReview
);

router.delete(
  '/:reviewId',
  auth,
  reviewController.deleteReview
);

module.exports = router;
