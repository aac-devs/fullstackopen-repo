const errorHandler = (error, request, response, next) => {
  if (error.message === 'user: missings') {
    return response.status(400).send({ error: 'password or username missing' });
  } else if (error.message === 'user: to short') {
    return response.status(400).send({
      error: 'password or username length must be at least 3 characters',
    });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }
  next(error);
};

module.exports = { errorHandler };
