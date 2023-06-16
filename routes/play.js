const express = require("express");

const app = new express.Router();

app.get("/play", (req, res) => {
    res.send("routing to play.js");
    res.end();
});

module.exports = app;