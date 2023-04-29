"use strict"
const axios = require("axios")
const {API_BASE_URL} = require("../config")
const {RAWG_KEY} = require("../api_key")
const {BadRequestError, NotFoundError} = require('../expressError')

/** Related functions to Game */

class Game {

    // To get a list of all games, enter no search filters
    static async searchGames(searchFilters= {}) {
        const {search, page, pageSize, platforms, genres, orderBy} = searchFilters;

        const params = {
            key: RAWG_KEY,    
        }

        // If search filters are provided, add them to the params
        search ? params.search = search : null;
        page ? params.page = page : null;
        pageSize ? params.page_size = pageSize : null;
        platforms ? params.platforms = platforms.join(',') : null;
        genres ? params.genres = genres.join(',') : null;
        orderBy ? params.order_by = orderBy : null;

        const res = await axios.get(`${API_BASE_URL}/games`, {params})
 
        return res.data;
    }

    static async getGame(id) {
            const res = await axios.get(`${API_BASE_URL}/games/${id}?key=${RAWG_KEY}`);
            return res.data;
    }
}

// DELETE vvv

// const test = async() => {
//     const searchFilters = {
//         search: "scum",
//         page: 1,
//         pageSize: 10,
//         platforms: [4, 187]  
//     }
//     const res = await Game.searchGames(searchFilters)
//     if(res){
//         console.log(res)
//     } else {
//         console.log("Not game found")
//     }
// };
// test();
// debugger;

// DELETTE ^^

module.exports = Game