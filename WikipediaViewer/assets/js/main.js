$('#wiki_search').keyup( function(e) {
  // onlly listen enter key
  if (e.keyCode !== 13) {
    return;
  }

  // save search value
  const searchValue = $(this).val();

  // only serach if the input has char
  if (searchValue == '') {
    return;
  }

  moveSearchFormToTop();
  cleanSearchResult();
  searchOnWikipedia(searchValue);
});

/**
 * Search on wikipedia
 * @param  String query
 */
const searchOnWikipedia = query => {
  const url = 'https://crossorigin.me/https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=' + query;

  $.ajax( {
    url: url,
    type: 'GET',
    success: data => {
      showResults(data.query.pages);
    }
  });
};

/**
 * Populate the DOM with the result from wikipedia
 * @param  Json results
 */
const showResults = results => {
  for(const id in results) {
    insertNewHtmlCard(results[id]);
  }
  toggleCardsAnimation();
};

/**
 * Creates a result's card
 * @param  Json result
 */
const insertNewHtmlCard = result => {
  const wikiURL = 'https://en.wikipedia.org/?curid=';
  const card = '<div class="col s12 m12 card-col"> \
                <div class="card hidden"> \
                  <div class="card-content"> \
                    <span class="card-title"><a href="" target="_blank"></a></span> \
                    <p class="card-extract"></p> \
                  </div> \
                </div> \
              </div>';
  $('.search-results').children().append(card);
  $('.card-title').last().children().html(result.title).attr('href', wikiURL+result.pageid);
  $('.card-extract').last().html(result.extract.truncate(150));
};

/**
 * Toggle animation for a card
 * @param  card
 */
const toggleCardsAnimation = card => {
  $('.card').each((i, card) => {
    setTimeout(() => {
      $(card).toggleClass('hidden');
    }, 250 * i);
  });
};

/**
 * Animate the serch form from original center position to a top position
 */
const moveSearchFormToTop = () => {
  const searchForm = $('.search-form');
  if (searchForm.hasClass('full-height')) {
    searchForm.removeClass('full-height');
  }
};

/**
 * Remove all result's card from the DOM
 */
const cleanSearchResult = () => {
  const searchResults = $('.search-results').children();
  if (searchResults.children()) {
    searchResults.html('');
  }
};

// added a truncate static method to String prototype
String.prototype.truncate = function(len) {
  return (this.length > len)
    ? this.substring(0, len) + '...'
    : this.substring(0, this.length);
};
