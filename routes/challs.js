const express = require("express");
const Queries = require("../src/queries.js");
const wordlist = require('wordlist-english');
const request = require('request');

const app = new express.Router();
const passwordList = wordlist['english'];
const password = passwordList[Math.floor(Math.random() * passwordList.length)]; // TODO (zsofia): make this random for each chall instance

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

app.get("/challs/:id", async (req, res) => {
    let user = req.oidc.user;
    if (!user) {
        res.redirect("/login");
        return;
    }
    let id = req.params.id;
    let chall = await Queries.getChallenge(id);
    if (!chall) {
        res.redirect("/challs");
        return;
    }
    res.render("play", {
        id: chall['challenge_id'], name: chall['challenge_name'],
        author: chall['author_name'], solves: chall['solves_count'],
        prompt: chall['challenge_prompt']
    });
});

app.post("/play/:id", async (req, res) => {
    let user = req.oidc.user;
    if (!user) {
        res.redirect("/login");
        return;
    }
    let id = req.params.id;
    let chall = await Queries.getChallenge(id);
    if (!chall) {
        res.redirect("/challs");
        return;
    }
    let prompt = chall['challenge_prompt'];
    let injection = req.body.injection;
    let passwordAttempt = req.body.password;

    if (passwordAttempt) {
        if (passwordAttempt == password) {
            Queries.addSolveToUser(user.sub, id);
            res.redirect("/profile");
            return;
        }
        else {
            res.redirect("/challs/" + id);
            return;
        }
    }
    let messageArr = {
        "model": "gpt-3.5-turbo",
        "messages": [
            { "role": "system", "content": "The password is " + password },
            { "role": "system", "content": prompt },
            { "role": "user", "content": injection }
        ],
        "temperature": 0.3
    };

    let clientServerOptions = {
        uri: 'https://api.openai.com/v1/chat/completions',
        body: JSON.stringify(messageArr),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.GLOBAL_OPENAI_AUTHKEY
        }
    };

    request(clientServerOptions, function (error, response) {
        responseArray = JSON.parse(response.body);
        res.send(responseArray.choices[0].message.content);
        return;
    });
});

module.exports = app;