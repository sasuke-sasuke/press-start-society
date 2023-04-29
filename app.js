const Game = require('./models/game');
const User = require('./models/user');

const express = require('express');
const cors = require('cors');

const { NotFoundError } = require('./expressError')

const morgan = require('morgan')
const app = express();

app.use(cors())
app.use(express.json());
app.use(morgan('tiny'))

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