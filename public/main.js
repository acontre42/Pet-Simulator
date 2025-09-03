"use strict";
import NotificationBar from './NotificationBar.js';
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
// <P>
const hungerP = document.getElementById("hunger");
const energyP = document.getElementById("energy");
const bladderP = document.getElementById("bladder");
const hygieneP = document.getElementById("hygiene");
const socialP = document.getElementById("social");
const funP = document.getElementById("fun");
// Other
const nameSpan = document.getElementById("pet-name");
const foodSelect = document.getElementById("food-select");
const playSelect = document.getElementById("play-select");
const petSelect = document.getElementById("pet-select");

// Pet Info Variables
let name;

// Comparison Variables
let priorEnergy = 0; // To compare to updated values in order to avoid calling wakeUp everytime energy is maxed out

// Button-related Variables
const WAKE = -1, HUNGER = 0, ENERGY = 1, BLADDER = 2, HYGIENE = 3, SOCIAL = 4, FUN = 5; // CODES FOR SPECIFIC NEEDS
const NEED_CODES = [WAKE, HUNGER, ENERGY, BLADDER, HYGIENE, SOCIAL, FUN];
const UNCLICKABLE = "unclickable";

// Button Functionality-related Functions
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

/*
// Will end simulation if hunger stays at 0 too long. Disable all buttons, clear all intervals, alert user.
function loss() {
    disableButtons();
    alert("HE DEAD");
}

// Other Functions
// Will run some action/animation
function runAnimation() {
    // ***TO DO***
}
*/
async function getPetName() {
    try {
        const response = await fetch('/pet/name', {
            method: 'GET'
        });
        const data = await response.json();
        name = data.name;
        nameSpan.textContent = name;
    }
    catch (err) {
        console.log(err);
    }
}

async function wakeUp() {
    // *** TO DO enable buttons, run animation?
    try {
        const response = await fetch('/needs/wake', {
            method: 'GET'
        });
        const result = await response.json();
        console.log(result); // *** DELETE
        notify("I'm awake now!"); // TO DO: notification
        disableSpecificButton(WAKE);
        enableButtons(WAKE);
    }
    catch (err) {
        console.log(err);
    }
}

async function sleep() {
    // *** TO DO disable buttons, run animation?, enable buttons
    try {
        const response = await fetch('/needs/sleep', {
            method: 'GET'
        });
        const {result} = await response.json();
        console.log(result); // *** DELETE
        if (result) {
            disableButtons();
            enableSpecificButton(WAKE);
            notify("Goodnight!");
        }
        else {
            notify(`${name} is not tired.`);
        }
    }
    catch (err) {
        console.log(err);
    }
}

async function eat() {
    // ***TO DO*** disable buttons, run animation?, enable buttons
    let food_value = +foodSelect.value; // Unary + makes operand into a number
    try {
        const response = await fetch('/needs/eat', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({value: food_value})
        });
        const result = await response.json();
        console.log(result); // *** DELETE
        notify("Munch munch crunch crunch"); // TO DO: notification
    }
    catch (err) {
        console.log('Error while attempting to feed pet')
    }
}

async function goBathroom() {
    // *** TO DO disable buttons, run animation?, enable buttons
    notify("Pee time!"); // TO DO: notification
}

async function bathe() {
    // *** TO DO disable buttons, run animation?, enable buttons
    notify("Scrub-a-dub-dub!"); // TO DO: notification
}

async function socialize() {
    // ***TO DO*** disable buttons, run animation?, enable buttons
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
        console.log(result); // *** DELETE
    }
    catch (err) {
        console.log('Error while attempting to socialize with pet')
    }
}

async function play() {
    // ***TO DO*** disable buttons, run animation?, enable buttons
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
        console.log(result); // *** DELETE
    }
    catch (err) {
        console.log('Error while attempting to socialize with pet')
    }
}

// Refreshes Need displays every 0.5 seconds
async function updateNeeds() { // *** TO DO: check living status each time called
    try {
        const response = await fetch('/needs', {
            method: 'GET'
        });
        const data = await response.json();
        const {hunger, energy, bladder, hygiene, social, fun, max} = data;
        // Update text
        hungerP.innerText = `Hunger: ${hunger} / ${max}`,
        energyP.innerText = `Energy: ${energy} / ${max}`,
        bladderP.innerText = `Bladder: ${bladder} / ${max}`,
        hygieneP.innerText = `Hygiene: ${hygiene} / ${max}`,
        socialP.innerText = `Social: ${social} / ${max}`,
        funP.innerText = `Fun: ${fun} / ${max}`
        // Compare to prior values
        console.log(`prior: ${priorEnergy}, current: ${energy}`); // *** DELETE
        if (energy == max && energy != priorEnergy) {
            wakeUp();
        }
        priorEnergy = energy;
    }
    catch (err) {
        console.log(err);
    }
}

function notify(msg) {
    console.log(msg); // *** TO DO: add notification to future notification box
}

async function rename() {
    let newName = ''; // *** TO DO: get name value from future input
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
        }
        else {
            console.log('There was an error renaming your pet');
        }
    }
    catch (err) {
        console.log(err);
    }
}

// MAIN
await getPetName();
enableButtons(WAKE);

await fetch('/pet/start', { // Start needs decay
    method: 'GET'
});

const updateId = setInterval(() => updateNeeds(), 500);

window.addEventListener('beforeunload', () => { // Pause needs decay before leaving
    fetch('/pet/stop', {
        method: 'GET'
    });
});