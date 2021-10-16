const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/bloglist');
const User = require('../models/user');

const api = supertest(app);

const createUser = async (username, name, password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({ username, name, passwordHash });
  return await newUser.save();
};

const createBlog = async (token, blogData) => {
  const blogCreated = await api
    .post('/api/blogs')
    .send(blogData)
    .set({ Authorization: token });
  return blogCreated.body;
};

const loginUser = async (username, password) => {
  return await api.post('/api/login').send({ username, password });
};

jest.setTimeout(10000);

describe('get users & blogs', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    for (let user of helper.initialUsers) {
      let userObj = new User(user);
      await userObj.save();
    }
    for (let blog of helper.initialBlogs) {
      let blogObj = new Blog(blog);
      await blogObj.save();
    }
  });

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all users are returned', async () => {
    const response = await api.get('/api/users');
    expect(response.body).toHaveLength(helper.initialUsers.length);
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('blog has a property defined as id', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  });
});

describe('create users and login', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('creation succeeds with valid data', async () => {
    const newUser = {
      username: 'andresarana',
      name: 'Andres',
      password: '123456',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body.id).toBeDefined();
  });

  test('creation fails with proper statuscode and message if username is missing', async () => {
    const newUser = {
      name: 'Andres',
      password: '123456',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toBe('password or username missing');
  });

  test('creation fails with proper statuscode and message if password is missing', async () => {
    const newUser = {
      username: 'andresarana',
      name: 'Andres',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toBe('password or username missing');
  });

  test("creation fails with proper statuscode and message if username's length is not at least 3 characters", async () => {
    const newUser = {
      username: 'an',
      name: 'Andres',
      password: '123456',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toBe(
      'password or username length must be at least 3 characters'
    );
  });

  test("creation fails with proper statuscode and message if password's length is not at least 3 characters", async () => {
    const newUser = {
      username: 'andresarana',
      name: 'Andres',
      password: '12',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toBe(
      'password or username length must be at least 3 characters'
    );
  });

  test('creation fails with proper statuscode and message if username already exist', async () => {
    await createUser('andresarana', 'aac', '123456');
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'andresarana',
      name: 'andres',
      password: '654321',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation succeeds with a fresh username', async () => {
    await createUser('andresarana', 'aac', '123456');
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'aac-devs',
      name: 'andres arana',
      password: '123456',
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('login succeeds with valid data', async () => {
    await createUser('andresarana', 'aac', '123456');
    const result = await loginUser('andresarana', '123456');
    const { username, token } = result.body;
    expect(token).toBeDefined();
    expect(username).toBe('andresarana');
  });

  test('login fails with wrong data', async () => {
    await createUser('andresarana', 'aac', '123456');
    const wrongUser = { username: 'user', password: 'xxxx' };
    const result = await api
      .post('/api/login')
      .send(wrongUser)
      .expect(401)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain('Invalid username or password');
  });
});

describe('create blogs', () => {
  let token, userId;
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    const user = await createUser('andresarana', 'aac', '123456');
    const result = await loginUser('andresarana', '123456');
    token = `bearer ${result.body.token}`;
    userId = user._id.toString();
  });

  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsSaved = await helper.blogsInDb();
    expect(blogsSaved).toHaveLength(1);
    const blogUser = blogsSaved[0].user.toString();
    expect(blogUser).toBe(userId);
    const titles = blogsSaved.map((b) => b.title);
    expect(titles).toContain(newBlog.title);
  });

  test('succeeds with likes missing, defaults in zero', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsSaved = await helper.blogsInDb();
    expect(blogsSaved).toHaveLength(1);
    const index = blogsSaved.map((b) => b.title).indexOf(newBlog.title);
    expect(blogsSaved[index].likes).toBe(0);
  });

  test('fails with a status code 400 if title is missing', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const blogsSaved = await helper.blogsInDb();
    expect(blogsSaved).toHaveLength(0);
  });

  test('fails with a status code 400 if url is missing', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      likes: 0,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const blogsSaved = await helper.blogsInDb();
    expect(blogsSaved).toHaveLength(0);
  });

  test('fails with status code 401 if token is missing', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
    };
    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toBe('invalid token');
    const blogsSaved = await helper.blogsInDb();
    expect(blogsSaved).toHaveLength(0);
  });

  test('fails with status code 401 if token is wrong', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
    };
    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `${token}x` })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toBe('invalid token');
    const blogsSaved = await helper.blogsInDb();
    expect(blogsSaved).toHaveLength(0);
  });
});

describe('delete blog', () => {
  const user1 = {
    username: 'andresarana',
    name: 'andres',
    password: '123456',
  };
  const user2 = {
    username: 'aac-devs',
    name: 'andres',
    password: '1111111',
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    await createUser(...Object.values(user1));
    await createUser(...Object.values(user2));
  });

  test('succeeds with status code 204 if valid data', async () => {
    const tokenResp = await loginUser(user1.username, user1.password);
    const token = `bearer ${tokenResp.body.token}`;
    const resp = await createBlog(token, helper.initialBlogs[0]);
    const blogId = resp.id;
    const blogsAtStart = await helper.blogsInDb();
    expect(blogsAtStart).toHaveLength(1);
    await api
      .delete(`/api/blogs/${blogId}`)
      .set({ Authorization: token })
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(0);
  });

  test('fails with status code 404 if user token is wrong', async () => {
    let tokenResp = await loginUser(user1.username, user1.password);
    const resp = await createBlog(
      `bearer ${tokenResp.body.token}`,
      helper.initialBlogs[0]
    );
    const blogId = resp.id;
    const blogsAtStart = await helper.blogsInDb();
    expect(blogsAtStart).toHaveLength(1);
    tokenResp = await loginUser(user2.username, user2.password);
    const wrongUserToken = `bearer ${tokenResp.body.token}`;
    const deletionResponse = await api
      .delete(`/api/blogs/${blogId}`)
      .set({ Authorization: wrongUserToken })
      .expect(404);

    expect(deletionResponse.body.error).toBe('blog not found');
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(1);
  });
});

describe('update blog', () => {
  const user = {
    username: 'andresarana',
    name: 'andres',
    password: '123456',
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    await createUser(...Object.values(user));
  });

  test('succeds with valid data', async () => {
    const tokenResp = await loginUser(user.username, user.password);
    const token = `bearer ${tokenResp.body.token}`;
    const resp = await createBlog(token, helper.initialBlogs[0]);
    const blogId = resp.id;
    const blogsAtStart = await helper.blogsInDb();
    expect(blogsAtStart).toHaveLength(1);
    const blogToUpdate = blogsAtStart[0];
    expect(blogToUpdate.likes).toBe(7);
    blogToUpdate.likes = 85;
    await api.put(`/api/blogs/${blogId}`).send(blogToUpdate).expect(200);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0].likes).toBe(85);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
