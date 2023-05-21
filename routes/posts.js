const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const User = require("../models/user");
const userPostSchema = require("../schemas/userPost.json");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");
const {BadRequestError} = require("../expressError");

router.get("/:username", ensureLoggedIn, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        return res.json(user.posts);
    } catch (err) {
        return next(err);
    }
});

router.get("/:username/:postId", ensureLoggedIn, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        const post = user.posts.find(p => p.id === +req.params.postId);
        return res.json(post);
    } catch (err) {
        return next(err);
    }
});

router.post("/:username", ensureCorrectUser, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        const validator = jsonschema.validate(req.body, userPostSchema);
        if (!validator.valid) throw new BadRequestError();

        await user.createPost(req.body.content);

        return res.status(201).json(user.posts);
    } catch (err) {
        return next(err);
    }
});

router.patch("/:username/:postId", ensureCorrectUser, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);

        await user.editPost(+req.params.postId, req.body.content);

        return res.json(user.posts);
    } catch (err) {
        return next(err);
    }
});

router.delete("/:username/:postId", ensureCorrectUser, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);

        await user.removePost(req.params.postId);

        return res.json(user.posts);
    } catch (err) {
        return next(err);
    }
});

router.get("/:username/:postId/likes", ensureLoggedIn, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        const post = user.posts.find(p => p.id === +req.params.postId);
        return res.json(post.likes);
    } catch (err) {
        return next(err);
    }
});

router.post("/:username/like/:postId", ensureCorrectUser, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);

        await user.likePost(+req.params.postId);

        return res.json(user.posts);
    } catch (err) {
        return next(err);
    }
});

router.delete("/:username/unlike/:postId", ensureCorrectUser, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);

        await user.unlikePost(+req.params.postId);

        return res.json(user.posts);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;