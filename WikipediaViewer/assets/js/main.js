// not perfect, but for now works...
window.onload = main();

/**
 * Main script, do the magic ¿?
 */
function main() {
  const searchInput = document.querySelector('#wiki_search');
  searchInput.onkeyup = function (e) {
    // not so pretty, but do the thing...
    if (searchInput.classList.contains('error')) {
      searchInput.classList.remove('error');
    }

    // onlly continue if enter key is press
    if (e.keyCode !== 13) {
      return;
    }

    // save search value
    const searchValue = this.value.trim();

    // only serach if the input has char
    if (searchValue === '') {
      return;
    }

    searchOnWikipedia(searchValue)
    .then(data => showResults(data.query.pages))
    .catch(error => showErrorSearch(error));
  };

  searchInput.onclick = function (e) {
    cleanUpSearchInput();
  };
}

/**
 * Search on wikipedia
 * @param  String query
 */
function searchOnWikipedia(query) {
  return new Promise((resolve, reject) => {
    const url = `https://crossorigin.me/https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=${query}`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
          // const data = JSON.parse(xhr.responseText);
          // showResults(data.query.pages);
        } else {
          const error = 'Ups!, something goes wrong. Please, try agan.';
          reject(error);
          // showErrorSearch(error);
        }
      }
    };
    xhr.send();
  });
}

/**
 * Populate the DOM with the result from wikipedia
 * @param  Json results
 */
function showResults(results) {
  moveSearchFormToTop();
  cleanSearchResult();
  for(const id in results) {
    insertNewHtmlCard(results[id]);
  }
  toggleCardsAnimation();
}

/**
 * Show error on the dom element that recive
 * @param  error
 */
function showErrorSearch(error) {
  const searchInput = document.querySelector('#wiki_search');
  if (!searchInput.classList.contains('error')) {
    searchInput.classList.add('error');
  }
  searchInput.value = error;
}

/**
 * Delete previous search query and remove error class from search input
 */
function cleanUpSearchInput() {
  const searchInput = document.querySelector('#wiki_search');
  searchInput.value = '';
  if (searchInput.classList.contains('error')) {
    searchInput.classList.remove('error');
  }
}

/**
 * Creates a result's card
 * @param  Json result
 */
function insertNewHtmlCard(result) {
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
}

/**
 * Toggle animation for a card
 */
function toggleCardsAnimation() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.remove('hidden');
    }, 250 * i);
  });
}

/**
 * Animate the search form from original center position to a top position
 * if needed
 */
function moveSearchFormToTop() {
  const searchForm = document.querySelector('.search-form');
  if (searchForm.classList.contains('full-height')) {
    searchForm.classList.remove('full-height');
  }
}

/**
 * Remove all result's card from the DOM
 */
function cleanSearchResult() {
  const resultsCards = document.querySelectorAll('.card-col');
  if (resultsCards) {
    resultsCards.forEach((card) => {
      card.parentNode.removeChild(card);
    });
  }
}

// added a truncate static method to String prototype
String.prototype.truncate = function(len) {
  return (this.length > len)
    ? this.substring(0, len) + '...'
    : this.substring(0, this.length);
};
