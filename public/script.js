// Search bar functionality

// Select elements
const searchButton = document.getElementById('search-button');
const cityInput = document.querySelector('.search-input');
const weatherTitle = document.querySelector('.city');
const highTemperatureValue = document.querySelector('.high-temperature .temperature-value');
const lowTemperatureValue = document.querySelector('.low-temperature .temperature-value');
const weatherDescription = document.querySelector('.weather-description');


//Reusable function to update the DOM with weather data
const updateWeatherUI = (data) => {
    weatherTitle.innerHTML = data.city;
       highTemperatureValue.innerHTML = data.highTemperature;
       lowTemperatureValue.innerHTML = data.lowTemperature;
       weatherDescription.textContent = data.condition;

};

//Reusable function to fetch weather using a query string.
const fetchWeather = async (query) => {
    try {
        const response = await axios.get(`/weather?${query}`);
        updateWeatherUI(response.data);
        console.log(`City: ${response.data.city}`);
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        alert("Something went wrong");
    }
};

// Function to get user location and fetch weather
const getUserLocationAndFetchWeather = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude,longitude } = position.coords;
            fetchWeather(`lat=${latitude}&lon=${longitude}`);
        }, (error) => {
            console.error('Error getting location:', error);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
};

// Event listener for search
const handleSearch = async () => {
    const city = cityInput.value.trim(); // Grt the city name
    if (!city) {
        console.log('Please enter a city name.');
        return;
    }
    fetchWeather(`city=${city}`);
};

searchButton.addEventListener('click', handleSearch);

// On page load, try to get user location and fetch weather accordingly.
document.addEventListener('DOMContentLoaded', getUserLocationAndFetchWeather);


// Surprise Me (love letter) functionality button and popup
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
