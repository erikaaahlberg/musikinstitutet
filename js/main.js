const searchButton = document.getElementsByClassName('searchButton');
const mainOutput = document.getElementById('mainOutput');
const searchResults = document.getElementById('searchResults')
/* Loops thru the searchRadioButtons then runs Fetch class. */
for (i = 0; i < searchButton.length; i++) {
    searchButton[i].addEventListener('click', function() {
        const activateButton = new DOMHandle();
        activateButton.activateSearchButton(this);
        const newFetch = new FetchHandle(this.value);
        mainOutput.innerHTML = '<div id="searchResults"></div>'
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

const searchField = document.getElementById('searchField');
searchField.addEventListener('keyup', () => {
    const filterRequest = new DOMHandle();
    filterRequest.filterSearch();
});

const createAlbumButton = document.
getElementById('createAlbumButton');

createAlbumButton.addEventListener('click', function(){
    const createAlbum = new DOMHandle();
    createAlbum.createAlbumContent();
})

const createArtistButton = document.getElementById('createArtistButton');

createArtistButton.addEventListener('click', function(){
    const createArtist = new DOMHandle();
    createArtist.createArtistContent();
})

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

    /* ----- Under construction ----- */
    fetchItemByName(item, itemName) {
        return fetch(`https://folksa.ga/api/${item}?name=${itemName}&key=flat_eric`)
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
          .then((playlist) => {

            const displayPlaylistComments = new DOMHandle();
            displayPlaylistComments.displayPlaylistComments(comments);
          });

    }
    rateStuff(apiPath, id, rating) {
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
            //console.log(error);
        });
    }
    /*--------ADDED BY ERIKA----------- */
    postItem (itemToPost, HttpRequest) {
        console.log(HttpRequest);
        fetch(`https://folksa.ga/api/${itemToPost}?&key=flat_eric`, HttpRequest)
            .then((response) => response.json())
                .then((album) => {
                    console.log(album)
                })
                    .catch((error) => {
                        //console.log(error);
                    });
    }
    deleteItem (itemToDelete, idToDelete) {
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
                    console.log(deletedItem);
                });
    }
    /*---------------- */
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

        for (i = 0; i < showByIdButton.length; i++) {
            showByIdButton[i].addEventListener('click', function() {
                const newFetch = new FetchHandle();
                newFetch.fetchAlbumById(this.id);
                const deActivate = new DOMHandle();
                deActivate.deactivateSearchButtons();
            })
        }


    }
    displayTracks(allTracks) {


        const searchResult = document.getElementById('searchResults')

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

        for (i = 0; i < showByIdButton.length; i++) {
            showByIdButton[i].addEventListener('click', function() {
                const newFetch = new FetchHandle();
                newFetch.fetchTrackById(this.id);
                const deActivate = new DOMHandle();
                deActivate.deactivateSearchButtons();
            });
        }
   }
    displayArtists(allArtists) {


        const searchResult = document.getElementById('searchResults')

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
        for (i = 0; i < showByIdButton.length; i++) {
            showByIdButton[i].addEventListener('click', function() {
                const newFetch = new FetchHandle();
                newFetch.fetchArtistById(this.id);
                const deActivate = new DOMHandle();
                deActivate.deactivateSearchButtons();
            })
        }

    }
    displayPlaylists(allPlaylists) {


        const searchResult = document.getElementById('searchResults')

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
        for (i = 0; i < showByIdButton.length; i++) {
            showByIdButton[i].addEventListener('click', function() {
                const newFetch = new FetchHandle();
                newFetch.fetchPlaylistById(this.id);
                const deActivate = new DOMHandle();
                deActivate.deactivateSearchButtons();
            })
        }

    }
    displaySpecificAlbum(album) {

        const fetchRating = new Logic();

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
        `
        mainOutput.innerHTML = contentOfSpecificAlbum;

        let trackTitles = "";

        for (let i = 0; i < album.tracks.length; i++) {
            trackTitles += `
                <button class="albumTrackButton" id="${album.tracks[i]._id}">
                    ${album.tracks[i].title}
                    <img src="images/rightArrow.svg">
                </button>
            `
        }

        const albumTracklist = document.getElementById('albumTracklist');

        albumTracklist.innerHTML = trackTitles;

        const albumTrackButton = document.
        getElementsByClassName('albumTrackButton');

        for (i = 0; i < albumTrackButton.length; i++) {
            albumTrackButton[i].addEventListener('click', function() {
                const newFetch = new FetchHandle();
                newFetch.fetchTrackById(this.id);
            })
        }

        const everyOtherButton = new DOMHandle();
        everyOtherButton.everyOtherButton(albumTrackButton);

        const rateAlbum = document.getElementById('rateAlbum');
        rateAlbum.addEventListener('click', () => {
            const ratingNumber = document.getElementById('ratingNumber').value;
            const thisAlbumId = album._id;
            const rateThisAlbum = new FetchHandle();
            rateThisAlbum.rateStuff('albums', thisAlbumId, ratingNumber);
            rateThisAlbum.fetchAlbumById(thisAlbumId);
        });

    }
    displaySpecificTrack(track) {
        const fetchRating = new Logic();

        let contentOfSpecificTrack = `
            <div id="contentOfSpecificTrack">
                    <div id="trackInfo">
                        <h2>${track.title}</h2>
                        <p>${track.artists[0].name}</p>
                        <p>Rating: ${fetchRating.calculateRating(track)}</p>
                        <button class="trackAlbumButton" id="${track.album.title._id}">
                            ${track.album.title}
                            <img src="images/rightArrow.svg">
                        </button>
                    </div>
                    <div id="buttonWrapper">
                    <input type="number" id="ratingNumber" placeholder="+/-" min="1" max="10">
                    <button id="rateTrack">
                        RATE TRACK
                    </button>
                    <button id="addToPlaylist">
                        ADD TO PLAYLIST
                    </button>
                    <button id="deleteAlbum">
                        DELETE TRACK
                    </button>
                </div>
            </div>
        `
        mainOutput.innerHTML = contentOfSpecificTrack;

        const rateTrack = document.getElementById('rateTrack');
        rateTrack.addEventListener('click', () => {
            const ratingNumber = document.getElementById('ratingNumber').value;
            const thisTrackId = track._id;
            const rateThisTrack = new FetchHandle();
            rateThisTrack.rateStuff('tracks', thisTrackId, ratingNumber);

    });
}
    displaySpecificArtist(artist, albums){
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
                    <img src="${artist.image}">
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
        `
        mainOutput.innerHTML = contentOfSpecificArtist;

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
                const fetchSpecAlbum = new FetchHandle();
                fetchSpecAlbum.fetchAlbumById(this.id);
            });
        }

        const everyOtherButton = new DOMHandle();
        everyOtherButton.everyOtherButton(artistAlbumButtons);


    }
    displaySpecificPlaylist(playlist, comments){
        const fetchRating = new Logic();

        const createdDate = playlist.createdAt.substring(0,10)
        const createdTime = playlist.createdAt.substring(11,16)

        const updatedDate = playlist.updatedAt.substring(0,10)
        const updatedTime = playlist.updatedAt.substring(11,16)

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
                <div class="underline"></div>
                <h3>TRACKLIST</h3>
                <div id="playlistTracklist"></div>
                <form id="commentform">
                    <input type="text" id="commentField">
                    <input type="text" id="commentUser">
                    <button type="button" id="addCommentButton">ADD COMMENT</button>
                </form>
                <div id="playlistComments"></div>
            </div>
        `
        mainOutput.innerHTML=contentOfSpecificPlaylist

        const playlistTracklist = document.getElementById('playlistTracklist');

        let trackButton = "";
        for (let i = 0; i < playlist.tracks.length; i++){
            trackButton +=`
                <button class="playlistTrackButton">
                    ${playlist.tracks[i].artists[0].name} -
                    ${playlist.tracks[i].title}
                    <img src="images/rightArrow.svg">
                </button>
            `
        }

        playlistTracklist.innerHTML=trackButton;

        if(!playlist.comments.length == 0){
        const displayPlaylistComments = new DOMHandle();
        displayPlaylistComments.displayPlaylistComments(comments);
        }

        const addCommentButton = document.getElementById('addCommentButton');
        const commentField = document.getElementById('commentField');
        const commentUser = document.getElementById('commentUser');

        addCommentButton.addEventListener('click', function(){

        const addPlayListComment = new FetchHandle();
        addPlayListComment.addPlayListComment(commentField.value, commentUser.value, playlist._id, comments);

        })

        const everyOtherButton = new DOMHandle();
        everyOtherButton.
        everyOtherButton(playlistTracklist.children);

        const ratePlaylist = document.getElementById('ratePlaylist');
        ratePlaylist.addEventListener('click', () => {
            const ratingNumber = document.getElementById('ratingNumber').value;
            const thisPlaylistId = playlist._id;
            const rateThisPlaylist = new FetchHandle();
            rateThisPlaylist.rateStuff('playlists', thisPlaylistId, ratingNumber);
});

    }
    displayTopPlaylist(list) {
        let topPlaylistsButtons = `<div class="topFivePlayLists">
                                   <p>THE HIGHEST RATED PLAYLISTS</p>`;

        for (let i = 0; i < list.length; i++) {
            if (i == 5) { break; }
            /* Storing the albums in a button */
            topPlaylistsButtons += `
                    <button class="showByIdButton topPlaylistsButton" id="${list[i].id}">
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
                const newFetch = new FetchHandle();
                newFetch.fetchPlaylistById(this.id);
                const deActivate = new DOMHandle();
                deActivate.deactivateSearchButtons();
            })
        }

    }

    displayPlaylistComments(comments, newComment){
        const playlistComments = document.getElementById('playlistComments');

        let commentContent = "";

        for(let i = 0; i < comments[0].length; i++){

            commentContent +=`
                <div class="playlistComment">
                    <p class="commenter">
                        ${comments[0][i].username}
                    </p>
                    <div class="underline"></div>
                    <p class="comment">
                        ${comments[0][i].body}
                    </p>
                </div>
            `
        }

        playlistComments.innerHTML=commentContent;

        if(newComment){
            const newCommentDiv = document.createElement('div');
            newCommentDiv.classList.add('playlistComment');
            const username = document.
            createTextNode(newComment.username);
            const body = document.
            createTextNode(newComment.body);
            newCommentDiv.appendChild(username)
            newCommentDiv.appendChild(body)
            playlistComments.appendChild(newCommentDiv);
        }

    }

    filterSearch() {
        for (let sbutton of searchButton) {
            if (sbutton.classList.contains('activeButton')) {
                const filter = searchField.value.toUpperCase();
                const buttons = mainOutput.getElementsByTagName('button');
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
        for (let i = 0; i < buttons.length; i++) {
            if (i % 2 == 0) {
                buttons[i].style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                buttons[i].addEventListener('mouseover', () => {
                    buttons[i].style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
                });
                buttons[i].addEventListener('mouseleave', () => {
                    buttons[i].style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                });
            }
            else {
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

    createAlbumContent(){
        const addDiv = document.getElementById('addDiv');

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
                <form id="postTrack">
                    <input text="text" id="inputTrackArtist" placeholder="ARTIST..">
                    <input text="text" id="inputTrackTitle" placeholder="TRACK TITLE..">
                    <button type="button" id="addTrackButton">
                        <i class="far fa-plus-square"></i>
                    </button>
                </form>
                <div id="addTrackTracklist"></div>
                <button type="button" id="importCloseButton">
                    <img src="images/x-circle.svg">
                    BACK
                </button>
            </div>
        `;

        addDiv.innerHTML=createAlbumContent;

        setTimeout(function(){
            addDiv.classList.remove('fadeOut');
        });

        const postAlbumButton = document.
        getElementById('postAlbumButton');

        /* -----------ADDED BY ERIKA------------- */
        postAlbumButton.addEventListener('click', function() {
            event.preventDefault();

            /* Gets the input values. */
            const albumController = new Controller;
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

            /* Title and artist are required to be filled in so checking that first. */
            if (isTitleEmpty) {
                errorMessages.push('Please enter a title!');
            }
            if (isArtistEmpty) {
                errorMessages.push('Please enter artist name!');
            }
            /* Checking which other input fields are filled in to see which parameters we have to check if valid */
            if (!isTitleEmpty && !isArtistEmpty) {
                const isGenresEmpty = albumController.isEmpty(albumGenres);
                const isReleaseDateEmpty = albumController.isEmpty(albumReleaseDate);
                const isSpotifyURLEmpty = albumController.isEmpty(albumSpotifyURL);
                const isCoverImageEmpty = albumController.isEmpty(albumCoverImageURL);


                /* If multiple genres are filled in the parameter have to be without ' ' and include ',' in between the genres */
                if (!isGenresEmpty) {
                    const editedGenresParameter = albumController.editGenresParameter(albumGenres);
                    albumGenres = editedGenresParameter;
                }
                if (!isReleaseDateEmpty) {
                    const isReleaseDateValid = albumController.checkYear(albumReleaseDate);
                }
                /* If spotify URL is filled in the URL must be checked */
                if (!isSpotifyURLEmpty) {
                    const isSpotifyURLValid = albumController.checkURL(albumSpotifyURL);
                    if (!isSpotifyURLValid) {
                        errorMessages.push('The spotify URL is not valid, please enter another one.');
                    }
                }

                /* If cover image is filled in the URL must be checked */
                if (!isCoverImageEmpty) {
                    const isImageURLValid = albumController.checkURL(albumCoverImageURL);
                    if (!isImageURLValid) {
                        errorMessages.push('The image URL is not valid, please enter another one.');
                    }
                }
            } /* --- if (!isTitleEmpty && !isArtistEmpty) collapse --- */

            /* A DOM-function to print error-messages should be called for here */
            if (errorMessages.length > 0) {
                for (let errorMessage of errorMessages) {
                    console.log(errorMessage);
                }
            }
            else {
                const fetchArtistId = new FetchHandle;
                const albumArtistId = fetchArtistId.fetchItemByName('albums', albumArtistName)     .then((artist) => {
                        const albumToPost = new Album(albumTitle, artist[0]._id, albumGenres, albumReleaseDate, albumSpotifyURL, albumCoverImageURL);
                        console.log(albumToPost);
                    });
            }
        });

        /* -----------ADDED BY ERIKA collapse------------- */

        const addTrackButton = document.
        getElementById('addTrackButton');

        addTrackButton.addEventListener('click', function(){
            event.preventDefault();
            /* Gets the input values */
            const trackController = new Controller;
            const trackArtist = trackController.getInputValue('inputAlbumArtist');

            fetchArtistByName(albumArtist);
            const albumTitle = trackController.getInputValue('inputAlbumTitle');
            var albumGenres = trackController.getInputValue('inputAlbumGenres');
            const albumReleaseDate = trackController.getInputValue('inputAlbumReleaseDate');
            const albumCoverImageURL = trackController.getInputValue('inputAlbumCoverImage');
            const isNameEmpty = trackController.isEmpty(albumTitle);

        const inputTrackTitle = document.
        getElementById('inputTrackTitle')

        const inputTrackArtist = document.
        getElementById('inputTrackArtist')

        const addTrackTracklist = document.
        getElementById('addTrackTracklist')

            const p = document.createElement('p');
            const newTrack = document.createTextNode(inputTrackArtist.value + ' - ' + inputTrackTitle.value)
            p.appendChild(newTrack);
            addTrackTracklist.appendChild(p)


        })

        const importCloseButton = document.getElementById('importCloseButton');

        importCloseButton.addEventListener('click', function(){
        let createAlbumContent =``;
            addDiv.classList.add('fadeOut');
        setTimeout(function(){
            addDiv.innerHTML=createAlbumContent;
        }, 1000)


        })

    }

    createArtistContent(){
        const addDiv = document.getElementById('addDiv');

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
            const errorMessages = [];

            /* Name is the only parameter required so checking that first */
            if (isNameEmpty) {
                errorMessages.push('Please enter a name!');
            }
            /* Checking which other input fields are filled in to see which parameters we have to check if valid */
            else {
                const isGenresEmpty = artistController.isEmpty(artistGenres);
                const isCoverImageEmpty = artistController.isEmpty(artistCoverImageURL);

                /* If multiple genres are filled in the parameter have to be without ' ' and include ',' in between the genres */
                if (!isGenresEmpty) {
                    const editedGenresParameter = artistController.editGenresParameter(artistGenres);
                    artistGenres = editedGenresParameter;
                    console.log(editedGenresParameter);
                }
                /* If cover image is filled in the URL must be checked */
                if (!isCoverImageEmpty) {
                    const isValidURL = artistController.checkURL(artistCoverImageURL);
                    if (!isValidURL) {
                        errorMessages.push('The URL is not valid, please enter another one.');
                    }
                }
            }
            /* A DOM-function to print error-messages should be called for here */
            if (errorMessages.length > 0) {
                for (let errorMessage of errorMessages) {
                    console.log(errorMessage);
                }
            }
            else {
                const artistToPost = new Artist(artistName, artistGenres, artistCoverImageURL);
                console.log(artistToPost);
            }
        });
        /* -----collapse------ */

        setTimeout(function(){
            addDiv.classList.remove('fadeOut');
        })

        importCloseButton.addEventListener('click', function(){
        let createAlbumContent =``;
            addDiv.classList.add('fadeOut');
        setTimeout(function(){
            addDiv.innerHTML=createAlbumContent;
        }, 1000)

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
    for(i = 0; i < bannerImages.length; i++){
        dots +=`<div class="slideDot"></div>`;
    }

    dotWrapper.innerHTML=dots;

    function startSlide(i){
        if(i <= bannerImages.length-1){
             let addSlide = `
                <div class="slideWrapper fadeSlide">
                    <img src="images/${bannerImages[i]}">
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

    i = 0;
    startSlide(i)
}
/*
displayErrorMessagePopup (errorMessages) {
    const popupDiv = document.createElement('div');
    popupDiv.className = 'fadeOut';
    for (let errorMessage of errorMessages) {
        const errorMessageParagraph = `<p class = "errorMessage">${errorMessage}</p>`;
    }
}*/

}/* --- Class FetchHandle collapse --- */

/* -----------ADDED BY ERIKA------------- */
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

const runSlideShow = new DOMHandle();
runSlideShow.slideShowBanner();

const startFetch = new FetchHandle();
startFetch.fetchAll();
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
