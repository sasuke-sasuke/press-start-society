CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(15) NOT NULL,
    last_name VARCHAR(15) NOT NULL,
    username VARCHAR(15) UNIQUE,
    email TEXT UNIQUE
        CHECK (position('@' IN email) > 1),
    hashed_password VARCHAR(255) NOT NULL,
    avatar TEXT DEFAULT 'image.png',
    banner_image TEXT DEFAULT 'image.png',
    about TEXT,
    status VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    release_date DATE NOT NULL,
    cover_image TEXT DEFAULT 'game.png',
    genre VARCHAR(30) NOT NULL,
    studio TEXT,
    game_api_id INTEGER NOT NULL
);

CREATE TABLE favorite_games (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    game_id INTEGER NOT NULL
        REFERENCES games(id)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    rating FLOAT NOT NULL 
        CHECK (rating >= 1.0 AND rating <= 5.0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    game_id INTEGER NOT NULL
        REFERENCES games(id) ON DELETE CASCADE
);

CREATE TABLE user_followers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    follower_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL
        REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER NOT NULL
        REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) UNIQUE,
    description VARCHAR(255),
    avatar TEXT DEFAULT 'groups.png',
    date_created DATE NOT NULL DEFAULT NOW(),
    game_id INTEGER NOT NULL
        REFERENCES games(id),
    owner_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE group_users (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL
        REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE
);