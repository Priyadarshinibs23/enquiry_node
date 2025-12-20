const { Package, Subject } = require('../models');

/**
 * CREATE Package (ADMIN only)
 */
exports.createPackage = async (req, res) => {
  try {
    const { name, code, subjectId } = req.body;

    if (!name || !code || !subjectId) {
      return res.status(400).json({
        message: 'name, code and subjectId are required',
      });
    }

    // check subject exists
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({
        message: 'Subject not found',
      });
    }

    const pkg = await Package.create({ name, code, subjectId });

    res.status(201).json({
      message: 'Package created successfully',
      package: pkg,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
      },
    });

    res.json(packages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET package by ID (ALL ROLES)
 */
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id, {
      include: Subject,
    });

    if (!pkg) {
      return res.status(404).json({
        message: 'Package not found',
      });
    }

    res.json(pkg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

    await pkg.update(req.body);

    res.json({
      message: 'Package updated successfully',
      package: pkg,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

    res.json({
      message: 'Package deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
