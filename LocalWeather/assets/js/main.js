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
 * Get weather data by coords
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
        var errMsg = "<p>Sorry, our meteorologist is taking a snap. Try again</p>";
        display('error', errMsg);
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
 * Set error message
 */
function setErrorMsg(errorBox, msg) {
    // default message
    msg = msg || "<p>Sorry, something goes wrong. Try again</p>";

    errorBox.html(msg);
}

/**
 * Update de DOM with the weather data
 */
function showWeather(weatherData) {
    setTemp(weatherData.main.temp);
    setType(weatherData.weather[0].description);
    setCity(weatherData.name);
    setIcon(weatherData.weather[0].icon);

    display('weather');
}

/**
 * Show/hide boxes
 */
function toggleBox (box, show) {
    if (show && box.hasClass("hide")) {
        box.removeClass("disapear");
        setTimeout(function() {
            box.removeClass("hide");
        }, 600);
    } else if (!show && !box.hasClass("hide")) {
        box.addClass("hide");
        setTimeout(function() {
            box.addClass("disapear");
        }, 600);
    }
}

/**
 * Handle the disply of boxes
 */
function display(box, errorMsg) {
    errorMsg = errorMsg || undefined;

    // boxes
    var weatherBox = $("#weather-box");
    var loaderBox = $("#loader-box");
    var errorBox = $("#error-box");

    switch (box) {
        case 'loader':
            toggleBox(errorBox, false);
            toggleBox(weatherBox, false);
            toggleBox(loaderBox, true);
            break;
        case 'weather':
            toggleBox(errorBox, false);
            toggleBox(loaderBox, false);
            toggleBox(weatherBox, true);
            break;
        case 'error':
            setErrorMsg(errorBox, errorMsg);
            toggleBox(loaderBox, false);
            toggleBox(weatherBox, false);
            toggleBox(errorBox, true);
            break;
        default:
            console.log('must provied a box element!');
            break;
    }
}

// the magic start here
(function(){
    // check browser support
    if (!navigator.geolocation) {
        var errMsg = "<p>Sorry, your browser has not support for geolocation. Try with Firefox or Chrome</p>";

        display('error', errMsg);

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

    }, function(err) { // on error
        // default msg
        var errMsg = "<p>Sorry, something it's not right. Try again.</p>";

        // user block
        if (err.code === 1) {
            errMsg = "<p>Please, we need that you enable geolocation in your browser.</p>";
        }

        display('error', errMsg);
    });
})();
