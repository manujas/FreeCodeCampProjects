// Whole-script strict mode syntax
"use strict";

/**
 *
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

/**
 *
 */
function showWeather(weatherData) {
    $("#w-temp").text(Math.ceil(weatherData.main.temp) + "°");
    $("#w-type").text(weatherData.weather[0].description);
    $("#w-city").text(weatherData.name);
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
        getWeatherData(coords, showWeather);
        // get weather data
        // set icon, city and type of weather
        // change background gradient by the hours
    });

})();
