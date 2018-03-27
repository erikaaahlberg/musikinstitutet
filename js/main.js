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
        console.log('hej', this.json);
    }
}

/* Creates a new instance of the FetchHandle-class and runs fetchAlbum() */ 
const newFetch = new FetchHandle('albums');
newFetch.fetchAlbums();
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', function () {
    const searchEvent = new Controller();
    searchEvent.search(event);
    /* Runs the search in Controller. */
    
})

class Controller {

    search(event) {
    /* Search function */
        event.preventDefault();
        /* Prevents page from updating */
        const searchFieldValue = document.getElementById('searchField').value
        /* Value of inputfield */
        const searchRadioButton = document.
        getElementsByClassName('searchRadioButton');

        let radioButtonValue = "";
        
        for (let i = 0; i < searchRadioButton.length; i++) {
            /* Loop thru the radiobuttons */
            if (searchRadioButton[i].checked) {
                /* If checked, store value */
                radioButtonValue = searchRadioButton[i].value
            }
        }
    }
    
}

/* USEFULL VARIBLES OF Controller.search
   -  radioButtonValue
   -  searchFieldValue */
