const api_key = "16d3b60db4cf8bb617eb4d8b62e0b4f1";
// creates var for submit form
const searchBtn = document.querySelector("#search-Btn");
// creates variable to sets value to key from local storage
var searchHistory = localStorage.getItem("Cities");
// creates variable for forecast container
const forecastContainer = document.querySelector("#forecast");
// console.log(forecastContainer);
// if search history has a string then it would be tru
if (searchHistory) {
  //search history turns strin into array
  searchHistory = JSON.parse(searchHistory);
  //otherwise
} else {
  //searchHistory will be an empty array
  searchHistory = [];
}
// logs what type of data search History has, object
//console.log(typeof searchHistory)
createHistoryBtns();
//function to create cityBtns
function createHistoryBtns() {
  var historycontainer = document.querySelector("#search-history");
  historycontainer.innerHTML = "";

  //for each cityInput run function with cityInput parameter
  searchHistory.forEach(function (cityInput) {
    //create variable to create button
    var cityBtn = document.createElement("li");
    cityBtn.className = "list-group-item text-center"
    // hav text content of cityBtn be the cityInput
    cityBtn.textContent = cityInput;
    cityBtn.addEventListener("click",function(event){
      getWeather(event.target.textContent)
      getFiveDay(event.target.textContent)
    })
    //appending cityBtn to historycontainer
    historycontainer.append(cityBtn);
  });
}
//create function for when search button clicked
function submitSearch(event) {
  //prevents page refresh
  event.preventDefault();
  //creates var for city input
  const cityInput = document.querySelector("#city-input").value;
  if(!cityInput){
    alert("Please input a City name!")
  }
  getWeather(cityInput);
  getFiveDay(cityInput);
  if (searchHistory.includes(cityInput)) {
    return;
  }
  //logs city submitted
  searchHistory.push(cityInput);
  //saves key value pair "city",searchhistory array turns into string with JSON.stringify to local storage
  localStorage.setItem("Cities", JSON.stringify(searchHistory));
  createHistoryBtns();
}
//creates listener for when submitBtn submitted, executes function
searchBtn.addEventListener("click", submitSearch);

// creates function to get city weather using cityInput as parameter
function getWeather(cityInput) {
  //takes in city above and returns current weather using api key
  var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${api_key}`;
  //send fetch request to get lat n long
  fetch(currentWeatherUrl)
    //grabs datas turns into Json that we can parse thru
    .then((data) => data.json())
    .then(function (weather) {
      //gives us data on weather
      //console.log(weather);

      //if the weather datas code is equal to 404(error message)
      if (weather.cod === "404") {
        //gives alert if error 404 code
        alert("City not found! Try again!");
        return;
      }
      //retrieves lat and lon data from weather data
      const lat = weather.coord.lat;
      const lon = weather.coord.lon;
      //sends api with our lat and long var for our city
      var onecallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;
      fetch(onecallURL)
        //converts data from onecall to .json
        .then((data) => data.json())
        .then(function (onecallURL) {
          console.log(onecallURL);
          console.log(onecallURL.current)
          // creates variable for element with id current -weather
          var currentWeather = document.querySelector("#current-weather");
          currentWeather.innerHTML = "";
          var d = new Date();
          var date = d.getUTCDate();
          var month = d.getUTCMonth() + 1;
          var year = d.getUTCFullYear();
          //creates variable for name of city and date
          var name = document.createElement("h3");
          name.textContent =
            weather.name + " (" + month + "/" + date + "/" + year + ")";
          currentWeather.append(name);
          var imgEl = document.createElement("img")
          imgEl.setAttribute("src",`http://openweathermap.org/img/w/${onecallURL.current.weather[0].icon}.png`)
          name.append(imgEl)
          //creates variable for temp including string and temp info in "current" array from onecallurl
          var temp = document.createElement("p");
          temp.textContent =
            "Temperature: " + onecallURL.current.temp.toFixed(1) + " ℉";
          currentWeather.append(temp);
          //create variable for humidity including string and humidity info in current from onecall url
          var humidity = document.createElement("p");
          humidity.textContent =
            "Humidity: " + onecallURL.current.humidity + "%";
          currentWeather.append(humidity);
          //creates variable for WindSPeed including string and WS info in "current" array from onecallurl
          var windSpeed = document.createElement("p");
          windSpeed.textContent =
            "Wind Speed: " + onecallURL.current.wind_speed.toFixed(1) + " MPH";
          currentWeather.append(windSpeed);
          //creates variable for UVI including string and UVI info in "current" array from onecallurl
          var uvIndex = document.createElement("p");
          uvIndex.textContent = "UV Index: " + onecallURL.current.uvi;
          if (onecallURL.current.uvi > 6) uvIndex.className = "text-danger";
          else if (onecallURL.current.uvi > 3)
            uvIndex.className = "text-warning";
          else uvIndex.className = "text-primary";
          currentWeather.append(uvIndex);
        });
    });
}

function getFiveDay(cityInput) {
  var fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${api_key}&units=imperial`;
  fetch(fiveDayUrl)
    //converts data from fiveDayUrl to .json
    .then((data) => data.json())
    .then(function (fiveDayUrl) {
      // console.log(fiveDayUrl);
      forecastContainer.innerHTML = "";

      for (var i = 4; i < fiveDayUrl.list.length; i = i + 8) {
        var forecastCard = document.createElement("div");
        forecastCard.className = ("card bg-primary text-center text-white col-md-2")
        //forecastCard.classList.add("forecast");

        // create  element for var, sets innertext of var to data, append var to container
        let forecastDate = document.createElement("h3");
        var date =fiveDayUrl.list[i].dt_txt.slice(9, 10);
        var month = fiveDayUrl.list[i].dt_txt.slice(6, 7);
        var year = fiveDayUrl.list[i].dt_txt.slice(0,4);
        forecastDate.innerText = month + "/" + date + "/" + year
        // fiveDayUrl.list[i].dt_txt.slice(0, 10);
        forecastCard.append(forecastDate);

        let forecastIcon = document.createElement("img");
        forecastIcon.setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${fiveDayUrl.list[i].weather[0].icon}@2x.png`
        );
        forecastCard.append(forecastIcon);
        forecastContainer.append(forecastCard);

        
        let forecastTemp = document.createElement("p");
        forecastTemp.innerText = "Temp: " + fiveDayUrl.list[i].main.temp + " ℉";
        forecastCard.append(forecastTemp);

        let forecastHumidity = document.createElement("p");
        forecastHumidity.innerText =
          "Humidity: " + fiveDayUrl.list[i].main.humidity + "%";
        forecastCard.append(forecastHumidity);
      }

      // console.log(fiveDayUrl.list[0].dt_txt)// date
      // console.log(fiveDayUrl.list[0].main.humidity)//humidity
      //console.log(fiveDayUrl.list[0].main.temp)// temp
      //console.log(fiveDayUrl.list[0].weather[0].icon)//icon
    });
}

//make function, make fetch with 5day api, .json data

//
//create var and create p tag with it for all data needed
//}
//look to project

//  for (let i=0; i <5, i++;){
//   var date = ["Date: " + (onecallURL.daily[i].dt)]
//   var icon = [onecallURL.daily[i].weather[i].icon]
//   var temp = ["Temp: " + (onecallURL.daily[i].temp.day)]
//   var humidity = ["Humidity: " + (onecallURL.daily[i].humidity)]
//   var fiveDAy = [date, icon, temp, humidity]
//   var forecast = document.querySelector("#forecast")
//   forecast.append(fiveDay)
//   }//    //create variables for each info

// appends weather info array to current weather html element
//currentWeather.append(currentWeatherInfo);
//looking for 5 day forecast info, looking into onecallUrl daily data

//date
//console.log(onecallURL.daily[0].dt)
//icon
//console.log(onecallURL.daily[0].weather[0].icon)
//temp
//console.log(onecallURL.daily[0].temp.day)

//humidity
// console.log(onecallURL.daily[0].humitidity)

//create for loop to go through each day
