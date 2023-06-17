const express = require("express");
const Queries = require("../queries.js");

const app = new express.Router();

app.get("/create", (req, res) => {
    res.render("create");
});

app.post("/create", async (req, res) => {
    let user = req.oidc.user;
    if (!user) {
        res.redirect("/login");
        return;
    }
    let name = req.body.name;
    let prompt = req.body.prompt;
    await Queries.addChallenge(user.sub, name, prompt);
    res.redirect("/challs");
});

app.get("/challs", async (req, res) => {
    let user = req.oidc.user;
    if (!user) {
        res.redirect("/login");
        return;
    }
    let allChalls = await Queries.getAllChallenges();
    res.render("challs", { challs: allChalls });
});

module.exports = app;