"use strict";
import NotificationBar from './NotificationBar.js';
import * as PetDisplay from './PetDisplay.js';
const NB = new NotificationBar();

// HTML Elements
// Buttons
const feedButton = document.getElementById("feed-button");
const sleepButton = document.getElementById("sleep-button");
const wakeButton = document.getElementById("wake-button");
const bathroomButton = document.getElementById("bathroom-button");
const batheButton = document.getElementById("bathe-button");
const petButton = document.getElementById("pet-button");
const playButton = document.getElementById("play-button");
const clearButton = document.getElementById("clear-button");
const renameButton = document.getElementById("rename-button");
const saveButton = document.getElementById("save-button");
const cancelButton = document.getElementById("cancel-button");
// <P>
const hungerP = document.getElementById("hunger");
const energyP = document.getElementById("energy");
const bladderP = document.getElementById("bladder");
const hygieneP = document.getElementById("hygiene");
const socialP = document.getElementById("social");
const funP = document.getElementById("fun");
// Other
const foodSelect = document.getElementById("food-select");
const playSelect = document.getElementById("play-select");
const petSelect = document.getElementById("pet-select");
const notificationBar = document.getElementById("notification-bar");
const renameInput = document.getElementById("rename-input");

// Pet Info Variables
let name;

// Comparison Variables
let priorEnergy = 0; // To compare to updated values in order to avoid calling wakeUp everytime energy is maxed out
let priorHunger = 10; // To compare to updated value in order to warn user if pet's hunger gets low
let priorStatus; // For pet-img updating purposes

// Button-related Variables
const WAKE = -1, HUNGER = 0, ENERGY = 1, BLADDER = 2, HYGIENE = 3, SOCIAL = 4, FUN = 5; // CODES FOR SPECIFIC NEEDS
const NEED_CODES = [WAKE, HUNGER, ENERGY, BLADDER, HYGIENE, SOCIAL, FUN];
const UNCLICKABLE = "unclickable";

// BUTTON FUNCTIONALITY-RELATED FUNCTIONS
// Make all buttons unclickable. If an exception is provided, skip it.
function disableButtons(exception) {
    for (let i = 0; i < NEED_CODES.length; i++) {
        if (NEED_CODES[i] === exception) {
            continue;
        }
        disableSpecificButton(NEED_CODES[i]);
    }
}
// Make all buttons clickable. If an exception is provided, skip it.
function enableButtons(exception) {
    for (let i = 0; i < NEED_CODES.length; i++) {
        if (NEED_CODES[i] === exception) {
            continue;
        }
        enableSpecificButton(NEED_CODES[i]);
    }
}
// Enables only one specific button based on value of needCode. Changes button's style properties.
function enableSpecificButton(needCode) {
    switch (needCode) {
        case WAKE:
            wakeButton.addEventListener("click", wakeUp);
            wakeButton.classList.remove(UNCLICKABLE);
            break;
        case HUNGER:
            feedButton.addEventListener("click", eat);
            feedButton.classList.remove(UNCLICKABLE);
            break;
        case ENERGY:
            sleepButton.addEventListener("click", sleep);
            sleepButton.classList.remove(UNCLICKABLE);
            break;
        case BLADDER:
            bathroomButton.addEventListener("click", goBathroom);
            bathroomButton.classList.remove(UNCLICKABLE);
            break;
        case HYGIENE:
            batheButton.addEventListener("click", bathe);
            batheButton.classList.remove(UNCLICKABLE);
            break;
        case SOCIAL:
            petButton.addEventListener("click", socialize);
            petButton.classList.remove(UNCLICKABLE);
            break;
        case FUN:
            playButton.addEventListener("click", play);
            playButton.classList.remove(UNCLICKABLE);
            break;
    }
}
// Disable only one specific button based on needCode. Changes button's style properties.
function disableSpecificButton(needCode) {
    switch (needCode) {
        case WAKE:
            wakeButton.removeEventListener("click", wakeUp);
            wakeButton.classList.add(UNCLICKABLE);
            break;
        case HUNGER:
            feedButton.removeEventListener("click", eat);
            feedButton.classList.add(UNCLICKABLE);
            break;
        case ENERGY:
            sleepButton.removeEventListener("click", sleep);
            sleepButton.classList.add(UNCLICKABLE);
            break;
        case BLADDER:
            bathroomButton.removeEventListener("click", goBathroom);
            bathroomButton.classList.add(UNCLICKABLE);
            break;
        case HYGIENE:
            batheButton.removeEventListener("click", bathe);
            batheButton.classList.add(UNCLICKABLE);
            break;
        case SOCIAL:
            petButton.removeEventListener("click", socialize);
            petButton.classList.add(UNCLICKABLE);
            break;
        case FUN:
            playButton.removeEventListener("click", play);
            playButton.classList.add(UNCLICKABLE);
            break;
    }
}

// DISPLAY-RELATED FUNCTIONS
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
// Update all elements classed as pet-name with pet name
function updateNameDisplay() {
    const elems = document.querySelectorAll('.pet-name');
    for (let elem of elems) {
        elem.textContent = name;
    }
}
// Refreshes Need displays
async function updateNeeds() {
    try {
        const response = await fetch('/needs', {
            method: 'GET'
        });
        const data = await response.json();
        // Update text
        const {hunger, energy, bladder, hygiene, social, fun, max} = data;
        hungerP.innerText = `Hunger: ${hunger} / ${max}`,
        energyP.innerText = `Energy: ${energy} / ${max}`,
        bladderP.innerText = `Bladder: ${bladder} / ${max}`,
        hygieneP.innerText = `Hygiene: ${hygiene} / ${max}`,
        socialP.innerText = `Social: ${social} / ${max}`,
        funP.innerText = `Fun: ${fun} / ${max}`
        // End simulation if no longer alive
        const {alive} = data;
        if (!alive) {
            await endSimulation();
            return;
        }
        // Compare energy to prior value
        if (energy == max && energy != priorEnergy) {
            wakeUp();
        }
        priorEnergy = energy;
        // Notify if hungry
        if (hunger < 4 && priorHunger >= 4) {
            notify(`${name} is getting hungry!`);
        }
        priorHunger = hunger;
        // Check if stinky
        const {stinky} = data;
        PetDisplay.setStink(stinky);
        // Update pet-img based on current status
        const {status} = data;
        if (status !== priorStatus) {
            console.log('new status: ', status); // *** DELETE
            if (status == null) { // Pet was previously doing an activity, and is now back to neutral
               PetDisplay.neutral();
            }
        }
        priorStatus = status;
    }
    catch (err) {
        console.log(err);
    }
}
// Disable all buttons, clear all intervals, hide existing effects, alert user.
async function endSimulation() {
    fetch('/pet/stop', {
        method: 'GET'
    });
    disableButtons();
    clearInterval(updateId);
    PetDisplay.deceased();
    notify(`${name} has passed away. RIP`);
}

// NOTIFICATION-RELATED FUNCTIONS
// Clear notification-bar
function clearNB() {
    NB.clear();
    notificationBar.innerHTML = `<p>No notifications to display.</p>`;
}
// Adds notification to notification bar. Scrolls to bottom of notification bar
function notify(msg) {
    NB.addNotification(msg);
    const notifications = NB.getNotifications();
    notificationBar.innerHTML = ``;
    for (let n of notifications) {
        notificationBar.innerHTML += `<p class='notification'>${n.toString()}</p>`;
    }
    notificationBar.scrollTop = notificationBar.scrollHeight;
}

// NAME-RELATED FUNCTIONS
async function getPetName() {
    try {
        const response = await fetch('/pet/name', {
            method: 'GET'
        });
        const data = await response.json();
        name = data.name;
        updateNameDisplay();
    }
    catch (err) {
        console.log(err);
    }
}
// Change pet's name if valid and successful
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
            await getPetName();
            hideRenameElems();
        }
        else {
            alert('There was an error renaming your pet. Name must be between 1-10 characters and contain at least one letter.');
        }
    }
    catch (err) {
        console.log(err);
    }
}

// PET CARE-RELATED FUNCTIONS
async function bathe() {
    try {
        const response = await fetch('/needs/bathe', {
            method: 'GET'
        });
        const {result} = await response.json();
        if (result) {
            PetDisplay.bathing();
            notify("Scrub-a-dub-dub!");
        }
        else {
            notify(`${name} is already squeaky clean!`)
        }
    }
    catch (err) {
        console.log(err);
    }
}
async function eat() {
    let food_value = +foodSelect.value; // Unary + makes operand into a number
    try {
        const response = await fetch('/needs/eat', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({value: food_value})
        });
        const {result} = await response.json();
        if (result) {
            let selectedIndex = foodSelect.selectedIndex;
            let url = '/images/effects/food/'; // Set food effect
            switch(selectedIndex) {
                case 0:
                    url += 'Spoonful.png';
                    break;
                case 1:
                    url += 'Rubber.png';
                    break;
                case 2:
                default: url += 'Confetti.png';
            }
            PetDisplay.eating(url);
            notify(`${name} is eating ${foodSelect.options[selectedIndex].text}.`);
        }
    }
    catch (err) {
        console.log('Error while attempting to feed pet')
    }
}
async function goBathroom() {
    try {
        const response = await fetch('/needs/pee', {
            method: 'GET'
        });
        const {result} = await response.json();
        if (result) {
            PetDisplay.peeing();
            notify("Pee time!");
        }
        else {
            notify(`${name}'s bladder is full.`);
        }
    }
    catch (err) {
        console.log(err);
    }
}
async function play() {
    let fun_value = +playSelect.value;
    try {
        const response = await fetch('/needs/play', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({value: fun_value})
        });
        const result = await response.json();
        if (result) {
            let selectedIndex = playSelect.selectedIndex;
            let url = '/images/effects/toys/'; // Set toy effect
            switch (selectedIndex) {
                case 0:
                    url += 'Chew.png';
                    break;
                case 1:
                    url += 'Rock.png';
                    break;
                case 2:
                default: url += 'Tug.png';
            }
            PetDisplay.playing(url);
            notify(`${name} is excited to play!`);
        }
    }
    catch (err) {
        console.log('Error while attempting to socialize with pet')
    }
}
async function sleep() {
    try {
        const response = await fetch('/needs/sleep', {
            method: 'GET'
        });
        const {result} = await response.json();
        if (result) {
            PetDisplay.sleeping();
            disableButtons();
            enableSpecificButton(WAKE);
            notify(`${name} has gone to sleep.`);
        }
        else {
            notify(`${name} is not tired.`);
        }
    }
    catch (err) {
        console.log(err);
    }
}
async function socialize() {
    let social_value = +petSelect.value;
    try {
        const response = await fetch('/needs/socialize', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({value: social_value})
        });
        const result = await response.json();
        if (result) {
            let selectedIndex = petSelect.selectedIndex;
            let url = '/images/effects/hands/'; // Set hand effect
            switch (selectedIndex) {
                case 0:
                    url += 'Head.png';
                    break;
                case 1:
                    url += 'Chin.png';
                    break;
                case 2:
                default: url += 'Belly.png';
            }
            PetDisplay.socializing(url);
            notify(`${name} loves the feeling of a good ${petSelect.options[selectedIndex].text}.`);
        }
    }
    catch (err) {
        console.log('Error while attempting to socialize with pet')
    }
}
async function wakeUp() {
    try {
        const response = await fetch('/needs/wake', {
            method: 'GET'
        });
        const {result} = await response.json();
        if (result) {
            notify(`${name} has woken up.`);
            disableSpecificButton(WAKE);
            enableButtons(WAKE);
        }
    }
    catch (err) {
        console.log(err);
    }
}


// MAIN
await getPetName();
enableButtons(WAKE);
clearButton.addEventListener('click', clearNB);
renameButton.addEventListener('click', showRenameElems);
cancelButton.addEventListener('click', hideRenameElems);
saveButton.addEventListener('click', rename);

await fetch('/pet/start', { // Start needs decay
    method: 'GET'
});

const updateId = setInterval(() => updateNeeds(), 250); // Every 0.25 seconds

window.addEventListener('beforeunload', () => { // Pause decay/fill intervals before leaving
    fetch('/pet/stop', {
        method: 'GET'
    });
});