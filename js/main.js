const searchButton = document.getElementsByClassName('searchButton');
/* Loops thru the searchRadioButtons then runs Fetch class. */
for (i = 0; i < searchButton.length; i++) {
    searchButton[i].addEventListener('click', function() {
        const activateButton = new DOMHandle();
        activateButton.activateSearchButton(this);
        const newFetch = new FetchHandle(this.value);
        if (this.value === 'albums') {
            newFetch.fetchAlbums();
        } else if (this.value === 'tracks') {
            newFetch.fetchTracks();
        }
        else if (this.value === 'artists') {
            newFetch.fetchArtists();
        }
        else if (this.value === 'playlists') {
            newFetch.fetchPlaylists();
        }
    });
}

/* Handles all fetch queries. */
class FetchHandle {
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
    fetchTracks() {
        fetch(`https://folksa.ga/api/tracks?key=flat_eric`)
            .then((response) => response.json())
            .then((tracks) => {
                const displayTrack = new DOMHandle();
                displayTrack.displayTracks(tracks);
            });
    }
    fetchArtists() {
        fetch(`https://folksa.ga/api/artists?key=flat_eric`)
            .then((response) => response.json())
            .then((artists) => {
                const displayArtist = new DOMHandle();
                displayArtist.displayArtists(artists);
            });
    }
    fetchPlaylists() {
        fetch(`https://folksa.ga/api/playlists?key=flat_eric`)
            .then((response) => response.json())
            .then((playlists) => {
                const displayPlaylist = new DOMHandle();
                displayPlaylist.displayPlaylists(playlists);
            });
    }
    fetchAlbumById(albumId){
        fetch(`https://folksa.ga/api/albums/${albumId}?key=flat_eric`)
            .then((response) => response.json())
            .then((album) => {
            const displaySpecificAlbum = new DOMHandle();
            displaySpecificAlbum.displaySpecificAlbum(album);
            });
    }

}

/* Handles the DOM. */
class DOMHandle {
    activateSearchButton(value) {
        const checkButton = value;
        /* Loops thru the buttons and removes the activeButton class */
        for (i = 0; i < searchButton.length; i++) {
            searchButton[i].classList.remove('activeButton');
        }
        /* Adds the activeButton class to selected button */
        checkButton.classList.add('activeButton');
    }

    /* Console logs the JSON-object. Doesn't add anything to the DOM right now. */
    displayAlbums(allAlbums, allArtists) {
        const searchResults = document.getElementById('searchResults');
        let searchedAlbumButtons = '';
        /* Loops json object */
        for (let i = 0; i < allAlbums.length; i++) {
            /* Storing the albums in a button */
            searchedAlbumButtons += `
                <button class="selectedButton" id="${allAlbums[i]._id}">
                    ${allArtists[i].name} -
                    ${allAlbums[i].title} -
                    ${allAlbums[i].releaseDate}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }
        /* Prints the search results for Albums */
        searchResults.innerHTML = searchedAlbumButtons;
        
        const selectedButton = document.
        getElementsByClassName('selectedButton');

        for (i = 0; i < selectedButton.length; i++) {
            selectedButton[i].addEventListener('click', function(){
                const newFetch = new FetchHandle();
                newFetch.fetchAlbumById(this.id);
            })
        }
        
    }
    displayTracks(allTracks) {
        const searchResults = document.getElementById('searchResults');
        let searchedTrackButtons = '';
        for (let i = 0; i < allTracks.length; i++) {
            searchedTrackButtons += `
                <button class="searchedTrackButton" id="${allTracks[i]._id}">
                    ${allTracks[i].title} -
                    ${allTracks[i].artists[0].name}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }
        searchResults.innerHTML = searchedTrackButtons;
    }
    displayArtists(allArtists) {
        const searchResults = document.getElementById('searchResults');
        let searchedArtistButtons = '';
        for (let i = 0; i < allArtists.length; i++) {
            searchedArtistButtons += `
                <button class="searchedArtistButton" id="${allArtists[i]._id}">
                    ${allArtists[i].name}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }
        searchResults.innerHTML = searchedArtistButtons;
    }
    displayPlaylists(allPlaylists) {
        const searchResults = document.getElementById('searchResults');
        let searchedPlaylistButtons = '';
        for (let i = 0; i < allPlaylists.length; i++) {
            searchedPlaylistButtons += `
                <button class="searchedPlaylistButton" id="${allPlaylists[i]._id}">
                    ${allPlaylists[i].title}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }
        searchResults.innerHTML = searchedPlaylistButtons;
    }
    displaySpecificAlbum(album){
        console.log(album)
        const searchResults = document.getElementById('searchResults');
        
        let contentOfSpecificAlbum =`
            <div class="contentOfSpecificAlbum">
                <div id="albumTopContent">
                    <img src="${album.coverImage}">
                    <div id="albumInfo">
                        <h2>${album.title}</h2>
                        <p>By ${album.artist}</p>
                        <p>Rating: ${album.rating}</p>
                    </div>
                </div>
                <div class="underline"></div>
                <h3>Tracklist:</h3>
                <div id="albumTracklist"></div>
            </div>
        `
        searchResults.innerHTML = contentOfSpecificAlbum;

        let trackTitles = "";
        for (let i = 0; i < album.tracks.length; i++) {
            trackTitles += `<p>${album.tracks[i].title}</p>`
        }
        
        const albumTracklist = document.getElementById('albumTracklist');
        
        albumTracklist.innerHTML=trackTitles;
        
    }
}

class Controller {
    getInputValue(elementId) {
        const element = getElementById(elementId);
        return element.value;
    }
}
