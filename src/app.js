const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// Initialize Express app
const app = express();

// Setup paths
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// Routes
app.get('', (req, res) => {
  try {
    res.render('index', {
      title: 'Weather',
      name: 'Prem Baba'
    });
  } catch (error) {
    console.error('Error rendering index:', error);
    res.status(500).send('An error occurred');
  }
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
  if (!req.query.address) {
    return res.status(400).send({ error: 'You must provide an address!' });
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.status(400).send({ error });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
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
    return res.status(400).send({ error: 'You must provide a search term' });
  }

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

// For local development
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
  });
}

module.exports = app;
