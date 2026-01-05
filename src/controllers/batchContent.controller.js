const { Batch, Announcement, Assignment, Material, MockInterview, User, Subject, Enquiry } = require('../models');

// ============= ANNOUNCEMENTS =============

// Create announcement for batch
exports.createAnnouncement = async (req, res) => {
  try {
    const { batchId, title, description, content } = req.body;
    const instructorId = req.user.id;

    // Verify batch exists
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Verify instructor is authorized for this batch
    if (batch.createdBy !== instructorId) {
      return res.status(403).json({ message: 'Not authorized to post in this batch' });
    }

    const announcement = await Announcement.create({
      batchId,
      instructorId,
      title,
      description,
      content,
    });

    return res.status(201).json({
      message: 'Announcement created successfully',
      data: announcement,
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return res.status(500).json({ message: 'Error creating announcement', error: error.message });
  }
};

// Get all announcements for a batch
exports.getBatchAnnouncements = async (req, res) => {
  try {
    const { batchId } = req.params;

    const announcements = await Announcement.findAll({
      where: { batchId },
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      message: 'Announcements retrieved successfully',
      data: announcements,
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
};

// Update announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const { title, description, content } = req.body;
    const instructorId = req.user.id;

    const announcement = await Announcement.findByPk(announcementId);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Verify instructor is the creator
    if (announcement.instructorId !== instructorId) {
      return res.status(403).json({ message: 'Not authorized to update this announcement' });
    }

    await announcement.update({ title, description, content });

    return res.status(200).json({
      message: 'Announcement updated successfully',
      data: announcement,
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return res.status(500).json({ message: 'Error updating announcement', error: error.message });
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const instructorId = req.user.id;

    const announcement = await Announcement.findByPk(announcementId);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Verify instructor is the creator
    if (announcement.instructorId !== instructorId) {
      return res.status(403).json({ message: 'Not authorized to delete this announcement' });
    }

    await announcement.destroy();

    return res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
};

// ============= BATCH CONTENT SUMMARY =============

// Get all batch content (announcements, assignments, materials, mock interviews) for instructor
exports.getBatchContent = async (req, res) => {
  try {
    const { batchId } = req.params;
    const instructorId = req.user.id;

    // Verify batch exists and instructor has access
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    if (batch.createdBy !== instructorId) {
      return res.status(403).json({ message: 'Not authorized to view this batch content' });
    }

    // Get all content for this batch
    const [announcements, assignments, materials, mockInterviews] = await Promise.all([
      Announcement.findAll({
        where: { batchId },
        attributes: ['id', 'title', 'description', 'createdAt'],
        order: [['createdAt', 'DESC']],
      }),
      Assignment.findAll({
        where: { batchId },
        attributes: ['id', 'title', 'description', 'dueDate', 'createdDate'],
        order: [['createdDate', 'DESC']],
      }),
      Material.findAll({
        where: { batchId },
        attributes: ['id', 'title', 'description', 'documentName', 'uploadedOn'],
        order: [['uploadedOn', 'DESC']],
      }),
      MockInterview.findAll({
        where: { batchId },
        attributes: ['id', 'studentName', 'interviewDate', 'interviewTime', 'mode'],
        order: [['interviewDate', 'DESC']],
      }),
    ]);

    return res.status(200).json({
      message: 'Batch content retrieved successfully',
      data: {
        batchId,
        batchName: batch.name,
        announcements: {
          count: announcements.length,
          items: announcements,
        },
        assignments: {
          count: assignments.length,
          items: assignments,
        },
        materials: {
          count: materials.length,
          items: materials,
        },
        mockInterviews: {
          count: mockInterviews.length,
          items: mockInterviews,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching batch content:', error);
    return res.status(500).json({ message: 'Error fetching batch content', error: error.message });
  }
};
