// set up .env
const dotenv = require('dotenv');
dotenv.config();

// prep webserver
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// auth0 Auth for express
const { auth, requiresAuth } = require('express-openid-connect');

if (!process.env.AUTH0_SECRET) {
    throw new Error("To run this app, please set AUTH0 values in .env (see sample_env.sh");
}

app.use(auth({
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASEURL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASEURL,

    // manipulating the flow of the login
    // https://github.com/auth0/express-openid-connect/blob/master/EXAMPLES.md#3-route-customization
    routes: {
        // we will redirect
        login: false,
    }
}));
app.get('/login', (req, res) => {
    return res.oidc.login({
        returnTo: '/profile',
        authorizationParams: {
            redirect_uri: process.env.AUTH0_BASEURL + '/callback',
        }
    });
});

// store auth session data
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.oidc.isAuthenticated();
    res.locals.user = req.oidc.user;
    next();
});



// Load in partials
const Handlebars = require("hbs");
Handlebars.registerPartials(__dirname + "/views/partials/", (error) => {if (error) throw error});
app.set("view engine", "hbs");

// public pages
app.use(express.static(__dirname + "/public"));

// hbs pages
app.use(require("./routes/index.js"));
app.use(requiresAuth(), require("./routes/profile.js"));
app.use(requiresAuth(), require("./routes/challs.js"));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});
