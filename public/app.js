document.getElementById('fetchWeatherBtn').addEventListener('click', fetchWeather);

async function fetchWeather() {
    const location = document.getElementById('locationInput').value;
    if (!location) {
        displayError('Please enter a location.');
        return;
    }

    try {
        const response = await axios.get(`/weather`, {
            params: { location }
        });
        displayWeather(response.data);
    } catch (error) {
        displayError('Unable to fetch weather data. Please try again.');
    }
}

function displayWeather(data) {
    const weatherHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;
    document.getElementById('weatherDisplay').innerHTML = weatherHTML;
}

function displayError(message) {
    document.getElementById('weatherDisplay').innerHTML = `<p class="error">${message}</p>`;
}

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
