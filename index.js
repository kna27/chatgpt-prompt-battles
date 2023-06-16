const express = require('express');

const app = express();
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
