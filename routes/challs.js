const express = require("express");
const Queries = require("../src/queries.js");
const wordlist = require('wordlist-english');
const request = require('request');

const app = new express.Router();
const passwordList = wordlist['english'];
//const password = passwordList[Math.floor(Math.random() * passwordList.length)]; // TODO (zsofia): make this random for each chall instance
const serverSeed = Math.random() * passwordList.length;

app.get("/create", (req, res) => {
    let user = req.oidc.user;
    if (!user) {
        return res.redirect("/login");
    }
    let error = "";
    if (req.query.error) {
        switch (req.query.error) {
            case "empty":
                error = "Name and prompt cannot be empty.";
                break;
            case "nameTooLong":
                error = "Name cannot be longer than 128 characters.";
                break;
            case "promptTooLong":
                error = "Prompt cannot be longer than 512 characters.";
                break;
            case "nameTaken":
                error = "Name is already taken.";
                break;
            default:
                error = "Unknown error.";
                break;
        }
    }
    res.render("create", { error: error });
});

app.post("/create", async (req, res) => {
    let user = req.oidc.user;
    if (!user) {
        res.redirect("/login");
        return;
    }
    let name = req.body.name;
    let prompt = req.body.prompt;
    if (!name || !prompt) {
        return res.redirect("/create?error=empty");
    }
    if (name.length > 128) {
        return res.redirect("/create?error=nameTooLong");
    }
    if (prompt.length > 512) {
        return res.redirect("/create?error=promptTooLong");
    }
    let chall = await Queries.getChallengeByName(name);
    if (chall) {
        return res.redirect("/create?error=nameTaken");
    }
    await Queries.addChallenge(user.sub, name, prompt);
    res.redirect("/challs");
});

app.get("/challs", async (req, res) => {
    let user = req.oidc.user;
    if (!user) {
        res.redirect("/login");
        return;
    }
    let allChalls = await Queries.getAllChallengesWithUserSolvedCol(user.sub);
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
    let options = {
        id: chall['challenge_id'], name: chall['challenge_name'],
        author: chall['author_name'], solves: chall['solves_count'],
        prompt: chall['challenge_prompt']
    };
    if (req.query.solved == "true") {
        options.solved = true;
    }
    else if (req.query.solved == "false") {
        options.not_solved = true;
    }

    res.render("play", options);
});

app.post("/play/:id", async (req, res) => {
    let user = req.oidc.user;
    if (!user) {
        res.redirect("/login");
        return;
    }
    let id = req.params.id;
    let chall = await Queries.getChallenge(id);

    let dbUser = await Queries.getUser(user.sub);
    if (!dbUser) {
        await Queries.createUser(user.sub, user.email);
        dbUser = await Queries.getUser(user.sub);
    }
    let challSeed = serverSeed * id + serverSeed * dbUser.id;
    let password = passwordList[Math.floor(challSeed) % passwordList.length];

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
            res.redirect("/challs/" + id + "/?solved=true");
            return;
        }
        else {
            res.redirect("/challs/" + id + "/?solved=false");
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
