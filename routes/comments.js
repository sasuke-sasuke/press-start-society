const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const User = require("../models/user");
const userPostCommentSchema = require("../schemas/userPostComment.json");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");
const {BadRequestError} = require("../expressError");

router.get("/:username/:postId", ensureLoggedIn, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        const post = user.posts.find(p => p.id === +req.params.postId);
        return res.json(post.comments);
    } catch (err) {
        return next(err);
    }
});

router.get("/:username/:postId/:commentId", ensureLoggedIn, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        const post = user.posts.find(p => p.id === +req.params.postId);
        const comment = post.comments.find(c => c.id === +req.params.commentId);
        return res.json(comment);
    } catch (err) {
        return next(err);
    }
});

router.post("/:username/:postId", ensureCorrectUser, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        const post = user.posts.find(p => p.id === +req.params.postId);
        const validator = jsonschema.validate(req.body, userPostCommentSchema);
        if (!validator.valid) throw new BadRequestError();

        await post.addComment(req.body.content);

        return res.status(201).json(post.comments);
    } catch (err) {
        return next(err);
    }
});

router.patch("/:username/:postId/:commentId", ensureCorrectUser, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        const post = user.posts.find(p => p.id === +req.params.postId);

        await post.editComment(+req.params.commentId, req.body.content);

        return res.json(post.comments);
    } catch (err) {
        return next(err);
    }
});

router.delete("/:username/:postId/:commentId", ensureCorrectUser, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        const post = user.posts.find(p => p.id === +req.params.postId);

        await post.removeComment(req.params.commentId);

        return res.json(post.comments);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;