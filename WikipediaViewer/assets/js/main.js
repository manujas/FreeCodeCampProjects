$("#wiki_search").keyup(function (e) {
  if (e.keyCode == 13) {
    var searchForm = $(".search-form");
    if (searchForm.hasClass("full-height")) {
      searchForm.removeClass("full-height")
    }
    searchOnWikipedia($(this).val());
  }
});

function searchOnWikipedia(query) {
  var url = "https://crossorigin.me/https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=" + query;

  $.ajax( {
    url: url,
    type: 'GET',
    success: function(data) {
      showResults(data.query.pages);
    }
  });
}

function showResults(results) {
  for(var i = 0; i < result.length; i++) {
    insertNewHtmlCard(function(result) {
      $('')
    });
  }
}

function insertNewHtmlCard(callback) {
  var card = "<div class='card'> \
                <div class='card-content'> \
                  <span class='card-title'></span> \
                  <p></p> \
                </div> \
              </div>";

  callback();
}
