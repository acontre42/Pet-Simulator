"use strict";

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
const foodSelect = document.getElementById("food-select");
const playSelect = document.getElementById("play-select");
const petSelect = document.getElementById("pet-select");

// Event Listeners
feedButton.addEventListener("click", eat);
petButton.addEventListener("click", socialize);
playButton.addEventListener("click", play);
/*
// JS
// Pet & Pet Needs Related Variables
const WAKE = -1, HUNGER = 0, ENERGY = 1, BLADDER = 2, HYGIENE = 3, SOCIAL = 4, FUN = 5; // CODES FOR SPECIFIC NEEDS
const NEED_CODES = [WAKE, HUNGER, ENERGY, BLADDER, HYGIENE, SOCIAL, FUN];
const ONE_SEC = 1000, TWO_SEC = 2000, TWO_HALF_SEC = 2500, THIRTY_SEC = 30000, MINUTE  = 60000; // TIME

// Will end simulation if hunger stays at 0 too long. Disable all buttons, clear all intervals, alert user.
function loss() {
    // ***TO DO***
    disableButtons();
    for (let key in needIntervals) {
        clearInterval(needIntervals[key]);
        needIntervals[key] = {};
    }
    for (let key in decayIntervals) {
        clearInterval(decayIntervals[key]);
        decayIntervals[key] = {};
    }
    alert("HE DEAD");
}


// Button-related Functions
// Make all buttons unclickable
function disableButtons() {
    for (let i = 0; i < NEED_CODES.length; i++) {
        disableSpecificButton(NEED_CODES[i]);
    }
}

// Make all buttons clickable
function enableButtons() {
    for (let i = 0; i < NEED_CODES.length; i++) {
        enableSpecificButton(NEED_CODES[i]);
    }
}

// Enables only one specific button based on value of needCode. Edits button's style properties.
function enableSpecificButton(needCode) {
    switch (needCode) {
        case WAKE:
            wakeButton.addEventListener("click", wakeUp);
            wakeButton.style = STYLE_CLICKABLE;
            break;
        case HUNGER:
            feedButton.addEventListener("click", eat);
            feedButton.style = STYLE_CLICKABLE;
            break;
        case ENERGY:
            sleepButton.addEventListener("click", sleep);
            sleepButton.style = STYLE_CLICKABLE;
            break;
        case BLADDER:
            bathroomButton.addEventListener("click", goBathroom);
            bathroomButton.style = STYLE_CLICKABLE;
            break;
        case HYGIENE:
            batheButton.addEventListener("click", bathe);
            batheButton.style = STYLE_CLICKABLE;
            break;
        case SOCIAL:
            petButton.addEventListener("click", socialize);
            petButton.style = STYLE_CLICKABLE;
            break;
        case FUN:
            playButton.addEventListener("click", play);
            playButton.style = STYLE_CLICKABLE;
            break;
    }
}

// Disable only one specific button based on needCode. Edits button's style properties.
function disableSpecificButton(needCode) {
    switch (needCode) {
        case WAKE:
            wakeButton.removeEventListener("click", wakeUp);
            wakeButton.style = STYLE_UNCLICKABLE;
            break;
        case HUNGER:
            feedButton.removeEventListener("click", eat);
            feedButton.style = STYLE_UNCLICKABLE;
            break;
        case ENERGY:
            sleepButton.removeEventListener("click", sleep);
            sleepButton.style = STYLE_UNCLICKABLE;
            break;
        case BLADDER:
            bathroomButton.removeEventListener("click", goBathroom);
            bathroomButton.style = STYLE_UNCLICKABLE;
            break;
        case HYGIENE:
            batheButton.removeEventListener("click", bathe);
            batheButton.style = STYLE_UNCLICKABLE;
            break;
        case SOCIAL:
            petButton.removeEventListener("click", socialize);
            petButton.style = STYLE_UNCLICKABLE;
            break;
        case FUN:
            playButton.removeEventListener("click", play);
            playButton.style = STYLE_UNCLICKABLE;
            break;
    }
}

// Other Functions
// Will run some action/animation
function runAnimation() {
    // ***TO DO***
}
*/

async function eat() {
    // ***TO DO*** disable buttons, run animation?, enable buttons
    let food_value = +foodSelect.value; // Unary + makes operand into a number
    try {
        const response = await fetch('/needs/eat', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({value: food_value})
        });
        const result = await response.json();
        console.log(result);
    }
    catch (err) {
        console.log('Error while attempting to feed pet')
    }
}

async function socialize() {
    // ***TO DO*** disable buttons, run animation?, enable buttons
    let social_value = +petSelect.value;
    try {
        const response = await fetch('/needs/socialize', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({value: social_value})
        });
        const result = await response.json();
        console.log(result);
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
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({value: fun_value})
        });
        const result = await response.json();
        console.log(result);
    }
    catch (err) {
        console.log('Error while attempting to socialize with pet')
    }
}

async function updateNeeds() {
    try {
        const response = await fetch('/needs', {
            method: 'GET'
        });
        const data = await response.json();
        const {hunger, energy, bladder, hygiene, social, fun} = data;
        hungerP.innerText = hunger;
        energyP.innerText = energy;
        bladderP.innerText = bladder;
        hygieneP.innerText = hygiene;
        socialP.innerText = social;
        funP.innerText = fun;
    }
    catch (err) {
        console.log(err);
    }
}

// MAIN
//enableButtons();
//disableSpecificButton(WAKE);
updateNeeds();
const updateId = setInterval(() => updateNeeds(), 500);