const express = require("express");
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));

// TEMP
app.use(require("./routes/index.js"));
app.use(require("./routes/play.js"));
app.use(require("./routes/profile.js"));
app.use(require("./routes/viewchalls.js"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});
