const { ClassFeed, Batch, Subject, Assignment, MockInterview, Material, Announcement } = require('../models');

/**
 * GET all ClassFeeds for a specific batch
 * Students/Enquiries get content posted by instructors
 */
exports.getClassFeedsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    // Validate batch exists
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({
        message: 'Batch not found',
      });
    }

    // Get all classfeeds for this batch with related content
    const classfeeds = await ClassFeed.findAll({
      where: { batchId },
      include: [
        {
          model: Batch,
          as: 'batch',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: Subject,
          as: 'subject',
          attributes: ['id', 'name', 'code'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Enrich classfeeds with actual content based on type
    const enrichedFeeds = await Promise.all(
      classfeeds.map(async (feed) => {
        let contentData = null;

        if (feed.type === 'announcement') {
          contentData = await Announcement.findAll({
            where: { batchId },
            attributes: ['id', 'title', 'content', 'createdAt'],
            limit: 5,
            order: [['createdAt', 'DESC']],
          });
        } else if (feed.type === 'assignment') {
          contentData = await Assignment.findAll({
            where: { batchId },
            attributes: ['id', 'title', 'description', 'dueDate', 'createdAt'],
            limit: 5,
            order: [['createdAt', 'DESC']],
          });
        } else if (feed.type === 'mock interview') {
          contentData = await MockInterview.findAll({
            where: { batchId },
            attributes: ['id', 'title', 'scheduledAt', 'createdAt'],
            limit: 5,
            order: [['createdAt', 'DESC']],
          });
        } else if (feed.type === 'materials') {
          contentData = await Material.findAll({
            where: { batchId },
            attributes: ['id', 'title', 'documentName', 'uploadedOn'],
            limit: 5,
            order: [['uploadedOn', 'DESC']],
          });
        }

        return {
          ...feed.toJSON(),
          content: contentData,
        };
      })
    );

    res.status(200).json({
      message: 'Class feeds retrieved successfully',
      data: enrichedFeeds,
    });
  } catch (error) {
    console.error('Error fetching classfeeds:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET ClassFeed by type for a specific batch
 */
exports.getClassFeedsByType = async (req, res) => {
  try {
    const { batchId, type } = req.params;

    // Validate batch exists
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({
        message: 'Batch not found',
      });
    }

    // Validate feed type
    const validTypes = ['announcement', 'mock interview', 'materials', 'assignment'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: 'Invalid feed type. Must be one of: announcement, mock interview, materials, assignment',
      });
    }

    const classfeed = await ClassFeed.findOne({
      where: { batchId, type },
      include: [
        {
          model: Batch,
          as: 'batch',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: Subject,
          as: 'subject',
          attributes: ['id', 'name', 'code'],
        },
      ],
    });

    if (!classfeed) {
      return res.status(404).json({
        message: `No ${type} feed found for this batch`,
      });
    }

    // Get actual content based on type
    let contentData = null;

    if (type === 'announcement') {
      contentData = await Announcement.findAll({
        where: { batchId },
        attributes: ['id', 'title', 'content', 'instructorId', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });
    } else if (type === 'assignment') {
      contentData = await Assignment.findAll({
        where: { batchId },
        attributes: ['id', 'title', 'description', 'dueDate', 'createdBy', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });
    } else if (type === 'mock interview') {
      contentData = await MockInterview.findAll({
        where: { batchId },
        attributes: ['id', 'title', 'scheduledAt', 'instructorId', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });
    } else if (type === 'materials') {
      contentData = await Material.findAll({
        where: { batchId },
        attributes: ['id', 'title', 'description', 'documentName', 'documentUrl', 'instructorId', 'uploadedOn'],
        order: [['uploadedOn', 'DESC']],
      });
    }

    res.status(200).json({
      message: `${type} feed retrieved successfully`,
      data: {
        ...classfeed.toJSON(),
        content: contentData,
      },
    });
  } catch (error) {
    console.error('Error fetching classfeed by type:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET ClassFeed for subject across all batches
 */
exports.getClassFeedsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Validate subject exists
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({
        message: 'Subject not found',
      });
    }

    const classfeeds = await ClassFeed.findAll({
      where: { subjectId },
      include: [
        {
          model: Batch,
          as: 'batch',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: Subject,
          as: 'subject',
          attributes: ['id', 'name', 'code'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      message: 'Class feeds for subject retrieved successfully',
      data: classfeeds,
    });
  } catch (error) {
    console.error('Error fetching classfeeds by subject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
