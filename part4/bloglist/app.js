const logger = require('./utils/logger.js');
const config = require('./utils/config.js');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const bloglistRouter = require('./controllers/bloglists.js');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');

mongoose
  .connect(config.MONGODB_URI)
  .then((resp) => logger.info('connected to mongodb'))
  .catch((error) => logger.info(error.message));

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtract);
app.use('/api/blogs', bloglistRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.errorHandler);

module.exports = app;
