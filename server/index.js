const InputHandler = require('./InputHandler.js').InputHandler;
const express = require('express');
const localTunnel = require('localtunnel');
const app = express();
app.use(express.json());
const port = 3065;

app.post('/', async (req, res) => {
    const input = req.body.input;
    console.log('Payload: ', JSON.stringify(req.body));

    try {
        const cmd = await InputHandler.handle(input);
        console.log(`Keypress: ${cmd}`);
        res.status(200).send(cmd);
    } catch (e) {
        console.log(e);
        res.status(400).send(`Bad input: ${input}`);
    }
});

app.listen(port, () => { 
    console.log(`Launching DogsPlayPokemon on port ${port}...`);
    var tunnel = localTunnel(port, { subdomain: 'dogsplaypokemon '} ,function(err, tunnel) {
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
