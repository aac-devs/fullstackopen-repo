const jwt = require('jsonwebtoken');
const bloglistRouter = require('express').Router();
const Blog = require('../models/bloglist.js');
const User = require('../models/user.js');

bloglistRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

bloglistRouter.post('/', async (request, response) => {
  const { title, author, url, likes: lks } = request.body;
  const token = getTokenFrom(request);
  const decodeToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodeToken.id) {
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
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

bloglistRouter.put('/:id', async (request, response) => {
  const blogObj = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogObj, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = bloglistRouter;
