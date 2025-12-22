const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database').development;

const sequelize = new Sequelize(config);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, DataTypes);
db.Subject = require('./subject')(sequelize, DataTypes);
db.Package = require('./package')(sequelize, DataTypes);
db.Enquiry = require('./enquiry')(sequelize, DataTypes);

// Associations
db.Subject.hasMany(db.Package, { foreignKey: 'subjectId' });
db.Package.belongsTo(db.Subject, { foreignKey: 'subjectId' });

module.exports = db;
