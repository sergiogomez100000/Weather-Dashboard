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
var cityInput = localStorage.getItem("Cities");
//if there is a value for cities

//function to create cityBtns
function createCityBtns(){
  //for each cityInput run function with cityInput parameter
  cityInput.forEach(function(cityInput){
    //create variable to create button
    var cityBtn= document.createElement("button");
    // hav text content of cityBtn be the cityInput
    cityBtn.textContent = cityInput
    // create variable to append cityBtn to search-history class
     var searchHitsory= $(".search-history").append(btn)

  })
}
//create function for when submit button clicked
function submitForm(event){
  //prevents page refresh
  event.preventDefault();
  //creates variable for city inputted in form
  const cityInput = document.querySelector("#input-city").value;
  //logs city submitted
  console.log(cityInput);
  //saves key value pair "city",cityinput to local storage
  localStorage.setItem("Cities",cityInput);
  getWeather(cityInput);



  
}
//creates listener for when submitBtn submitted, executes function
submitBtn.addEventListener("submit",submitForm);

// creates funstion to get weather using cityInput as parameter
function getWeather(cityInput){
  //takes in city above and returns current weather using api key
  var currentWeatherUrl= `http://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${api_key}`;
  //logs info that we get from api 
  console.log(currentWeatherUrl);
  //send fetch request to get lat n long
  fetch(currentWeatherUrl)
      //grabs datas turns into Json
      .then((data)=>data.json())
      .then(function (weather){
        //gives us data on 
          console.log(weather);
        if(weather.cod==="404"){
          //gives alert if error 404 code
          alert("city not found");
          return;
        }
        //acess lat n long  from returned data
      var lat = weather.coord.lat;
      var lon = weather.coord.lon;
      //sends api with our lat and long var for our city
      var onecallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;
      fetch(onecallURL)
        .then((data) => data.json())
        .then(function (oneCallData) {
          currentUVEl.innerhtml = ""
          //   oneCallData has all the information that we need
          console.log(oneCallData);
          
        });
      })
}


