const yargs = require('yargs');
const axios = require('axios');
const argv = yargs.option({
    a: {
        demand: true,
        alias: 'address',
        describe: 'Address to fetch weather for',
        string: true
    }
})
    .help()
    .alias('help', 'h')
    .argv;

var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl)
    .then((response) => {
        if (response.data.status === 'ZERO_RESULTS') {
            throw new Error('Unable to find that address');
        }
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;
        var weatherUrl = `https://api.darksky.net/forecast/205f3302b4482f490652431ae0756887/${lat},${lng}`;
        console.log(response.data.results[0].formatted_address);
        return axios.get(weatherUrl);
    })
    .then((response) => {
        var temperature = ((response.data.currently.temperature -32) / 1.8).toFixed(2);
        var apparentTemperature = ((response.data.currently.apparentTemperature -32) / 1.8).toFixed(2);
        console.log(`It's currently ${temperature} °C. It feel ${apparentTemperature} °C`);

    })
    .catch((err) => {
        if (err.code === 'ENOTFOUND') {
            console.log('Unable to connect to API server');
        }
        else {
            console.log(err.message);
        }
    });
