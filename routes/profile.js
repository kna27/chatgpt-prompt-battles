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
    let options = { username: dbUser.username, challsCreated: challsCreated, challsSolved: challsSolved };
    if (req.query.error) {
        switch (req.query.error) {
            case "usernameTaken":
                options["error"] = "Username is already taken.";
                break;
            default:
                options["error"] = "Unknown error.";
                break;
        }
    }
    return res.render("profile", options);
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
        if (req.body.username === dbUser.username) {
            return res.redirect("/profile");
        }
        let usernameTaken = await Queries.getUserByUsername(req.body.username);
        if (usernameTaken) {
            return res.redirect("/profile?error=usernameTaken");
        }
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

app.get("/delete", async (req, res) => {
    let user = req.oidc.user;
    if (!user) return res.redirect("/login");
    let dbUser = await Queries.getUser(user.sub);
    if (!dbUser) {
        await Queries.createUser(user.sub, user.email);
        dbUser = await Queries.getUser(user.sub);
    }
    await Queries.deleteUser(dbUser.id);
    return res.redirect("/logout");
});

module.exports = app;
