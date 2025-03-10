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
