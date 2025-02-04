const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files from he "public" folder
app.use(express.static('public'));

// Define routes
app.get('/', (req,res) => {
    res.render('index');
});

// Weather route
app.get('/weather', async (req, res) => {
    const { city } = req.query.city;
    const apiKey = process.env.API_KEY;

    try{
        // Get latitude and longitide for the city
        const geocodeUrl = `https://api.openCagedata.com/geocode/v1/json`;
        const geocodeResponse = await axios.get(geocodeUrl, {
            params: {
                q:city,
                key:apiKey,
                limit:1,
            },
        });

        if (geocodeResponse.data.results.length === 0) {
            return res.status(404).send('City not found');
        }

        const { lat, lng } = geocodeResponse.data.results[0].geometry;

        // Fetch weather data based on coordinates
        const weatherUrl = 'https://api.open-meteo.com/v1/forecast';
        const weatherResponse = await axios.get(weatherUrl, {
            params: {
                latitude: lat,
                longitude: lng,
                current_weather: true,
            },
        });

        const temperature = weatherResponse.data.current_weather.temperature;
        res.json({ city, temperature });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});