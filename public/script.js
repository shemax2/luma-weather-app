// Search bar functionality

// Select elements
const searchButton = document.getElementById('search-button');
const cityInput = document.querySelector('.search-input');

// Event listener for search
searchButton.addEventListener('click', async () => {
    const city = cityInput.value.trim(); // Grt the city name
    const weatherTitle = document.querySelector('.city');
    const highTemperatureValue = document.querySelector('.high-temperature .temperature-value');
    const lowTemperatureValue = document.querySelector('.low-temperature .temperature-value');
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
       weatherTitle.innerHTML = returnedCity;
       highTemperatureValue.innerHTML = response.data.highTemperature;
       lowTemperatureValue.innerHTML = response.data.lowTemperature;
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        alert("Someting went wrong");
    }
});

// Get elements for Surprise Me button and popup
const surpriseButton = document.getElementById('surprise-btn');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('close-popup');
const quoteElement = document.getElementById('quote');

surpriseButton.addEventListener('click', async () => {
    try{
        //Fetch love letter from server.js '/surprise' route
        const response = await fetch('/surprise');

        if (!response.ok) {
            throw new Error('Failed to fetch love letter');
        }

        const data = await response.json();
        const loveLetter = data.loveLetter || 'Love you, my Little Banana!';

        //Display the quote in the popup
        quoteElement.textContent = loveLetter;
        popup.style.display = 'block';
    } catch (error){
        console.error('Error fetching love letter:', error);
        popup.style.display = 'none';
    }
});

closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});
