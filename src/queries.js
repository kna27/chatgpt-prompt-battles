const pool = require('./db.js');

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

async function getAllChallengesWithUserSolvedCol(auth0Sid) {
    let user = await getUserByAuth0Id(auth0Sid);
    const query = `SELECT c.id AS challenge_id, 
                    c.name AS challenge_name, 
                    u.username AS author_name, 
                    COUNT(s.id) AS solves_count,
                    CASE 
                        WHEN su.id IS NULL THEN FALSE
                        ELSE TRUE
                    END AS solved_by_user
                FROM challenges c
                JOIN users u ON u.id = c.user_id
                LEFT JOIN solves s ON s.challenge_id = c.id
                LEFT JOIN solves su ON su.challenge_id = c.id AND su.user_id = $1
                GROUP BY c.id, u.username,su.id;`;
    const values = [user['id']];
    const result = await pool.query(query, values);
    return result.rows;
}

async function getChallenge(id) {
    const query = `SELECT c.id AS challenge_id, 
                    c.name AS challenge_name, 
                    COUNT(s.id) AS solves_count, 
                    c.prompt AS challenge_prompt, 
                    u.username AS author_name
                FROM challenges c
                JOIN users u ON u.id = c.user_id
                LEFT JOIN solves s ON s.challenge_id = c.id
                WHERE c.id = $1
                GROUP BY c.id, c.name, c.prompt, u.username;`;
    const values = [id];
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
        return null;
    }
    return result.rows[0];
}

async function getUsersChallenges(id) {
    const query = `SELECT c.id AS challenge_id,
                        c.name AS challenge_name,
                        COUNT(s.id) AS solves_count
                    FROM challenges c
                    LEFT JOIN solves s ON s.challenge_id = c.id
                    WHERE c.user_id = $1
                    GROUP BY c.id;`;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows;
}

async function getChallengesSolvedByUser(id) {
    const query = `SELECT c.id AS challenge_id,
                        c.name AS challenge_name,
                        u.username AS author_name,
                        COUNT(s.id) AS solves_count
                    FROM solves s
                    JOIN challenges c ON c.id = s.challenge_id
                    JOIN users u ON u.id = c.user_id
                    WHERE s.user_id = $1
                    GROUP BY c.id, u.username;`;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows;
}

async function deleteChallenge(id) {
    const query = `DELETE FROM challenges WHERE id = $1`;
    const values = [id];
    await pool.query(query, values);
}

async function addSolveToUser(auth0Sid, challengeId) {
    let user = await getUserByAuth0Id(auth0Sid);
    let query = `SELECT * FROM solves WHERE user_id = $1 AND challenge_id = $2`;
    let values = [user['id'], challengeId];
    let result = await pool.query(query, values);
    if (result.rowCount !== 0) {
        return;
    }
    query = `INSERT INTO solves (user_id, challenge_id) VALUES ($1, $2)`;
    values = [user['id'], challengeId];
    await pool.query(query, values);
}

module.exports = {
    getUser,
    createUser,
    updateUsername,
    addChallenge,
    getAllChallengesWithUserSolvedCol,
    getChallenge,
    getUsersChallenges,
    getChallengesSolvedByUser,
    deleteChallenge,
    addSolveToUser
};
