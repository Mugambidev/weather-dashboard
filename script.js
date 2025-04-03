const apiKey = "5ff47da2061790f8b741c71ce654627a";

function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            document.getElementById("weatherResult").innerHTML = `<p>${error.message}</p>`;
        });
}

function displayWeather(data) {
    const weatherResult = document.getElementById("weatherResult");
    const { name } = data;
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const { description } = data.weather[0];

    weatherResult.innerHTML = `
        <h2>${name}</h2>
        <p>Temperature: ${temp}°C</p>
        <p>Weather: ${description}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${speed} m/s</p>
    `;
}