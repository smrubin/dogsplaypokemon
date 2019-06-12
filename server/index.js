const keyHandler = require('./keyHandler.js');
const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

app.post('/', (req, res) => {
    const validInputs = ['w', 's', 'a', 'd', 'z', 'x', 'n', 'm', 'l', 'r'];
    const cmd = req.body.input;
    console.log('Executing keypress: ', cmd);
    keyHandler.sendKey(cmd);
    res.send(cmd);
});

app.listen(port, () => console.log(`Launching DogsPlayPokemon on port ${port}...`));
