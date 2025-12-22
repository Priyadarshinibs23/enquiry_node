const { User } = require('../models');
const { hashPassword } = require('../utils/password');


exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ where: { role: { [require('sequelize').Op.ne]: 'ADMIN' } } });
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const hashed = await hashPassword(password);

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const existingadmin = await User.findOne({ where: { role: 'ADMIN' } });

        if (role === 'ADMIN' && existingadmin) {
            return res.status(400).json({ message: 'Admin user already exists' });
        }
        const user = await User.create({
            email,
            password: hashed,
            role,
        });

        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        console.log("Inside change password controller");
        const { id, newPassword } = req.body;
        const userrole = req.user.role;
        if (userrole !== 'ADMIN') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashed = await hashPassword(newPassword);
        user.password = hashed;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });

    }

    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}