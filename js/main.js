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