// Select elements
const searchButton = document.getElementById('search-button');
const cityInput = document.querySelector('.search-input');

// Event listener for search
searchButton.addEventListener('click', async () => {
    const city = cityInput.value.trim(); // Grt the city name
    if (!city) {
        console.log('Please enter a city name.');
        return;
    }

    try {
       // Send a GET request with the city name to the server
       const response = await axios.get('/weather', { params: { city } });

       // Extract and log the city and temperature in the console
       const { city: returnedCity, temperature } = response.data;
       console.log(`City: ${returnedCity}, Temperature: ${temperature}°C`); 
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        alert("Someting went wrong");
    }
});