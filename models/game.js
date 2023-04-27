"use strict"
const axios = require("axios")
const {API_BASE_URL} = require("../config")
const {RAWG_KEY} = require("../api_key")
const {BadRequestError} = require('../expressError')
const db = require("../db")

/** Related functions to Game */

class Game {

    // get all games
    static async getAllGames() {
        try {
            const res = await axios.get(`${API_BASE_URL}/games?key=${RAWG_KEY}`);
            return res.data;
        } catch (err) {
            throw new BadRequestError();
        }
    }

    // search games
    static async searchGames(search, page=1, pageSize=10) {
        try {
            const res = await axios.get(`${API_BASE_URL}/games?search=${search}&page=${page}&page_size=${pageSize}&key=${RAWG_KEY}`);
            return res.data;
        } catch (err) {
            throw new BadRequestError();
        }
    }

    // gets a single game
    static async getGame(id) {
        try {
            const res = await axios.get(`${API_BASE_URL}/games/${id}?key=${RAWG_KEY}`);
            return res.data;
        } catch (err) {
            throw new BadRequestError();
        }
    }
}

// DELETE vvv

// async function test(){
//     const res = await Game.getGame(13554);
//     console.log(res);
//     return res.data;
// }

// let search = test();
// debugger;

// DELETTE ^^

module.exports = Game