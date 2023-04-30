"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {BCRYPT_WORK_FACTOR} = require("../config");
const {sqlForPartialUpdate} = require("../helpers/sql")
const {NotFoundError, BadRequestError, UnauthorizedError} = require("../expressError")

class User {
    constructor({
        id = null,
        username,
        hashed_password,
        first_name,
        last_name,
        email,
        avatar = null,
        banner_image = null,
        about = '',
        status = '',
        created_at = null,
        last_login = null,
        follows = [],
        followers = [],
        posts = [],
        favoriteGames = []
    }) 
    {
        this.id = id;
        this.username = username;
        this.hashed_password = hashed_password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.avatar = avatar;
        this.banner_image = banner_image;
        this.about = about;
        this.status = status;
        this.created_at = created_at;
        this.last_login = last_login;
        this.follows = follows;
        this.followers = followers;
        this.posts = posts;
        this.favoriteGames = favoriteGames;
    }

    static async get(username) {
        const res = await db.query(
            `SELECT *
            FROM users
            WHERE username = $1`,
            [username],
        )

        const userRow = res.rows[0];

        if(!userRow) throw new NotFoundError(`User ${username} not found`);

        return new User(userRow);
    }


    static async register(username, password, firstName, lastName, email){
        const duplicateCheck = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [username],
        );

        if(duplicateCheck.rows[0]) {
            throw new BadRequestError(`Username ${username} is already taken`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const res = await db.query(
            `INSERT INTO users
            (username, hashed_password, first_name, last_name, email)
            VALUES
            ($1, $2, $3, $4, $5)
            RETURNING *`,
            [username, hashedPassword, firstName, lastName, email]
        );

        const newUserRow = res.rows[0];
        const newUser = new User(newUserRow);

        // Update the instance properties with updated data
        for (const [key, value] of Object.entries(newUserRow)){
            newUser[key] = value;
        }

        return newUser;
    }


    static async login(username, password){
        const res = await db.query(
            `SELECT * 
            FROM users
            WHERE username = $1`,
            [username],
        );
        const userRow = res.rows[0];

        if(!userRow) throw new UnauthorizedError(`Invalid username or password`);

        const isValid = await bcrypt.compare(password, userRow.hashed_password);

        if(!isValid) throw new UnauthorizedError(`Invalid username or password`);

        const user = new User(userRow);

        const lastLoginRes = await db.query(
            `UPDATE users
            SET last_login = NOW()
            WHERE id = $1
            RETURNING
            last_login`,
            [user.id]
        );

        user.last_login = lastLoginRes.rows[0].last_login;

        return user;
    }


    async update(data) {
        if (data.password) {
            data.hashed_password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                username: "username",
                hashed_password: "hashed_password",
                firstName: "first_name",
                lastName: "last_name",
                email: "email",
                avatar: "avatar",
                bannerImage: "banner_image",
                about: "about",
                status: "status"
            });
        const usernameVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users
                          SET ${setCols}
                          WHERE username = ${usernameVarIdx}
                          RETURNING *`;

        const res = await db.query(querySql, [...values, this.username]);
        const updatedUserRow = res.rows[0];

        if(!updatedUserRow) throw new NotFoundError(`User ${username} not found`);

        // Update the instance properties with updated data
        for (const [key, value] of Object.entries(updatedUserRow)) {
            this[key] = value;
        }

        return this;
    }

    async permaRemove() {
        const res = await db.query(
            `DELETE FROM users
            WHERE username = $1
            RETURNING username`,
            [this.username],
        )

        const removedUserRow = res.rows[0];

        if(!removedUserRow) throw new NotFoundError(`User ${username} not found`);

        return {
            message:`${removedUserRow.username} has been removed`
        }
    }

    async getFavGames(){
        const res = await db.query(
            `SELECT g.title  
             FROM users u 
             JOIN favorite_games f 
             ON u.id = f.user_id 
             JOIN games g 
             ON f.game_id = g.id
             WHERE username = $1`,
             [this.username],
        )
        const userFavGamesRows = res.rows;
        this.favoriteGames = userFavGamesRows;
        return this;
    }


    async addFavGame(gameId){

        await db.query(
            `INSERT INTO favorite_games
            (user_id, game_id)
            VALUES
            ($1, $2)`,
            [this.id, gameId]
        )

        return this.getFavGames();
    }


    async removeFavGame(gameId){

        await db.query(
            `DELETE FROM favorite_games
            WHERE user_id = $1 AND game_id = $2`,
            [this.id, gameId]
        )

        return this.getFavGames();
    }

    static async getFollows(username) {
    }

    static async getFollowers(username){

    }

    async follow(usernameToFollow){

    }
    
    async unfollow(usernameToUnfollow){

    }

}

// DELETE vvvvvvvv

// const test = async () => {
    // const res = await User.register(
    //     "bob",
    //     "1234567",
    //     "bob",
    //     "bobby boy",
    //     "bob@email.com"
    // )
        // const res = await User.get("seven");
    //     const user = await User.login("bob", "1234567");  
    // console.log(await user.permaRemove("bob"));
    // const user = await User.login("three", "1234567");
    // console.log(await user.update({
    //     firstName: "chrys",
    //     about: "super cute"
    // }))
    // console.log(await user.getFavGames())
    // console.log(await user.addFavGame(9));
    // console.log(await user.removeFavGame(7));
    // console.log(res);
    // console.log(user)
// }

// test();

// DELETE ^^^^^^^^

module.exports = User;