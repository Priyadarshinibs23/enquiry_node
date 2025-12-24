const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database').development;

let sequelize;

if (config.url) {
  // Neon / Production / DATABASE_URL
  sequelize = new Sequelize(config.url, {
    dialect: config.dialect,
    dialectOptions: config.dialectOptions,
    logging: false,
  });
} else {
  // Local DB
  sequelize = new Sequelize(
    config.database,
    config.username,
    String(config.password || ''),
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: false,
    }
  );
}

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, DataTypes);
db.Subject = require('./subject')(sequelize, DataTypes);
db.Package = require('./package')(sequelize, DataTypes);
db.Enquiry = require('./enquiry')(sequelize, DataTypes);
db.Log = require('./log')(sequelize, DataTypes);
db.Billing = require('./billing')(sequelize, DataTypes);

/* relations stay same */
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

db.User.hasMany(db.Log, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Log.belongsTo(db.User, { foreignKey: 'userId' });

db.Enquiry.hasMany(db.Billing, { foreignKey: 'enquiryId', onDelete: 'CASCADE' });
db.Billing.belongsTo(db.Enquiry, { foreignKey: 'enquiryId' });

module.exports = db;
