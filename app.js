const Game = require('./models/game');

const express = require('express');
const cors = require('cors');

const { NotFoundError } = require('./expressError')
const {verifyToken} = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const favGameRoutes = require('./routes/favGames');
const followerRoutes = require('./routes/followers');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const morgan = require('morgan')
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(verifyToken);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/favGames", favGameRoutes);
app.use("/follows", followerRoutes);
app.use("/posts", postRoutes);
app.use("/post/comments", commentRoutes);

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