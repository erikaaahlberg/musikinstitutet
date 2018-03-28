/* Handles all fetch queries. */
class FetchHandle {
    /* If a value is sent to the constructor it is available for all
     * methods in the class. apiPath is the folksa.ga/api/->this<-/ */
    constructor(apiPath) {
        this.apiPath = apiPath;
    }
    
    
    /* Fetches all the albums using this.apiPath which is available in the class */
    fetchAlbums() {
        fetch(`https://folksa.ga/api/${this.apiPath}?key=flat_eric`)
            .then((response) => response.json())
            .then((artists) => {
                /* Creates a new instance of the DOMHandle-class and
                 * sends the JSON-object artists to the constructor. */
                const displayAlbum = new DOMHandle(artists);
                /* When the new instance is created the displayAlbums() function
                 * in the class is called. */
                displayAlbum.displayAlbums();
            });
    }
    
}

/* Handles the DOM. */
class DOMHandle {
    /* The constructor accepts a JSON-object that is available to all methods. */
    constructor(json) {
        this.json = json;
    }
    /* Console logs the JSON-object. Doesn't add anything to the DOM right now. */
    displayAlbums() {
        
        const searchResults = document.getElementById('searchResults');
        let searchedAlbumButtons = ""
        /* Loops json object */
        for(let albums of this.json){
            /* Storing the albums in a button */
            searchedAlbumButtons += `
                <button class="searchedAlbumButton" id="${albums._id}">
                    ARTISTNAME
                    ${albums.title}
                    ${albums.releaseDate}
                    <img src="images/rightArrow.svg">
                </div>
            `;
        }
        /* Prints the search results for Albums */
        searchResults.innerHTML=searchedAlbumButtons
        
    }
}

const searchRadioButton = document.
getElementsByClassName('searchRadioButton');

/* Loops thru the searchRadioButtons then runs Fetch class. */ 
for (i = 0; i < searchRadioButton.length; i++){
   
    searchRadioButton[i].addEventListener('click', function () {

    const newFetch = new FetchHandle(this.value);
    newFetch.fetchAlbums();
    
})
    
}

class Controller {
    
}