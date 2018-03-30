class Artist {
    constructor(name, genres, coverImage) {
        this.name =       name;
        this.genres =     genres;	
        this.coverImage = coverImage;
    }
}
class Album {
    constructor(title, artists, genres, releaseDate, coverImage) {
        this.title =       title;	
        this.artists =     artists;	
        this.genres	=      genres;
        this.releaseDate = releaseDate;	
        this.coverImage =  coverImage;
    }
}
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

const Controller = (function() {
    return {
        getInputValue: function (elementId) {
            const element = document.getElementById(elementId);
            return element.value;
        },
        isEmpty: function (value) {
            if(value && value != '') {
                return true;
            }
            else {
                return false;
            }
        },
        editGenresParameter: function (genresParameter) {
            var editedGenresParameter = '';
            if (genresParameter.includes(', ')) {
                const splitGenresParameter = genresParameter.split(', ');
                editedGenresParameter = splitGenresParameter[0].concat(',', splitGenresParameter[1]);
            }
            else if (genresParameter.includes(' ')) {
                const splitGenresParameter = genresParameter.split(' ');
                editedGenresParameter = splitGenresParameter[0].concat(',', splitGenresParameter[1]);
            }
            else {
                editedGenresParameter = genresParameter;
            }
            return editedGenreParameter;
        }
    }
})();

const postArtistButton = document.getElementById('postArtistButton');
const postAlbumButton = document.getElementById('postAlbumButton');
const postTrackButton = document.getElementById('postTrackButton');

postArtistButton.addEventListener('click', function(){
    event.preventDefault();
    const artistName = Controller.getInputValue('inputArtistName');
    const isNameEmpty = Controller.isEmpty(artistName);
    const artistGenres = Controller.getInputValue('inputArtistGenres');
    const isGenresEmpty = Controller.isEmpty(artistGenres);
    const artistCoverImage = Controller.getInputValue('inputArtistCoverImage');
    const isCoverImageEmpty = Controller.isEmpty(artistCoverImage);

    const errorMessage = [];
    if (!isNameEmpty) {
        errorMessages.push('Please enter a name!');
    }
    if (!isGenresEmpty) {
        errorMessages.push('The genres you wrote is not valid');
    }
    if (!isCoverImageEmpty) {
        errorMessages.push('The cover image URL is not valid');
    }
    if (errorMessages.length > 0) {
        for (let errorMessage of errorMessages) {
            console.log(errorMessage);
        }
    }
    else {
        const editedGenresParameter = Controller.editGenresParameter(artistGenres);

        const artistToPost = new Artist();
    }
});