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
        following = [],
        followers = [],
        posts = [],
        favorite_games = [],
        groups = []
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
        this.following = following;
        this.followers = followers;
        this.posts = posts;
        this.favorite_games = favorite_games;
        this.groups = groups;
    }

    static async getAll() {
        const res = await db.query(
            `SELECT *
            FROM users`
        )
        return res.rows;
    }

    /** Gets all info related to user */
    static async get(username) {
        const res = await db.query(
            `SELECT *
            FROM users
            WHERE username = $1`,
            [username],
        )

        const userRow = res.rows[0];

        if(!userRow) throw new NotFoundError(`User ${username} not found`);

        const user = new User(userRow);
        await user.getFavGames();
        await user.getFollowing();
        await user.getFollowers();
        await user.getPosts();
        await user.getGroups();
        
        return user;
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

        const user = await User.get(userRow.username);

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

        return await User.get(this.username);
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
        this.favorite_games = [...userFavGamesRows];
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

    async getFollowing(){
        const res = await db.query(
            `SELECT 
             u.id, 
             u.username
             FROM users u
             JOIN user_followers uf
             ON u.id = uf.user_id
             WHERE uf.follower_id = $1`,
             [this.id]
        )

        const userFollowingRows = res.rows;
        this.following = [...userFollowingRows];

        return this;
    }

    async getFollowers(){
        const res = await db.query(
            `SELECT
             u.id, 
             u.username
             FROM users u
             JOIN user_followers uf
             ON u.id = uf.follower_id
             WHERE uf.user_id = $1`,
             [this.id]
        )

        const userFollowersRows = res.rows;
        this.followers = [...userFollowersRows];

        return this;
    }

    async follow(usernameToFollow){
        const follow = await User.get(usernameToFollow);

        await db.query(
            `INSERT INTO user_followers
            (user_id, follower_id)
            VALUES
            ($1, $2)`,
            [follow.id, this.id]
        )

        return this.getFollowing();
    }
    
    async unfollow(usernameToUnfollow){
        const unfollow = await User.get(usernameToUnfollow);
        await db.query(
            `DELETE FROM user_followers
            WHERE user_id = $1 AND follower_id = $2`,
            [unfollow.id, this.id]
        )

        return this.getFollowing();
    }

    async getPosts(){
        const res = await db.query(
            `SELECT p.id, p.content, p.date_created
            FROM users u
            JOIN posts p
            ON u.id = p.user_id
            WHERE u.id = $1
            ORDER BY p.date_created DESC`,
            [this.id]
        )

        const userPostsRows = res.rows;
        this.posts = [...userPostsRows];
        
        for( let post of this.posts){
            post.likes = await this.getPostLikes(post.id);
            post.comments = await this.getComments(post.id);
        }

        return this;
    }

    async getPost(postId){
        const res = await db.query(
            `SELECT id, user_id, content, date_created
            FROM posts
            WHERE id = $1`,
            [postId]
        )
        const userPostRow = res.rows[0];

        if(!userPostRow) throw new NotFoundError(`Post ${postId} not found`);

        userPostRow.likes = await this.getPostLikes(userPostRow.id);

        return userPostRow;
    }

    async createPost(content){
        await db.query(
            `INSERT INTO posts
            (user_id, content)
            VALUES
            ($1, $2)`,
            [this.id, content]
        )

        return this.getPosts();
    }

    async removePost(postId){
        await db.query(
            `DELETE FROM posts
            WHERE id = $1`,
            [postId]
        )

        return this.getPosts();
    }

    async editPost(postId, content){
        await db.query(
            `UPDATE posts
            SET content = $1
            WHERE id = $2`,
            [content, postId]
        )

        return this.getPosts();
    }

    async getPostLikes(postId){
        const res = await db.query(
            `SELECT post_id, COUNT(user_id) AS likes
            FROM post_likes
            WHERE post_id = $1
            GROUP BY post_id`,
            [postId]
        )
        const userPostLikesRow = res.rows[0];

        let likes;
        if(!userPostLikesRow){
            likes = 0;
        } else {
            likes = +userPostLikesRow.likes;
        }

        return likes;
    }

    async likePost(postId){
        await db.query(
            `INSERT INTO post_likes
            (user_id, post_id)
            VALUES
            ($1, $2)`,
            [this.id, postId]
        )

        return this.getPosts();
    }

    async unlikePost(postId){
        await db.query(
            `DELETE FROM post_likes
            WHERE user_id = $1 AND post_id = $2`,
            [this.id, postId]
        )

        return this.getPosts();
    }

    async getComment(commentId){
        const res = await db.query(
            `SELECT id, post_id, user_id, content, created_at
            FROM comments
            WHERE id = $1`,
            [commentId]
        )
        const userCommentRow = res.rows[0];

        if(!userCommentRow) throw new NotFoundError(`Comment ${commentId} not found`);

        return userCommentRow; 
    }


    async getComments(postId){
        const res = await db.query(
            `SELECT c.id, c.content, c.created_at
            FROM posts p
            JOIN comments c
            ON p.id = c.post_id
            WHERE p.id = $1`,
            [postId]
        )

        const userPostCommentsRows = res.rows;
        const post = await this.getPost(postId)
        post.comments = userPostCommentsRows;
        return post.comments;
    }

    async addComment(postId, content){
        await db.query(
            `INSERT INTO comments
            (user_id, post_id, content)
            VALUES
            ($1, $2, $3)
            RETURNING *`,
            [this.id, postId, content]
        )

        return this.getPosts();
    }

    async editComment(commentId, content){
        await db.query(
            `UPDATE comments
            SET content = $1
            WHERE id = $2`,
            [content, commentId]
        )
        return this.getPosts();
    }

    async removeComment(commentId){
        await db.query(
            `DELETE FROM comments
            WHERE id = $1`,
            [commentId]
        )
        return this.getPosts();
    }

    async getGroups(){
        const res = await db.query(
            `SELECT id, name, description, avatar, game_id, owner_id
            FROM groups
            WHERE owner_id = $1`,
            [this.id]
        )

        const userGroupsRows = res.rows;
        if(!userGroupsRows) throw new NotFoundError(`No groups found`);

        this.groups = userGroupsRows;

        return this;
    }

    async getGroup(groupId){
        const res = await db.query(
            `SELECT id, name, description, avatar, game_id, owner_id
             FROM groups
             WHERE id = $1`,
             [groupId]
        )
        const userGroupRow = res.rows[0];
        if(!userGroupRow) throw new NotFoundError(`Group ${groupId} not found`);
        return userGroupRow;
    }

    async createGroup(data){
        const {name, description, avatar, game_id} = data;
        await db.query(
            `INSERT INTO groups
            (name, description, avatar, game_id, owner_id)
            VALUES
            ($1, $2, $3, $4, $5)`,
            [name, description, avatar, game_id, this.id]
        )

        return this.getGroups();
    }

    async updateGroup(groupId, data){
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                name: "name",
                description: "description",
                avatar: "avatar",
                game_id: "game_id",
                owner_id: "owner_id"
            });

        const userIdVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE groups
                          SET ${setCols}
                          WHERE owner_id = ${userIdVarIdx}
                          RETURNING *`;

        const res = await db.query(querySql, [...values, groupId]);
        const updatedGroupRow = res.rows[0];

        if(!updatedGroupRow) throw new NotFoundError(`Group id: ${groupId} not found`);

        for (const [key, value] of Object.entries(updatedGroupRow)) {
            this[key] = value;
        }

        return this.getGroups();
    }

    async removeGroup(groupId){
        await db.query(
            `DELETE FROM groups
            WHERE id = $1`,
            [groupId]
        )

        return this.getGroups();
    }

    async getGroupUsers(groupId){
        const res = await db.query(
            `SELECT g.name, u.id, u.username
            FROM groups g
            JOIN group_users gu
            ON g.id = gu.group_id
            JOIN users u
            ON gu.user_id = u.id
            WHERE g.id = $1`,
            [groupId]
        )

        const userGroupUsersRows = res.rows;
        if(!userGroupUsersRows) throw new NotFoundError(`Group id: ${groupId} not found`);

        return userGroupUsersRows;
    }

    async addGroupUser(groupId, userId){
        await db.query(
            `INSERT INTO group_users
            (group_id, user_id)
            VALUES
            ($1, $2)`,
            [groupId, userId]
        )

        return this.getGroupUsers(groupId);
    }

    async removeGroupUser(groupId, userId){
        await db.query(
            `DELETE FROM group_users
            WHERE group_id = $1 AND user_id = $2`,
            [groupId, userId]
        )

        return this.getGroupUsers(groupId);
    }

}

module.exports = User;