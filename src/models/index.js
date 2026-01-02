const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database').development;

const sequelize = new Sequelize(config);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, DataTypes);
db.Subject = require('./subject')(sequelize, DataTypes);
db.Package = require('./package')(sequelize, DataTypes);
db.Batch = require('./batch')(sequelize, DataTypes);
db.Enquiry = require('./enquiry')(sequelize, DataTypes);
db.Log = require('./log')(sequelize, DataTypes);
db.Billing = require('./billing')(sequelize, DataTypes);
db.Review = require('./review')(sequelize, DataTypes);
db.Instructor = require('./instructor')(sequelize, DataTypes);
db.Assignment = require('./assignment')(sequelize, DataTypes);
db.MockInterview = require('./mockInterview')(sequelize, DataTypes);
db.Material = require('./material')(sequelize, DataTypes);
db.Feedback = require('./feedback')(sequelize, DataTypes);


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

// One-to-many association between User and Log
db.User.hasMany(db.Log, {
	foreignKey: 'userId',
	onDelete: 'CASCADE',
});
db.Log.belongsTo(db.User, {
	foreignKey: 'userId',
});

// One-to-many association between Enquiry and Billing
db.Enquiry.hasMany(db.Billing, {
	foreignKey: 'enquiryId',
	onDelete: 'CASCADE',
});
db.Billing.belongsTo(db.Enquiry, {
	foreignKey: 'enquiryId',
});

// Many-to-many association between User and Subject through Instructor
db.User.belongsToMany(db.Subject, {
	through: db.Instructor,
	foreignKey: 'userId',
	otherKey: 'subjectId',
});
db.Subject.belongsToMany(db.User, {
	through: db.Instructor,
	foreignKey: 'subjectId',
	otherKey: 'userId',
});

// One-to-many association between User and Batch
db.User.hasMany(db.Batch, {
	foreignKey: 'createdBy',
	onDelete: 'SET NULL',
});
db.Batch.belongsTo(db.User, {
	foreignKey: 'createdBy',
	as: 'creator',
});

// One-to-many association between Subject and Batch
db.Subject.hasMany(db.Batch, {
	foreignKey: 'subjectId',
	onDelete: 'CASCADE',
});
db.Batch.belongsTo(db.Subject, {
	foreignKey: 'subjectId',
	as: 'subject',
});

// One-to-many association between Subject and Review
db.Subject.hasMany(db.Review, {
	foreignKey: 'subjectId',
	onDelete: 'CASCADE',
});
db.Review.belongsTo(db.Subject, {
	foreignKey: 'subjectId',
	as: 'subject',
});

// One-to-many association between Package and Review
db.Package.hasMany(db.Review, {
	foreignKey: 'packageId',
	onDelete: 'CASCADE',
});
db.Review.belongsTo(db.Package, {
	foreignKey: 'packageId',
	as: 'package',
});

// ONE-TO-MANY: Batch has many Assignments
db.Batch.hasMany(db.Assignment, {
	foreignKey: 'batchId',
	onDelete: 'CASCADE',
	as: 'assignments',
});
db.Assignment.belongsTo(db.Batch, {
	foreignKey: 'batchId',
	as: 'batch',
});

// ONE-TO-MANY: Subject has many Assignments
db.Subject.hasMany(db.Assignment, {
	foreignKey: 'subjectId',
	onDelete: 'CASCADE',
	as: 'assignments',
});
db.Assignment.belongsTo(db.Subject, {
	foreignKey: 'subjectId',
	as: 'subject',
});

// ONE-TO-MANY: User (Instructor) creates many Assignments
db.User.hasMany(db.Assignment, {
	foreignKey: 'createdBy',
	onDelete: 'CASCADE',
	as: 'createdAssignments',
});
db.Assignment.belongsTo(db.User, {
	foreignKey: 'createdBy',
	as: 'instructor',
});

// ONE-TO-MANY: Enquiry can have many Assignments (for candidates in 'class' status)
db.Enquiry.hasMany(db.Assignment, {
	foreignKey: 'enquiryId',
	onDelete: 'CASCADE',
	as: 'assignments',
});
db.Assignment.belongsTo(db.Enquiry, {
	foreignKey: 'enquiryId',
	as: 'enquiry',
});

// ONE-TO-MANY: User (Reviewer) reviews many Assignments
db.User.hasMany(db.Assignment, {
	foreignKey: 'reviewedBy',
	onDelete: 'SET NULL',
	as: 'reviewedAssignments',
});
db.Assignment.belongsTo(db.User, {
	foreignKey: 'reviewedBy',
	as: 'reviewer',
});

// ONE-TO-MANY: Batch has many Mock Interviews
db.Batch.hasMany(db.MockInterview, {
	foreignKey: 'batchId',
	onDelete: 'CASCADE',
	as: 'mockInterviews',
});
db.MockInterview.belongsTo(db.Batch, {
	foreignKey: 'batchId',
	as: 'batch',
});

// ONE-TO-MANY: Enquiry has many Mock Interviews
db.Enquiry.hasMany(db.MockInterview, {
	foreignKey: 'enquiryId',
	onDelete: 'CASCADE',
	as: 'mockInterviews',
});
db.MockInterview.belongsTo(db.Enquiry, {
	foreignKey: 'enquiryId',
	as: 'enquiry',
});

// ONE-TO-MANY: User (Instructor) schedules many Mock Interviews
db.User.hasMany(db.MockInterview, {
	foreignKey: 'instructorId',
	onDelete: 'CASCADE',
	as: 'scheduledMockInterviews',
});
db.MockInterview.belongsTo(db.User, {
	foreignKey: 'instructorId',
	as: 'instructor',
});

// ONE-TO-MANY: Subject has many Materials
db.Subject.hasMany(db.Material, {
	foreignKey: 'subjectId',
	onDelete: 'CASCADE',
	as: 'materials',
});
db.Material.belongsTo(db.Subject, {
	foreignKey: 'subjectId',
	as: 'subject',
});

// ONE-TO-MANY: Batch has many Materials
db.Batch.hasMany(db.Material, {
	foreignKey: 'batchId',
	onDelete: 'CASCADE',
	as: 'materials',
});
db.Material.belongsTo(db.Batch, {
	foreignKey: 'batchId',
	as: 'batch',
});

// ONE-TO-MANY: User (Instructor) uploads many Materials
db.User.hasMany(db.Material, {
	foreignKey: 'instructorId',
	onDelete: 'CASCADE',
	as: 'uploadedMaterials',
});
db.Material.belongsTo(db.User, {
	foreignKey: 'instructorId',
	as: 'instructor',
});

// ONE-TO-MANY: Enquiry provides many Feedbacks
db.Enquiry.hasMany(db.Feedback, {
	foreignKey: 'enquiryId',
	onDelete: 'CASCADE',
	as: 'feedbacks',
});
db.Feedback.belongsTo(db.Enquiry, {
	foreignKey: 'enquiryId',
	as: 'enquiry',
});

// ONE-TO-MANY: User (Instructor) receives many Feedbacks
db.User.hasMany(db.Feedback, {
	foreignKey: 'instructorId',
	onDelete: 'CASCADE',
	as: 'receivedFeedbacks',
});
db.Feedback.belongsTo(db.User, {
	foreignKey: 'instructorId',
	as: 'instructor',
});

// ONE-TO-MANY: Batch has many Feedbacks
db.Batch.hasMany(db.Feedback, {
	foreignKey: 'batchId',
	onDelete: 'CASCADE',
	as: 'feedbacks',
});
db.Feedback.belongsTo(db.Batch, {
	foreignKey: 'batchId',
	as: 'batch',
});

module.exports = db;
