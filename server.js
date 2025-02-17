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
    const { city } = req.query;
    const apiKey = process.env.API_KEY;

    try{
        // Get latitude and longitide for the city
        const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json`;
        const geocodeResponse = await axios.get(geocodeUrl, {
            params: {
                q: city,
                key: apiKey,
                limit: 1,
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
                hourly: 'temperature_2m',
                timezone: 'auto',
            },
        });

        const temperatures = weatherResponse.data.hourly.temperature_2m;
        const highTemperature = Math.round(Math.max(...temperatures));
        const lowTemperature = Math.round(Math.min(...temperatures));
        res.json({ city, highTemperature, lowTemperature });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


// Endpoint for generating love letters using Cohere REST API
app.get('/surprise', async (req,res) => {
    try{
        const response = await axios.post('https://api.cohere.ai/v1/generate',
            {
            model: 'command',
            prompt: 'Write a complete, concise, and heartfelt love letter in exactly 100 words no more. Do not use placeholders or suggest that the text is editable. Address the letter to "My little Princess" or "My sweet Beans" and focus on expressing deep affection, admiration, and gratitude. Avoid addressing the reader directly as if the letter requires further input or response avoid anyhow message addressing the prompter treat the letter as ready to go as in copy paste ready without editing also dont add anything to edit its not a template but ready to go please avoid placeholders like [your name], [name] or any form of placeholder, also keep in mind that the two lovers are in a distance relationship not writing as if they live together you get the idea but dont focus on the distance as the message just a heads up rather keep it sweet it but avoid mentioning distance just focus on keeping it sweet and ready to go without any form of editing,also avoid that the message itself surpaases 100 words. Thank You.',
            max_tokens: 105,
            temperature: 0.7,
        },
    {
        headers: {
            Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        },
    }
    );

        const loveLetter = response.data.generations[0].text.trim();
        res.json({ loveLetter });
    } catch (error) {
        console.error('Error fetching love letter:', error.response?.data || error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});