const errorHandler = (error, request, response, next) => {
    console.error('Caught in error handle middleware:', error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }

    next(error);
};

module.exports = errorHandler;