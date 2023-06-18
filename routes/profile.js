const express = require("express");
const Queries = require("../src/queries.js");
const app = new express.Router();

app.get("/profile", async (req, res) => {
    let user = req.oidc.user;
    if (!user) return res.redirect("/login");
    let dbUser = await Queries.getUser(user.sub);
    if (!dbUser) {
        await Queries.createUser(user.sub, user.email);
        dbUser = await Queries.getUser(user.sub);
    }
    let challsCreated = await Queries.getUsersChallenges(dbUser.id);
    let challsSolved = await Queries.getChallengesSolvedByUser(dbUser.id);
    return res.render("profile", { username: dbUser.username, challsCreated: challsCreated, challsSolved: challsSolved });
});

app.post("/profile", async (req, res) => {
    let user = req.oidc.user;
    if (!user) return res.redirect("/login");
    let dbUser = await Queries.getUser(user.sub);
    if (!dbUser) {
        await Queries.createUser(user.sub, user.email);
        dbUser = await Queries.getUser(user.sub);
    }
    if (req.body.username) {
        await Queries.updateUsername(user.sub, req.body.username);
    }
    if (req.body.challenge_id) {
        let challenge = await Queries.getChallenge(req.body.challenge_id);
        if (challenge.author_name !== dbUser.username) {
            return res.redirect("/profile");
        }
        await Queries.deleteChallenge(req.body.challenge_id);
    }
    return res.redirect("/profile");
});


module.exports = app;
