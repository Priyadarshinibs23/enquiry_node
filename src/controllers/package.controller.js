const { Package, Subject } = require('../models');

/**
 * CREATE Package (ADMIN only)
 */
exports.createPackage = async (req, res) => {
  try {
    const { name, code, subjectIds } = req.body;

    if (!name || !code || !Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res.status(400).json({
        message: 'name, code and subjectIds (array) are required',
      });
    }

    // Check all subjects exist
    const foundSubjects = await Subject.findAll({ where: { id: subjectIds } });
    if (foundSubjects.length !== subjectIds.length) {
      return res.status(404).json({ message: 'One or more subjects not found' });
    }

    const pkg = await Package.create({ name, code });
    await pkg.setSubjects(subjectIds);

    // Fetch with subjects for response, exclude join table
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
 * UPDATE package (ADMIN only)
 */
exports.updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        message: 'Package not found',
      });
    }

    const { subjectIds } = req.body;
    if (subjectIds) {
      if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
        return res.status(400).json({ message: 'subjectIds must be a non-empty array' });
      }
      const foundSubjects = await Subject.findAll({ where: { id: subjectIds } });
      if (foundSubjects.length !== subjectIds.length) {
        return res.status(404).json({ message: 'One or more subjects not found' });
      }
    }

    await pkg.update(req.body);
    if (subjectIds) {
      await pkg.setSubjects(subjectIds);
    }
    // Fetch with subjects for response
    const pkgWithSubjects = await Package.findByPk(pkg.id, {
      include: {
        model: Subject,
        attributes: ['id', 'name', 'code'],
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
 * DELETE package (ADMIN only)
 */
exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        message: 'Package not found',
      });
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
