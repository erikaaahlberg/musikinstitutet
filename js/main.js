const searchButton = document.getElementsByClassName('searchButton');
/* Loops thru the searchRadioButtons then runs Fetch class. */
for (i = 0; i < searchButton.length; i++) {
    searchButton[i].addEventListener('click', function() {
        const activateButton = new DOMHandle();
        activateButton.activateSearchButton(this);
        const newFetch = new FetchHandle(this.value);
        switch (this.value) {
            case 'albums':
                newFetch.fetchAlbums();
                break;
            case 'tracks':
                newFetch.fetchTracks();
                break;
            case 'artists':
                newFetch.fetchArtists();
                break;
            case 'playlists':
                newFetch.fetchPlaylists();
                break;
        }
    });
}

const searchField = document.getElementById('searchField');
searchField.addEventListener('keyup', () => {
    const filterRequest = new DOMHandle();
    filterRequest.filterSearch();
});

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
                        displayAlbum.filterSearch();
                    })
            });
    }
    fetchTracks() {
        fetch(`https://folksa.ga/api/tracks?key=flat_eric`)
            .then((response) => response.json())
            .then((tracks) => {
                const displayTrack = new DOMHandle();
                displayTrack.displayTracks(tracks);
                displayTrack.filterSearch();
            });
    }
    fetchArtists() {
        fetch(`https://folksa.ga/api/artists?key=flat_eric`)
            .then((response) => response.json())
            .then((artists) => {
                const displayArtist = new DOMHandle();
                displayArtist.displayArtists(artists);
                displayArtist.filterSearch();
            });
    }
    fetchPlaylists() {
        fetch(`https://folksa.ga/api/playlists?key=flat_eric`)
            .then((response) => response.json())
            .then((playlists) => {
                const displayPlaylist = new DOMHandle();
                displayPlaylist.displayPlaylists(playlists);
                displayPlaylist.filterSearch();
            });
    }
    fetchAlbumById(albumId){
        fetch(`https://folksa.ga/api/albums/${albumId}?key=flat_eric`)
            .then((response) => response.json())
            .then((album) => {
           fetch(`https://folksa.ga/api/artists/${album.artists[0]._id}?key=flat_eric`)
                .then((response) => response.json())
                .then((artist) => {

                const displaySpecificAlbum = new DOMHandle();
                displaySpecificAlbum.displaySpecificAlbum(album, artist);
            })

        });
    }
    fetchTrackById(trackId){
        fetch(`https://folksa.ga/api/tracks/${trackId}?key=flat_eric`)
            .then((response) => response.json())
            .then((track) => {

            fetch(`https://folksa.ga/api/artists/${track.artists[0]._id}?key=flat_eric`)
                .then((response) => response.json())
                .then((artist) => {

            const displaySpecificTrack = new DOMHandle();
            displaySpecificTrack.displaySpecificTrack(track, artist);
        });
        });
    }
    fetchArtistById(artistId){
        fetch(`https://folksa.ga/api/artists/${artistId}?key=flat_eric`)
            .then((response) => response.json())
            .then((artist) => {
            
            let albumArray = [];
            for (let i = 0; i < artist.albums.length; i++){
                    
                const albumPromise = fetch(`https://folksa.ga/api/albums/${artist.albums[i]}?key=flat_eric`)
                .then((response) => response.json())
                albumArray.push(albumPromise);
            }
            
            Promise.all(albumArray)
            .then((albums) => {
                
            const displaySpecificArtist = new DOMHandle();
            displaySpecificArtist.displaySpecificArtist(artist, albums);

            });
        });
    }
    fetchPlaylistById(playlistId){
         fetch(`https://folksa.ga/api/playlists/${playlistId}?key=flat_eric`)
            .then((response) => response.json())
            .then((playlist) => {

             const displaySpecificPlaylist = new DOMHandle();
            displaySpecificPlaylist.displaySpecificPlaylist(playlist);
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
                <button class="selectedButton" id="${allTracks[i]._id}">
                    ${allTracks[i].title} -
                    ${allTracks[i].artists[0].name}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }
        searchResults.innerHTML = searchedTrackButtons;

        const selectedButton = document.
        getElementsByClassName('selectedButton');

        for (i = 0; i < selectedButton.length; i++) {
            selectedButton[i].addEventListener('click', function(){
                const newFetch = new FetchHandle();
                newFetch.fetchTrackById(this.id);
            })
        }
    }
    displayArtists(allArtists) {
        const searchResults = document.getElementById('searchResults');
        let searchedArtistButtons = '';
        for (let i = 0; i < allArtists.length; i++) {
            searchedArtistButtons += `
                <button class="selectedButton" id="${allArtists[i]._id}">
                    ${allArtists[i].name}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }
        searchResults.innerHTML = searchedArtistButtons;

       const selectedButton = document.
        getElementsByClassName('selectedButton');
        for (i = 0; i < selectedButton.length; i++){
        selectedButton[i].addEventListener('click', function(){
            const newFetch = new FetchHandle();
            newFetch.fetchArtistById(this.id);
            })
        }
    }
    displayPlaylists(allPlaylists) {
        const searchResults = document.getElementById('searchResults');
        let searchedPlaylistButtons = '';
        for (let i = 0; i < allPlaylists.length; i++) {
            searchedPlaylistButtons += `
                <button class="selectedButton" id="${allPlaylists[i]._id}">
                    ${allPlaylists[i].title}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }
        searchResults.innerHTML = searchedPlaylistButtons;

               const selectedButton = document.
        getElementsByClassName('selectedButton');
        for (i = 0; i < selectedButton.length; i++){
        selectedButton[i].addEventListener('click', function(){
            const newFetch = new FetchHandle();
            newFetch.fetchPlaylistById(this.id);
            })
        }
    }
    displaySpecificAlbum(album, artist){
        const searchResults = document.getElementById('searchResults');
        let contentOfSpecificAlbum =`
            <div class="contentOfSpecificAlbum">
                <div id="albumTopContent">
                    <img src="${album.coverImage}">
                    <div id="albumInfo">
                        <h2>${album.title}</h2>
                        <p>By ${artist.name}</p>
                        <p>Rating: ${album.rating}</p>
                    </div>
                </div>
                <button id="rateAlbum">
                    RATE ALBUM
                </button>
                <button id="deleteAlbum">
                    DELETE ALBUM
                </button>
                <div class="underline"></div>
                <h3>Tracklist:</h3>
                <div id="albumTracklist"></div>
            </div>
        `
        searchResults.innerHTML = contentOfSpecificAlbum;

        let trackTitles = "";
        for (let i = 0; i < album.tracks.length; i++) {
            trackTitles += `
                <button class="albumTrack">
                    ${album.tracks[i].title}
                    <img src="images/rightArrow.svg">
                </button>
            `
        }
    
        const albumTracklist = document.getElementById('albumTracklist');

        albumTracklist.innerHTML=trackTitles;

    }
    displaySpecificTrack(track, artist){
        const searchResults = document.getElementById('searchResults');
        let contentOfSpecificTrack =`
            <div class="contentOfSpecificTrack">
                <div id="trackTopContent">
                    <div id="trackInfo">
                        <h2>${track.title}</h2>
                        <p>By ${artist.name}</p>
                        <p>In album: ${track.album.title}</p>
                    </div>
                </div>
                <button id="addToPlaylist">
                    ADD TO PLAYLIST
                </button>
                <button id="rateTrack">
                    RATE TRACK
                </button>
                <button id="deleteTrack">
                    DELETE TRACK
                </button>
            </div>
        `
        searchResults.innerHTML = contentOfSpecificTrack;
    }
    displaySpecificArtist(artist, albums){
        const searchResults = document.getElementById('searchResults');
        let contentOfSpecificArtist =`
            <div class="artistContent">
                <img src="${artist.image}">
                ${artist.name}
                ${artist.genres}
                ${artist.countryBorn}
                ${artist.born}
                <button id="deleteArtist">
                    DELETE ARTIST
                </button>
                <div id="artistAlbums"></div>
            </div>
        `
        searchResults.innerHTML = contentOfSpecificArtist;
        console.log(albums)
        let artistAlbum = "";
        for(let i = 0; i < albums.length; i++){
            artistAlbum +=`
                <button class="selectedButton" id="${albums[i]._id}">
                    ${albums[i].title} -
                    ${albums[i].releaseDate}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }
        const albumList = document.getElementById('artistAlbums');
        albumList.innerHTML=artistAlbum;
    }
    displaySpecificPlaylist(playlist){
        console.log(playlist)
        console.log(playlist.title)
        console.log(playlist.createdAt)
        console.log(playlist.updatedAt)
        console.log(playlist.genres)
        console.log(playlist.ratings)
        console.log(playlist.comments)
        console.log(playlist.tracks)
    }
    filterSearch() {
        const filter = searchField.value.toUpperCase();
        const buttons = searchResults.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
             buttons[i].style.display = 'flex';
            } else {
             buttons[i].style.display = 'none';
            }
        }
        if (filter == '') {
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].style.display = 'none';
            }
        }
    }
}

class Controller {
    getInputValue(elementId) {
        const element = getElementById(elementId);
        return element.value;
    }
    checkValue(value) {
        if(value && value != '') {
            return true;
        }
        else {
            return false;
        }
    }
}
/*
const postArtistButton = getElementById('postArtistButton');
const postAlbumButton = getElementById('postAlbumButton');
const postTrackButton = getElementById('postTrackButton');

postArtistButton.addEventListener('click', function(){
    const artistName = Controller.getInputValue('inputArtistName');
    const isNameValid = Controller.checkValue(artistName);
    const artistGenres = Controller.getInputValue('inputArtistGenres');
    const isGenresValid = Controller.checkValue(artistGenres);
    const artistCoverImage = Controller.getInputValue('inputArtistCoverImage');
    const isCoverImageValid = Controller.checkValue(artistCoverImage);

    const errorMessages = [];
    if (!isNameValid) {
        errorMessages.push('The name you wrote is not valid');
    }
    if (!isGenresValid) {
        errorMessages.push('The genres you wrote is not valid');
    }
    if (!isCoverImageValid) {
        errorMessages.push('The cover image URL is not valid');
    }
});*/
