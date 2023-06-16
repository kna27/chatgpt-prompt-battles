// profile page will have settings

const express = require("express");

const app = new express.Router();

app.get("/profile", (req, res) => {
    res.send("routing to profile.js");
    res.end();
});

module.exports = app;