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
    setCoverImage (coverImageURL) {
        if (coverImageURL != '') {
            this.coverImage = coverImageURL;
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
    setCoverImage (coverImage) {
        if (coverImageURL != '') {
            this.coverImage = coverImageURL;
        }
    }    
}
const album = new Album('', 'bob marley', 'reggae', 'igår', 'http://');
console.log(album);

class Tracks {
    constructor(title, artists, album, genres, coverImage, spotifyURL) {
        if (title != '' && artists != '' && album != '') {
            this.title = title;	
            this.artists = artists;	
            this.album	= album;
            this.genres	= genres;
            this.coverImage = coverImage;
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
        checkURL (URLaddress) {
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

const postArtistButton = document.getElementById('postArtistButton');
const postAlbumButton = document.getElementById('postAlbumButton');
const postTrackButton = document.getElementById('postTrackButton');

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


function fetchArtistByName(artistName) {
    return fetch(`https://folksa.ga/api/artists?name=${artistName}&key=flat_eric`)
        .then((response) => response.json())
            .then((artist) => {
                return artist;
            });
}
fetchArtistByName('tim buckley').then((artist) => { 
    console.log(artist);
});

postAlbumButton.addEventListener('click', function() {
    event.preventDefault();
    console.log('hej');
    /* Gets the input values */
    const albumController = new Controller;
    const albumArtist = albumController.getInputValue('inputAlbumArtist');

    /* Still not working */
    const albumArtistId = fetchArtistByName(albumArtist);
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

postTrackButton.addEventListener('click', function(){
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
});