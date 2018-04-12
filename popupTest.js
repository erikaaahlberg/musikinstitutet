function displayErrorMessagePopup (errorMessages) {
    const popupDiv = document.createElement('div');
    popupDiv.className = 'messagePopupBox';
    //popupDiv.setAttribute('id', 'messagePopupBox');
    for (let errorMessage of errorMessages) {
        const errorMessageParagraph = document.createElement('p');
        errorMessageParagraph.className = 'errorMessage';
        const errorMessageNode = document.createTextNode(errorMessage);
        errorMessageParagraph.appendChild(errorMessageNode);
        popupDiv.appendChild(errorMessageParagraph);
    }
    const messageBox = document.getElementById('messageBox');
    const okButton = document.createElement('button');
    const buttonNode = document.createTextNode('Ok');
    okButton.setAttribute('id', 'errorOkButton');
    okButton.appendChild(buttonNode);
    popupDiv.appendChild(okButton);
    messageBox.appendChild(popupDiv);
}
/*const error = ['det är fel blabla du har helt fel okej', 'inte rätt', 'du fuckar upp de här'];
displayErrorMessagePopup(error);*/

function questionMessagePopup (question) {
    const messageBox = document.getElementById('messageBox');

    const popupDiv = document.createElement('div');
    const questionParagraph = document.createElement('p');
    const questionNode = document.createTextNode(question);
    const yesButton = document.createElement('button');
    const yesButtonNode = document.createTextNode('Yes');
    const noButton = document.createElement('button');
    const noButtonNode = document.createTextNode('No');

    yesButton.setAttribute('id', 'yesButton');
    noButton.setAttribute('id', 'noButton');

    popupDiv.setAttribute('id', 'messagePopupBox');
    popupDiv.className = 'messagePopupBox';
    questionParagraph.className = 'questionMessage';
    //popupDiv.setAttribute('id', 'messagePopupBox');
    questionParagraph.appendChild(questionNode);
    popupDiv.appendChild(questionParagraph);
    yesButton.appendChild(yesButtonNode);
    popupDiv.appendChild(yesButton);
    noButton.appendChild(noButtonNode);
    popupDiv.appendChild(noButton);
    messageBox.appendChild(popupDiv);

}
questionMessagePopup('vill du me på lite eeh ehh ehh hhhheeeh eeeeeeeh?');
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');

yesButton.addEventListener('click', function(){
    event.preventDefault();
    hideElement('messagePopupBox');
    displayAddTrackForm();

});

noButton.addEventListener('click', function(){
    event.preventDefault();
    hideElement('messagePopupBox');
});
function hideElement (elementId) {
    const element = document.getElementById(elementId);
    element.className = 'hidden';
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
    const addDiv = getElementById('addDiv').innerHTML += `
    <form id="postTrack">
        <input text="text" id="inputTrackTitle" placeholder="TRACK TITLE..">
        <button type="button" id="addTrackButton">
            <i class="far fa-plus-square"></i>
        </button>
    </form>`;
}

const addTrackButton = getElementById('addTrackButton');
const tracks = [];

addTrackButton.addEventListener('click', function(){
    event.preventDefault();
    const trackController = new Controller;
    tracks.push(trackController.getInputValue('inputTrackTitle'));
    console.log(tracks);
});