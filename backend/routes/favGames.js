const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const User = require("../models/user");
const userFavGameSchema = require("../schemas/userFavGame.json");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");
const {BadRequestError} = require("../expressError");

router.get("/:username", async (req, res, next) => {
    try {
        const user = await User.get(req.params.username)
        return res.json(user.favorite_games);
    } catch (err) {
        return next(err);
    }
});

router.post("/:username", ensureCorrectUser, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        const validator = jsonschema.validate(req.body, userFavGameSchema);
        if (!validator.valid) throw new BadRequestError();
        // if (user.favorite_games.includes(+req.body.game_id)) {
        //     throw new BadRequestError("Game already added to your favorites");
        // }

        await user.addFavGame(+req.body.game_id);

        return res.status(201).json(user.favorite_games);
    } catch (err) {
        return next(err);
    }
});

router.delete("/:username", ensureCorrectUser, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);

        await user.removeFavGame(+req.body.game_id);

        return res.json(user.favorite_games);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;