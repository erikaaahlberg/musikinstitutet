class Artist {
    constructor(name, genres, coverImage) {
        this.name =       name;
        this.genres =     genres;	
        this.coverImage = coverImage;
    }
}
class Album {
    constructor(title, artists, genres, releaseDate, coverImage) {
        this._title =      title;	
        this.artists =     artists;	
        this.genres	=      genres;
        this.releaseDate = releaseDate;	
        this.coverImage =  coverImage;
    }
    get title() {
        return this._title;
    }
    set title(title) {
        if(title === '') {
            console.log('no way');
        } else {
            this._title = title;
        }
    }
}
const album = new Album('', 'bob marley', 'reggae', 'igår', 'http://');
console.log(album);
class Tracks {
    constructor(title, artists, album, genres, coverImage, spotifyURL) {
        this.title = title;	
        this.artists = artists;	
        this.album	= album;
        this.genres	= genres;
        this.coverImage = coverImage;
        this.spotifyURL = spotifyURL;
    }
}

class HttpRequest {
    constructor(method, headers, body) {
        this.method = method;
        this.headers = headers;
        this.body = body;
    }
}
const request = new HttpRequest('POST', 'blablaa', {id: '15', name: 'erika'});
console.log(request);

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
        checkUrl(urlAddress) {
            var isValid = false;
            const notAllowedCharacters = ['å', 'ä', 'ö', ' '];
            if (urlAddress.includes('http://') || urlAddress.includes('https://')) {
                for (let character of notAllowedCharacters) {
                    if (urlAddress.includes(character)) {
                        isValid = false;
                    } else {
                        isValid = true;
                    }
                }
            }
        return isValid;
    }
};

const postArtistButton = document.getElementById('postArtistButton');
const postAlbumButton = document.getElementById('postAlbumButton');
const postTrackButton = document.getElementById('postTrackButton');

postArtistButton.addEventListener('click', function() {
    event.preventDefault();
    /* Gets the input values */
    const artistName = Controller.getInputValue('inputArtistName');
    var artistGenres = Controller.getInputValue('inputArtistGenres');
    const artistCoverImageUrl = Controller.getInputValue('inputArtistCoverImage');
    const isNameEmpty = Controller.isEmpty(artistName);

    /* Checking the imported values before creating a new artist. This can also   be a string because there is not gonna be more than one error message so far, but in case we want to expand */
    const errorMessages = [];

    /* Name is the only one required so checking that first */
    if (isNameEmpty) {
        errorMessages.push('Please enter a name!');
    }
    /* Checking which other input fields are filled in to see which parameters we have to check if valid */
    else {
        const isGenresEmpty = Controller.isEmpty(artistGenres);
        const isCoverImageEmpty = Controller.isEmpty(artistCoverImageUrl);
        
        /* If multiple genres are filled in the parameter have to be without ' ' and include ',' in between the genres */
        if (!isGenresEmpty) {
            const editedGenresParameter = Controller.editGenresParameter(artistGenres);
            artistGenres = editedGenresParameter;
        }
        /* If cover image is filled in the URL must be checked */
        if (!isCoverImageEmpty) {
            const isValidUrl = Controller.checkUrl(artistCoverImageUrl);
            if (!isValidUrl) {
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
        const artistToPost = new Artist(artistName, artistGenres, artistCoverImageUrl);
        console.log(artistToPost);
    }
});

function fetchArtistByName(artistName){
    fetch(`https://folksa.ga/api/artists?name=${artistName}&key=flat_eric`)
        .then((response) => response.json())
            .then((artist) => {
                console.log(artist);
                /*fetch(`https://folksa.ga/api/albums/${artist.albums}&key=flat_eric`)
                .then((response) => response.json())
                .then((albumTitle) => {
                            /*const displaySpecificArtist = new DOMHandle();
                            displaySpecificArtist.displaySpecificArtist(artist, albums);
                            console.log(albumTitle);
                     
                });   */
            });
}

postAlbumButton.addEventListener('click', function() {
    event.preventDefault();
    /* Gets the input values */
    const album = new Controller;
    const albumArtist = album.getInputValue('inputAlbumArtist');
    
    /*const albumArtistId = */
    fetchArtistByName(albumArtist);
    /*const albumTitle = Controller.getInputValue('inputAlbumTitle');
    var albumGenres = Controller.getInputValue('inputAlbumGenres');
    const albumReleaseDate = Controller.getInputValue('inputAlbumReleaseDate');
    const albumCoverImageUrl = Controller.getInputValue('inputAlbumCoverImage');
    const isNameEmpty = Controller.isEmpty(albumName);

    /* Checking the imported values before creating a new artist. This can also be a string because there is not gonna be more than one error message so far, but in case we want to expand */
    const errorMessages = [];

    /* Name is the only one required so checking that first */
    if (isNameEmpty) {
        errorMessages.push('Please enter a name!');
    }
    /* Checking which other input fields are filled in to see which parameters we have to check if valid */
    else {
        const isGenresEmpty = Controller.isEmpty(albumGenres);
        const isCoverImageEmpty = Controller.isEmpty(albumCoverImageUrl);
        
        /* If multiple genres are filled in the parameter have to be without ' ' and include ',' in between the genres */
        if (!isGenresEmpty) {
            const editedGenresParameter = Controller.editGenresParameter(albumGenres);
            albumGenres = editedGenresParameter;
        }
        /* If cover image is filled in the URL must be checked */
        if (!isCoverImageEmpty) {
            const isValidUrl = Controller.checkUrl(albumCoverImageUrl);
            if (!isValidUrl) {
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
        const albumToPost = new Artist(albumName, albumGenres, albumCoverImageUrl);
        console.log(albumToPost);
    }
});