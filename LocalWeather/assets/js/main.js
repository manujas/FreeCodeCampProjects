// Whole-script strict mode syntax
"use strict";

var weatherIcon = {
    "01d": "wi-day-sunny",
    "01n": "wi-night-clear",
    "02d": "wi-day-cloudy",
    "02n": "wi-night-alt-cloudy",
    "03d": "wi-cloud",
    "03n": "wi-cloud",
    "04d": "wi-cloudy",
    "04n": "wi-cloudy",
    "09d": "wi-rain",
    "09n": "wi-rain",
    "10d": "wi-day-rain",
    "10n": "wi-night-alt-rain",
    "11d": "wi-thunderstorm",
    "11n": "wi-thunderstorm",
    "13d": "wi-snow",
    "13n": "wi-snow",
    "50d": "wi-fog",
    "50n": "wi-fog"
};

/**
 * Get weather data by coors
 */
function getWeatherData(coords, callback) {
    var weatherData;
    var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + coords.lon +"&lon=" + coords.log + "&units=metric&APPID=fc44b32f2aceb2cf76fbedf4b7d6c1bc";

    // get the weather data
    $.ajax({
        url: url
    })
    .done(function(data) {
        callback(data);
    })
    .fail(function(err) {
        console.log(err.responseText);
    });
}

function setTemp(temp) {
    temp = Math.ceil(temp);
    $("#w-temp").text(temp + "°");
}

function setType(type) {
    type = type.charAt(0).toUpperCase() + type.slice(1);
    $("#w-type").text(type);
}

function setCity(city) {
    $("#w-city").text(city);
}

function setIcon(icon) {
    var iconClass = "wi " + weatherIcon[icon];
    $("#w-icon").removeClass().addClass(iconClass);
}
/**
 * Update de DOM with the weather data
 */
function showWeather(weatherData) {
    setTemp(weatherData.main.temp);
    setType(weatherData.weather[0].description);
    setCity(weatherData.name);
    setIcon(weatherData.weather[0].icon);
}


// the magic start here
(function(){
    // Loader
    // get coordinates
    if (!navigator.geolocation) {
        // Here goes error handeling
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        var coords = {
            lon: position.coords.latitude,
            log: position.coords.longitude
        };

        // get weather data & update the DOM
        getWeatherData(coords, showWeather);

        // change background gradient by the hours
    });
})();
