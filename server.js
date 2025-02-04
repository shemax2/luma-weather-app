const express = require('express');
const axios = require('axios');
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
    const city = req.query.city;

    if (!city){
        return res.status(400).json({ error: 'City name is required'});
    }

    try{
        // Get geolocation for the city
        const geoResponse = await axios.get(`https://geocode.xyz/${city}?json=1`);
        const { latt, longt} = geoResponse.data;

        // Get weather data
        const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latt}&longitude=${longt}&current_weather=true`);
        const temperature = weatherResponse.data.current_weather.temperature;

        res.json({ city, temperature });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error:'Failed to fetch weather data' });
    }
});

module.exports = app;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});