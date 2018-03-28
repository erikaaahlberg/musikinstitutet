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