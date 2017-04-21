const searchInput = document.querySelector('#wiki_search');
searchInput.onkeyup = function (e) {
  // onlly listen enter key
  if (e.keyCode !== 13) {
    return;
  }

  // save search value
  const searchValue = this.value.trim();

  // only serach if the input has char
  if (searchValue === '') {
    return;
  }

  moveSearchFormToTop();
  cleanSearchResult();
  searchOnWikipedia(searchValue);
};

searchInput.onclick = function (e) {
  cleanUpSearchInput();
};

/**
 * Search on wikipedia
 * @param  String query
 */
const searchOnWikipedia = query => {
  const url = `https://crossorigin.me/https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=${query}`;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        showResults(data.query.pages);
      } else {
        const error = 'Ups!, something goes wrong. Please, try agan.';
        showErrorSearch(error);
      }
    }
  };
  xhr.send();
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
 * Show error on the dom element that recive
 * @param  element where put the error messagge
 * @param  error
 */
const showErrorSearch = error => {
  const searchInput = document.querySelector('#wiki_search');
  if (!searchInput.classList.contains('error')) {
    searchInput.classList.add('error');
  }
  searchInput.value = error;
};

/**
 * Delete previous search query and remove error class from search input
 */
const cleanUpSearchInput = () => {
  const searchInput = document.querySelector('#wiki_search');
  searchInput.value = '';
  if (searchInput.classList.contains('error')) {
    searchInput.classList.remove('error');
  }
};

/**
 * Creates a result's card
 * @param  Json result
 */
const insertNewHtmlCard = result => {
  const wikiURL = `https://en.wikipedia.org/?curid=${result.pageid}`;
  const card = `<div class="col s12 m12 card-col"> \
                <div class="card hidden"> \
                  <div class="card-content"> \
                    <span class="card-title"><a href="${wikiURL}" target="_blank">${result.title}</a></span> \
                    <p class="card-extract">${result.extract.truncate(150)}</p> \
                  </div> \
                </div> \
              </div>`;

  const searchResults = document.querySelector('.search-results');
  searchResults.insertAdjacentHTML('beforeend', card);
};

/**
 * Toggle animation for a card
 */
const toggleCardsAnimation = () => {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.remove('hidden');
    }, 250 * i);
  });
};

/**
 * Animate the search form from original center position to a top position
 * if needed
 */
const moveSearchFormToTop = () => {
  const searchForm = document.querySelector('.search-form');
  if (searchForm.classList.contains('full-height')) {
    searchForm.classList.remove('full-height');
  }
};

/**
 * Remove all result's card from the DOM
 */
const cleanSearchResult = () => {
  const resultsCards = document.querySelectorAll('.card-col');
  if (resultsCards) {
    resultsCards.forEach((card) => {
      card.parentNode.removeChild(card);
    });
  }
};

// added a truncate static method to String prototype
String.prototype.truncate = function(len) {
  return (this.length > len)
    ? this.substring(0, len) + '...'
    : this.substring(0, this.length);
};
