// Search bar functionality

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

// Header Surprise Button functionality
const surpriseButton = document.getElementById('surprise-btn');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('close-popup');
const quoteElement = document.getElementById('quote');

surpriseButton.addEventListener('click', async () => {
    try{
        //Fetch love quote from API
        const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=love', {
            method: 'GET',
            headers: {
                'X-Api-Key': 'TkrD08VqsryRjMedKF4WAg==wfcGfIX7RkusmeUh'
            }
        });

        const data = await response.json();
        const quote = data[0]?.quote || 'Love you, my LIttle Banana!';

        //Display the quote in the popup
        quoteElement.textContent = quote;
        popup.style.display = 'block';
    } catch (error){
        console.error('Error fetching quote:', error);
        popup.style.display = 'none';
    }
});

closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});