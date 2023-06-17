const express = require("express");

const app = new express.Router();

app.get("/play", (req, res) => {
    res.render("play");
});

module.exports = app;