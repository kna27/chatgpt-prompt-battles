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

async function getUserByAuth0Id(auth0Sid) {
    const query = `SELECT * FROM users WHERE auth0_user_key = $1`;
    const values = [auth0Sid];
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

async function addChallenge(auth0Sid, name, prompt) {
    let user = await getUserByAuth0Id(auth0Sid);
    const query = `INSERT INTO challenges (user_id, name, prompt) VALUES ($1, $2, $3)`;
    const values = [user['id'], name, prompt];
    await pool.query(query, values);
}

async function getAllChallenges() {
    const query = `SELECT  c.id AS challenge_id, 
                        c.name AS challenge_name, 
                        u.username AS author_name, 
                        COUNT(s.id) AS solves_count
                    FROM challenges c
                    JOIN users u ON u.id = c.user_id
                    LEFT JOIN solves s ON s.challenge_id = c.id
                    GROUP BY c.id, u.username;`;
    const result = await pool.query(query);
    return result.rows;
}

module.exports = {
    getUser,
    createUser,
    updateUsername,
    addChallenge,
    getAllChallenges
};
