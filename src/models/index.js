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


// Many-to-many association between Package and Subject using join table 'PackageSubjects'
db.Package.belongsToMany(db.Subject, {
	through: 'PackageSubjects',
	foreignKey: 'packageId',
	otherKey: 'subjectId',
});
db.Subject.belongsToMany(db.Package, {
	through: 'PackageSubjects',
	foreignKey: 'subjectId',
	otherKey: 'packageId',
});

module.exports = db;
