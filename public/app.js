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
    } catch (error) {
        console.error('Error fetching API key:', error);
        alert('An error occurred while fetching the API key.');
    }
};

// Call this function on page load to get the API key
fetchApiKey();

// Using axios for HTTP requests
const axiosInstance = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5/',
});

// Create a weather card
const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
        return `
            <div class="mt-3 d-flex justify-content-between">
                <div>
                    <h3 class="fw-bold">${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <h6 class="my-3 mt-3">Temperature: ${(weatherItem.main.temp * 9/5 + 32).toFixed(2)}°F</h6>
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
            <div class="col mb-3">
                <div class="card border-0 bg-secondary text-white">
                    <div class="card-body p-3 text-white">
                        <h5 class="card-title fw-semibold">(${weatherItem.dt_txt.split(" ")[0]})</h5>
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png" alt="weather icon">
                        <h6 class="card-text my-3 mt-3">Temp: ${(weatherItem.main.temp * 9/5 + 32).toFixed(2)}°F</h6>
                        <h6 class="card-text my-3">Wind: ${weatherItem.wind.speed} M/S</h6>
                        <h6 class="card-text my-3">Humidity: ${weatherItem.main.humidity}%</h6>
                    </div>
                </div>
            </div>`;
    }
};

// Fetch weather details
const getWeatherDetails = async (cityName, lat, lon) => {
    try {
        const response = await axiosInstance.get('forecast', {
            params: { lat, lon, appid: API_KEY }
        });
        const forecastArray = response.data.list;
        const uniqueForecastDays = new Set();

        const fiveDaysForecast = forecastArray.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.has(forecastDate) && uniqueForecastDays.size < 6) {
                uniqueForecastDays.add(forecastDate);
                return true;
            }
            return false;
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        daysForecastDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                daysForecastDiv.insertAdjacentHTML("beforeend", html);
            }
        });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert("An error occurred while fetching the weather forecast!");
    }
};

// Fetch city coordinates
const getCityCoordinates = async () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;

    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    try {
        const response = await axios.get(API_URL);
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

// Example of Recursion
function factorial(n) {
    if (n === 0) {
        return 1;
    }
    return n * factorial(n - 1);
}

console.log('Factorial of 5:', factorial(5));

// Using ES6 Native Array Function
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log('Doubled numbers:', doubled);

// Exception Handling Example
try {
    throw new Error('This is an example error');
} catch (error) {
    console.error('Caught an exception:', error.message);
}
