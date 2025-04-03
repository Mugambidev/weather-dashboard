const apiKey = "5ff47da2061790f8b741c71ce654627a";
let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateRecentCities();
    if (recentCities.length > 0) {
        document.getElementById('cityInput').value = recentCities[0];
        getWeather();
    }
});

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
}

function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) {
        showError("Please enter a city name!");
        return;
    }

    showLoading();
    hideError();
    hideWeather();

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found. Please try another location.");
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            addToRecentCities(city);
        })
        .catch(error => {
            showError(error.message);
        })
        .finally(() => {
            hideLoading();
        });
}

function displayWeather(data) {
    const weatherResult = document.getElementById("weatherResult");
    const { name } = data;
    const { temp, feels_like, humidity, pressure } = data.main;
    const { speed, deg } = data.wind;
    const { description, icon } = data.weather[0];
    const { country } = data.sys;
    
    // Get weather icon class based on OpenWeatherMap icon code
    const iconClass = getWeatherIconClass(icon);
    
    weatherResult.innerHTML = `
        <h2><i class="fas ${iconClass} weather-icon"></i> ${name}, ${country}</h2>
        <p><strong>Temperature:</strong> ${temp}°C (Feels like ${feels_like}°C)</p>
        <p><strong>Weather:</strong> ${description}</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Pressure:</strong> ${pressure} hPa</p>
        <p><strong>Wind:</strong> ${speed} m/s, ${getWindDirection(deg)}</p>
    `;
    showWeather();
}

function getWeatherIconClass(iconCode) {
    const iconMap = {
        '01d': 'fa-sun',          // clear sky (day)
        '01n': 'fa-moon',         // clear sky (night)
        '02d': 'fa-cloud-sun',    // few clouds (day)
        '02n': 'fa-cloud-moon',   // few clouds (night)
        '03d': 'fa-cloud',        // scattered clouds
        '03n': 'fa-cloud',
        '04d': 'fa-cloud',        // broken clouds
        '04n': 'fa-cloud',
        '09d': 'fa-cloud-rain',   // shower rain
        '09n': 'fa-cloud-rain',
        '10d': 'fa-cloud-sun-rain', // rain (day)
        '10n': 'fa-cloud-moon-rain',// rain (night)
        '11d': 'fa-bolt',         // thunderstorm
        '11n': 'fa-bolt',
        '13d': 'fa-snowflake',    // snow
        '13n': 'fa-snowflake',
        '50d': 'fa-smog',         // mist
        '50n': 'fa-smog'
    };
    return iconMap[iconCode] || 'fa-cloud';
}

function getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round((degrees % 360) / 45) % 8;
    return directions[index];
}

function addToRecentCities(city) {
    // Remove if already exists
    recentCities = recentCities.filter(c => c.toLowerCase() !== city.toLowerCase());
    // Add to beginning
    recentCities.unshift(city);
    // Keep only last 5 cities
    recentCities = recentCities.slice(0, 5);
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
    updateRecentCities();
}

function updateRecentCities() {
    const recentCitiesContainer = document.getElementById('recentCities');
    recentCitiesContainer.innerHTML = recentCities.map(city => 
        `<span class="recent-city" onclick="searchRecentCity('${city}')">${city}</span>`
    ).join('');
}

function searchRecentCity(city) {
    document.getElementById('cityInput').value = city;
    getWeather();
}

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showWeather() {
    document.getElementById('weatherResult').style.display = 'block';
}

function hideWeather() {
    document.getElementById('weatherResult').style.display = 'none';
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}