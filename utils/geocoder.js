const NodeGeocoder = require('node-geocoder');

console.log("process.env.GEO_PROVIDER");

console.log(process.env.GEO_PROVIDER);


var geocoder = NodeGeocoder({
    provider: process.env.GEO_PROVIDER,
    apiKey: process.env.API_KEY
});

module.exports = geocoder;