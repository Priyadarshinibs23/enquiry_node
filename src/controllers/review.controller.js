const db = require('../models');
const Subject = db.Subject;
const Package = db.Package;
const Review = db.Review;

// Create Review for Subject
exports.createSubjectReview = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { username, image, comment, rating } = req.body;

    console.log('Create subject review:', { subjectId, username, rating });

    if (!username || !comment || !rating) {
      return res.status(400).json({
        message: 'username, comment, and rating are required',
      });
    }

    // Check if subject exists
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Validate rating (1-5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = await Review.create({
      username,
      image: image || null,
      comment,
      rating,
      subjectId,
    });

    console.log('Subject review created:', review?.dataValues);

    res.status(201).json({
      success: true,
      message: 'Review added for subject successfully',
      data: review,
    });
  } catch (error) {
    console.error('Error in createSubjectReview:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create Review for Package
exports.createPackageReview = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { username, image, comment, rating } = req.body;

    console.log('Create package review:', { packageId, username, rating });

    if (!username || !comment || !rating) {
      return res.status(400).json({
        message: 'username, comment, and rating are required',
      });
    }

    // Check if package exists
    const pkg = await Package.findByPk(packageId);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Validate rating (1-5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = await Review.create({
      username,
      image: image || null,
      comment,
      rating,
      packageId,
    });

    console.log('Package review created:', review?.dataValues);

    res.status(201).json({
      success: true,
      message: 'Review added for package successfully',
      data: review,
    });
  } catch (error) {
    console.error('Error in createPackageReview:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get Reviews for Subject
exports.getSubjectReviews = async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Check if subject exists
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const reviews = await Review.findAll({
      where: { subjectId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      total: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error('Error in getSubjectReviews:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get Reviews for Package
exports.getPackageReviews = async (req, res) => {
  try {
    const { packageId } = req.params;

    // Check if package exists
    const pkg = await Package.findByPk(packageId);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const reviews = await Review.findAll({
      where: { packageId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      total: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error('Error in getPackageReviews:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get Review by ID
exports.getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByPk(reviewId, {
      include: [
        {
          model: Subject,
          attributes: ['id', 'name', 'code'],
          as: 'subject',
        },
        {
          model: Package,
          attributes: ['id', 'name', 'code'],
          as: 'package',
        },
      ],
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Error in getReviewById:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update Review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { username, image, comment, rating } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Update fields
    if (username) review.username = username;
    if (image) review.image = image;
    if (comment) review.comment = comment;
    if (rating) review.rating = rating;

    await review.save();

    console.log('Review updated:', review?.dataValues);

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    console.error('Error in updateReview:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.destroy();

    console.log('Review deleted:', reviewId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteReview:', error);
    res.status(500).json({ message: error.message });
  }
};
