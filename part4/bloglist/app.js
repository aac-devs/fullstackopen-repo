const logger = require('./utils/logger.js');
const config = require('./utils/config.js');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const bloglistRouter = require('./controllers/bloglists.js');
const mongoose = require('mongoose');

mongoose
  .connect(config.MONGODB_URI)
  .then((resp) => logger.info('connected to mongodb'))
  .catch((error) => logger.info(error.message));

app.use(cors());
app.use(express.json());
app.use('/api/blogs', bloglistRouter);

module.exports = app;
