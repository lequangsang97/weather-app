const request = require('request');

var getWeather = (lat, lng, callback) => {
  request({
    url: `https://api.darksky.net/forecast/205f3302b4482f490652431ae0756887/${lat},${lng}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      callback('Unable to connect to Darksky server');
    } else if (response.statusCode === 400) {
      callback('Unable fetch data from server DarkSky');

    } else if (response.statusCode === 200) {
      callback(undefined, {
        temperature: body.currently.temperature,
        apparentTemperature: body.currently.apparentTemperature
      });
    }
  });
}

module.exports.getWeather = getWeather;