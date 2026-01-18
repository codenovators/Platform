const apiKey = "f80fa0ad563adedd8b82b4015c6647df";

const searchBox = document.querySelector(".userInput");
const searchButton = document.querySelector(".btnSearch");
const suggestions = document.querySelector(".suggestions");

// ================= WEATHER FETCH =================
async function checkWeatherByCoords(lat, lon, cityName) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`,
  );

  if (!response.ok) return alert("Weather not found");

  const data = await response.json();

  document.querySelector(".city").textContent = cityName;
  document.querySelector(".temp").textContent =
    `${Math.round(data.main.temp)}℃`;
  document.querySelector(".description").textContent = data.weather[0].main;
  document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
  document.querySelector(".wind").textContent = `${data.wind.speed} km/h`;

  const weatherIcon = document.querySelector(".weatherIcon");

  switch (data.weather[0].main) {
    case "Clouds":
      weatherIcon.src = "./img/cloudy (1).png";
      break;
    case "Clear":
      weatherIcon.src = "./img/sun.png";
      break;
    case "Mist":
      weatherIcon.src = "./img/snowflake.png";
      break;
    case "Rain":
      weatherIcon.src = "./img/heavy-rain.png";
      break;
    default:
      weatherIcon.src = "./img/cloudy (1).png";
  }

  // Hide suggestions after selection
  suggestions.innerHTML = "";
  suggestions.style.display = "none"; // hide completely
  searchBox.value = "";
}

// ================= AUTOCOMPLETE =================
searchBox.addEventListener("input", async () => {
  const query = searchBox.value.trim();

  if (query.length < 2) {
    suggestions.innerHTML = "";
    suggestions.style.display = "none";
    return;
  }

  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`,
  );

  const cities = await response.json();

  suggestions.innerHTML = ""; // clear previous suggestions
  suggestions.style.display = "block"; // show suggestions

  cities.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = `${city.name}, ${city.country}`;

    // Use mousedown instead of click to avoid focus loss
    li.addEventListener("mousedown", () => {
      checkWeatherByCoords(city.lat, city.lon, city.name);
    });

    suggestions.appendChild(li);
  });
});

// ================= BUTTON SEARCH =================
searchButton.addEventListener("click", async () => {
  const city = searchBox.value.trim();
  if (!city) return;

  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`,
  );

  const data = await response.json();
  if (!data.length) return alert("City not found");

  checkWeatherByCoords(data[0].lat, data[0].lon, data[0].name);
});
