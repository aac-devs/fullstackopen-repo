const http = require('http');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const cors = require('cors');
const config = require('./utils/config.js');
const logger = require('./utils/logger.js');
const bloglistRouter = require('./controllers/bloglists.js');

mongoose
  .connect(config.MONGODB_URI)
  .then((resp) => logger.info('connected to mongodb'))
  .catch((error) => logger.info(error.message));

app.use(cors());
app.use(express.json());
app.use('/api/blogs', bloglistRouter);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
