const express = require("express");

const app = new express.Router();

app.get("/", (req, res) => {
    res.send("routing to index.js");
    res.end();
});

module.exports = app;