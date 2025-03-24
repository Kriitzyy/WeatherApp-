const apiKey = '3e4ed98a0b25973bf2c0639d207e74b1';

let isCelsius = true;

/**
 * Hämtar väderdata för en given stad och uppdaterar GUI:t.
 * @async
 * @param {string} city - Namnet på staden att hämta väder för.
 */
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

        getForecast(city);
        updateMap(city);
        getHourlyForecast(data.coord.lat, data.coord.lon);
        getAirQuality(data.coord.lat, data.coord.lon);
    } catch (error) {
        showError("Something went wrong!");
    }
}

/**
 * Hämtar och visar 5-dagars väderprognos för en stad.
 * @async
 * @param {string} city - Namnet på staden att hämta prognos för.
 */
async function getForecast(city) {
    const unit = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        let forecastHTML = "";
        let daysShown = {};
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

/**
 * Uppdaterar kartvyn baserat på staden.
 * @param {string} city - Stadens namn.
 */
function updateMap(city) {
    const mapURL = `https://www.openstreetmap.org/search?query=${city}#map=11/57.7076/11.9670`;
    document.getElementById('map').src = mapURL;
}

/**
 * Visar ett felmeddelande i GUI:t.
 * @param {string} message - Felmeddelande som ska visas.
 */
function showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-message').classList.remove('hidden');
    document.getElementById('weather-container').classList.add('hidden');
}

/**
 * Hämtar väderdata för en specifik stad och uppdaterar en angiven HTML-sektion.
 * @async
 * @param {string} city - Namnet på staden.
 * @param {string} elementId - ID på HTML-elementet där väder ska visas.
 */
async function getCityWeather(city, elementId) {
    const unit = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            const tempUnit = isCelsius ? '°C' : '°F';
            document.querySelector(`#${elementId} .temp`).textContent = `🌡️ ${data.main.temp}${tempUnit}`;
            document.querySelector(`#${elementId} .desc`).textContent = `☁️ ${data.weather[0].description}`;

            if (elementId === "stockholm") {
                getAirQuality(data.coord.lat, data.coord.lon);
            }
        } else {
            document.querySelector(`#${elementId} .temp`).textContent = "Data not available";
        }
    } catch (error) {
        console.error(`Error fetching weather for ${city}:`, error);
    }
}

/**
 * Hämtar luftkvalitetsdata (AQI) och uppdaterar GUI:t.
 * @async
 * @param {number} lat - Latitud.
 * @param {number} lon - Longitud.
 */
async function getAirQuality(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const aqi = data.list[0].main.aqi;
        const desc = ["Good 😊", "Fair 🙂", "Moderate 😐", "Poor 😷", "Very Poor ☠️"];

        document.getElementById('aqi-value').textContent = aqi;
        document.getElementById('aqi-desc').textContent = desc[aqi - 1];
    } catch (error) {
        console.error("Error fetching air quality:", error);
    }
}

/**
 * Hämtar väder för alla större städer när sidan laddas.
 */
document.addEventListener("DOMContentLoaded", () => {
    getCityWeather("Stockholm", "stockholm");
    getCityWeather("Gothenburg", "gothenburg");
    getCityWeather("Malmo", "malmo");
    getCityWeather("Uppsala", "uppsala");
});

/**
 * Hanterar klick på sök-knappen och hämtar väderdata.
 */
document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) getWeather(city);
});

/**
 * Växlar mellan ljust och mörkt tema.
 */
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

/**
 * Visar aktuellt år i sidfoten.
 */
document.getElementById('year').textContent = new Date().getFullYear();

/**
 * Hanterar inskickning av kontaktformuläret.
 * @param {Event} e - Submit-event.
 */
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you! Your message has been sent.');
    this.reset();
});

/**
 * Växlar mellan Celsius och Fahrenheit och uppdaterar alla väderdata.
 */
document.getElementById('unit-toggle').addEventListener('click', () => {
    isCelsius = !isCelsius;
    document.getElementById('unit-toggle').textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';

    const cityText = document.getElementById('city-name').textContent;
    const cityName = cityText.replace('📍', '').split(',')[0].trim();

    if (cityName && cityName !== 'Search by city') {
        getWeather(cityName);
    }

    getCityWeather("Stockholm", "stockholm");
    getCityWeather("Gothenburg", "gothenburg");
    getCityWeather("Malmo", "malmo");
    getCityWeather("Uppsala", "uppsala");
});
