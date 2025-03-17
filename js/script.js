// script.js
const apiKey = 'DIN_API_NYCKEL_HÄR';

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=sv`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Fel vid hämtning av data:', error);
    }
}

function displayWeather(data) {
    if (data.cod !== 200) {
        document.getElementById('weatherResult').innerText = "Staden hittades inte.";
        return;
    }
    const weatherInfo = `
        ${data.name}: ${data.weather[0].description},
        Temperatur: ${data.main.temp}°C,
        Vind: ${data.wind.speed} m/s
    `;
    document.getElementById('weatherResult').innerText = weatherInfo;
}

function searchWeather() {
    const city = document.getElementById('searchInput').value;
    if (city) getWeather(city);
}

// Funktion för att öppna/stänga hamburgermenyn
function toggleMenu() {
    let sidebar = document.querySelector(".sidebar");
    if (sidebar.style.left === "-250px") {
        sidebar.style.left = "0px";
    } else {
        sidebar.style.left = "-250px";
    }
}
// Lista över 10 extra städer med väderdata
const extraWeatherData = [
    { city: "Sollentuna", temp: -5, icon: "🌙" },
    { city: "Södermalm", temp: -5, icon: "🌙" },
    { city: "Västerås", temp: -6, icon: "🌙" },
    { city: "Örebro", temp: -6, icon: "🌙" },
    { city: "Linköping", temp: -4, icon: "☁️" },
    { city: "Helsingborg", temp: 1, icon: "☁️" },
    { city: "Lund", temp: 0, icon: "⛅" },
    { city: "Jönköping", temp: -3, icon: "☁️" },
    { city: "Gävle", temp: -7, icon: "🌙" },
    { city: "Umeå", temp: -8, icon: "❄️" }
];


// Funktion för att generera tabellrader
function generateWeatherTable() {
    const tableBody = document.getElementById("weather-table-body");

    extraWeatherData.forEach(weather => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${weather.city}</td>
            <td>${weather.temp}°</td>
            <td>${weather.icon}</td> 
        `;

        tableBody.appendChild(row);
    });
}

generateWeatherTable();

