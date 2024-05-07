const NodeGeocoder = require('node-geocoder');


var geocoder = NodeGeocoder({
    provider: process.env.GEO_PROVIDER,
    apiKey: process.env.API_KEY
});

module.exports = geocoder;