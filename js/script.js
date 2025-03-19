const apiKey = '3e4ed98a0b25973bf2c0639d207e74b1';

async function getWeather(city) {
    const unit = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            showError("City not found!");
            return;
        }

        const tempUnit = isCelsius ? '°C' : '°F';
        document.getElementById('city-name').textContent = `📍 ${data.name}, ${data.sys.country}`;
        document.getElementById('temperature').textContent = `🌡️ ${data.main.temp}${tempUnit}`;
        document.getElementById('description').textContent = `☁️ ${data.weather[0].description}`;
        document.getElementById('humidity').textContent = `💧 Humidity: ${data.main.humidity}%`;
        document.getElementById('wind-speed').textContent = `🌬️ Wind Speed: ${data.wind.speed} ${isCelsius ? 'm/s' : 'mph'}`;
        document.getElementById('pressure').textContent = `🌡️ Pressure: ${data.main.pressure} hPa`;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

        document.getElementById('weather-container').classList.remove('hidden');
        document.getElementById('error-message').classList.add('hidden');

        getForecast(city); // Keep same, we can adapt if needed
        updateMap(city);
        getHourlyForecast(data.coord.lat, data.coord.lon);
        getAirQuality(data.coord.lat, data.coord.lon);

    } catch (error) {
        showError("Something went wrong!");
    }
}

async function getForecast(city) {
    const unit = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        let forecastHTML = "";
        let daysShown = {}; // Track days to avoid duplicates
        const tempUnit = isCelsius ? '°C' : '°F';

        for (let i = 0; i < data.list.length; i += 8) {
            const day = data.list[i];
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

            if (!daysShown[dayName]) {
                daysShown[dayName] = true;
                forecastHTML += `
                    <div class="forecast-item">
                        <p><strong>${dayName}</strong></p>
                        <p>🌡️ ${day.main.temp}${tempUnit}</p>
                        <p>☁️ ${day.weather[0].description}</p>
                        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                    </div>
                `;
            }
        }

        document.getElementById('forecast-container').innerHTML = forecastHTML;
        document.getElementById('forecast').classList.remove('hidden');
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}


function updateMap(city) {
    const mapURL = `https://www.openstreetmap.org/search?query=${city}#map=11/57.7076/11.9670`;
    document.getElementById('map').src = mapURL;
}

function showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-message').classList.remove('hidden');
    document.getElementById('weather-container').classList.add('hidden');
}

// Search button event
document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) getWeather(city);
});

// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// DOM loaded - fetch weather for top cities
document.addEventListener("DOMContentLoaded", () => {
    getCityWeather("Stockholm", "stockholm");
    getCityWeather("Gothenburg", "gothenburg");
    getCityWeather("Malmo", "malmo");
    getCityWeather("Uppsala", "uppsala");
});

// Footer year update
document.getElementById('year').textContent = new Date().getFullYear();

// Contact form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you! Your message has been sent.');
    this.reset();
});

// Fahrenheit/Celsius switch
let isCelsius = true;

document.getElementById('unit-toggle').addEventListener('click', () => {
    isCelsius = !isCelsius;
    document.getElementById('unit-toggle').textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';

    // Refresh main city weather
    const cityText = document.getElementById('city-name').textContent;
    const cityName = cityText.replace('📍', '').split(',')[0].trim();

    if (cityName && cityName !== 'Search by city') {
        getWeather(cityName);
    }

    // Refresh Top Cities
    getCityWeather("Stockholm", "stockholm");
    getCityWeather("Gothenburg", "gothenburg");
    getCityWeather("Malmo", "malmo");
    getCityWeather("Uppsala", "uppsala");
});
