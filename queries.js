const pool = require('./db');

async function getUser(id) {
    const query = `SELECT * FROM users WHERE auth0_user_key = $1`;
    const values = [id];
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
        return null;
    }
    return result.rows[0];
}

async function createUser(auth0Sid, username) {
    const query = `INSERT INTO users (auth0_user_key, username) VALUES ($1, $2)`;
    const values = [auth0Sid, username];
    await pool.query(query, values);
}

async function updateUsername(auth0Sid, username) {
    const query = `UPDATE users SET username = $1 WHERE auth0_user_key = $2`;
    const values = [username, auth0Sid];
    await pool.query(query, values);
}

module.exports = {
    getUser,
    createUser,
    updateUsername
};