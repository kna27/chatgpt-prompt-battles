
const MIN_SCORE = 5;
const MAX_SCORE = 500;

/* temporarily copied from https://github.com/redpwn/rctf/blob/411b75b2224f627e42da8f53282b08d20038eaec/server/util/scores.ts#L9 */
// lol

const p0 = 0.7
const p1 = 0.96

const c0 = -Math.atanh(p0)
const c1 = Math.atanh(p1)
const a = (x) => (1 - Math.tanh(x)) / 2
const b = (x) => (a((c1 - c0) * x + c0) - a(c1)) / (a(c0) - a(c1))

/**
 * @param {number} highestSolves the highest amount of solves on any challenge globally 
 * @param {number} solves the amount of solves on *this* challenge
 * @returns {number} What the score of the challenge should be
 */
const getChallengeWorth = (maxSolves, solves)  => {
    const s = Math.max(1, maxSolves)
    const f = (x) => MIN_SCORE + (MAX_SCORE - MIN_SCORE) * b(x / s)
    return Math.round(Math.max(f(solves), f(s)))
}

module.exports = {
    getChallengeWorth
}
