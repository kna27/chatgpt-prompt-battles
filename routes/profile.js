const express = require("express");
const Queries = require("../queries.js");
const app = new express.Router();

app.get("/profile", async (req, res) => {
    let user = req.oidc.user;
    if (!user) return res.redirect("/login");
    let dbUser = await Queries.getUser(user.sub);
    if (!dbUser) {
        await Queries.createUser(user.sub, user.email);
        dbUser = await Queries.getUser(user.sub);
    }
    return res.render("profile", { username: dbUser.username });
});

app.post("/profile", async (req, res) => {
    let user = req.oidc.user;
    if (!user) return res.redirect("/login");
    let dbUser = await Queries.getUser(user.sub);
    if (!dbUser) {
        await Queries.createUser(user.sub, user.email);
        dbUser = await Queries.getUser(user.sub);
    }
    if (!req.body.username) return res.redirect("/profile");
    await Queries.updateUsername(user.sub, req.body.username);
    return res.redirect("/profile");
});

app.get("/logout", (req, res) => {
    req.oidc.logout();
    res.redirect("/");
});

module.exports = app;