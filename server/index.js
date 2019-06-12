const inputHandler = require('./inputHandler.js');
const express = require('express');
const app = express();
app.use(express.json());
const port = 3065;

app.post('/', async (req, res) => {
    const input = req.body.input;
    console.log('Payload: ', JSON.stringify(req.body));

    try {
        const cmd = await inputHandler.handle(input);
        res.status(200).send(cmd);
    } catch (e) {
        res.status(400).send(`Bad input: ${input}`);
    }
});

app.listen(port, () => console.log(`Launching DogsPlayPokemon on port ${port}...`));
