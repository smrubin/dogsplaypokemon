const InputHandler = require('./InputHandler.js');
const express = require('express');
const localTunnel = require('localtunnel');
const app = express();
app.use(express.json());
const port = 3065;

app.post('/', async (req, res) => {
    console.log('Payload: ', JSON.stringify(req.body));

    try {
        const cmd = await InputHandler.getInstance().handle(req.body);
        console.log(`Keypress: ${cmd}`);
        res.status(200).send(cmd);
    } catch (e) {
        console.log(e);
        res.status(400).send(`Bad request: ${req.body}`);
    }
});

app.listen(port, () => {
    console.log(`Launching DogsPlayPokemon on port ${port}...`);
    const tunnel = localTunnel(port, { subdomain: 'dogsplaypokemon '} ,function(err, tunnel) {
        if (err) {}

        // the assigned public url for your tunnel
        // i.e. https://abcdefgjhij.localtunnel.me
        console.log(`Tunnelling on ${tunnel.url}`)
    });

    tunnel.on('close', function() {
        // tunnels are closed
        app.close();
    });
});
