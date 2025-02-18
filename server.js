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
    const { city, lat, lon } = req.query;
    const apiKey = process.env.API_KEY;

    try{
        let latitude, longitude;
        let cityName = city;
        if (city) {
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

            const { lat: fetchedLat, lng: fetchedLon } = geocodeResponse.data.results[0].geometry;
            latitude = fetchedLat;
            longitude = fetchedLon;
        } else if (lat && lon) {
            latitude = lat;
            longitude = lon;
            // Perform reverse geocoding to get the city name based on coordinates
            const reverseGeocodeUrl = `https://api.opencagedata.com/geocode/v1/json`;
            const reverseResponse = await axios.get(reverseGeocodeUrl, {
                params: {
                    q: `${lat},${lon}`,
                    key: apiKey,
                    limit: 1,
                },
            });

            if (reverseResponse.data.results.length > 0) {
                const components = reverseResponse.data.results[0].components;
                //city, town, or village 
                cityName = components.city || components.town || components.village || "Unknown Location";
            } else {
                cityName = "Unknown Location";
            }
        } else {
            return res.status(400).json({ message: "City or coordinates are required" });
        }
        
        // Fetch weather data based on coordinates
        const weatherUrl = 'https://api.open-meteo.com/v1/forecast';
        const weatherResponse = await axios.get(weatherUrl, {
            params: {
                latitude,
                longitude,
                current_weather: true,
                daily: 'temperature_2m_min',
                hourly: 'relativehumidity_2m,surface_pressure,visibility',
                timezone: 'auto',
            },
        });

        // Extract high temperature as the current temperature
        const currentWeather = weatherResponse.data.current_weather;
        const highTemperature = Math.round(currentWeather.temperature);
        const weatherCode = currentWeather.weathercode;

        // Extract low temperature as daily low from the daily data array
        const daily = weatherResponse.data.daily;
        const lowTemperature = Math.round(daily.temperature_2m_min[0]);

        // Extract hourly data for humidity, pressure, and visibility
        const hourly = weatherResponse.data.hourly;
        const hourlyIndex = hourly.time.findIndex(time => time === currentTime);

        const relativeHumidity = hourlyIndex !== -1 ? Math.round(hourly.relativehumidity_2m[hourlyIndex]) : null;
        const surfacePressure = hourlyIndex !== -1 ? Math.round(hourly.surface_pressure[hourlyIndex]) : null;
        const visibility = hourlyIndex !== -1 ? Math.round(hourly.visibility[hourlyIndex]) : null;


         // Map the weather code to a text condition (example mapping)
         let condition = '';
         if (weatherCode === 0) {
             condition = 'Clear sky';
         } else if (weatherCode >= 1 && weatherCode <= 3) {
             condition = 'Partly cloudy';
         } else if (weatherCode >= 45 && weatherCode <= 48) {
             condition = 'Fog';
         } else if ((weatherCode >= 51 && weatherCode <= 57) || (weatherCode >= 61 && weatherCode <= 67)) {
             condition = 'Rain';
         } else if (weatherCode >= 71 && weatherCode <= 77) {
             condition = 'Snow';
         } else if (weatherCode >= 80 && weatherCode <= 82) {
             condition = 'Rain showers';
         } else if (weatherCode >= 95) {
             condition = 'Thunderstorm';
         } else {
             condition = 'Unknown';
         }
         
        res.json({ 
            city: cityName, 
            highTemperature, 
            lowTemperature, 
            condition, 
            relativeHumidity, 
            surfacePressure, 
            visibility 
});
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