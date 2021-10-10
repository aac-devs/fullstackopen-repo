const http = require('http');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const cors = require('cors');
const config = require('./utils/config.js');
const logger = require('./utils/logger.js');
const Blog = require('./models/bloglist.js');

mongoose
  .connect(config.MONGODB_URI)
  .then((resp) => logger.info('connected to mongodb'))
  .catch((error) => logger.info(error.message));

app.use(cors());
app.use(express.json());

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
