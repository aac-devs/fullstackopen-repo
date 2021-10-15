const jwt = require('jsonwebtoken');
const bloglistRouter = require('express').Router();
const Blog = require('../models/bloglist.js');
const User = require('../models/user.js');

bloglistRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

bloglistRouter.post('/', async (request, response) => {
  const { title, author, url, likes: lks } = request.body;
  const decodeToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodeToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodeToken.id);
  const blog = new Blog({
    title,
    author,
    url,
    likes: !lks ? 0 : lks,
    user: user._id,
  });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await User.findByIdAndUpdate(user._id, user);
  response.status(201).json(savedBlog);
});

bloglistRouter.delete('/:id', async (request, response) => {
  const decodeToken = jwt.verify(request.token, process.env.SECRET);
  const blogUser = await Blog.findById(request.params.id);
  if (decodeToken.id === blogUser?.user.toString()) {
    await blogUser.remove();
    return response.status(204).end();
  }
  return response.status(404).json({ error: 'blog not found' });
});

bloglistRouter.put('/:id', async (request, response) => {
  const blogObj = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogObj, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = bloglistRouter;
