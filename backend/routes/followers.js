const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const User = require("../models/user");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");
const {BadRequestError} = require("../expressError");

router.get("/followers/:username", ensureLoggedIn, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username)
        return res.json(user.followers);
    } catch (err) {
        return next(err);
    }
});

router.get("/following/:username", ensureLoggedIn, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username)
        return res.json(user.following);
    } catch (err) {
        return next(err);
    }
});

router.post("/:username", ensureCorrectUser, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        if (user.followers.includes(req.body.username)) {
            throw new BadRequestError("User already followed");
        }

        await user.follow(req.body.username);

        return res.status(201).json(user.following);
    } catch (err) {
        return next(err);
    }
});

router.delete("/:username", ensureCorrectUser, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);

        await user.unfollow(req.body.username);

        return res.json(user.following);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;