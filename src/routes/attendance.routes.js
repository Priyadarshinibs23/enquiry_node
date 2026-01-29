// const express = require('express');
// const router = express.Router();
// const { Attendance, Enquiry, Subject, Batch, User } = require('../models');
// const { Op } = require('sequelize');
// const QRCode = require('qrcode');

// // Get attendance summary for a batch and subject
// router.get('/summary', async (req, res) => {
//   const { batchId, subjectId } = req.query;
//   if (!batchId || !subjectId) return res.status(400).json({ error: 'batchId and subjectId required' });

//   // Get eligible students from enquiry
//   const students = await Enquiry.findAll({
//     where: {
//       batchId,
//       candidateStatus: { [Op.in]: ['class', 'class qualified'] }
//     },
//     attributes: ['id', 'name', 'email', 'trainingMode']
//   });

//   // For each student, calculate attendance stats
//   const summary = await Promise.all(students.map(async (student) => {
//     const totalSessions = await Attendance.count({ where: { batchId, subjectId, enquiryId: student.id } });
//     const attendedSessions = await Attendance.count({ where: { batchId, subjectId, enquiryId: student.id, attended: true } });
//     const notAttended = totalSessions - attendedSessions;
//     const percentage = totalSessions > 0 ? ((attendedSessions / totalSessions) * 100).toFixed(2) : '0.00';
//     return {
//       name: student.name,
//       email: student.email,
//       totalSessions,
//       attendedSessions,
//       notAttended,
//       attendancePercentage: percentage,
//       trainingMode: student.trainingMode
//     };
//   }));

//   res.json({ summary });
// });

// // Instructor generates QR code for online attendance
// router.post('/generate-qr', async (req, res) => {
//   const { batchId, subjectId, instructorId, sessionDate } = req.body;
//   // Validate instructor and batch/subject
//   // Generate QR code with session info and expiry (2 hours)
//   const qrSessionId = `${batchId}-${subjectId}-${Date.now()}`;
//   const qrData = { batchId, subjectId, instructorId, sessionDate, qrSessionId, expiresAt: Date.now() + 2 * 60 * 60 * 1000 };
//   const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
//   res.json({ qrCode, qrSessionId, expiresAt: qrData.expiresAt });
// });

// // Student marks attendance by scanning QR
// router.post('/mark', async (req, res) => {
//   const { qrSessionId, enquiryId } = req.body;
//   // Validate QR session expiry and student eligibility
//   // Mark attendance for this session
//   // (Implementation would check QR session validity and update Attendance)
//   res.json({ message: 'Attendance marked (to be implemented)' });
// });

// module.exports = router;
