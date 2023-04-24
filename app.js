const express = require('express');

const { NotFoundError } = require('./expressError')


const app = express();

app.use(express.json());

/** Handle 404 error -- this matches everything */
app.use((req, res, next) => {
    return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here */
app.use((err, req, res, next) => {
    if(process.env.NODE_ENV !== 'test') console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: {message, status}
    });
});

module.exports = app;