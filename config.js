"use strict";

/** Shared config for app */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

// Use dev db, test db, or env var / production db
function getDatabaseUri() {
    return (process.env.NODE_ENV === 'test') 
        ? "press_start_society_test"
        : process.env.DATABASE_URL || "press_start_society";
}

module.exports = {
    SECRET_KEY,
    PORT
}