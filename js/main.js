const searchButton = document.getElementsByClassName('searchButton');
const mainOutput = document.getElementById('mainOutput');
const searchResults = document.getElementById('searchResults');
const searchField = document.getElementById('searchField');
const mainAnimationTime = 400;

class Init {
    initiateEventListeners() {
        /* Loops thru the searchRadioButtons then runs Fetch class. */
        for (let i = 0; i < searchButton.length; i++) {
            searchButton[i].addEventListener('click', function() {
                const activateButton = new DOMHandle();
                activateButton.activateSearchButton(this);
                const newFetch = new FetchHandle();
                mainOutput.innerHTML = '<div id="searchResults"></div>';
                switch (this.value) {
                    case 'all':
                        newFetch.fetchAll();
                        break;
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
                        newFetch.fetchTopPlaylists();
                        break;
                }
            });
        }

        searchField.addEventListener('keyup', () => {
            const filterRequest = new DOMHandle();
            filterRequest.filterSearch();
        });

        const createAlbumButton = document.getElementById('createAlbumButton');

        createAlbumButton.addEventListener('click', function(){
            const createAlbum = new DOMHandle();
            createAlbum.createAlbumContent();
        });

        const createArtistButton = document.getElementById('createArtistButton');
        createArtistButton.addEventListener('click', function(){
            const createArtist = new DOMHandle();
            createArtist.createArtistContent();
        });

        const createPlaylistButton = document.getElementById('createPlaylistButton');
        createPlaylistButton.addEventListener('click', function(){
            const createPlaylist = new DOMHandle();
            createPlaylist.createPlaylistContent();
        });
    }
}

/* Handles all fetch queries. */
class FetchHandle {

    /* ----ADDED BY ERIKA----- */
    constructor (method, body) {
        this.method = method;
        this.headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
        this.body = JSON.stringify(body);
    }
    /*---------- */
    fetchAll() {
        this.fetchAlbums()
        this.fetchTracks()
        this.fetchArtists()
        this.fetchPlaylists()
    }

    /* Fetches all the albums using this.apiPath which is available in the class */
    fetchAlbums() {
        fetch(`https://folksa.ga/api/albums?populateArtists=true&limit=999&key=flat_eric`)
            .then((response) => response.json())
            .then((albums) => {
                const displayTrack = new DOMHandle();
                for (let i = 0; i < albums.length; i++) {
                    if (!albums[i].artists[0]) {
                        albums[i].artists[0] = { name: 'No name', _id: false };
                    }
                }
                displayTrack.displayAlbums(albums);
                displayTrack.filterSearch();
            });
    }

    fetchTracks() {
        fetch(`https://folksa.ga/api/tracks?limit=999&key=flat_eric`)
            .then((response) => response.json())
            .then((tracks) => {
                const displayTrack = new DOMHandle();
                for (let i = 0; i < tracks.length; i++) {
                    if (!tracks[i].artists[0]) {
                        tracks[i].artists[0] = { name: 'No name', _id: false };
                    }
                }
                displayTrack.displayTracks(tracks);
                displayTrack.filterSearch();
            });
    }
    fetchArtists() {
        fetch(`https://folksa.ga/api/artists?limit=999&key=flat_eric`)
            .then((response) => response.json())
            .then((artists) => {
                const displayArtist = new DOMHandle();
                displayArtist.displayArtists(artists);
                displayArtist.filterSearch();
            });
    }
    fetchPlaylists() {
        fetch(`https://folksa.ga/api/playlists?limit=999&key=flat_eric`)
            .then((response) => response.json())
            .then((playlists) => {
                const displayPlaylist = new DOMHandle();
                displayPlaylist.displayPlaylists(playlists);
                displayPlaylist.filterSearch();
            });
    }
    fetchTopPlaylists() {
        fetch(`https://folksa.ga/api/playlists?limit=999&key=flat_eric`)
            .then((response) => response.json())
            .then((playlists) => {
                const topPlaylists = new Logic();
                const sortedList = topPlaylists.determineTopPlaylists(playlists);
                const displayTop = new DOMHandle();
                displayTop.displayTopPlaylist(sortedList);
            });
    }
    fetchAlbumById(albumId) {
        fetch(`https://folksa.ga/api/albums/${albumId}?key=flat_eric`)
            .then((response) => response.json())
            .then((album) => {
                if (!album.artists[0]) {
                    album.artists[0] = { name: 'No name', _id: false };
                }
                const displaySpecificAlbum = new DOMHandle();
                displaySpecificAlbum.displaySpecificAlbum(album);
            });
    }
    fetchTrackById(trackId) {
        fetch(`https://folksa.ga/api/tracks/${trackId}?key=flat_eric`)
            .then((response) => response.json())
            .then((track) => {
                if (!track.artists[0]) {
                    track.artists[0] = { name: 'No name', _id: false };
                }
                const displaySpecificTrack = new DOMHandle();
                displaySpecificTrack.displaySpecificTrack(track);
            });
    }
    fetchArtistById(artistId) {
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

    /* ----- ADDED BY ERIKA ----- */
    fetchItemByChosenParameter(item, parameter, itemName) {
        return fetch(`https://folksa.ga/api/${item}?${parameter}=${itemName}&key=flat_eric`)
            .then((response) => response.json())
                .then((fetchedItem) => {
                    return fetchedItem;
                });
    }
    /* -------------- */

    fetchPlaylistById(playlistId) {
        fetch(`https://folksa.ga/api/playlists/${playlistId}?key=flat_eric`)
            .then((response) => response.json())
            .then((playlist) => {
                let commentArray = [];
                for (let i = 0; i < playlist.comments.length; i++) {
                    const commentPromise = fetch(`https://folksa.ga/api/playlists/${playlistId}/comments?key=flat_eric`)
                    .then((response) => response.json())
                        commentArray.push(commentPromise);
                }
                Promise.all(commentArray)
                    .then((comments) => {
                        const displaySpecificPlaylist = new DOMHandle();
                        displaySpecificPlaylist.displaySpecificPlaylist(playlist, comments);
                    });
            });
    }
    addPlayListComment(body, user, playlistId, comments) {
        let comment = {
          playlist: playlistId,
          body: body,
          username: user
        }
        fetch(`https://folksa.ga/api/playlists/${playlistId}/comments?key=flat_eric`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
          })
          .then((response) => response.json())
          .then((comment) => {

            const newFetch = new FetchHandle();
            newFetch.fetchPlaylistById(comment.playlist);

          });

    }
    rateStuff(apiPath, id, rating) {
        const display = new DOMHandle;
        fetch(`https://folksa.ga/api/${apiPath}/${id}/vote?key=flat_eric`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating: rating })
        })
            .then((response) => response.json())
                .then((vote) => {
                    if (apiPath == 'albums') {
                        this.fetchAlbumById(id);
                    }
                    if (apiPath == 'playlists') {
                        this.fetchPlaylistById(id);
                    }
                    if (apiPath == 'tracks') {
                        this.fetchTrackById(id);
                    }
                })
                    .catch((error) => {
                        display.displayPopup([error]);
                    });
    }
    /*--------ADDED BY ERIKA----------- */
    postItem (itemToPost, HttpRequest) {
        const theItem = itemToPost.slice(0, -1);
        const display = new DOMHandle;
        fetch(`https://folksa.ga/api/${itemToPost}?&key=flat_eric`, HttpRequest)
            .then((response) => response.json())
                .then((postedItem) => {
                    display.displayPopup([`The ${theItem} was successfully added!`]);
                })
                    .catch((errorMessage) => {
                        display.displayPopup([errorMessage]);
                    });
    }
    deleteItem (itemToDelete, idToDelete) {
        const theItem = itemToDelete.slice(0, -1);
        fetch(`https://folksa.ga/api/${itemToDelete}/${idToDelete}?&key=flat_eric`,
        {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
                .then((deletedItem) => {
                    const display = new DOMHandle;
                    display.displayPopup([`The ${theItem} was successfully deleted!`]);
                })
                    .catch((errorMessage) => {
                        const displayError = new DOMHandle;
                        displayError.displayPopup([errorMessage]);
                    });
    }
    /*---------------- */
}

/* Handles the DOM. */
class DOMHandle {
    activateSearchButton(value) {
        const checkButton = value;
        this.deactivateSearchButtons();
        /* Adds the activeButton class to selected button */
        checkButton.classList.add('activeButton');
    }
    loadingIndicator(div) {
        const loading = `<div class="spinner">
                            <div class="bounce1"></div>
                            <div class="bounce2"></div>
                            <div class="bounce3"></div>
                        </div>`
        return loading;
    }
    deactivateSearchButtons() {
        for (let sbutton of searchButton) {
            sbutton.classList.remove('activeButton');
        }
    }

    displayAll(allAlbums, allTracks, allArtists, allPlaylists) {
        this.displayAlbums(allAlbums);
        this.displayTracks(allTracks);
        this.displayArtists(allArtists);
        this.displayPlaylists(allPlaylists);
    }

    /* Console logs the JSON-object. Doesn't add anything to the DOM right now. */
    displayAlbums(allAlbums) {
        let searchedAlbumButtons = '';
        /* Loops json object */



        const searchResult = document.getElementById('searchResults')

        for (let i = 0; i < allAlbums.length; i++) {
            /* Storing the albums in a button */
            searchedAlbumButtons += `
                <button class="showByIdButton" id="${allAlbums[i]._id}" data-genre="${this.displayGenres(allAlbums[i])}">
                    ${allAlbums[i].artists[0].name} –
                    ${allAlbums[i].title}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }

        /* Prints the search results for Albums */
        searchResult.insertAdjacentHTML('beforeend', searchedAlbumButtons);

        const showByIdButton = document.
        getElementsByClassName('showByIdButton');

        for (let i = 0; i < showByIdButton.length; i++) {
            showByIdButton[i].addEventListener('click', function() {

                const deActivate = new DOMHandle();
                deActivate.deactivateSearchButtons();
               deActivate.fadeOutAnimation(mainOutput, 'add');

                setTimeout( () =>{
                    const newFetch = new FetchHandle();
                    newFetch.fetchAlbumById(this.id);
                    mainOutput.innerHTML = deActivate.loadingIndicator();
                }, mainAnimationTime)
            })
        }


    }
    displayTracksInSelector(allTracks) {
        const selector = document.getElementById('trackSelector');
        let i = 0;
        for (let track of allTracks) {
            const option = document.createElement('option');
            var artist = track[i].artists; //[i].name;
            var title = track[i].title;
            option.text = `${artist} - ${title}`;
            selector.add(option);
            i++;
        }
    }
    displayTracks(allTracks) {

        const newFetch = new FetchHandle();
        const deActivate = new DOMHandle();
        const searchResult = document.getElementById('searchResults');

        let searchedTrackButtons = '';
        for (let i = 0; i < allTracks.length; i++) {
            searchedTrackButtons += `
                <button class="showByIdButton" id="${allTracks[i]._id}" data-genre="${this.displayGenres(allTracks[i])}">
                    ${allTracks[i].title} -
                    ${allTracks[i].artists[0].name}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }

        searchResult.insertAdjacentHTML('beforeend', searchedTrackButtons);

        const showByIdButton = document.
        getElementsByClassName('showByIdButton');

        for (let i = 0; i < showByIdButton.length; i++) {
            showByIdButton[i].addEventListener('click', function() {
                deActivate.deactivateSearchButtons();
                deActivate.fadeOutAnimation(mainOutput, 'add');
                setTimeout( () => {
                    newFetch.fetchTrackById(this.id);
                }, mainAnimationTime);
            });
        }
   }
    //CLEANED
    displayArtists(allArtists) {

        const deActivate = new DOMHandle();
        const newFetch = new FetchHandle();
        const searchResult = document.getElementById('searchResults');

        let searchedArtistButtons = '';
        for (let i = 0; i < allArtists.length; i++) {
            searchedArtistButtons += `
                <button class="showByIdButton" id="${allArtists[i]._id}" data-genre="${this.displayGenres(allArtists[i])}">
                    ${allArtists[i].name}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }

        searchResult.insertAdjacentHTML('beforeend', searchedArtistButtons);

        const showByIdButton = document.
        getElementsByClassName('showByIdButton');
        for (let i = 0; i < showByIdButton.length; i++) {
            showByIdButton[i].addEventListener('click', function() {
                deActivate.deactivateSearchButtons();
                deActivate.fadeOutAnimation(mainOutput, 'add');
                setTimeout( () => {
                    newFetch.fetchArtistById(this.id);
                }, mainAnimationTime);
            });
        }

    }
    //CLEANED
    displayPlaylists(allPlaylists) {

        const newFetch = new FetchHandle();
        const deActivate = new DOMHandle();
        const searchResult = document.getElementById('searchResults');

        let searchedPlaylistButtons = '';
        for (let i = 0; i < allPlaylists.length; i++) {
            searchedPlaylistButtons += `
                <button class="showByIdButton" id="${allPlaylists[i]._id}" data-genre="${this.displayGenres(allPlaylists[i])}">
                    ${allPlaylists[i].title}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }

        searchResult.insertAdjacentHTML('beforeend', searchedPlaylistButtons);

        const showByIdButton = document.
        getElementsByClassName('showByIdButton');
        for (let i = 0; i < showByIdButton.length; i++) {
            showByIdButton[i].addEventListener('click', function() {
                deActivate.deactivateSearchButtons();
                deActivate.fadeOutAnimation(mainOutput, 'add');
                setTimeout( () => {
                    newFetch.fetchPlaylistById(this.id);
                }, mainAnimationTime);
            });
        }

    }
    //CLEANED
    displayTopPlaylist(list) {

        const newDOM = new DOMHandle();
        const newFetch = new FetchHandle();

        let topPlaylistsButtons = `
            <div class="topFivePlayLists">
            <p>THE HIGHEST RATED PLAYLISTS</p>`;

        for (let i = 0; i < list.length; i++) {
            if (i == 5) { break; }
            /* Storing the albums in a button */
            topPlaylistsButtons += `
                    <button class="topPlaylistsButton" id="${list[i].id}">
                        ${list[i].title} -
                        ${list[i].rating}
                        <img src="images/rightArrow.svg">
                    </button>
            `;
        }
        topPlaylistsButtons += '</div>';
        mainOutput.insertAdjacentHTML('beforeend', topPlaylistsButtons);
        const playListButtons = document.getElementsByClassName('topPlaylistsButton');
        this.everyOtherButton(playListButtons);

        for (i = 0; i < playListButtons.length; i++) {
            playListButtons[i].addEventListener('click', function() {
                newDOM.fadeOutAnimation(mainOutput, 'add');
                setTimeout( () => {
                    newFetch.fetchPlaylistById(this.id);
                    newDOM.deactivateSearchButtons();
                }, mainAnimationTime)
            })
        }
    }
    //CLEANED
    displaySpecificAlbum(album) {

        const fetchRating = new Logic();
        const newDOM = new DOMHandle();
        const newFetch = new FetchHandle();

        let contentOfSpecificAlbum = `
            <div id="contentOfSpecificAlbum">
                <div id="albumTopContent">
                    <img src="${album.coverImage}">
                    <div id="albumInfo">
                        <h2>${album.title}</h2>
                        <p id="artistName"> ${album.artists[0].name}</p>
                        <p id="genres"><span>Genres:</span> ${album.genres}</p>
                        <p id="releaseDate"><span>Released:</span> ${album.releaseDate}</p>
                        <p id="rating">Rating: ${fetchRating.calculateRating(album)}</p>
                        <div id="buttonWrapper">
                            <input type="number" id="ratingNumber" placeholder="+/-" min="1" max="10">
                            <button id="rateAlbum">
                                RATE ALBUM
                            </button>
                            <button id="deleteAlbum">
                                DELETE ALBUM
                            </button>
                        </div>
                    </div>
                </div>
                <div class="underline"></div>
                <h3>TRACKLIST</h3>
                <div id="albumTracklist"></div>
            </div>
        `;
        mainOutput.innerHTML=contentOfSpecificAlbum;
        newDOM.fadeOutAnimation(mainOutput, 'remove');

        const deleteButton = document.getElementById('deleteAlbum');
        deleteButton.addEventListener('click', () => {
            newFetch.deleteItem('albums', album._id);
            const albumsButton = document.getElementById('albumsButton');
            const albumDiv = document.getElementById('contentOfSpecificAlbum');
            this.fadeOutAnimation(albumDiv, 'add');
            setTimeout(() => {
                mainOutput.innerHTML='<div id="searchResults"></div>';
                this.activateSearchButton(albumsButton);
                newFetch.fetchAlbums();
            }, mainAnimationTime);
        });

        let trackTitles = "";

        for (let i = 0; i < album.tracks.length; i++) {
            trackTitles += `
                <button class="albumTrackButton" id="${album.tracks[i]._id}">
                    ${album.tracks[i].title}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }

        const albumTracklist = document.getElementById('albumTracklist');

        albumTracklist.innerHTML=trackTitles;

        const albumTrackButton = document.
        getElementsByClassName('albumTrackButton');

        for (i = 0; i < albumTrackButton.length; i++) {
            albumTrackButton[i].addEventListener('click', function() {
                newDOM.fadeOutAnimation(mainOutput, 'add');
                setTimeout( () => {
                    newFetch.fetchTrackById(this.id);
                }, mainAnimationTime)
            })
        }

        const rateAlbum = document.getElementById('rateAlbum');
        rateAlbum.addEventListener('click', () => {
            const ratingNumber = document.getElementById('ratingNumber').value;
            const thisAlbumId = album._id;
            newFetch.rateStuff('albums', thisAlbumId, ratingNumber);
            newFetch.fetchAlbumById(thisAlbumId);
        });

        newDOM.everyOtherButton(albumTrackButton);
    }
    //CLEANED
    displaySpecificTrack(track) {

        const fetchRating = new Logic();
        const newFetch = new FetchHandle();
        const newDOM = new DOMHandle();

        let contentOfSpecificTrack = `
            <div id="contentOfSpecificTrack">
                <div id="trackInfo">
                    <div id="topTrackContent">
                        <h2>${track.title}</h2>
                        <button id="addToPlaylist">
                            ADD TO PLAYLIST
                        </button>
                    </div>
                    <div class="underline"></div>
                    <p>${track.artists[0].name}</p>
                    <p class="rating">Rating: ${fetchRating.calculateRating(track)}</p>
                    <p>
                        <span>In album:</span>
                        <button class="trackAlbumButton" id="${track.album._id}">
                            ${track.album.title}
                        </button>
                    </p>
                </div>
                <div id="buttonWrapper">
                    <input type="number" id="ratingNumber" placeholder="+/-" min="1" max="10">
                    <button id="rateTrack">
                        RATE TRACK
                    </button>
                    <button id="deleteTrack">
                        DELETE TRACK
                    </button>
                </div>
            </div>
        `;
        mainOutput.innerHTML = contentOfSpecificTrack;
        newDOM.fadeOutAnimation(mainOutput, 'remove');

        const trackAlbumButton = document.getElementsByClassName('trackAlbumButton');

        for (let button of trackAlbumButton) {
            button.addEventListener('click', function() {
                newDOM.fadeOutAnimation(mainOutput, 'add');
                setTimeout( () => {
                newFetch.fetchAlbumById(button.id);
                }, mainAnimationTime);
            });
        }

        const deleteButton = document.getElementById('deleteTrack');
        deleteButton.addEventListener('click', () => {
            newFetch.deleteItem('tracks', track._id);
            const tracksButton = document.getElementById('tracksButton');
            const trackDiv = document.getElementById('contentOfSpecificTrack');
            this.fadeOutAnimation(trackDiv, 'add');
            setTimeout(() => {
                mainOutput.innerHTML = '<div id="searchResults"></div>';
                this.activateSearchButton(tracksButton);
                deleteTrack.fetchTracks();
            }, mainAnimationTime);
        });

        const rateTrack = document.getElementById('rateTrack');
        rateTrack.addEventListener('click', () => {
            const ratingNumber = document.getElementById('ratingNumber').value;
            const thisTrackId = track._id;
            newFetch.rateStuff('tracks', thisTrackId, ratingNumber);

        });
    }
    //CLEANED
    displaySpecificArtist(artist, albums){

        const newDOM = new DOMHandle();
        const newFetch = new FetchHandle();

        let convertedDated = '';
        if (artist.born) {
          convertedDated = artist.born.substring(0,4);
        }
        else {
          convertedDated = 'No data.';
        }

        let contentOfSpecificArtist = `
            <div id="contentOfSpecificArtist">
                <div id="artistTopContent">
                    <img src="${artist.coverImage}">
                    <div id="artistInfo">
                        <h2>${artist.name}</h2>
                        <p id="genres"><span>Genres:</span> ${artist.genres}</p>
                        <p id="countryBorn"><span>Country:</span> ${artist.countryBorn}</p>
                        <p id="born"><span>Born:</span> ${convertedDated}</p>
                        <button id="deleteArtist">
                            DELETE ARTIST
                        </button>
                    </div>
                </div>
                <div class="underline"></div>
                <h3>ALBUMS</h3>
                <div id="artistAlbums"></div>
            </div>
        `;
        mainOutput.innerHTML = contentOfSpecificArtist;
        newDOM.fadeOutAnimation(mainOutput, 'remove');

        const deleteButton = document.getElementById('deleteArtist');
        deleteButton.addEventListener('click', () => {
            newFetch.deleteItem('artists', artist._id);
            const artistsButton = document.getElementById('artistsButton');
            const artistDiv = document.getElementById('contentOfSpecificArtist');
            this.fadeOutAnimation(artistDiv, 'add');
            setTimeout( () => {
                mainOutput.innerHTML = '<div id="searchResults"></div>';
                this.activateSearchButton(artistsButton);
                newFetch.fetchArtists();
            }, mainAnimationTime);
        });

        let artistAlbum = "";
        for(let i = 0; i < albums.length; i++){
            if(!albums[i].type) {
              artistAlbum +=`
                  <button class="artistAlbumButton" id="${albums[i]._id}">
                      ${albums[i].title} -
                      ${albums[i].releaseDate}
                      <img src="images/rightArrow.svg">
                  </button>
              `;
            }
        }

        const albumList = document.getElementById('artistAlbums');
        albumList.innerHTML=artistAlbum;

        const artistAlbumButtons = document.getElementsByClassName('artistAlbumButton');
        for (let button of artistAlbumButtons) {
            button.addEventListener('click', function() {
                newDOM.fadeOutAnimation(mainOutput, 'add');
                setTimeout(() => {
                    newFetch.fetchAlbumById(this.id);
                }, mainAnimationTime);
            });
        }

        newDOM.everyOtherButton(artistAlbumButtons);
    }
    //CLEANED
    displaySpecificPlaylist(playlist, comments){

        const fetchRating = new Logic();
        const newDOM = new DOMHandle();
        const newFetch = new FetchHandle();

        const createdDate = playlist.createdAt.substring(0,10);
        const createdTime = playlist.createdAt.substring(11,16);
        const updatedDate = playlist.updatedAt.substring(0,10);
        const updatedTime = playlist.updatedAt.substring(11,16);

        let contentOfSpecificPlaylist =`
            <div id="contentOfSpecificPlaylist">
                <div id="playlistTopContent">
                    <h2>${playlist.title}</h2>
                    <p><span>Genres: </span> ${playlist.genres}</p>
                    <p><span>Rating:</span> ${fetchRating.calculateRating(playlist)}</p>
                    <p id="createdBy"><span>Created by: </span>${playlist.createdBy}</p>
                    <br>
                    <p><span>Created:</span> ${createdDate} / ${createdTime}</p>
                    <p><span>Last updated:</span> ${updatedDate} / ${updatedTime}</p>
                </div>
                <div id="buttonWrapper">
                    <input type="number" id="ratingNumber" placeholder="+/-" min="1" max="10">
                    <button id="ratePlaylist">
                        RATE PLAYLIST
                    </button>
                    <button id="deletePlaylist">
                        DELETE PLAYLIST
                    </button>
                </div>
                <button id="displayComments">
                    VIEW / ADD COMMENTS
                </button>
                <div class="underline"></div>
                <h3>TRACKLIST</h3>
                <div id="playlistTracklist"></div>
                <div id="commentsOutput" class="fadeOut"></div>
            </div>
        `;

        mainOutput.innerHTML=contentOfSpecificPlaylist;
        newDOM.fadeOutAnimation(mainOutput, 'remove');

        const deleteButton = document.getElementById('deletePlaylist');
        deleteButton.addEventListener('click', () => {
            newFetch.deleteItem('playlists', playlist._id);
            const playlistsButton = document.getElementById('playlistsButton');
            const playlistDiv = document.getElementById('contentOfSpecificPlaylist');
            this.fadeOutAnimation(playlistDiv, 'add');
            setTimeout(() => {
                mainOutput.innerHTML = '<div id="searchResults"></div>';
                this.activateSearchButton(playlistsButton);
                deletePlaylist.fetchPlaylists();
                deletePlaylist.fetchTopPlaylists();
            }, mainAnimationTime)
        });

        const playlistTracklist = document.getElementById('playlistTracklist');

        let trackButton = "";
        for (let i = 0; i < playlist.tracks.length; i++){
            trackButton +=`
                <button class="playlistTrackButton" id="${playlist.tracks[0]._id}">
                    ${playlist.tracks[i].artists[0].name} -
                    ${playlist.tracks[i].title}
                </button>
            `;
        }

        playlistTracklist.innerHTML=trackButton;

        const displayCommentsButton = document.getElementById('displayComments');

        displayCommentsButton.addEventListener('click', () => {
            newDOM.displayPlaylistComments(comments, playlist._id);
        })

        const ratePlaylist = document.getElementById('ratePlaylist');
        ratePlaylist.addEventListener('click', () => {
            const ratingNumber = document.getElementById('ratingNumber').value;
            const thisPlaylistId = playlist._id;
            newFetch.rateStuff('playlists', thisPlaylistId, ratingNumber);
        });

        newDOM.everyOtherButton(playlistTracklist.children);
    }
    //CLEANED
    displayPlaylistComments(comments, playlistID){

        const commentsOutput = document.getElementById('commentsOutput');
        const newFetch = new FetchHandle();
        const newDOM = new DOMHandle();
        const newController = new Controller();

        newDOM.fadeOutAnimation(commentsOutput, 'remove');

        let commentField = `
            <form id="commentForm">
                <button type="button" id="commentCloseButton">
                <img src="images/x-circle.svg">
                BACK
            </button>
                <div id="wrongMessageComment" class="fadeOut"></div>
                <input placeholder="COMMENT.." type="text" id="commentField">
                <div id="commentBottom">
                    <input placeholder="NAME.." type="text" id="commentUser">
                    <button type="button" id="addCommentButton"><img src="images/plus-circle.svg"></button>
                </div>
            </form>
            <div id="playlistComments"></div>
        `;

        commentsOutput.innerHTML=commentField;

        const playlistComments = document.getElementById('playlistComments');

        let commentContent = "";

        if(!comments.length == 0){
            for(let i = 0; i < comments[0].length; i++){
                 commentContent +=`
                    <div class="playlistComment">
                        <header>
                            <p class="commenter">
                                ${comments[0][i].username}
                            </p>
                            <button class="deleteComment" id="${comments[0][i]._id}">
                                <img src="images/x-circle.svg">
                            </button>
                        </header>
                        <div class="underline"></div>
                        <p class="comment">
                            ${comments[0][i].body}
                        </p>
                    </div>
                `;
            }
        } //END OF IF NOT NULL STATEMENT

        playlistComments.innerHTML=commentContent;

        const addCommentButton = document.getElementById('addCommentButton');
        const commentFieldDiv = document.getElementById('commentField');
        const commentUser = document.getElementById('commentUser');

        addCommentButton.addEventListener('click', function(){

            const commentFieldEmpty = newController.isEmpty(commentFieldDiv.value);
            const commentUserEmpty = newController.isEmpty(commentUser.value);
            const wrongMessageComment = document.getElementById('wrongMessageComment');
            
            if(commentFieldEmpty || commentUserEmpty){
                let wrongMessage='<p> YOU HAVE TO FILL IN THE FIELDS CORRECTLY</p>';
                wrongMessageComment.innerHTML=wrongMessage;
                setTimeout(() => {
                    newDOM.fadeOutAnimation(wrongMessageComment, 'remove');
                })
            } else {
                wrongMessageComment.innerHTML='';
                newDOM.fadeOutAnimation(wrongMessageComment, 'add');
                newDOM.fadeOutAnimation(playlistComments, 'add');
                setTimeout( () =>{
                    playlistComments.innerHTML=`
                        <div id="commentMessage">
                            <img src="images/check.svg">
                            <p> THANK YOU FOR LEAVING A COMMENT</p>
                        </div>
                    `;
                    newDOM.fadeOutAnimation(playlistComments, 'remove');
                    setTimeout( () => {
                        newFetch.addPlayListComment(commentFieldDiv.value, commentUser.value, playlistID)
                        newDOM.fadeOutAnimation(commentsOutput, 'add');
                    }, 400);
                }, mainAnimationTime);
            }
        });

        const deleteCommentButton = document.
        getElementsByClassName('deleteComment');

        for (let i = 0; i < deleteCommentButton.length; i++) {
            deleteCommentButton[i].addEventListener('click', function(){
                newDOM.fadeOutAnimation(playlistComments, 'add');
                setTimeout( () => {
                        newFetch.deleteItem('comments', this.id);
                        newFetch.fetchPlaylistById(playlistID);
                    }, 400);
            });
        }

        const commentCloseButton = document.getElementById('commentCloseButton');

        commentCloseButton.addEventListener('click', () => {
            let commentContent ='';
            newDOM.fadeOutAnimation(commentsOutput, 'add');
            setTimeout( () => {
                commentsOutput.innerHTML=commentContent;
            }, mainAnimationTime);
        });


    }
    //CLEANED
    filterSearch() {
        for (let sbutton of searchButton) {
            if (sbutton.classList.contains('activeButton')) {
                const filter = searchField.value.toUpperCase();
                const buttons = document.querySelectorAll('.showByIdButton');

                let visibleButtons = [];
                for (let i = 0; i < buttons.length; i++) {
                    let dataGenre = buttons[i].getAttribute('data-genre').toUpperCase();
                    if (buttons[i].innerHTML.toUpperCase().indexOf(filter) > -1 || dataGenre.indexOf(filter) > -1 && dataGenre != 'NONE') {
                        buttons[i].style.display = 'flex';
                        visibleButtons.push(buttons[i]);
                    } else {
                        buttons[i].style.display = 'none';
                    }
                }
                if (filter == '') {
                    for (let i = 0; i < buttons.length; i++) {
                        buttons[i].style.display = 'none';
                    }
                }
                this.everyOtherButton(visibleButtons);
            }
        }
    }
    everyOtherButton(buttons) {
        /* THIS FUNCTION LIGHTER COLOR TO
         * EVERY OTHER BUTTON + ADDS HOVER EFFECT */
        for (let i = 0; i < buttons.length; i++) {
            if (i % 2 == 0) {
                buttons[i].style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                buttons[i].addEventListener('mouseover', () => {
                    buttons[i].style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
                });
                buttons[i].addEventListener('mouseleave', () => {
                    buttons[i].style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                });
            } else {
                buttons[i].style.backgroundColor = '#191919';
                buttons[i].addEventListener('mouseover', () => {
                    buttons[i].style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
                });
                buttons[i].addEventListener('mouseleave', () => {
                    buttons[i].style.backgroundColor = '#191919';
                });
            }
        }
    }

    addTrackToPlaylistEventListener () {
        event.preventDefault();
        const addedTracks = [];
        const errorMessages = [];

        const trackController = new Controller;
        const trackDom = new DOMHandle;
        const trackFetch = new FetchHandle;

        const playlistTitle = trackController.getInputValue('inputPlaylistTitle');

        console.log(playlistTitle);
        const isTitleEmpty = trackController.isEmpty(playlistTitle);

        if (isTitleEmpty) {
            errorMessages.push('Title is required.');
        }
        if (errorMessages.length > 0) {
            trackDom.displayPopup(errorMessages);
        } else {
            trackFetch.fetchItemByChosenParameter('playlists', 'title', playlistTitle)
            .then((fetchedPlaylist) => {
                const playlistId = fetchedPlaylist[0]._id;
                console.log(fetchedPlaylist[0]._id);
                const trackToPost = {
                    tracks: trackId
                };
                console.log(trackToPost);

                const playlistPostRequest = new FetchHandle('POST', trackToPost);
                const postTrack = new Playlist();
                postTrack.addTrack(playlistPostRequest, playlistId);
            });
        }
    }
    choseTrackSelector(parentElement){
        const addTrackContent = `
            <select id = "trackSelector"></select>
            <button type="button" id="addTrackButton">
                <i class="far fa-plus-square"></i>
            </button>
        <div id="addTrackTracklist"></div>
        `;
        parentElement.insertAdjacentHTML('beforeend', addTrackContent);

        const addButton = document.getElementById('addTrackButton');

        const trackDom = new DOMHandle();
        const trackFetch = new FetchHandle();
        const trackController = new Controller();

        const selector = document.getElementById('trackSelector');

        trackFetch.fetchItemByChosenParameter('tracks', 'limit', '999')
            .then((fetchedTracks) => {
                for (let track of fetchedTracks) {
                    var option = document.createElement('option');

                    if (!track.artists[0]) {
                        track.artists[0] = { name: 'No name', _id: false };
                    }

                    option.text = `${track.artists[0].name} - ${track.title}`;

                    option.value = track._id;

                    selector.add(option);
                    //trackDom.addTrackToPlaylist(title);
                }
            addButton.addEventListener('click', function() {
                var selectedIndex = selector.selectedIndex;

                const trackId = (document.getElementsByTagName('option')[selectedIndex].value);
                console.log(trackId);
                trackDom.addTrackToPlaylist(trackId);
            });
        });
    }

    addTrackToAlbumEventListener() {
        event.preventDefault();
        const addedTracks = [];
        const errorMessages = [];
        const trackController = new Controller;
        const trackDom = new DOMHandle;
        const trackFetch = new FetchHandle;
        const newTrackTitle = trackController.getInputValue('inputTrackTitle');
        const newTrackArtist = trackController.getInputValue('inputTrackArtist');
        const newTrackAlbum = trackController.getInputValue('inputAlbumTitle');

        console.log(newTrackTitle);
        console.log(newTrackArtist);
        console.log(newTrackAlbum);

        const isArtistEmpty = trackController.isEmpty(newTrackArtist);
        const isTitleEmpty = trackController.isEmpty(newTrackTitle);

        if (isArtistEmpty) {
            errorMessages.push('Artist name is required.');
        }
        if (isTitleEmpty) {
            errorMessages.push('Title is required.');
        }
        if (errorMessages.length > 0) {
            trackDom.displayPopup(errorMessages);
        } else {
            /* Fetching id's for album and artist to create a track to post */
            trackFetch.fetchItemByChosenParameter('albums', 'title', newTrackAlbum)
            .then((fetchedAlbum) => {
                /* Creating track to post */
                console.log(fetchedAlbum);
                const trackToPost = new Tracks (newTrackTitle, fetchedAlbum[0].artists[0], fetchedAlbum[0]._id, fetchedAlbum[0].genres[0], fetchedAlbum[0].coverImage);
                addedTracks.push(`${newTrackArtist} - ${newTrackTitle}`);
                console.log(trackToPost);

                /* Posting track */
                const postTrackRequest = new FetchHandle('POST', trackToPost);
                postTrackRequest.postItem('tracks', postTrackRequest);

                /* Printing added tracks */
                for (let track of addedTracks) {
                    const parentElement = document.getElementById('addWrapper');
                    const p = document.createElement('p');
                    const addedTrack = document.createTextNode(track);
                    p.appendChild(addedTrack);
                    parentElement.appendChild(p);
                }
            });
        }
    }

    createAlbumContent(){
        const addDiv = document.getElementById('addDiv');

        const albumDom = new DOMHandle;
        const albumController = new Controller;
        const albumFetch = new FetchHandle;

        addDiv.innerHTML = ``;
        albumDom.fadeOutAnimation(addDiv, 'remove');

        let createAlbumContent =`
            <div id="addWrapper">
                <p>ADD AN ALBUM</p>
                <form id="importAlbum">
                    <input type="text" id="inputAlbumArtist" placeholder="ARTIST..">
                    <input type="text" id="inputAlbumTitle" placeholder="ALBUM TITLE..">
                    <input type="text" id="inputAlbumGenres" placeholder="ALBUM GENRE..">
                    <input type="text" id="inputAlbumReleaseDate" placeholder="RELEASE YEAR..">
                    <input type = "text"
                    id = "inputAlbumSpotifyURL"
                    placeholder = "SPOTIFY URL..">
                    <input type="text" id="inputAlbumCoverImage" placeholder="COVER IMAGE URL..">
                    <button type ="button" id="postAlbumButton">
                        ADD ALBUM
                    </button>
                </form>
                <a href = "#" id = "addTrackToExistingAlbum" class = "mainLink">
                Add track to existing album
                </a>
                <button type="button" id="importCloseButton">
                    <img src="images/x-circle.svg">
                    BACK
                </button>
            </div>
        `;

        addDiv.innerHTML=createAlbumContent;

        /* Get buttons */
        const importCloseButton = document.getElementById('importCloseButton');
        const postAlbumButton = document.
        getElementById('postAlbumButton');
        const addTrackToExistingAlbum = document.getElementById('addTrackToExistingAlbum');

        /* Go back-button */
        importCloseButton.addEventListener('click',function(){
            albumDom.fadeOutAnimation(addDiv, 'add');
            addDiv.innerHTML = ``;
        });

        /* Add track to existing album link */
        addTrackToExistingAlbum.addEventListener('click', function(){
            addDiv.innerHTML = `
            <div id="addWrapper">
            <p>ADD TRACK TO EXISTING ALBUM</p>
            <form id="addTrackToExistingAlbum">
                <input type="text" id="inputAlbumTitle" placeholder="ALBUM TITLE..">
                <input type="text" id="inputTrackTitle" placeholder="TRACK TITLE..">
                <input type="text" id="inputTrackArtist" placeholder="ARTIST..">
                <button type ="button" id="addTrackButton">
                    ADD TRACK
                </button>
            </form>
            <a href = "#" id="createAlbum" class = "mainLink">
            Add new album
            </a>
            <button type="button" id="importCloseButton">
                <img src="images/x-circle.svg">
                BACK
            </button>
        </div>
            `;
            const addTrackButton = document.
            getElementById('addTrackButton');

            addTrackButton.addEventListener('click', function(){
                albumDom.addTrackToAlbumEventListener();
            });
        });

        /* -----------ADDED BY ERIKA------------- */
        postAlbumButton.addEventListener('click', function() {
            event.preventDefault();

            /* Gets the input values. */
            const albumArtistName = albumController.getInputValue('inputAlbumArtist');
            const albumTitle = albumController.getInputValue('inputAlbumTitle');
            var albumGenres = albumController.getInputValue('inputAlbumGenres');
            const albumReleaseDate = albumController.getInputValue('inputAlbumReleaseDate');
            const albumSpotifyURL = albumController.getInputValue('inputAlbumSpotifyURL');
            const albumCoverImageURL = albumController.getInputValue('inputAlbumCoverImage');

            /* Title and artist are required to create a new album. */
            const isTitleEmpty = albumController.isEmpty(albumTitle);
            const isArtistEmpty = albumController.isEmpty(albumArtistName);

            /* Checking the imported values before creating a new album. */
            const errorMessages = [];

            if (isTitleEmpty) {
                errorMessages.push('Album title is required.');
            }
            if (isArtistEmpty) {
                errorMessages.push('Artist name is required.');
            }
            /* Checking which other input fields are filled in to see which parameters we have to check if valid */
            if (!isTitleEmpty && !isArtistEmpty) {
                const isGenresEmpty = albumController.isEmpty(albumGenres);
                const isReleaseDateEmpty = albumController.isEmpty(albumReleaseDate);
                const isSpotifyURLEmpty = albumController.isEmpty(albumSpotifyURL);
                const isCoverImageEmpty = albumController.isEmpty(albumCoverImageURL);

                console.log(isGenresEmpty);
                console.log(isReleaseDateEmpty);
                console.log(isSpotifyURLEmpty);
                console.log(isCoverImageEmpty);

                /* If multiple genres are filled in the parameter have to be without ' ' and include ',' in between the genres */
                if (!isGenresEmpty) {
                    const editedGenresParameter = albumController.editGenresParameter(albumGenres);
                    albumGenres = editedGenresParameter;
                }
                if (!isReleaseDateEmpty) {
                    const isReleaseDateValid = albumController.checkYear(albumReleaseDate);
                    if (!isReleaseDateValid) {
                        errorMessages.push('The release year is not valid.')
                    }
                }
                /* If spotify URL is filled in the URL must be checked */
                if (!isSpotifyURLEmpty) {
                    const isSpotifyURLValid = albumController.checkURL(albumSpotifyURL);
                    if (!isSpotifyURLValid) {
                        errorMessages.push('The spotify URL is not valid.');
                    }
                }

                /* If cover image is filled in the URL must be checked */
                if (!isCoverImageEmpty) {
                    const isImageURLValid = albumController.checkURL(albumCoverImageURL);
                    if (!isImageURLValid) {
                        errorMessages.push('The image URL is not valid.');
                    }
                }
            } /* --- if (!isTitleEmpty && !isArtistEmpty) collapse --- */

            if (errorMessages.length > 0) {
                    albumDom.displayPopup(errorMessages);
            }
            else {
                albumFetch.fetchItemByChosenParameter('artists', 'name', albumArtistName)
                    .then((artist) => {
                        const albumToPost = new Album(albumTitle, artist[0]._id, albumGenres, albumReleaseDate, albumSpotifyURL, albumCoverImageURL);
                        console.log(albumToPost);
                        const albumPostRequest = new FetchHandle('POST', albumToPost);

                        //albumPostRequest.postItem('albums', albumPostRequest);
                    });

                /* Display alternative popup */
                albumDom.displayQuestionPopup('Do you want to add tracks now?');

                const yesButton = document.getElementById('yesButton');
                const noButton = document.getElementById('noButton');

                const messagePopupBox = document.getElementById('messagePopupBox');
                const parentElement = document.getElementById('addWrapper');

                yesButton.addEventListener('click', function(){
                    albumDomHandle.hideElement('messagePopupBox');
                    const addTrackContent = `
                    <form id="postTrack">
                        <input text="text" id="inputTrackArtist" placeholder="ARTIST..">
                        <input text="text" id="inputTrackTitle" placeholder="TRACK TITLE..">
                        <button type="button" id="addTrackButton">
                            <i class="far fa-plus-square"></i>
                        </button>
                    </form>
                    <div id="addTrackTracklist"></div>
                    `;
                    parentElement.insertAdjacentHTML('beforeend', addTrackContent);
                    const addTrackButton = document.
                    getElementById('addTrackButton');

                    addTrackButton.addEventListener('click', function(){
                        albumDomHandle.addTrackToAlbumEventListener();
                    });
                });
                noButton.addEventListener('click', function(){
                    const popupDom = new DOMHandle;
                    messagePopupBox.innerHTML = ``;
                    messagePopupBox.className = 'hidden';
                    popupDom.fadeOutAnimation(addDiv, 'add');
                    addDiv.innerHTML = ``;
                });
            }
        });
    }

    createArtistContent(){
        const artistDom = new DOMHandle();
        const artistFetch = new FetchHandle();
        const artistController = new Controller();

        const addDiv = document.getElementById('addDiv');

        addDiv.innerHTML=``;

        artistDom.fadeOutAnimation(addDiv, 'remove');

        let createArtistContent =`
            <div id="addWrapper">
                <p>ADD ARTIST</p>
                <form id = "importArtist">
                    <input type="text" id="inputArtistName" placeholder="ARTIST NAME..">
                    <input type="text" id="inputArtistGenres" placeholder="GENRES..">
                    <input type="text" id="inputArtistCoverImage" placeholder="COVER IMAGE URL..">
                    <button id="postArtistButton">ADD ARTIST</button>
                </form>
                <button type="button" id="importCloseButton">
                    <img src="images/x-circle.svg">
                    BACK
                </button>
            </div>
            `;

        addDiv.innerHTML=createArtistContent;

        /* ---------ADDED BY ERIKA--------- */
        postArtistButton.addEventListener('click', function() {
            event.preventDefault();
            /* Gets the input values */
            const artistController = new Controller;
            const artistName = artistController.getInputValue('inputArtistName');
            var artistGenres = artistController.getInputValue('inputArtistGenres');
            const artistCoverImageURL = artistController.getInputValue('inputArtistCoverImage');
            const isNameEmpty = artistController.isEmpty(artistName);

            /* Checking the imported values before creating a new artist. */
            var errorMessages = [];

            /* Name is the only parameter required so checking that first */
            if (isNameEmpty) {
                errorMessages.push('Artist name is required.');
            }
            /* Checking which other input fields are filled in to see which parameters we have to check if valid */
            else {
                const isGenresEmpty = artistController.isEmpty(artistGenres);
                const isCoverImageEmpty = artistController.isEmpty(artistCoverImageURL);

                /* If multiple genres are filled in the parameter have to be without ' ' and include ',' in between the genres */
                if (!isGenresEmpty) {
                    const editedGenresParameter = artistController.editGenresParameter(artistGenres);
                    artistGenres = editedGenresParameter;
                }
                /* If cover image is filled in the URL must be checked */
                if (!isCoverImageEmpty) {
                    const isValidURL = artistController.checkURL(artistCoverImageURL);
                    if (!isValidURL) {
                        errorMessages.push('The URL is not valid.');
                    }
                }
            }
            /* A DOM-function to print error-messages should be called for here */
            if (errorMessages.length > 0) {
                const popupMessage = new DOMHandle;
                popupMessage.displayPopup(errorMessages);
            }
            else {
                const artistToPost = new Artist(artistName, artistGenres, artistCoverImageURL);
                const artistPostRequest = new FetchHandle('POST', artistToPost);
                artistPostRequest.postItem('artists', artistPostRequest);
            }
        });
        /* -----collapse------ */

        //artistDom.fadeOutAnimation(addDiv, 'remove');

        importCloseButton.addEventListener('click', function(){
            artistDom.fadeOutAnimation(addDiv, 'add');
            addDiv.innerHTML = ``;
        });
    }
    displayGenres(object) {
        let genres = '';
        if (object.genres.length != 0) {
            object.genres.forEach((element) => {
                genres += element + ' ';
            })
            return genres;
        }
        genres += 'none';
        return genres;
    }

    slideShowBanner(){

    const slideShowBannerDiv = document.
    getElementById('slideShow');

    const bannerImages = [
        "image1.jpg",
        "image2.jpg",
        "image3.jpg",
        "image4.jpg",
        "image5.jpg",
    ];

    const dotWrapper = document.
    getElementById('slideDotsWrapper')

    let dots = "";
    for(let i = 0; i < bannerImages.length; i++){
        dots +=`<div class="slideDot"></div>`;
    }

    dotWrapper.innerHTML=dots;

    function startSlide(i){
        if(i <= bannerImages.length-1){
             let addSlide = `
                <div class="slideWrapper fadeSlide">
                    <img src="images/${bannerImages[i]}"
                </div>
            `;
            const dot = `<div id="slideDotsWrapper"></div>`

            slideShowBannerDiv.innerHTML=addSlide+dot

            slideShowBannerDiv.
            nextElementSibling.children[i].
            classList.add('activeDot');

            setTimeout(function(){
            slideShowBannerDiv.
            nextElementSibling.children[i].
            classList.remove('activeDot');
            }, 2500)

            setTimeout(function(){
                slideShowBannerDiv.firstElementChild.
                classList.remove('fadeSlide');
            })

            setTimeout(function(){

                if(i === bannerImages.length-1){
                    i = 0;
                } else {
                    i++
                }

                startSlide(i)
            }, 2500)
        }
    }

    let i = 0;
    startSlide(i)
}
createPlaylistContent(){
    const addDiv = document.getElementById('addDiv');
    const playlistController = new Controller();
    const playlistDom = new DOMHandle();
    const playlistFetch = new FetchHandle();

    addDiv.innerHTML = ``;
    playlistDom.fadeOutAnimation(addDiv, 'remove');

    const createPlaylistForm =`
        <div id="addWrapper">
            <p>CREATE PLAYLIST</p>
            <form id = "createPlaylist">
                <input type="text" id="inputPlaylistTitle" placeholder="PLAYLIST TITLE..">
                <input type="text" id="inputPlaylistGenres" placeholder="GENRES..">
                <input type="text" id="inputPlaylistCoverImage" placeholder="PLAYLIST IMAGE URL..">
                <input type="text" id="inputPlaylistCreator" placeholder="CREATED BY..">
                <button id="addPlaylistButton">ADD PLAYLIST</button>
            </form>
            <a href = "#" id="addToExistingPlaylist" class = "mainLink">
                Add tracks to existing playlist
            </a>
            <button type="button" id="importCloseButton">
                <img src="images/x-circle.svg">
                BACK
            </button>
        </div>
        `;
    addDiv.innerHTML = createPlaylistForm;

    const importCloseButton = document.getElementById('importCloseButton');

    importCloseButton.addEventListener('click', function(){
        playlistDom.fadeOutAnimation(addDiv, 'add');
        addDiv.innerHTML = ``;
    });

    const addToExistingPlaylistLink = document.getElementById('addToExistingPlaylist');

    /* Add track to existing album link */
    addToExistingPlaylistLink.addEventListener('click', function(){
        const addToExistingPlaylist = `
        <div id="addWrapper">
            <p>ADD TRACK TO EXISTING PLAYLIST</p>
            <form id="addTrackToExistingPlaylist">
                <input type="text" id="inputPlaylistTitle" placeholder="PLAYLIST TITLE..">
            </form>
            <button type ="button" id="addTrackButton">
                ADD TRACK
            </button>
            <a href = "#" id="createPlaylist" class = "mainLink">
            Add new playlist
            </a>
            <button type="button" id="importCloseButton">
                <img src="images/x-circle.svg">
                BACK
            </button>
        </div>
        `;
        addDiv.innerHTML = addToExistingPlaylist;
        const parentElement = document.getElementById('addTrackToExistingPlaylist');

        playlistDom.choseTrackSelector(parentElement);

        importCloseButton.addEventListener('click', function(){
            albumDom.fadeOutAnimation(addDiv, 'add');
            addDiv.innerHTML = ``;
        });
        /*const addTrackButton = document.
        getElementById('addTrackButton');

        addTrackButton.addEventListener('click', function(){
            albumDom.addTrackEventListener();
        });*/
    });

     /* Get buttons */
     const addPlaylistButton = document.
     getElementById('addPlaylistButton');
     const addTrackToExistingPlaylist = document.getElementById('addTrackToExistingPlaylist');

     /* Go back-button */
     importCloseButton.addEventListener('click',function(){
        playlistDom.fadeOutAnimation(addDiv, 'add');
        addDiv.innerHTML = ``;
     });

     addPlaylistButton.addEventListener('click', function(){
         event.preventDefault();
         /* Gets the input values. */
         const playlistTitle = playlistController.getInputValue('inputPlaylistTitle');
         var playlistGenres = playlistController.getInputValue('inputPlaylistGenres');
         const playlistImageURL = playlistController.getInputValue('inputPlaylistCoverImage');
         const playlistCreator = playlistController.getInputValue('inputPlaylistCreator');

         /* Title and creator are required parameters */
         const isTitleEmpty = playlistController.isEmpty(playlistTitle);
         const isCreatorEmpty = playlistController.isEmpty(playlistCreator);

         /* Checking the imported values before creating a new album. */
         const errorMessages = [];

        if (isTitleEmpty) {
            errorMessages.push('Playlist title is required.');
        }
        if (isCreatorEmpty) {
            errorMessages.push('Creator name is required.');
        }

        /* Checking which other input fields are filled in to see which parameters we have to check if valid */
        if (!isTitleEmpty && !isCreatorEmpty) {
            const isGenresEmpty = playlistController.isEmpty(playlistGenres);
            const isCoverImageEmpty = playlistController.isEmpty(playlistImageURL);

            if (!isGenresEmpty) {
                const editedGenresParameter = playlistController.editGenresParameter(playlistGenres);
                playlistGenres = editedGenresParameter;
            }
            if (!isCoverImageEmpty) {
                const isImageURLValid = playlistController.checkURL(playlistImageURL);
                if (!isImageURLValid) {
                    errorMessages.push('The image URL is not valid.');
                }
            }
        } /* --- if (!isTitleEmpty && !isCreatorEmpty) collapse --- */

        if (errorMessages.length > 0) {
                playlistDom.displayPopup(errorMessages);
        }
        else {
                const playlistToPost = new Playlist(playlistTitle, playlistGenres, playlistImageURL, playlistCreator);
                console.log(playlistToPost);
                const playlistPostRequest = new FetchHandle('POST', playlistToPost);

                playlistPostRequest.postItem('playlists', playlistPostRequest);
                /* Display alternative popup */
                playlistDom.displayQuestionPopup('Do you want to add tracks now?');

                const yesButton = document.getElementById('yesButton');
                const noButton = document.getElementById('noButton');
                const messagePopupBox = document.getElementById('messagePopupBox');
                const parentElement = document.getElementById('createPlaylist');

                yesButton.addEventListener('click', function() {
                    playlistDom.hideElement('messagePopupBox');
                    playlistDom.choseTrackSelector(parentElement);
                    /*const addTrackContent = `
                    <form id="addTrackToPlaylist">
                        <select id = "trackSelector"></select>
                        <button type="button" id="addTrackButton">
                            <i class="far fa-plus-square"></i>
                        </button>
                    </form>
                    <div id="addTrackTracklist"></div>
                    `;
                parentElement.insertAdjacentHTML('beforeend', addTrackContent);
                const trackFetch = new FetchHandle();
                trackFetch.fetchItemByChosenParameter('tracks', 'limit', '999')
                    .then((fetchedTracks) => {
                        const selector = document.getElementById('trackSelector');
                        let i = 0;
                        for (let track of fetchedTracks) {
                            /*console.log(track.title);
                            console.log(track.artists[0].name);
                            console.log(i);
                            const option = document.createElement('option');
                            var artist = track.artists[0].name;
                            var title = track.title;
                            option.text = `${track.artists[0].name} - ${track.title}`;
                            selector.add(option);
                            i++;
                        }
                    //playlistDom.displayTracksInSelector(fetchedTracks);
                });*/

                const addTrackButton = document.getElementById('addTrackButton');

                addTrackButton.addEventListener('click', function() {
                    playlistDom.addTrackToPlaylist();
                });
                });
                noButton.addEventListener('click', function(){
                    const popupDom = new DOMHandle;
                    messagePopupBox.innerHTML = ``;
                    messagePopupBox.className = 'hidden';

                    popupDom.fadeOutAnimation(addDiv, 'add');
                    addDiv.innerHTML = ``;
                });
        }
    });
}

    fadeOutAnimation(div, addRemove){
        if(addRemove === 'remove'){
            div.classList.remove('fadeOut');
        } else {
            div.classList.add('fadeOut');
        }
    }
    //CLEANED

/* --------ADDED BY ERIKA--------- */
hideElement (elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = ``;
    element.className = 'hidden';
}
displayElement (elementId) {
    const element = document.getElementById(elementId).style.display = "block";
}
/* -------under construction-------- */
displayPopup (errorMessages, div = 'popUpWindow') {
    const parentElement = document.getElementById(div);
    console.log(parentElement);
    const popupBox = document.createElement('div');
    popupBox.className = 'messagePopupBox';
    popupBox.setAttribute('id', 'messagePopupBox');

    for (let errorMessage of errorMessages) {
        const errorMessageParagraph = document.createElement('p');
        errorMessageParagraph.className = 'errorMessage';
        const errorMessageNode = document.createTextNode(errorMessage);
        errorMessageParagraph.appendChild(errorMessageNode);
        popupBox.appendChild(errorMessageParagraph);
    }
    popupBox.insertAdjacentHTML('beforeend',
        `<div id = "messageButtonWrapper">
            <button id = "errorOkButton"> Ok </button>
        </div>`
    );
    parentElement.appendChild(popupBox);
    const okButton = document.getElementById('errorOkButton');

    okButton.addEventListener('click', function() {
        const hide = new DOMHandle;
        hide.hideElement('messagePopupBox');
    });
}
displayQuestionPopup (question) {
    const parentElement = document.getElementById('addWrapper');
    const popupBox = document.createElement('div');
    popupBox.className = 'messagePopupBox';
    popupBox.setAttribute('id', 'messagePopupBox');

    popupBox.innerHTML = `
        <p>${question}</p>
        <div id = "messageButtonWrapper">
            <button id = "yesButton"> Yes </button>
            <button id = "noButton"> No </button>
        </div>
    `;
    parentElement.appendChild(popupBox);
}
}/* --- Class DOMHandle collapse --- */

class Controller {
    getInputValue (elementId) {
        const element = document.getElementById(elementId);
        return element.value;
    }
    isEmpty (value) {
        if(value && value != '') {
            return false;
        }
        else {
            return true;
        }
    }
    /* If multiple genres are filled in the parameter have to be without ' ' and include ',' in between the genres. This does not yet support if the user types in 'hip hop' instead of 'hiphop' f.e */
    editGenresParameter (genresParameter) {
        var editedGenresParameter = '';
        if (genresParameter.includes(', ')) {
            const splitGenresParameter = genresParameter.split(', ');
            editedGenresParameter = splitGenresParameter[0].concat(',', splitGenresParameter[1]);
        }
        else if (genresParameter.includes(' ')) {
            const splitGenresParameter = genresParameter.split(' ');
            editedGenresParameter = splitGenresParameter[0].concat(',', splitGenresParameter[1]);
        } else {
                editedGenresParameter = genresParameter;
        }
            return editedGenresParameter;
        }
        checkURL(URLaddress) {
            var isValid = false;
            const notAllowedCharacters = ['å', 'ä', 'ö', ' '];
            if (URLaddress.includes('http://') || URLaddress.includes('https://')) {
                for (let character of notAllowedCharacters) {
                    if (URLaddress.includes(character)) {
                        isValid = false;
                    } else {
                        isValid = true;
                    }
                }
            }
        return isValid;
        }
        checkYear (year) {
            const currentTime = new Date();
            const currentYear = currentTime.getFullYear();
            if (year > 1500 && year <= currentYear) {
                return true;
            } else {
                return false;
            }
        }
};

class Artist {
    constructor(name, genres, coverImage) {
        if (name != '') {
            this.name =       name;
            this.genres =     genres;
            this.coverImage = coverImage;
        }
    }
    setGenres (genres) {
        if (genres != '') {
            this.genres = genres;
        }
    }
    setCoverImage (coverImage) {
        if (coverImageURL != '') {
            this.coverImage = coverImage;
        }
    }
}

class Album {
    constructor(title, artists, genres, releaseDate, spotifyURL, coverImage) {
        if (title != '' && artists != '') {
            this.title       = title;
            this.artists     = artists;
            this.genres	     = genres;
            this.releaseDate = releaseDate;
            this.spotifyURL  = spotifyURL;
            this.coverImage  = coverImage;
        }
    }
    setGenres (genres) {
        if (genres != '') {
            this.genres = genres;
        }
    }
    setReleaseDate (date) {
        if (date != '') {
            this.date = date;
        }
    }
    setSpotifyURL (spotifyURL) {
        if (spotifyURL != '') {
            this.spotifyURL = spotifyURL;
        }
    }
    setCoverImage (coverImage) {
        if (coverImageURL != '') {
            this.coverImage = coverImage;
        }
    }
}

class Tracks {
    constructor (title, artists, album, genres, coverImage) {
        if (title != '' && artists != '' && album != '') {
            this.title = title;
            this.artists = artists;
            this.album	= album;
            this.genres	= genres;
            this.coverImage = coverImage;
        }
    }
    setGenres (genres) {
        if (genres != '') {
            this.genres = genres;
        }
    }
    setCoverImage (coverImage) {
        if (coverImage != '') {
            this.coverImage = coverImage;
        }
    }
}

class Playlist {
    constructor (title, genres, coverImage, createdBy) {
        if (title != '') {
            this.title = title;
            this.genres = genres;
            this.coverImage = coverImage;
            this.createdBy = createdBy;
        }
    }
    addTrack (httpRequest, playlistId) {
        console.log(httpRequest);
        fetch(` https://folksa.ga/api/playlists/${playlistId}/tracks?key=flat_eric`, httpRequest)
            .then((response) => response.json())
                .then((postedTrack) => {
                    console.log(postedTrack);
                })
                    .catch((errorMessage) => {
                        //const displayError = new DOMHandle;
                        console.log(errorMessage);
                        //displayError.displayErrorPopup(errorMessage);
                    });
    }
    setCoverImage (coverImage) {
        if (coverImage != '') {
            this.coverImage = coverImage;
        }
    }
    setGenres (genres) {
        if (genres != '') {
            this.genres = genres;
        }
    }
}
/*------------------------ */

class Logic {
    calculateRating(object) {
        if (object.ratings === undefined || object.ratings.length == 0) {
            return 'No votes.'
        }
        let number = 0;
        for (let n of object.ratings) {
            if (n != 'null') {
                number += n;
            }
        }
        const rating = (number / object.ratings.length);
        const roundedRating = this.roundNumber(rating);
        return roundedRating;
    }
    determineTopPlaylists(object) {
        let allTopPlaylists = []
        for (let playlists of object) {
            if (!playlists.ratings.length == 0) {
                let totalRating = 0;
                for (let i = 0; i < playlists.ratings.length; i++) {
                    totalRating += playlists.ratings[i];
                }
                let averageRating = totalRating / playlists.ratings.length;
                let roundedRating = this.roundNumber(averageRating);
                let playListInfo = { title: playlists.title, id: playlists._id, rating: roundedRating };
                allTopPlaylists.push(playListInfo);
            }
        }
        const sortedAllPlaylists = allTopPlaylists.sort(this.compareRatings);
        return sortedAllPlaylists;
    }
    compareRatings(a, b) {
        if (a.rating > b.rating) {
            return -1;
        }
        if (a.rating < b.rating) {
            return 1;
        }
        return 0;
    }
    roundNumber(number) {
        return Math.round( number * 10 ) / 10;
    }
}
const initiate = new Init();
initiate.initiateEventListeners();

const runSlideShow = new DOMHandle();
runSlideShow.slideShowBanner();

const startFetch = new FetchHandle();
startFetch.fetchAll();
