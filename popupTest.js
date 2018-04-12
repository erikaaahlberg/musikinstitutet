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
    okButton.setAttribute('class', 'errorOkButton');
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

    yesButton.setAttribute('class', 'yesButton');
    noButton.setAttribute('class', 'noButton');

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