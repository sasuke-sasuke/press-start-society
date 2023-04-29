"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {BCRYPT_WORK_FACTOR} = require("../config");
const {sqlForPartialUpdate} = require("../helpers/sql")
const {NotFoundError, BadRequest, UnauthorizedError} = require("../expressError")

class User {

    static async register(username, password, firstName, lastName, email){
        const duplicateCheck = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [username],
        );

        if(duplicateCheck.rows[0]) {
            throw new BadRequest(`Username ${username} is already taken`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const res = await db.query(
            `INSERT INTO users
            (username, hashed_password, first_name, last_name, email)
            VALUES
            ($1, $2, $3, $4, $5)
            RETURNING 
            username,
            first_name AS "firstName", 
            last_name AS "lastName", 
            email`,
            [username, hashedPassword, firstName, lastName, email]
        );
        const user = res.rows[0]

        return user;
    }


    static async login(username, password){
        const res = await db.query(
            `SELECT username, hashed_password 
            FROM users
            WHERE username = $1`,
            [username],
        );
        const user = res.rows[0];

        if(user) {
            const valid = await bcrypt.compare(password, user.hashed_password);
            if(valid){
                delete user.hashed_password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username or password");
    }

    static async get(username) {
        const res = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [username],
        )

        const user = res.rows[0];

        if(!user) throw new NotFoundError(`User ${username} not found`);

        return user;
    }

    static async update(username, data) {
        if (data.password) {
            data.hashed_password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                firstName: "first_name",
                lastName: "last_name",
                email: "email",
                avatar: "avatar",
                bannerImage: "banner_image",
                about: "about"
            });
        const usernameVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users
                          SET ${setCols}
                          WHERE username = ${usernameVarIdx}
                          RETURNING username,
                          first_name AS "firstName", 
                          last_name AS "lastName", 
                          email`;

        const res = await db.query(querySql, [...values, username]);
        const user = res.rows[0];

        if(!user) throw new NotFoundError(`User ${username} not found`);

        delete user.password;
        return user;
    }

    static async remove(username) {
        const res = await db.query(
            `DELETE FROM users
            WHERE username = $1
            RETURNING username`,
            [username],
        )

        const user = res.rows[0];

        if(!user) throw new NotFoundError(`User ${username} not found`);
    }

}

const test = async () => {
    const res = await User.register(
        username = "sasuke",
        password = "myeye123",
        firstName = "Sasuke",
        lastName = "Uchiha",
        email = "sasuke@email.com"
    )
    console.log(res)
}

test();
debugger;

module.exports = User;