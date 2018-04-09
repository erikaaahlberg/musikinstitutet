const searchButton = document.getElementsByClassName('searchButton');
const mainOutput = document.getElementById('mainOutput');
const searchResults = document.getElementById('searchResults')
/* Loops thru the searchRadioButtons then runs Fetch class. */
for (i = 0; i < searchButton.length; i++) {
    searchButton[i].addEventListener('click', function() {
        const activateButton = new DOMHandle();
        activateButton.activateSearchButton(this);
        const newFetch = new FetchHandle(this.value);
        searchResults.innerHTML = '';
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
    fetchAll() {
        /* Contains promises and objects */
        let promiseArray = [];
        let artistPromiseArray = [];
        let fetchedObject = { albums: [], albumartists: [], tracks: [], artists: [], playlists: [] };
        const toFetch = ['albums', 'tracks', 'artists', 'playlists'];
        /* Start of by fetching everything. */
        for (let promise of toFetch) {
            let fetchItem = fetch(`https://folksa.ga/api/${promise}?key=flat_eric`)
                .then((response) => response.json())
            promiseArray.push(fetchItem);
            /* For albums we want the artist name too, so a new fetch is initiated
             * based on the object that is retreived. */
            if (promise == 'albums') {
                Promise.resolve(fetchItem)
                    .then((resolvedObject) => {
                        for (let item of resolvedObject) {
                            let artistPromise = fetch(`https://folksa.ga/api/artists/${item.artists}?key=flat_eric`)
                                .then((response) => response.json())
                            artistPromiseArray.push(artistPromise);
                        }
                        /* They are promised and applied to fetchedObject.  */
                        Promise.all(artistPromiseArray)
                            .then((artistPromisedArray) => {
                                fetchedObject['albumartists'] = artistPromisedArray;
                            })
                            /* All data needs to be present, so we are using then to make sure
                             * that they are async using then. */
                            .then(() => {
                                /* All the items from toFetch are Promised here and applied
                                 * to fetchedObject. */
                                Promise.all(promiseArray)
                                    .then((promisedArray) => {
                                        for (let i = 0; i < promisedArray.length; i++) {
                                            fetchedObject[toFetch[i]] = promisedArray[i];
                                        }
                                        /* displayAll is called */
                                        const displayAll = new DOMHandle();
                                        displayAll.displayAll(fetchedObject.albums, fetchedObject.tracks,
                                            fetchedObject.artists, fetchedObject.playlists, fetchedObject.albumartists);
                                        displayAll.filterSearch();
                                    });
                            })
                    })
            }
        }
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
                    .then((artistPromise) => {
                        const displayAlbum = new DOMHandle();
                        displayAlbum.displayAlbums(albums, artistPromise);
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
    fetchTopPlaylists() {
        fetch(`https://folksa.ga/api/playlists?key=flat_eric`)
            .then((response) => response.json())
            .then((playlists) => {
                const topPlaylists = new Logic();
                console.log(topPlaylists.determineTopPlaylists(playlists));
            });
    }
    fetchAlbumById(albumId) {
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
    fetchTrackById(trackId) {
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
    fetchArtistByName(artistName){
        var albumArtistId = [];
        fetch(`https://folksa.ga/api/artists?name=${artistName}&key=flat_eric`)
            .then((response) => response.json())
                .then((artist) => {
                    //console.log(artist[0]._id);
                    albumArtistId.push(artist[0]._id);
                });
                return albumArtistId;
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
            console.log(vote);
        })
        .catch((error) => {
            console.log(error);
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

    displayAll(allAlbums, allTracks, allArtists, allPlaylists, allAlbumArtists) {
        this.displayAlbums(allAlbums, allAlbumArtists);
        this.displayTracks(allTracks);
        this.displayArtists(allArtists);
        this.displayPlaylists(allPlaylists);
    }

    /* Console logs the JSON-object. Doesn't add anything to the DOM right now. */
    displayAlbums(allAlbums, allArtists) {
        let searchedAlbumButtons = '';
        /* Loops json object */



        const searchResult = document.getElementById('searchResults')

        for (let i = 0; i < allAlbums.length; i++) {
            /* Storing the albums in a button */
            searchedAlbumButtons += `
                <button class="showByIdButton" id="${allAlbums[i]._id}" data-genre="${this.displayGenres(allAlbums[i])}">
                    ${allArtists[i].name} -
                    ${allAlbums[i].title} -
                    ${allAlbums[i].releaseDate}
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
            })
        }

        const everyOtherButton = new DOMHandle();
        everyOtherButton.
        everyOtherButton(mainOutput.firstElementChild.children);

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
            })
        }

        const everyOtherButton = new DOMHandle();
        everyOtherButton.
        everyOtherButton(mainOutput.firstElementChild.children);

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
            })
        }

        const everyOtherButton = new DOMHandle();
        everyOtherButton.
        everyOtherButton(mainOutput.firstElementChild.children);

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
            })
        }

        const everyOtherButton = new DOMHandle();
        everyOtherButton.
        everyOtherButton(mainOutput.firstElementChild.children);

    }
    displaySpecificAlbum(album, artist) {

        const fetchRating = new Logic();

        let contentOfSpecificAlbum = `
            <div id="contentOfSpecificAlbum">
                <div id="albumTopContent">
                    <img src="${album.coverImage}">
                    <div id="albumInfo">
                        <h2>${album.title}</h2>
                        <p id="artistName"> ${artist.name}</p>
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
                console.log(this)
            })
        }

        const rateAlbum = document.getElementById('rateAlbum');
        rateAlbum.addEventListener('click', () => {
            const ratingNumber = document.getElementById('ratingNumber').value;
            const thisAlbumId = album._id;
            const rateThisAlbum = new FetchHandle();
            rateThisAlbum.rateStuff('albums', thisAlbumId, ratingNumber);
            rateThisAlbum.fetchAlbumById(thisAlbumId);
        });

        const everyOtherButton = new DOMHandle();
        everyOtherButton.
        everyOtherButton(albumTracklist.children);

    }
    displaySpecificTrack(track, artist) {

        let contentOfSpecificTrack = `
            <div id="contentOfSpecificTrack">
                    <div id="trackInfo">
                        <h2>${track.title}</h2>
                        <p>${artist.name}</p>
                        <p>Rating: ${artist.rating}</p>
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

    }
    displaySpecificArtist(artist, albums){

        let contentOfSpecificArtist = `
            <div id="contentOfSpecificArtist">
                <div id="artistTopContent">
                    <img src="${artist.image}">
                    <div id="artistInfo">
                        <h2>${artist.name}</h2>
                        <p id="genres"><span>Genres:</span> ${artist.genres}</p>
                        <p id="countryBorn"><span>Country:</span> ${artist.countryBorn}</p>
                        <p id="born"><span>Born:</span> ${artist.born}</p>
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
            artistAlbum +=`
                <button class="artistAlbumButton" id="${albums[i]._id}">
                    ${albums[i].title} -
                    ${albums[i].releaseDate}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }

        const albumList = document.getElementById('artistAlbums');
        albumList.innerHTML=artistAlbum;

        const everyOtherButton = new DOMHandle();
        everyOtherButton.
        everyOtherButton(albumList.children);

    }
    displaySpecificPlaylist(playlist, comments){

        let contentOfSpecificPlaylist =`
            <div class="playlistContent">
                ${playlist.title}
                ${playlist.ratings}
                ${playlist.genres}
                ${playlist.createdBy}
                ${playlist.createdAt}
                ${playlist.updatedAt}
                <button id="deletePlaylist">
                    DELETE PLAYLIST
                </button>
                <button id="ratePlaylist">
                    RATE PLAYLIST
                </button>
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
                <button class="playlistTrack">
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

    }

    displayPlaylistComments(comments, newComment){
        const playlistComments = document.getElementById('playlistComments');

        let commentContent = "";

        for(let i = 0; i < comments[0].length; i++){

            commentContent +=`
                <div class="playlistComment">
                    ${comments[0][i].username}
                    ${comments[0][i].body}
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
        const filter = searchField.value.toUpperCase();
        const buttons = mainOutput.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            let dataGenre = buttons[i].getAttribute('data-genre').toUpperCase();
            if (buttons[i].innerHTML.toUpperCase().indexOf(filter) > -1 || dataGenre.indexOf(filter) > -1 && dataGenre != 'NONE') {
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
    everyOtherButton(page){
        for(let i = 0; i < page.length; i++){
            let sum = i++;
             page[sum].classList.add('lightButton');
        }
    }

    createAlbumContent(){
        const addDiv = document.getElementById('addDiv');

        let createAlbumContent =`
            <p>ADD AN ALBUM</p>
            <form id="importAlbum">
                <input type="text" id="inputAlbumArtist" placeholder="ARTIST..">
                <input type="text" id="inputAlbumTitle" placeholder="ALBUM TITLE..">
                <input type="text" id="inputAlbumGenres" placeholder="ALBUM GENRE..">
                <input type="text" id="inputAlbumReleaseDate" placeholder="RELEASE YEAR..">
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
                BACK
            </button>

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
            console.log('hej');
            /* Gets the input values */
            const albumController = new Controller;
            const albumArtist = albumController.getInputValue('inputAlbumArtist');

            /* Still not working */
            var albumArtistId = '';
            fetchArtistByName(albumArtist);
            console.log(albumArtistId);
            /* ------------------ */

            const albumTitle = albumController.getInputValue('inputAlbumTitle');
            var albumGenres = albumController.getInputValue('inputAlbumGenres');
            const albumReleaseDate = albumController.getInputValue('inputAlbumReleaseDate');
            const albumCoverImageURL = albumController.getInputValue('inputAlbumCoverImage');

            /* Title and artist are required to create a new album */
            const isTitleEmpty = albumController.isEmpty(albumTitle);
            const isArtistEmpty = albumController.isEmpty(albumArtist);

            /* Checking the imported values before creating a new artist. */
            const errorMessages = [];

            /* Title and artist is the only required so checking that first */
            if (isTitleEmpty) {
                errorMessages.push('Please enter a title!');
            }
            if (isArtistEmpty) {
                errorMessages.push('Please enter artist name!');
            }
            /* Checking which other input fields are filled in to see which parameters we have to check if valid */
            if (!isTitleEmpty && !isArtistEmpty) {
                const isGenresEmpty = albumController.isEmpty(albumGenres);
                const isCoverImageEmpty = albumController.isEmpty(albumCoverImageURL);
                const isReleaseDateEmpty = albumController.isEmpty(albumReleaseDate);

                /* If multiple genres are filled in the parameter have to be without ' ' and include ',' in between the genres */
                if (!isGenresEmpty) {
                    const editedGenresParameter = albumController.editGenresParameter(albumGenres);
                    albumGenres = editedGenresParameter;
                }
                /* If cover image is filled in the URL must be checked */
                if (!isCoverImageEmpty) {
                    const isURLValid = albumController.checkURL(albumCoverImageURL);
                    if (!isURLValid) {
                        errorMessages.push('The URL is not valid, please enter another one.');
                    }
                }
                if (!isReleaseDateEmpty) {
                    const isReleaseDateValid = albumController.checkYear(albumReleaseDate);
                }
            }
            /* A DOM-function to print error-messages should be called for here */
            if (errorMessages.length > 0) {
                for (let errorMessage of errorMessages) {
                    console.log(errorMessage);
                }
            }
            else {
                const albumToPost = new Album(albumName, albumGenres, albumCoverImageURL);
                console.log(albumToPost);
            }
        });

        /* -----------ADDED BY ERIKA collapse------------- */

        const addTrackButton = document.
        getElementById('addTrackButton');

        addTrackButton.addEventListener('click', function(){

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
            <p>ADD AN ARTIST</p>
                <form id = "importArtist">
                    <input type="text" id="inputArtistName" placeholder="ARTIST NAME..">
                    <input type="text" id="inputArtistGenres" placeholder="GENRES..">
                    <input type="text" id="inputArtistCoverImage" placeholder="COVER IMAGE..">
                    <button id="postArtistButton">Add artist</button>
                </form>
            <button type="button" id="importCloseButton">
                BACK
            </button>
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

            /* Checking the imported values before creating a new artist. This can also   be a string because there is not gonna be more than one error message so far, but in case we want to expand */
            const errorMessages = [];

            /* Name is the only one required so checking that first */
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

}

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
            console.log(currentYear);
            if (year > 1500 && year <= currentYear) {
                return true;
            } else {
                return false;
            }
        }
};

class Artist {
    constructor(name, genres, coverImageURL) {
        if (name != '') {
            this.name =       name;
            this.genres =     genres;
            this.coverImageURL = coverImage;
        }
    }
    setGenres (genres) {
        if (genres != '') {
            this.genres = genres;
        }
    }
    setCoverImage (coverImageURL) {
        if (coverImageURL != '') {
            this.coverImageURL = coverImageURL;
        }
    }
}

class Album {
    constructor(title, artists, genres, releaseDate, spotifyURL, coverImage) {
        if (title != '' && artist != '') {
            this.title =      title;
            this.artists =     artists;
            this.genres	=      genres;
            this.releaseDate = releaseDate;
            this.spotifyURL =  spotifyURL;
            this.coverImage =  coverImage;
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
        if (URL != '') {
            this.spotifyURL = spotifyURL;
        }
    }
    setCoverImage (coverImageURL) {
        if (coverImageURL != '') {
            this.coverImageURL = coverImage;
        }
    }
}

class Tracks {
    constructor (title, artists, album, genres, coverImage, spotifyURL) {
        if (title != '' && artists != '' && album != '') {
            this.title = title;
            this.artists = artists;
            this.album	= album;
            this.genres	= genres;
            this.coverImage = coverImage;
            this.spotifyURL = spotifyURL;
        }
    }
    setGenres (genres) {
        if (genres != '') {
            this.genres = genres;
        }
    }
    setCoverImage (coverImageURL) {
        if (coverImageURL != '') {
            this.coverImageURL = coverImage;
        }
    }
    setSpotifyURL (spotifyURL) {
        if (URL != '') {
            this.spotifyURL = spotifyURL;
        }
    }
}

class HttpRequest {
    constructor(method, headers, body) {
        this.method = method;
        this.headers = headers;
        this.body = body;
    }
}
/* -----------ADDED BY ERIKA------------- */

class Logic {
    calculateRating(object) {
        if (object.ratings === undefined || object.ratings.length == 0) {
            return 'No votes.'
        }
        let number = 0;
        for (let n of object.ratings) {
            number += n;
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
