const express = require('express')
const applicationsRoutes = require('./routes/applications')

const app = express();
app.use(express.json());

// connect to DB
app.use('/applications',applicationsRoutes);


module.exports = app;
