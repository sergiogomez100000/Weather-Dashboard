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
var api_key ="16d3b60db4cf8bb617eb4d8b62e0b4f1";
var city= "";
var currentWeatherUrl="api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={api_key}"
fetch(currentWeatherUrl)
    .then((data)=>data.json())
    .then(function (weather){
        console.log(weather);
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    var onecallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}`;
    fetch(onecallURL)
      .then((data) => data.json())
      .then(function (oneCallData) {
        //   oneCallData has all the information that we need
        console.log(oneCallData);
      });
    })
var forecastWeatherUrl="api.openweathermap.org/data/2.5/forecast?q={city name},{state code}&appid={API_key}"
function getWeather(city){

}
fetch(currentWeatherUrl)
  .then((data) => data.json())
  .then(function (weather) {
    console.log(weather);
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    var onecallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}`;
    fetch(onecallURL)
      .then((data) => data.json())
      .then(function (oneCallData) {
        //   oneCallData has all the information that we need
        console.log(oneCallData);
      });
  });
