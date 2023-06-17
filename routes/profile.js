// profile page will have settings

const express = require("express");

const app = new express.Router();

app.get("/profile", (req, res) => {
    res.render("profile");
});

module.exports = app;