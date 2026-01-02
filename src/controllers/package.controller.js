const { Package, Subject } = require('../models');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

/**
 * CREATE Package (ADMIN and COUNSELLOR)
 */
exports.createPackage = async (req, res) => {
  try {
    const { name, code, subjectIds, startDate, overview, syllabus, prerequisites } = req.body;
    const userRole = req.user.role;

    // Only ADMIN and COUNSELLOR can create packages
    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({
        message: 'Access denied. Only Admin and Counsellor can create packages',
      });
    }

    if (!name || !code) {
      return res.status(400).json({
        message: 'name and code are required',
      });
    }

    let imageUrl = null;

    // Upload image if provided
    if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer, `package-${Date.now()}`);
      imageUrl = uploadResult.secure_url;
    }

    // Validate subjects if provided
    let subjectsArray = [];
    if (subjectIds) {
      if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
        return res.status(400).json({ message: 'subjectIds must be a non-empty array' });
      }
      const foundSubjects = await Subject.findAll({ where: { id: subjectIds } });
      if (foundSubjects.length !== subjectIds.length) {
        return res.status(404).json({ message: 'One or more subjects not found' });
      }
      subjectsArray = subjectIds;
    }

    const pkg = await Package.create({
      name,
      code,
      startDate: startDate || null,
      image: imageUrl,
      overview: overview ? JSON.parse(overview) : null,
      syllabus: syllabus ? JSON.parse(syllabus) : null,
      prerequisites: prerequisites ? JSON.parse(prerequisites) : null,
    });

    if (subjectsArray.length > 0) {
      await pkg.setSubjects(subjectsArray);
    }

    // Fetch with subjects for response
    const pkgWithSubjects = await Package.findByPk(pkg.id, {
      include: {
        model: Subject,
        attributes: ['id', 'name', 'code'],
        through: { attributes: [] },
      },
    });

    return res.status(201).json({
      message: 'Package created successfully',
      package: pkgWithSubjects,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET all packages (ALL ROLES)
 */
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({
      include: {
        model: Subject,
        attributes: ['id', 'name', 'code'],
        through: { attributes: [] },
      },
    });
    return res.status(200).json(packages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET package by ID (ALL ROLES)
 */
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id, {
      include: {
        model: Subject,
        attributes: ['id', 'name', 'code'],
        through: { attributes: [] },
      },
    });

    if (!pkg) {
      return res.status(404).json({
        message: 'Package not found',
      });
    }

    return res.status(200).json(pkg);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * UPDATE package (ADMIN and COUNSELLOR)
 */
exports.updatePackage = async (req, res) => {
  try {
    const userRole = req.user.role;

    // Only ADMIN and COUNSELLOR can update packages
    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({
        message: 'Access denied. Only Admin and Counsellor can update packages',
      });
    }

    const pkg = await Package.findByPk(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        message: 'Package not found',
      });
    }

    const { name, code, startDate, subjectIds, overview, syllabus, prerequisites } = req.body;
    let imageUrl = pkg.image;

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (pkg.image) {
        const publicId = pkg.image.split('/').pop().split('.')[0];
        await deleteImage(`enquiry_system/${publicId}`);
      }

      const uploadResult = await uploadImage(req.file.buffer, `package-${Date.now()}`);
      imageUrl = uploadResult.secure_url;
    }

    // Validate and update subjects if provided
    if (subjectIds) {
      if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
        return res.status(400).json({ message: 'subjectIds must be a non-empty array' });
      }
      const foundSubjects = await Subject.findAll({ where: { id: subjectIds } });
      if (foundSubjects.length !== subjectIds.length) {
        return res.status(404).json({ message: 'One or more subjects not found' });
      }
      await pkg.setSubjects(subjectIds);
    }

    await pkg.update({
      name: name || pkg.name,
      code: code || pkg.code,
      startDate: startDate || pkg.startDate,
      image: imageUrl,
      overview: overview ? JSON.parse(overview) : pkg.overview,
      syllabus: syllabus ? JSON.parse(syllabus) : pkg.syllabus,
      prerequisites: prerequisites ? JSON.parse(prerequisites) : pkg.prerequisites,
    });

    // Fetch with subjects for response
    const pkgWithSubjects = await Package.findByPk(pkg.id, {
      include: {
        model: Subject,
        attributes: ['id', 'name', 'code'],
        through: { attributes: [] },
      },
    });

    return res.status(200).json({
      message: 'Package updated successfully',
      package: pkgWithSubjects,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE package (ADMIN and COUNSELLOR)
 */
exports.deletePackage = async (req, res) => {
  try {
    const userRole = req.user.role;

    // Only ADMIN and COUNSELLOR can delete packages
    if (userRole !== 'ADMIN' && userRole !== 'COUNSELLOR') {
      return res.status(403).json({
        message: 'Access denied. Only Admin and Counsellor can delete packages',
      });
    }

    const pkg = await Package.findByPk(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        message: 'Package not found',
      });
    }

    // Delete image from Cloudinary if it exists
    if (pkg.image) {
      const publicId = pkg.image.split('/').pop().split('.')[0];
      await deleteImage(`enquiry_system/${publicId}`);
    }

    await pkg.destroy();

    return res.status(200).json({
      message: 'Package deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
