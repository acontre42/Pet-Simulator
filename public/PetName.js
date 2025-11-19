"use strict";

// HTML Elements
const renameButton = document.getElementById("rename-button");
const saveButton = document.getElementById("save-button");
const cancelButton = document.getElementById("cancel-button");
const renameInput = document.getElementById("rename-input");

// Event Listeners
renameButton.addEventListener('click', showRenameElems);
cancelButton.addEventListener('click', hideRenameElems);
saveButton.addEventListener('click', rename);

// Functions
// Get pet name from server, update name display
export async function getPetName() {
    try {
        const response = await fetch('/pet/name', {
            method: 'GET'
        });
        const data = await response.json();
        let name = data.name;
        updateNameDisplay(name);
        return name;
    }
    catch (err) {
        console.log(err);
    }
}

// Change pet's name if valid and successful, update name display
async function rename() {
    let newName = renameInput.value;
    try {
        const response = await fetch('/pet/name', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: newName})
        });
        const {result} = await response.json();
        if (result) {
            hideRenameElems();
            updateNameDisplay(newName);
        }
        else {
            alert('There was an error renaming your pet. Name must be between 1-10 characters and contain at least one letter.');
        }
    }
    catch (err) {
        console.log(err);
    }
}

// Display input and buttons related to name change
function showRenameElems() {
    const renameElems = document.getElementsByClassName("rename");
    for (let elem of renameElems) {
        elem.hidden = false;
    }
    renameButton.hidden = true;
    renameInput.focus();
}

// Hide input and buttons related to name change
function hideRenameElems() {
    renameInput.value = '';
    const renameElems = document.getElementsByClassName("rename");
    for (let elem of renameElems) {
        elem.hidden = true;
    }
    renameButton.hidden = false;
}

// Update all elements classed as 'pet-name' with pet name
function updateNameDisplay(name) {
    const elems = document.querySelectorAll('.pet-name');
    for (let elem of elems) {
        elem.textContent = name;
    }
}