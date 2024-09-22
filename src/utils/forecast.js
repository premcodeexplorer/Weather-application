const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_API_KEY}&query=${latitude},${longitude}&units=f`

    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            console.error('Weather service connection error:', error);
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            console.error('Weather service error:', body.error);
            callback('Unable to find location', undefined)
        } else if (!body.current) {
            console.error('Unexpected weather service response:', body);
            callback('Unexpected response from weather service', undefined)
        } else {
            const weatherDescription = body.current.weather_descriptions[0] || 'No description available';
            const temperature = body.current.temperature;
            callback(undefined, `${weatherDescription}. It is currently ${temperature} degrees out.`)
        }
    })
}

module.exports = forecast
