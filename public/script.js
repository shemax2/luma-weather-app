// Search bar functionality

// Weather elements
const searchButton = document.getElementById('search-button');
const cityInput = document.querySelector('.search-input');
const weatherTitle = document.querySelector('.city');

const highTemperatureValue = document.querySelector('.high-temperature .temperature-value');
const lowTemperatureValue = document.querySelector('.low-temperature .temperature-value');
const weatherDescription = document.querySelector('.weather-description');

const pressureValue = document.querySelector('.pressure .title-value .pressure-value');
const visibilityValue = document.querySelector('.visibility .title-value .visibility-value');
const humidityValue = document.querySelector('.humidity .title-value .humidity-value');

// AQI elements
const aqiPolutantElement = document.querySelector('.aqi-pollutant');
const aqiValueElement = document.querySelector('.aqi-value');
const progressFillElement = document.querySelector('.progress-fill');

// #region - Reusable function to update the DOM with weather data
const updateWeatherUI = (data) => {
    weatherTitle.innerHTML = data.city;
    highTemperatureValue.innerHTML = data.highTemperature;
    lowTemperatureValue.innerHTML = data.lowTemperature;
    weatherDescription.textContent = data.condition;

    updateWeatherIcon(data.condition);
    updateWeatherBackground(data.condition);

    // Update Weather Data
    if(pressureValue) pressureValue.textContent = data.surfacePressure !== null ? data.surfacePressure : 'N/A';
    if(visibilityValue) visibilityValue.textContent = data.visibility !== null ? data.visibility : 'N/A';
    if(humidityValue) humidityValue.textContent = data.relativeHumidity !== null ? data.relativeHumidity : 'N/A';

    // Update AQI data
    if(aqiPolutantElement) aqiPolutantElement.textContent = data.mainPollutant;
    if(aqiValueElement) aqiValueElement.textContent = data.aqi;

    // Map AQI index (1-5) to a progress bar width
    if(progressFillElement) {
        const aqiPercentage = data.aqi * 20;
        progressFillElement.style.width = `${aqiPercentage}%`;
    }
};
// #endregion

// #region - Reusable function to fetch weather and AQI using a query string.
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
// #endregion

// #region - Function to get user location and fetch weather
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
// #endregion

// #region -  Event listener for search
const handleSearch = async () => {
    const city = cityInput.value.trim(); // Grt the city name
    if (!city) {
        console.log('Please enter a city name.');
        return;
    }
    fetchWeather(`city=${city}`);
};

searchButton.addEventListener('click', handleSearch);
// #endregion

// On page load, try to get user location and fetch weather accordingly.
document.addEventListener('DOMContentLoaded', getUserLocationAndFetchWeather);

// #region - Function that maps condition to material Symbols icon names
const  updateWeatherIcon = (condition) => {
    const iconElement = document.querySelector('#weather-icon i');
    let iconName = '';

    const cond = condition.toLowerCase();

    if (cond.includes('clear')) {
        iconName = 'sunny';
    } else if (cond.includes('cloud')) {
        iconName = 'cloud';
    } else if (cond.includes('rain')) {
        iconName = 'rainy';
    } else if (cond.includes('thunder')) {
        iconName = 'bolt';
    } else if (cond.includes('snow')) {
        iconName = 'ac_unit';
    } else if (cond.includes('fog') || cond.includes('mist')) {
        iconName = 'foggy';
    } else {
        iconName = 'thermostat';
    }

    iconElement.textContent = iconName;
};
// #endregion

// #region - Function to update the background image based on the weather condition
const updateWeatherBackground = (condition) => {
    const weatherImg = document.querySelector('.weather-img');
    let imageUrl = '';

    const cond = condition.toLowerCase();

    if(cond.includes('clear')) {
        imageUrl = '/images/clear.jpg';
    } else if (cond.includes('cloud')) {
        imageUrl = '/images/cloud.jpg';
    } else if (cond.includes('rain')) {
        imageUrl = '/images/rain.jpg';
    } else if (cond.includes('thunder')) {
        imageUrl = '/images/rain.jpg';
    } else if (cond.includes('snow')) {
        imageUrl = '/images/snow.jpg';
    } else if (cond.includes('fog') || cond.includes('mist')) {
        imageUrl = '/images/fog.jpg';
    } else {
        imageUrl = '/images/clear.jpg';
    }

    weatherImg.src = imageUrl;
};
// #endregion

// #region - Surprise Me (love letter) functionality button and popup
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
// #endregion