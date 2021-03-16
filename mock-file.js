var api_key = “f8073a85a7a537a08dad181818ffb256”;
var forecastContainer = document.querySelector(“#forecast-container”);
var $cityText = document.querySelector(“#city-text”);
var currentContainer = document.querySelector(“#current-container”);
var historyContainer = document.querySelector(“#history-container”);
var past = JSON.parse(localStorage.getItem(“history”)) || [];
//Function for Current Day
function getWeather(city) {
  var currentWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=imperial`;
  fetch(currentWeatherUrl)
    .then((data) => data.json())
    .then(function (weather) {
      console.log(weather);
      if (weather.cod === “404”) {
        //Display message to user
        alert(“City not found”);
        return;
      }
      var lat = weather.coord.lat;
      var lon = weather.coord.lon;
      var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;
      fetch(oneCallUrl)
        .then((data) => data.json())
        .then(function (oneCallData) {
          console.log(oneCallData);
          var mainCard = document.createElement(“div”);
          mainCard.classList.add(“mainCard”);
          //City name
          var cityEl = document.createElement(“h2");
          cityEl.textContent = city + ” - ” + new Date().toDateString();
          mainCard.append(cityEl);
          //UV
          var uvEl = document.createElement(“button”);
          var uvIndex = oneCallData.current.uvi;
          uvEl.textContent = oneCallData.current.uvi;
          console.log(typeof oneCallData.current.uvi);
          if (uvIndex <= 2) {
            uvEl.classList.add(“favorable”);
          } else if (uvIndex >= 5) {
            uvEl.classList.add(“severe”);
          } else {
            uvEl.classList.add(“moderate”);
          }
          mainCard.append(uvEl);
          currentContainer.innerHTML = “”;
          currentContainer.append(mainCard);
        });
    });
}
// Function for 5 day forecast
function getFiveDay(city) {
  var fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=imperial`;
  fetch(fiveDayUrl)
    .then((data) => data.json())
    .then(function (oneCallData) {
      var fiveDayArray = oneCallData.list;
      forecastContainer.innerHTML = “”;
      for (let index = 4; index < fiveDayArray.length; index = index + 8) {
        console.log(fiveDayArray[index]);
        var currentDay = fiveDayArray[index];
        var forecastCard = document.createElement(“div”);
        forecastCard.classList.add(“forecastCard”);
        //Header
        var dateEl = document.createElement(“h2");
        dateEl.textContent = currentDay.dt_txt.slice(0, 10) + ” 3:00";
        forecastCard.append(dateEl);
        //Image
        var imageEl = document.createElement(“img”);
        imageEl.setAttribute(
          “src”,
          `http://openweathermap.org/img/wn/${currentDay.weather[0].icon}@2x.png`
        );
        imageEl.setAttribute(“width”, “50%“);
        forecastCard.append(imageEl);
        //Temperature
        var tempEl = document.createElement(“p”);
        tempEl.textContent = `Temp: ${currentDay.main.temp} °F`;
        forecastCard.append(tempEl);
        //Humidity
        var humidityEl = document.createElement(“p”);
        humidityEl.textContent = `Humidity: ${currentDay.main.humidity} %`;
        forecastCard.append(humidityEl);
        forecastContainer.append(forecastCard);
      }
    });
}
historyContainer.addEventListener(“click”, function (e) {
  e.preventDefault()
  if (!e.target.matches(“li”)) return;
  getWeather(e.target.textContent)
  getFiveDay(e.target.textContent)
  console.log(e.target.textContent)
}
)
$(“.sbmtbutton”).on(“click”, function (event) {
  //prevents page from refreshing
  event.preventDefault();
  console.log(“submit”);
  var city = $(“#city-input”).val();
  handleCity(city);
  console.log(city);
  getWeather(city);
  getFiveDay(city);
  renderPast()
});
function handleCity(cityName) {
  //treat as a catch all for each item in history array
  console.log(typeof past)
  if (!past.includes(cityName)) {
    past.push(cityName)
  }
  localStorage.setItem(“history”, JSON.stringify(past));
  // Each item gets a p tag
  // add an event listener
  // call getWeather and buildDashboard using the value of whatever
  // Push into history array the most recent search
  // After the array has been updated, we store it under the key of history so that when the page reloads you get the most recent search.
}
renderPast()
function renderPast() {
  historyContainer.innerHTML = “”;
  for (const city of past) {
    var previousCity = document.createElement(“li”);
    previousCity.textContent = city
    historyContainer.append(previousCity);
  }
}
white_check_mark
eyes
raised_hands





