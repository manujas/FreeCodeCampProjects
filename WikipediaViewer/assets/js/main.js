var str = '';

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
  for(var id in results) {
    console.log(id);
    console.log(results[id]);
    insertNewHtmlCard(results[id]);
  }
}

function insertNewHtmlCard(result) {
  var wikiURL = "https://en.wikipedia.org/?curid=";
  var card = "<div class='col s12 m6'> \
                <div class='card'> \
                  <div class='card-content'> \
                    <span class='card-title'><a href='' target='_blank'></a></span> \
                    <p class='card-extract'></p> \
                  </div> \
                </div> \
              </div>";
  $(".search-results").children().append(card);
  $(".card-title").last().children().html(result.title).attr("href", wikiURL+result.pageid);
  $(".card-extract").last().html(result.extract.truncate(100));
  str = result.extract;
}

String.prototype.truncate = function(len) {
    return (this.length > len)
      ? this.substring(0, len) + "..."
      : this.substring(0, this.length);
};
