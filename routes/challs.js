// global challenge view page

const express = require("express");

const app = new express.Router();

app.get("/challs", (req, res) => {
    res.render("challs");
});

module.exports = app;