// global challenge view page

const express = require("express");

const app = new express.Router();

app.get("/challs", (req, res) => {
    res.send("routing to viewchalls.js");
    res.end();
});

module.exports = app;