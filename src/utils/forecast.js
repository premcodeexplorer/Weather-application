const request = require('request')

const forecast = (latitude, longitude, callback) => {
const url = 'http://api.weatherstack.com/current?access_key=e09713ed6d0a4a4e59a2ab679d413475&query=' + latitude + ',' + longitude + '&units=f'

    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, body.current.weather_descriptions[0] + ". It is currently " + body.current.temperature + " degress out.")
        }
    })
}

module.exports = forecast