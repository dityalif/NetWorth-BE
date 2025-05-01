require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    },
});

const connect = async () => {
    try {
        await pool.connect();
        console.log("Connected to the database successfully.");
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
}

connect();

const query = async (text, params) => {
    try {
        const res = await pool.query(text, params);
        return res;
    } catch (err) {
        console.error("Error executing query:", err);
    }
};

module.exports = {
    query,
}


