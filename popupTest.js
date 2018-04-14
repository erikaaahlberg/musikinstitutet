function displayErrorMessagePopup (errorMessages) {
    const parentElement = document.getElementById('messageBox');
    
    const popupBox = document.createElement('div');
    popupBox.className = 'messagePopupBox';
    //popupDiv.setAttribute('id', 'messagePopupBox');
    for (let errorMessage of errorMessages) {
        const errorMessageParagraph = document.createElement('p');
        errorMessageParagraph.className = 'errorMessage';
        const errorMessageNode = document.createTextNode(errorMessage);
        errorMessageParagraph.appendChild(errorMessageNode);
        popupBox.appendChild(errorMessageParagraph);
    }
    const okButton = document.createElement('button');
    const buttonNode = document.createTextNode('Ok');
    okButton.setAttribute('id', 'errorOkButton');
    okButton.appendChild(buttonNode);
    popupBox.appendChild(okButton);
    parentElement.appendChild(popupBox);
}
/*const error = ['det är fel blabla du har helt fel okej', 'inte rätt', 'du fuckar upp de här'];
displayErrorMessagePopup(error);*/

function questionMessagePopup (question) {
    const parentElement = document.getElementById('messageBox');
    displayElement('messageBox');

    const popupBox = document.createElement('div');
    const questionParagraph = document.createElement('p');
    const questionNode = document.createTextNode(question);
    const yesButton = document.createElement('button');
    const yesButtonNode = document.createTextNode('Yes');
    const noButton = document.createElement('button');
    const noButtonNode = document.createTextNode('No');

    yesButton.setAttribute('id', 'yesButton');
    noButton.setAttribute('id', 'noButton');

    popupBox.setAttribute('id', 'messagePopupBox');
    popupBox.className = 'messagePopupBox';
    questionParagraph.className = 'questionMessage';
    //popupDiv.setAttribute('id', 'messagePopupBox');
    questionParagraph.appendChild(questionNode);
    popupBox.appendChild(questionParagraph);
    yesButton.appendChild(yesButtonNode);
    popupBox.appendChild(yesButton);
    noButton.appendChild(noButtonNode);
    popupBox.appendChild(noButton);
    parentElement.appendChild(popupBox);

}
questionMessagePopup('vill du me på lite eeh ehh ehh hhhheeeh eeeeeeeh?');
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');

yesButton.addEventListener('click', function(){
    event.preventDefault();
    displayElement('addDiv');
    hideElement('messageBox');
    displayAddTrackForm();
});

noButton.addEventListener('click', function(){
    event.preventDefault();
    hideElement('messageBox');
});
function hideElement (elementId) {
    const element = document.getElementById(elementId);
    element.className = 'fadeOut';
}

function displayAddTrackForm(){
    const addTrackForm = `
    <form id="postTrack">
        <input text="text" id="inputTrackArtist" placeholder="ARTIST..">
        <input text="text" id="inputTrackTitle" placeholder="TRACK TITLE..">
        <button type="button" id="addTrackButton">
            <i class="far fa-plus-square"></i>
        </button>
    </form>`;     
    const addDiv = document.getElementById('addDiv').innerHTML += `
    <form id="postTrack">
        <input text="text" id="inputTrackTitle" placeholder="TRACK TITLE..">
        <button type="button" id="addTrackButton">
            <i class="far fa-plus-square"></i>
        </button>
    </form>`;
}

const addTrackButton = getElementById('addTrackButton');
const addedTracks = [];

addTrackButton.addEventListener('click', function(){
    event.preventDefault();
    const trackController = new Controller;
    const newTrackTitle = getInputValue('inputTrackTitle');
    const newTrackArtist = getInputValue('inputTrackArtist');
    addedTracks.push(`${newTrackArtist} - ${newTrackTitle}`);
});
for (let track in addedTracks) {
    console.log(track);
}
function displayElement (elementId) {
    const element = document.getElementById(elementId).style.display = "block";
}