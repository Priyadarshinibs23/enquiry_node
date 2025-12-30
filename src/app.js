const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://rainbow-crisp-8175a7.netlify.app'],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/packages', require('./routes/package.routes'));
app.use('/api/subjects', require('./routes/subject.routes'));
app.use('/api/enquiries', require('./routes/enquiry.routes'));
app.use('/api/logs', require('./routes/log.routes'));
app.use('/api/billings', require('./routes/billing.routes'));
                                                                                                   
module.exports = app;
