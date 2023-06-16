// TODO(kna27)


/**
 * Creates a user into the DB using UserMetadata.name and .auth0UserKey
 * 
 * @param {UserMetadata} user
 * @returns {Promise<User>}
 */
async function createUser(user) {
    /* TODO */
}

/**
 * Edit a user in db
 * 
 * @param {number} userId
 * @param {UserSettings} newSettings only writable values are here
 * @returns {Promise<User>} updated user
 */
async function editUser(userId, newSettings) {
    /* TODO */
}

/**
 * Gets user through their auth0 key, for use in auth0 logins
 * 
 * @param {string} auth0UserKey The auth0 `user_id` property, used to identify users in the DB
 * @returns {Promise<User>}
 */
async function getUser(auth0UserKey) {
    /* TODO */
}



/**
 * List challenges owned by a user
 * 
 * @todo logically find way to do pagination
 * 
 * @param {User} user the user
 * - maybe make this User.id in the future? user is better for now though
 * @returns {Promise<Challenge[]>}
 */
async function listUsersChallenges(user) {
    /* TODO */
}

/**
 * List of global challenges
 * 
 * @todo logically find way to do pagination
 * @todo find a cool ordering, for now maybe sort by least solved
 * 
 * @returns {Promise<Challenge[]>}
 */
async function getGlobalChallenges() {
    /* TODO */
}



/**
 * Let user create a challenge
 * 
 * @param {User} creator
 * @param {ChallengeMetadata} challenge
 * @returns {Promise<Challenge>}
 */
async function createChallenge(creator, challenge) {
    /* TODO */
}

/**
 * Fetch challenge by id
 * 
 * @param {number} id
 * @returns {Promise<Challenge>}
 */
async function fetchChallenge(id) {
    /* TODO */
}

/**
 * Submit solve will not only add a new xref
 * between user and challenge but it will also
 * update the challenge's point worth and then
 * every relevant user's score
 * 
 * can prob use scoring.js's getChallengeWorth(solves) algo
 * 
 * @param {User} solver
 * @param {Challenge} challenge
 * @returns {Promise<Challenge>}
 */
async function submitSolve(solver, challenge) {
    /* TODO */
}


module.exports = {
    createUser,
    getUser,
    editUser,
    listUsersChallenges,
    getGlobalChallenges,
    createChallenge,
    fetchChallenge,
    submitSolve
}