"use strict";

const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const User = require("../models/user");
const userUpdateSchema = require("../schemas/userUpdate.json");
const {ensureCorrectUser, ensureLoggedIn} = require("../middleware/auth");
const {BadRequestError} = require("../expressError");


router.get("/", ensureLoggedIn, async (req, res, next) => {
    try {
        const users = await User.getAll();
        return res.json({users})
    } catch (err) {
        return next(err);
    }
});

router.get("/:username", ensureLoggedIn, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        return res.json({user})
    } catch (err) {
        return next(err);
    }
})

router.patch("/:username", ensureCorrectUser, async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) throw new BadRequestError();
        const user = await User.get(req.params.username);
        user.update(req.body);
        return res.json(user);
    } catch (err) {
        return next(err);
    }
})

router.delete("/:username", ensureCorrectUser, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        await user.permaRemove();
        return res.json({message: "User deleted"})
    } catch (err) {
        return next(err);
    }
})


module.exports = router;