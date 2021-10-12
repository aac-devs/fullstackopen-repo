const bloglistRouter = require('express').Router();
const Blog = require('../models/bloglist.js');

bloglistRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

bloglistRouter.post('/', async (request, response) => {
  const blogObj = request.body;
  if (!blogObj?.likes) blogObj.likes = 0;
  const blog = new Blog(blogObj);
  const result = await blog.save();
  response.status(201).json(result);
});

bloglistRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = bloglistRouter;
