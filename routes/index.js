const express = require("express");

const app = new express.Router();

app.get("/", (req, res) => {
    res.render("index");
});

module.exports = app;