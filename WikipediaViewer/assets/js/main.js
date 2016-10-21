$("#wiki_search").keyup(function (e) {
  if (e.keyCode == 13) {
    var searchForm = $(".search-form");
    if (searchForm.hasClass("full-height")) {
      searchForm.removeClass("full-height")
    }
    var searchResults = $(".search-results").children();
    if (searchResults.children()) {
      searchResults.html('');
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
    insertNewHtmlCard(results[id]);
  }
  toggleCardsAnimation();
}

function insertNewHtmlCard(result) {
  var wikiURL = "https://en.wikipedia.org/?curid=";
  var card = "<div class='col s12 m6 card-col'> \
                <div class='card hidden'> \
                  <div class='card-content'> \
                    <span class='card-title'><a href='' target='_blank'></a></span> \
                    <p class='card-extract'></p> \
                  </div> \
                </div> \
              </div>";
  $(".search-results").children().append(card);
  $(".card-title").last().children().html(result.title).attr("href", wikiURL+result.pageid);
  $(".card-extract").last().html(result.extract.truncate(50));
}

function toggleCardsAnimation(eraseCard) {
  $(".card").each(function(i, card) {
    setTimeout(function() {
      $(card).toggleClass('hidden');
    }, 250);
  });
}

String.prototype.truncate = function(len) {
  return (this.length > len)
    ? this.substring(0, len) + "..."
    : this.substring(0, this.length);
};
