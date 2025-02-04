// Select elements
const searchButton = document.getElementById('search-button');
const cityInput = document.querySelector('.search-input');

// Event listener for search
searchButton.addEventListener('click', async () => {
    const cityName = cityInput.value.trim(); // Grt the city name
    if (!cityName) {
        console.log('Please enter a city name.');
        return;
    }

    try {
        // Fetch weather data from the server
        const response = await fetch(`/weather?city=${cityName}`);
        const data = await response.json();

        //Log the city and temperature
        console.log(`City: ${data.city}`);
        console.log(`Temperature: ${data.temperature}`);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
});