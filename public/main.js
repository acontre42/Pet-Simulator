"use strict";
import * as NotificationManager from './NotificationManager.js';
import * as PetDisplay from './PetDisplay.js';
import {getPetName} from './PetName.js';

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
const saveButton = document.getElementById("save-button");
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

// Pet Info Variables
let name;

// Comparison Variables
const priorNeeds = {
    energy: 0,  // To compare to updated values in order to avoid calling wakeUp everytime energy is maxed out
    hunger: 10,
    bladder: 10,
    social: 10,
    fun: 10
};
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
        // Compare energy to prior value and wake up if energy is full
        if (energy == max && energy != priorNeeds.energy) {
            wakeUp();
        }
        // Alert user prior to need failures
        notifyLowNeeds(data);
        // Check if stinky
        const {stinky} = data;
        (data.status == 'runaway' ? PetDisplay.setStink(false) : PetDisplay.setStink(stinky)); // Don't display stink fumes if alien is offscreen
        //PetDisplay.setStink(stinky);
        // Update UI based on changes to current status
        const {status, unavailable} = data;
        if (status !== priorStatus) {
            console.log('new status: ', status); // *** DELETE
            if (status == null) { // Pet was previously doing an activity, and is now back to neutral
               PetDisplay.neutral();
            }

            if (unavailable) { // Pet's status is currently sleeping, runaway, or restless.
                disableButtons();
                switch (status) {
                    case 'sleeping':
                        PetDisplay.sleeping();
                        enableSpecificButton(WAKE);
                        break;
                    case 'runaway':
                        PetDisplay.runaway();
                        break;
                    case 'restless':
                        PetDisplay.restless();
                        break;
                }
            }
            else { // Pet is available and was previously sleeping, which means they're now awake.
                enableButtons(WAKE);
                disableSpecificButton(WAKE);
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
    NotificationManager.stopInterval();
    PetDisplay.deceased();
    NotificationManager.notify(`${name} has passed away. RIP`);
}

// NOTIFICATION-RELATED FUNCTIONS
// Notify user of low pet needs
function notifyLowNeeds(needs) {
    if (needs.hunger < 4 && priorNeeds.hunger >= 4) { // Hungry
        NotificationManager.notify(`${name} is getting hungry!`);
    }
    priorNeeds.hunger = needs.hunger;
    if (needs.energy < 3 && priorNeeds.energy >= 3) { // Tired
        NotificationManager.notify(`${name} is getting very sleepy...`);
    }
    priorNeeds.energy = needs.energy;
    if (needs.bladder < 2 && priorNeeds.bladder >= 2) { // Bladder full
        NotificationManager.notify(`${name} is about to have an accident!`);
    }
    priorNeeds.bladder = needs.bladder;
    if (needs.social < 3 && priorNeeds.social >= 3) { // Lonely
        NotificationManager.notify(`${name} could use some affection.`);
    }
    priorNeeds.social = needs.social;
    if (needs.fun < 3 && priorNeeds.fun >= 3) { // Bored
        NotificationManager.notify(`${name} is bored and starting to feel restless...`);
    }
    priorNeeds.fun = needs.fun;
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
            NotificationManager.notify("Scrub-a-dub-dub!");
        }
        else {
            NotificationManager.notify(`${name} is already squeaky clean!`)
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
            PetDisplay.eating(selectedIndex);
            NotificationManager.notify(`${name} is eating ${foodSelect.options[selectedIndex].text}.`);
        }
    }
    catch (err) {
        console.log(err);
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
        }
        else {
            NotificationManager.notify(`${name}'s bladder is full.`);
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
            PetDisplay.playing(selectedIndex);
        }
    }
    catch (err) {
        console.log(err);
    }
}
async function sleep() {
    try {
        const response = await fetch('/needs/sleep', {
            method: 'GET'
        });
        const {result} = await response.json();
        NotificationManager.notify(result ? `${name} has gone to sleep.` : `${name} is not tired.`);
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
            PetDisplay.socializing(selectedIndex);
        }
    }
    catch (err) {
        console.log(err);
    }
}
async function wakeUp() {
    try {
        const response = await fetch('/needs/wake', {
            method: 'GET'
        });
        const {result} = await response.json();
        if (result) {
            NotificationManager.notify(`${name} has woken up.`);
        }
    }
    catch (err) {
        console.log(err);
    }
}


// MAIN
name = await getPetName();
enableButtons(WAKE);
saveButton.addEventListener('click', async () => name = await getPetName()); // Get pet name any time a rename attempt is made
clearButton.addEventListener('click', NotificationManager.clearNB);

await fetch('/pet/start', { // Start needs decay
    method: 'GET'
});

const updateId = setInterval(() => updateNeeds(), 250); // Every 0.25 seconds
NotificationManager.startInterval(); // Start checking for notifications in PetController

window.addEventListener('beforeunload', () => { // Pause decay/fill intervals before leaving
    fetch('/pet/stop', {
        method: 'GET'
    });
});