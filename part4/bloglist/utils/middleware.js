const { request, response } = require('express');

const errorHandler = (error, request, response, next) => {
  if (error.message === 'user: missings') {
    return response.status(400).send({ error: 'password or username missing' });
  } else if (error.message === 'user: to short') {
    return response.status(400).send({
      error: 'password or username length must be at least 3 characters',
    });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    });
  }
  next(error);
};

const tokenExtract = (request, response, next) => {
  const authorization = request.get('authorization');
  request.token = undefined;
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
};

module.exports = { errorHandler, tokenExtract };
