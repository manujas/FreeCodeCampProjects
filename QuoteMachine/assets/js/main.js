// array of colors I like
var colors = ['#455A64', '#536DFE', '#CDDC39', '#009688', '#03A9F4', '#B2DFDB', '#727272', '#212121'];

/** MAIN FUNCTIONS **/

/**
 * Get a new random quote and call a function to populate the html
 */
function getNewQuote(populateCallback) {
    $.ajax({
        url: 'http://quotes.stormconsultancy.co.uk/random.json',
        dataType: 'jsonp',
        success: function(result) {
            populateCallback(result);
        }
    });
}

/**
 * Populates a new quote and changes the primary color
 */
function populateQuote(jsonQuote) {
    $("#text-quote").hide();
    $("#text-quote").html(jsonQuote.quote).fadeIn(1000);
    $("#author-quote").html(jsonQuote.author);

    // creates the links for sharing
    var tweetQuote = 'http://twitter.com/share?text=' + jsonQuote.quote + " - " + jsonQuote.author;
    $("#tweet").attr('href', tweetQuote);
    $("#permalink").attr('href', jsonQuote.permalink);

    // a new color for the web
    var color = newRandomColor(colors);
    $(".primary-color").css('color', color);
    $(".back-color").css('background-color', color);
}

/**
 * returns a string with a random HEX color from the array hiven
 */
function newRandomColor(colorsArr) {
    return colorsArr[randomNum(0, colorsArr.length)];
}

/** AUX FUNCTIONS **/

/**
 * returns a random number between two limits
 */
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * ON LOAD SCRIPT
 */
$(document).ready(function() {
    // bind the click handeler to the new quote button
    $("#quote-up").on("click", function() {
        getNewQuote(populateQuote);
    });

    // get the fisrt quote
    getNewQuote(populateQuote);
});
