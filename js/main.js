const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', function(){
    search(event)
})

function search(event){
    
    const searchFieldValue = document.getElementById('searchField').value
    
    event.preventDefault();
    
    const searchRadioButton = document.
    getElementsByClassName('searchRadioButton');
    
    let radioButtonValue = "";
    //Fetches the value from searchRadioButton
    for(i = 0;i < searchRadioButton.length; i++){
        if(searchRadioButton[i].checked){
          radioButtonValue = searchRadioButton[i].value
            console.log(searchField.value)
            console.log(radioButtonValue)
        }
    }
    
}