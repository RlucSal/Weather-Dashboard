const cityInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const currentWeatherDiv = document.querySelector("#today");
const daysForecastDiv = document.querySelector("#cards");
const historyList = document.querySelector("#history");
const API_KEY = "6b63f3a74904f2af5e40abf686e2d416";
document.addEventListener("DOMContentLoaded", function () {
    searchButton.addEventListener("click", function (event) {
        event.preventDefault();
        const cityI = cityInput.value;

        // Check if the city value is not empty
        if (!cityI) {
            console.error("City input is empty");
        } else {
            // Make the API call
            makeApiCall(cityI);

            // Clear the input value
            cityInput.value = "";
        }
    });
});
function makeApiCall(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&mode=json&appid=${API_KEY}`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Process the data as needed
            updateWeatherInfo(data);
            addToHistory(city);
            console.log(data);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}
function updateWeatherInfo(data) {
    const todaySection = document.querySelector("#today");
    const cardsContainer = document.querySelector("#cards");
    // Clear previous content
    todaySection.innerHTML = "";
    cardsContainer.innerHTML = "";
    if (data.list && data.list.length > 0) {
        const cityName = data.city.name;
        const todayWeather = data.list[0];
        // Update current weather section
        const todayHtml = createWeatherCard(cityName, todayWeather, true);
        todaySection.innerHTML = todayHtml;
        // Update the 5-day forecast
        const forecastData = data.list.filter((entry, index) => (index + 1) % 8 === 0).slice(0, 5);
        forecastData.forEach((forecast, index) => {
            const html = createWeatherCard(cityName, forecast, false);
            cardsContainer.insertAdjacentHTML("beforeend", html);
        });
    } else {
        console.error('No forecast data available');
    }
}
function createWeatherCard(cityName, weatherItem, isToday) {
    const temperatureCelsius = (weatherItem.main.temp - 273.15).toFixed(2);
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const formattedDate = new Date(weatherItem.dt * 1000).toLocaleDateString('en-US', dateOptions);
    if (isToday) {
        return `
            <h3 class="fw-bold">${cityName} (${formattedDate})</h3>
            <h6 class="my-3 mt-3">Temperature: ${temperatureCelsius} °C</h6>
            <h6 class="my-3">Wind: ${weatherItem.wind.speed} M/S</h6>
            <h6 class="my-3">Humidity: ${weatherItem.main.humidity}%</h6>
        `;
    } else {
        console.log(formattedDate);
        console.log(weatherItem);
        console.log(weatherItem.dt * 1000);
        return `
            <div class="col mb-3">
                <div class="card border-0 bg-secondary text-white">
                    <div class="card-body p-3 text-white">
                        <h5 class="card-title fw-semibold">${formattedDate}</h5>
                        
                        <h6 class="card-text my-3 mt-3">Temp: ${temperatureCelsius} °C</h6>
                        <h6 class="card-text my-3">Wind: ${weatherItem.wind.speed} M/S</h6>
                        <h6 class="card-text my-3">Humidity: ${weatherItem.main.humidity}%</h6>
                    </div>
                </div>
            </div>
        `;
    }
}
function addToHistory(city) {
    // Create a new list item for the history list
    const listItem = document.createElement("li");
    listItem.textContent = city;
    historyList.appendChild(listItem);
}
