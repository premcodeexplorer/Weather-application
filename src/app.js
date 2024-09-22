const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const weatherstackAPIKey = process.env.WEATHERSTACK_API_KEY;

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Prem Baba'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Prem Baba'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Prem Baba'
    });
});

app.get('/weather', (req, res) => {
    console.log('Received request:', req.query);

    if (!req.query.address) {
        console.error('Error: No address provided');
        return res.status(400).send({ error: 'You must provide an address!' });
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            console.error('Geocode error:', error);
            return res.status(400).send({ error });
        }

        console.log('Geocoding successful:', { latitude, longitude, location });

        forecast(latitude, longitude, weatherstackAPIKey, (error, forecastData) => {
            if (error) {
                console.error('Forecast error:', error);
                return res.status(400).send({ error });
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            });
        });
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }

    console.log(req.query.search);
    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Prem Baba',
        errorMessage: 'Help article not found.'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Prem Baba',
        errorMessage: 'Page not found.'
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});
module.exports = app;
