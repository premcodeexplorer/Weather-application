const request = require('request')

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(address)}&access_token=${process.env.MAPBOX_API_KEY}&limit=1`

    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            console.error('Location service connection error:', error);
            callback('Unable to connect to location services!', undefined)
        } else if (!body.features || body.features.length === 0) {
            console.error('Location not found for address:', address);
            callback('Unable to find location. Try another search.', undefined)
        } else {
            const feature = body.features[0];
            callback(undefined, {
                latitude: feature.geometry.coordinates[1],
                longitude: feature.geometry.coordinates[0],
                location: feature.properties.name
            })
        }
    })
}

module.exports = geocode
