// Get DOM elements
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const daysForecastDiv = document.querySelector(".days-forecast");

let API_KEY = '';

// Fetch the API key from the server
const fetchApiKey = async () => {
    try {
        const response = await axios.get('/config');
        API_KEY = response.data.apiKey;
        console.log('API_KEY fetched:', API_KEY);
    } catch (error) {
        console.error('Error fetching API key:', error);
        alert('An error occurred while fetching the API key.');
    }
};

// Call this function on page load to get the API key
fetchApiKey();

// One of the requirements
// Used axios, a third-party Node.js library for HTTP requests,
// to handle asyncrhonous operations and to make API calls 
const axiosInstance = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5/',
});

// Create a weather card
const createWeatherCard = (cityName, weatherItem, index) => {
    // Convert temperature from Kelvin to Fahrenheit
    const tempFahrenheit = ((weatherItem.main.temp - 273.15) * 9/5 + 32).toFixed(2);
    
    if (index === 0) {
        return `
            <div class="mt-3 d-flex justify-content-between">
                <div>
                    <h3 class="fw-bold">${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <h6 class="my-3 mt-3">Temperature: ${tempFahrenheit}°F</h6>
                    <h6 class="my-3">Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6 class="my-3">Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="text-center me-lg-5">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>
            </div>`;
    } else {
        return `
            <div class="weather-card">
                <div class="card-body">
                    <h5 class="card-title fw-semibold">(${weatherItem.dt_txt.split(" ")[0]})</h5>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png" alt="weather icon">
                    <h6 class="card-text my-3 mt-3">Temp: ${tempFahrenheit}°F</h6>
                    <h6 class="card-text my-3">Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6 class="card-text my-3">Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
            </div>`;
    }
};


// Fetch weather details with recursion and ES6 array functions
const getWeatherDetails = async (cityName, lat, lon) => {
    try {
        const response = await axiosInstance.get('forecast', {
            params: { lat, lon, appid: API_KEY }
        });
        console.log('Weather data fetched:', response.data);
        const forecastArray = response.data.list;
        const uniqueForecastDays = new Set();

        // Second requirement-  Native Array ES6 function
        //Filter to get a unique forecast for five days
        const fiveDaysForecast = forecastArray.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.has(forecastDate) && uniqueForecastDays.size < 5) {
                uniqueForecastDays.add(forecastDate);
                return true;
            }
            return false;
        });

        // Clear previous results
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        daysForecastDiv.innerHTML = "";

        // Third requirement
        //Recursive function to process and display weather data
        const processForecast = (index) => {
            if (index >= fiveDaysForecast.length) return; // Base case

            const weatherItem = fiveDaysForecast[index];
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                daysForecastDiv.insertAdjacentHTML("beforeend", html);
            }

            processForecast(index + 1); // Recursive call
        };

        // Start processing the forecast data
        processForecast(0);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert("An error occurred while fetching the weather forecast!");
    }
};

// Fetch city coordinates
const getCityCoordinates = async () => {
    const cityName = cityInput.value.trim();
    console.log('City entered:', cityName);
    if (cityName === "") return;



    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    try {
        const response = await axios.get(API_URL);
        console.log('Coordinates fetched:', response.data);
        if (!response.data.length) return alert(`No coordinates found for ${cityName}`);
        
        const { lat, lon, name } = response.data[0];
        getWeatherDetails(name, lat, lon);
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        alert("An error occurred while fetching the coordinates!");
    }
};

// Attach event listener to search button
searchButton.addEventListener("click", getCityCoordinates);



// One of the additional requirements
//Exception Handling Example
try {
    throw new Error('This is an example error');
} catch (error) {
    console.error('Caught an exception:', error.message);
}