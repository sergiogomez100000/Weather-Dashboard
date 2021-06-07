// creates variable for API key
const api_key = "16d3b60db4cf8bb617eb4d8b62e0b4f1";
// creates variable for search button
const searchBtn = document.querySelector("#search-Btn");
// creates variable to sets value to key from local storage
var searchHistory = localStorage.getItem("Cities");
// creates variable for forecast container
const forecastContainer = document.querySelector("#forecast");
//creates variable for forecast container
const weathercontainer = document.querySelector("#weather")
// creates variable for search history container
var historycontainer = document.querySelector("#search-history");


// if search history has a string then it would be true
if (searchHistory) {
  //search history turns string into array
  searchHistory = JSON.parse(searchHistory);
  //otherwise
} else {
  //searchHistory will be an empty array
  searchHistory = [];
}

//invokes function on page load
createHistoryBtns();

//function to create history Btns
function createHistoryBtns() {
  //clear history buttons
  historycontainer.innerHTML = "";

  //for each cityInput run function with cityInput parameter
  searchHistory.forEach(function (cityInput) {
    //create variable to create button, add classes
    var cityItem = document.createElement("li");
    cityItem.className = "list-group-item text-center"
    //cityBtn text is set to cityInput
    var cityName = document.createElement("span");
    cityName.textContent = cityInput;
    // cityBtn.textContent = cityInput;
    //event listener on cityBtns to invoke API functions
    cityItem.addEventListener("click",function(){
      getWeather(cityInput)
      getFiveDay(cityInput)
    })
    var deleteBtn= document.createElement("button");
    deleteBtn.className = "btn-danger rounded float-right"
    deleteBtn.textContent = "🗑️";

    deleteBtn.addEventListener("click", function(){
      console.log("delete button clicked!")
    })


    cityItem.append(cityName)
    cityItem.append(deleteBtn)
    //appending cityBtn to historycontainer
    historycontainer.append(cityItem);
  });
}


//create function for when search button clicked
function submitSearch() {
  //creates var for city input
  const cityInput = document.querySelector("#city-input").value;
  // if no city input then alert
  if(!cityInput){
    alert("Please input a City name!")
    return;
  }
  //otherwise invoke API functions
  getWeather(cityInput);
  getFiveDay(cityInput);
  //if city input already in search history return
  if (searchHistory.includes(cityInput)) {
    return;
  }
  
  //pushes city input to searchHistory array
  searchHistory.push(cityInput);
  //saves key value pair, "Cities" and stringified search History array to local storage
  localStorage.setItem("Cities", JSON.stringify(searchHistory));
  //invokes function
  createHistoryBtns();
}

//creates listener for when submitBtn clicked, executes function
searchBtn.addEventListener("click", submitSearch);

// creates function to get city weather using cityInput as parameter
function getWeather(cityInput) {
  //takes in city above and returns current weather using api key
  var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${api_key}`;
  //send fetch request to get lat n long
  fetch(currentWeatherUrl)
    //grabs data turns into Json that we can parse through
    .then((data) => data.json())
    //turns data to weather
    .then(function (weather) {
      // console.log(weather);
      //if the weather datas code is equal to 404(error message)
      if (weather.cod === "404") {
        //gives alert if error 404 code
        alert("City not found! Try again!");
        //removes last item in searchHistory array
        searchHistory.pop();
        localStorage.setItem("Cities", JSON.stringify(searchHistory))
        createHistoryBtns();
        return;
      }
      //remove display-none class from weather container
      weathercontainer.classList.remove("d-none")
      //retrieves lat and lon data from weather data
      const lat = weather.coord.lat;
      const lon = weather.coord.lon;
      //sends api with our lat and long var for our city
      var onecallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;
      fetch(onecallURL)
        //converts data from onecall to .json
        .then((data) => data.json())
        .then(function (onecallURL) {
          // console.log(onecallURL);
          // console.log(onecallURL.current)
          // creates variable for element with id current-weather
          var currentWeather = document.querySelector("#current-weather");
          //resets currentWeather
          currentWeather.innerHTML = "";
          // creates variables for date info
          var d = new Date();
          var date = d.getUTCDate();
          var month = d.getUTCMonth() + 1;
          var year = d.getUTCFullYear();
          //creates variable for name of city and date, appends to container
          var name = document.createElement("h3");
          name.className= "text-center"
          name.textContent =
            weather.name + " (" + month + "/" + date + "/" + year + ")";
          currentWeather.append(name);

          // creates image for icon, appends to name
          var imgEl = document.createElement("img")
          imgEl.setAttribute("src",`http://openweathermap.org/img/w/${onecallURL.current.weather[0].icon}.png`)
          name.append(imgEl)

          //creates variable for temp, appends to container
          var temp = document.createElement("p");
          temp.textContent =
            "Temperature: " + onecallURL.current.temp.toFixed(1) + " ℉";
          currentWeather.append(temp);

          //create variable for humidity, appends to container
          var humidity = document.createElement("p");
          humidity.textContent =
            "Humidity: " + onecallURL.current.humidity + "%";
          currentWeather.append(humidity);

          //creates variable for WindSpeed, appends to container
          var windSpeed = document.createElement("p");
          windSpeed.textContent =
            "Wind Speed: " + onecallURL.current.wind_speed.toFixed(1) + " MPH";
          currentWeather.append(windSpeed);

          //creates variable for UVI, appends to container
          var uvIndex = document.createElement("p");
          uvIndex.textContent = "UV Index: ";
          //creates  variable for UVI Value target for class, appends to uviIndex
          var uvIndexVal= document.createElement("span")
          uvIndexVal.textContent= onecallURL.current.uvi;
          // if else statement to modify text depending on UVI value
          if (onecallURL.current.uvi > 6) uvIndexVal.className = "text-white bg-danger";
          else if (onecallURL.current.uvi > 3)
            uvIndexVal.className = "text-white bg-warning";
          else uvIndexVal.className = "text-white bg-primary";
          uvIndex.appendChild(uvIndexVal)
          currentWeather.append(uvIndex);
        });
    });
}

function getFiveDay(cityInput) {
  var fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${api_key}&units=imperial`;
  fetch(fiveDayUrl)
    //converts data from fiveDayUrl to .json
    .then((data) => data.json())
    // turns data to fiveDayURL
    .then(function (fiveDayUrl) {
      // console.log(fiveDayUrl);
      //if error status
      if(fiveDayUrl.cod === "404"){
        return
      }
      //resets forecastContainer
      forecastContainer.innerHTML = "";
      //for loop for each day
      for (var i = 4; i < fiveDayUrl.list.length; i = i + 8) {
        //creates card, add classes
        var forecastCard = document.createElement("div");
        forecastCard.className = ("card bg-primary text-center text-white col-md-2")

        // creates variable for date, appends to container
        // whole date(fiveDayUrl.list[i].dt_txt.slice(0, 10))
        let forecastDate = document.createElement("h3");
        var date =fiveDayUrl.list[i].dt_txt.slice(9, 10);
        var month = fiveDayUrl.list[i].dt_txt.slice(6, 7);
        var year = fiveDayUrl.list[i].dt_txt.slice(0,4);
        forecastDate.innerText = month + "/" + date + "/" + year
        forecastCard.append(forecastDate);

        //creates variable for icon, sets src, appends to card,
        let forecastIcon = document.createElement("img");
        forecastIcon.setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${fiveDayUrl.list[i].weather[0].icon}@2x.png`
        );
        forecastCard.append(forecastIcon);

        // creates variable to temp, appends to card
        let forecastTemp = document.createElement("p");
        forecastTemp.innerText = "Temp: " + fiveDayUrl.list[i].main.temp + " ℉";
        forecastCard.append(forecastTemp);

        // creates variable for humidity, appends to card, appends to container
        let forecastHumidity = document.createElement("p");
        forecastHumidity.innerText =
          "Humidity: " + fiveDayUrl.list[i].main.humidity + "%";
        forecastCard.append(forecastHumidity);
        forecastContainer.append(forecastCard);
      }
    });
}

