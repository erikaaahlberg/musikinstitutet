const searchButton = document.getElementsByClassName('searchButton');
/* Loops thru the searchRadioButtons then runs Fetch class. */
for (i = 0; i < searchButton.length; i++) {
    searchButton[i].addEventListener('click', function() {
        const activateButton = new DOMHandle(this);
        activateButton.activateSearchButton();
        const newFetch = new FetchHandle(this.value);
        newFetch.fetchAlbums();
    })
}

/* Handles all fetch queries. */
class FetchHandle {
    /* If a value is sent to the constructor it is available for all
     * methods in the class. apiPath is the folksa.ga/api/->this<-/ */
    constructor(apiPath) {
        this.apiPath = apiPath;
    }

    /* Fetches all the albums using this.apiPath which is available in the class */
    fetchAlbums() {
        fetch(`https://folksa.ga/api/albums?key=flat_eric`)
            .then((response) => response.json())
            .then((albums) => {
                /* Empty array that will contain the artist-data. */
                let promiseArray = [];
                /* For every album, a new fetch request is initiated to retreive more
                 * data. For instance, the artist name. */
                for (let i = 0; i < albums.length; i++) {
                    const artistPromise = fetch(`https://folksa.ga/api/artists/${albums[i].artists}?key=flat_eric`)
                        .then((response) => response.json())
                    promiseArray.push(artistPromise);
                }
                /* Promise.all is used for the entire promiseArray. Values are then sent
                 * to the DOMHandle.displayAlbums function. */
                Promise.all(promiseArray)
                    .then((allArtists) => {
                        const displayAlbum = new DOMHandle();
                        displayAlbum.displayAlbums(albums, allArtists);
                    })
            });
    }

}

/* Handles the DOM. */
class DOMHandle {
    /* The constructor accepts a JSON-object that is available to all methods. */
    constructor(json) {
        this.json = json;
    }

    activateSearchButton() {
        const checkButton = this.json
        /* Loops thru the buttons and removes the activeButton class */
        for (i = 0; i < searchButton.length; i++) {
            searchButton[i].classList.remove('activeButton');
        }
        /* Adds the activeButton class to selected button */
        checkButton.classList.add('activeButton');
    }

    /* Console logs the JSON-object. Doesn't add anything to the DOM right now. */
    displayAlbums(allAlbums, allArtists) {
        console.log(allAlbums, allArtists);
        const searchResults = document.getElementById('searchResults');
        let searchedAlbumButtons = '';
        /* Loops json object */
        for (let i = 0; i < allAlbums.length; i++) {
            /* Storing the albums in a button */
            searchedAlbumButtons += `
                <button class="searchedAlbumButton" id="${allAlbums[i]._id}">
                    ${allArtists[i].name}
                    ${allAlbums[i].title}
                    ${allAlbums[i].releaseDate}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }
        /* Prints the search results for Albums */
        searchResults.innerHTML = searchedAlbumButtons;
    }
}

class Controller {

}
