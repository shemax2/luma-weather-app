const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const port = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
    res.render("index");
});

// Weather route
app.get("/weather", async (req, res) => {
    const { lat, lon, city } = req.query;
    let url;
    let cityName = city;

    if (lat && lon) {
        // Use coordinates if provided
        url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weathercode&timezone=auto`;

        // Use OpenCage Geocoding API to fetch city name
        const apiKey = process.env.API_KEY;
        const reverseGeoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;
        try {
            const reverseGeoResponse = await axios.get(reverseGeoUrl);
            if (reverseGeoResponse.data.results && reverseGeoResponse.data.results.length > 0) {
                const components = reverseGeoResponse.data.results[0].components;
                cityName = components.city || components.town || components.village || `Location (${parseFloat(lat).toFixed(2)}, ${parseFloat(lon).toFixed(2)})`;
            } else {
                cityName = `Location (${parseFloat(lat).toFixed(2)}, ${parseFloat(lon).toFixed(2)})`;
            }
        } catch (error) {
            console.error("Reverse Geocoding API error:", error);
            cityName = `Location (${parseFloat(lat).toFixed(2)}, ${parseFloat(lon).toFixed(2)})`;
        }
    } else if (city) {
        // Use Geocoding API to fetch latitude and longitude for the city
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
        try {
            const geoResponse = await axios.get(geoUrl);
            const location = geoResponse.data.results[0];
            if (!location) {
                return res.json({ success: false, message: "City not found." });
            }
            url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&hourly=temperature_2m,precipitation_probability,weathercode&timezone=auto`;
        } catch (error) {
            console.error("Geocoding API error:", error);
            return res.json({ success: false, message: "Error fetching location data." });
        }
    } else {
        return res.render("error", { message: "Invalid request: Location data is missing." });
    }

    try {
        const response = await axios.get(url);
        const data = response.data;

        const weather = {
            city: cityName,
            temperature: data.hourly.temperature_2m[0],
            precipitation: data.hourly.precipitation_probability[0],
            weatherCode: data.hourly.weathercode[0]
        };

        res.json({ success: true, weather });
    } catch (error) {
        console.error("Weather API error:", error);
        res.json({ success: false, message: "Failed to fetch weather data." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});