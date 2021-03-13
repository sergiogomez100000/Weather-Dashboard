// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
//get api to get into server
const api_key = "16d3b60db4cf8bb617eb4d8b62e0b4f1";
// creates var for submit form
const submitBtn = document.querySelector(".submit-form");
// creates variable to sets value to key from local storage
var searchHistory = localStorage.getItem("Cities");
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
createCityBtns();
//function to create cityBtns
function createCityBtns() {
  var btncontainer = document.querySelector(".search-history");
  //for each cityInput run function with cityInput parameter
  searchHistory.forEach(function (cityInput) {
    //create variable to create button
    var cityBtn = document.createElement("button");
    // hav text content of cityBtn be the cityInput
    cityBtn.textContent = cityInput;
    //appending cityBtn to btncontainer
    btncontainer.append(cityBtn);
  });
}
//create function for when submit button clicked
function submitForm(event) {
  //prevents page refresh
  event.preventDefault();
  //creates variable for city inputted in form
  const cityInput = document.querySelector("#input-city").value;
  //logs city submitted
  searchHistory.push(cityInput);
  //saves key value pair "city",searchhistory array turns into string with JSON.stringify to local storage
  localStorage.setItem("Cities", JSON.stringify(searchHistory));
  getWeather(cityInput);
}
//creates listener for when submitBtn submitted, executes function
submitBtn.addEventListener("submit", submitForm);

// creates funstion to get weather using cityInput as parameter
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
        alert("city not found");
        return;
      }
      // logs the name from weather
      // console.log(weather.name)
      //creates varibale for name of city
      var name = weather.name;
      //acess lat n long  from returned data, current api endpoint
      //creat variable for long and lat info to use for onecal url
      const lat = weather.coord.lat;
      const lon = weather.coord.lon;
      //sends api with our lat and long var for our city
      var onecallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;
      fetch(onecallURL)
        //converts data from onecall to .json
        .then((data) => data.json())
        .then(function (onecallURL) {

          var todayCard = document.createElement("div");
          todayCard.classList.add("current-weather");
          //todayCard.innerHTML= name
          //currentWeather.append(todayCard)

          //   oneCallData has all the information that we need for 5 day
          //console.log(onecallURL);
          // logs url info,looks into "current" array for todays forcast
          //console.log(onecallURL.current)
          //create variable for humidity including string and humidity info in current from onecall url
          var humidity = ["Humidity: " + onecallURL.current.humidity + "%"];
          //creates variable for temp including string and temp info in "current" array from onecallurl
          var temp = ["Temp: " + onecallURL.current.temp + "Degrees"];
          //console.log(temp)
          //creates variable for UVI including string and UVI info in "current" array from onecallurl
          var uvIndex = ["UV Index: " + onecallURL.current.uvi];
          //creates variable for WindSPeed including string and WS info in "current" array from onecallurl
          var windSpeed = ["Wind Speed: " + onecallURL.current.wind_speed +"MPH"];
          //creates variable for WC including string and WC info in "current" array from onecallurl
          var weatherCond = [
            "Weather Conditions: " + onecallURL.current.weather[0].main,
          ];
          // creates variable for element with class current -weather
          var currentWeather = document.querySelector(".current-weather");
          
          //clear innerhtml of currentweatheerInfo hopefully
          //currentWeatherInfo= "";
          // creates array of weather info variables
          const currentWeatherInfo = [
            name,
            humidity,
            temp,
            uvIndex,
            windSpeed,
            weatherCond,
          ];
          // appends weather info array to current weather html element
          currentWeather.append(currentWeatherInfo);
          //looking for 5 day forecast info, looking into onecallUrl daily data
          console.log(onecallURL);
          //date
          //console.log(onecallURL.daily[0].dt)
          //icon
          //console.log(onecallURL.daily[0].weather[0].icon)
          //temp
          //console.log(onecallURL.daily[0].temp.day)

          //humidity
          // console.log(onecallURL.daily[0].humitidity)

          //create for loop to go through each day
          //  for (let i=0; i <5, i++;){
          //    //create variables for each info
          //   var date = ["Date: " + (onecallURL.daily[i].dt)]
          //   var icon = [onecallURL.daily[i].weather[i].icon]
          //   var temp = ["Temp: " + (onecallURL.daily[i].temp.day)]
          //   var humidity = ["Humidity: " + (onecallURL.daily[i].humidity)]
          //   var fiveDAy = [date, icon, temp, humidity]
          //   var forecast = document.querySelector("#forecast")
          //   forecast.append(fiveDay)
          //   }
        });
    });
}

