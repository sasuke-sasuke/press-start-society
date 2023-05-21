"use strict";

const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const User = require("../models/user");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const createToken = require("../helpers/tokens");
const {BadRequestError} = require("../expressError");


router.post("/login", async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if(!validator.valid) throw new BadRequestError();

        const {username, password} = req.body;
        const user = await User.login(username, password);
        const token = createToken(user);
        return res.json({token});
    } catch (err) {
        return next(err);
    }
})

router.post("/register", async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if(!validator.valid) throw new BadRequestError();

        const {username, password, first_name, last_name, email} = req.body;
        const newUser =  await User.register(username, password, first_name, last_name, email);
        const token = createToken(newUser);
        return res.status(201).json({token});
    } catch (err) {
        return next(err);
    }

    
});


module.exports = router;