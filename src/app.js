const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/packages', require('./routes/package.routes'));
app.use('/api/subjects', require('./routes/subject.routes'));

module.exports = app;
