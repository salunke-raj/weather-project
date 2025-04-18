let searchBtn = document.getElementById("searchBtn");
let cityInput = document.getElementById("cityInput");
let weatherBox = document.getElementById("weatherBox");
let forecastBox = document.getElementById("forecastBox");
let errorMsg = document.getElementById("errorMsg");
let recentCities = document.getElementById("recentCities");

let apiKey = "d75ae50ad8e344758e061429251804";

searchBtn.addEventListener("click", () => {
  let cityName = cityInput.value.trim();
  if (cityName === "") {
    errorMsg.innerText = "Please enter a city name.";
    errorMsg.classList.remove("hidden");
    return;
  }

  getWeather(cityName);
  addToRecent(cityName);
});

recentCities.addEventListener("change", () => {
  let city = recentCities.value;
  getWeather(city);
});

function getWeather(cityName) {
  let url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=5&aqi=no&alerts=no`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error.message);
      }

      weatherBox.classList.remove("hidden");
      errorMsg.classList.add("hidden");

      document.getElementById("cityName").innerText = data.location.name + ", " + data.location.country;
      document.getElementById("temperature").innerText = `Temperature: ${data.current.temp_c}°C`;
      document.getElementById("humidity").innerText = `Humidity: ${data.current.humidity}%`;
      document.getElementById("windSpeed").innerText = `Wind Speed: ${data.current.wind_kph} km/h`;
      document.getElementById("weatherIcon").src = data.current.condition.icon;

      forecastBox.innerHTML = "";
      forecastBox.classList.remove("hidden");

      data.forecast.forecastday.forEach(day => {
        let date = new Date(day.date).toDateString();
        let temp = day.day.avgtemp_c;
        let wind = day.day.maxwind_kph;
        let humidity = day.day.avghumidity;
        let icon = day.day.condition.icon;

        let card = document.createElement("div");
        card.className = "p-4 bg-white shadow rounded";

        card.innerHTML = `
          <p class="font-semibold">${date}</p>
          <img src="${icon}" alt="icon" class="w-12">
          <p>Temp: ${temp}°C</p>
          <p>Wind: ${wind} km/h</p>
          <p>Humidity: ${humidity}%</p>
        `;

        forecastBox.appendChild(card);
      });
    })
    .catch(error => {
      errorMsg.innerText = "Could not fetch weather.";
      errorMsg.classList.remove("hidden");
      weatherBox.classList.add("hidden");
      forecastBox.classList.add("hidden");
    });
}

function addToRecent(city) {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("recentCities", JSON.stringify(cities));
    updateDropdown();
  }
}

function updateDropdown() {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  recentCities.innerHTML = '<option disabled selected>Select a city</option>';
  cities.forEach(city => {
    let option = document.createElement("option");
    option.value = city;
    option.text = city;
    recentCities.appendChild(option);
  });
}

updateDropdown();
