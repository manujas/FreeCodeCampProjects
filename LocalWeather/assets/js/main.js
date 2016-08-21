// Whole-script strict mode syntax
"use strict";

// icon dictionary
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
        console.log(err.responceText);
        var errMsg = "Sorry, our meteorologist is taking a snap. Try again";
        handleError(true, errMsg);
    });
}

/**
 * DOM manipulation for temp
 */
function setTemp(temp) {
    temp = Math.ceil(temp);
    $("#w-temp").text(temp + "°");
}

/**
 * DOM manipulation for type of weather
 */
function setType(type) {
    type = type.charAt(0).toUpperCase() + type.slice(1);
    $("#w-type").text(type);
}

/**
 * DOM manipulation for city
 */
function setCity(city) {
    $("#w-city").text(city);
}

/**
 * DOM manipulation for icon
 */
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

/**
 * Shown/hide error function
 */
function handleError(show, msg) {
    msg = msg || "Sorry, we don't now what happen. Try again";
    var errBox = $("#err-box");
    var weatherBox = $("#weather-box");

    // hide all boxes
    if (!errBox.hasClass('hide')) {
        errBox.addClass("hide", 1500);
    }
    if (!weatherBox.hasClass('hide')) {
        weatherBox.addClass("hide", 1500);
    }

    // show the right box
    if (show) {
        setTimeout(function() {
            errBox.html(msg).removeClass("hide", 1500);
        }, 1500);
        return;
    } else {
        setTimeout(function() {
            weatherBox.removeClass("hide");
        }, 1500);
    }
}

// the magic start here
(function(){
    // Loader

    // check browser support
    if (!navigator.geolocation) {
        handleError(true, "Sorry, your browser has not support for geolocation. Try with Firefox or Chrome");
        return;
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        var coords = {
            lon: position.coords.latitude,
            log: position.coords.longitude
        };

        // get weather data & update the DOM
        getWeatherData(coords, showWeather);

        // change background gradient by the hours

    }, function(posErr) { // on error
        // default msg
        var errMsg = "Sorry, something it's not right. Try again.";

        // user block
        if (posErr.code === 1) {
            errMsg = "Please, we need that you enable geolocation in your browser.";
        }

        handleError(true, errMsg);
    });
})();
