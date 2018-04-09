const searchButton = document.getElementsByClassName('searchButton');
const mainOutput = document.getElementById('mainOutput');
/* Loops thru the searchRadioButtons then runs Fetch class. */
for (i = 0; i < searchButton.length; i++) {
    searchButton[i].addEventListener('click', function() {
        const activateButton = new DOMHandle();
        activateButton.activateSearchButton(this);
        const newFetch = new FetchHandle(this.value);
        mainOutput.innerHTML = '';
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
        for (let i = 0; i < allAlbums.length; i++) {
            /* Storing the albums in a button */
            searchedAlbumButtons += `
                <button class="showByIdButton" id="${allAlbums[i]._id}">
                    ${allArtists[i].name} -
                    ${allAlbums[i].title} -
                    ${allAlbums[i].releaseDate}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }
        /* Prints the search results for Albums */
        mainOutput.insertAdjacentHTML('beforeend', searchedAlbumButtons);

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
        everyOtherButton(mainOutput.children);

    }
    displayTracks(allTracks) {
        let searchedTrackButtons = '';
        for (let i = 0; i < allTracks.length; i++) {
            searchedTrackButtons += `
                <button class="showByIdButton" id="${allTracks[i]._id}">
                    ${allTracks[i].title} -
                    ${allTracks[i].artists[0].name}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }

        mainOutput.insertAdjacentHTML('beforeend', searchedTrackButtons);

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
        everyOtherButton(mainOutput.children);

    }
    displayArtists(allArtists) {
        let searchedArtistButtons = '';
        for (let i = 0; i < allArtists.length; i++) {
            searchedArtistButtons += `
                <button class="showByIdButton" id="${allArtists[i]._id}">
                    ${allArtists[i].name}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }

        mainOutput.insertAdjacentHTML('beforeend', searchedArtistButtons);

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
        everyOtherButton(mainOutput.children);

    }
    displayPlaylists(allPlaylists) {
        let searchedPlaylistButtons = '';
        for (let i = 0; i < allPlaylists.length; i++) {
            searchedPlaylistButtons += `
                <button class="showByIdButton" id="${allPlaylists[i]._id}">
                    ${allPlaylists[i].title}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }

        mainOutput.insertAdjacentHTML('beforeend', searchedPlaylistButtons);

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
        everyOtherButton(mainOutput.children);

    }
    displaySpecificAlbum(album, artist) {
        
        const fetchRating = new Logic();
        
        let contentOfSpecificAlbum = `
            <div id="contentOfSpecificAlbum">
                <div id="albumTopContent">
                    <img src="${album.coverImage}">
                    <div id="albumInfo">
                        <h2>${album.title}</h2>
                        <p>By ${artist.name}</p>
                        <p>Rating: ${fetchRating.calculateRating(album)}</p>
                    </div>
                </div>
                <input type="number" id="ratingNumber" placeholder="1-10" min="1" max="10">
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
        mainOutput.innerHTML = contentOfSpecificAlbum;

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

        albumTracklist.innerHTML = trackTitles;

        const rateAlbum = document.getElementById('rateAlbum');
        rateAlbum.addEventListener('click', () => {
            const ratingNumber = document.getElementById('ratingNumber').value;
            const thisArtistId = album._id;
            const rateThisAlbum = new FetchHandle();
            rateThisAlbum.rateStuff('albums', thisArtistId, ratingNumber);
            rateThisAlbum.fetchAlbumById(thisArtistId);
        });

    }
    displaySpecificTrack(track, artist) {
        let contentOfSpecificTrack = `
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
        mainOutput.innerHTML = contentOfSpecificTrack;
    }
    displaySpecificArtist(artist, albums){

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
        mainOutput.innerHTML = contentOfSpecificArtist;

        let artistAlbum = "";
        for(let i = 0; i < albums.length; i++){
            artistAlbum +=`
                <button class="showByIdButton" id="${albums[i]._id}">
                    ${albums[i].title} -
                    ${albums[i].releaseDate}
                    <img src="images/rightArrow.svg">
                </button>
            `;
        }

        const albumList = document.getElementById('artistAlbums');
        albumList.innerHTML=artistAlbum;

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
        })
        
        const addAlbumButton = document.
        getElementById('postAlbumButton');
        
        addAlbumButton.addEventListener('click', function(){
            console.log("hej")
        })
        
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
    
}

class Controller {
    getInputValue(elementId) {
        const element = getElementById(elementId);
        return element.value;
    }
    checkValue(value) {
        if (value && value != '') {
            return true;
        } else {
            return false;
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
            number += n;
        }
        const rating = (number / object.ratings.length);
        const roundedRating = Math.round( rating * 10 ) / 10;
        return roundedRating;
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
