const express = require('express');
const app = express();
const port = 3000;

app.post('/', (req, res) => {

    const inputs = ['up', 'down', 'left', 'right', 'a', 'b', 'start', 'select'];

    // just return a random element for now
    const cmd = inputs[Math.floor(Math.random() * inputs.length)];
    res.send(cmd);
});

app.listen(port, () => console.log(`Launching DogsPlayPokemon on port ${port}...`));
