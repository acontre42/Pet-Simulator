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
// JS
// Pet & Pet Needs Related Variables
const WAKE = -1, HUNGER = 0, ENERGY = 1, BLADDER = 2, HYGIENE = 3, SOCIAL = 4, FUN = 5; // CODES FOR SPECIFIC NEEDS
const NEED_CODES = [WAKE, HUNGER, ENERGY, BLADDER, HYGIENE, SOCIAL, FUN];
const ONE_SEC = 1000, TWO_SEC = 2000, TWO_HALF_SEC = 2500, THIRTY_SEC = 30000, MINUTE  = 60000; // TIME

// PET/NEED-SPECIFIC FUNCTIONS
// Disable all buttons except "Wake Up", clear energyDecayInterval, gradually increase energy need to max.
// If not interrupted, call wakeUp() when maxed out.
function sleep() {
    console.log("Goodnight!");
    disableButtons();
    enableSpecificButton(WAKE);
    clearInterval(decayIntervals.energyDecayInterval);
    needIntervals.sleepInterval = setInterval(() => {
        if (pet.energy < MAX_NEEDS) {
            pet.energy++;
            updateEnergyP();
        }
        else {
            wakeUp();
        }
    }, TWO_SEC);
}

// Re-enable buttons except "Wake Up", stop increasing energy variable by clearing sleepInterval.
// Restart energyDecayInterval.
function wakeUp() {
    //***TO DO***
    enableButtons();
    disableSpecificButton(WAKE);
    clearInterval(needIntervals.sleepInterval);
    needIntervals.sleepInterval = {};
    console.log("I'm up!");
    decayIntervals.energyDecayInterval = setInterval(() => decayFunctions.energyDecay(), TWO_SEC); // ***TO DO***TWEAK TIME
}

// Increase hunger variable by food_value. Add delay based on food_value? If over max, set to max. Update hungerP (React?).
function eat() {
    // ***TO DO*** disable buttons, run animation?, enable buttons
    if (pet.hunger == MAX_NEEDS) {
        alert("Your pet alien is stuffed!");
    }
    let food_value = +foodSelect.value; // Unary + makes operand into a number
    console.log(`${pet.hunger} + ${food_value} = ${pet.hunger + food_value}`);
    let total = pet.hunger + food_value;
    pet.hunger = total > MAX_NEEDS ? MAX_NEEDS : total;
    updateHungerP();
}
// Clear hygieneDecayInterval. Increase hygiene variable by 1 every __ seconds. 
// Stop when hygiene reaches max. Restart hygieneDecayInterval. Update hygieneP. (React?)
function bathe() {
    if (pet.hygiene == MAX_NEEDS) {
        console.log("Already fresh");
        return;
    }

    clearInterval(decayIntervals.hygieneDecayInterval);
    decayIntervals.hygieneDecayInterval = {};

    needIntervals.batheInterval = setInterval(() => {
        if (pet.hygiene < MAX_NEEDS) {
            pet.hygiene++;
            updateHygieneP();
        }
        else {
            clearInterval(needIntervals.batheInterval);
            needIntervals.batheInterval = {};
            console.log("Squeaky clean!");
            decayIntervals.hygieneDecayInterval = setInterval(() => decayFunctions.hygieneDecay(), ONE_SEC); // ***TO DO*** TWEAK TIME
        }
    }, ONE_SEC);
}
// Clear bladderDecayInterval. Increase bladder variable by 1 every ___ seconds. 
// Stop when maxed out. Restart bladderDecayInterval. Update bladderP (React?).
function goBathroom() {
    if (pet.bladder == MAX_NEEDS) {
        console.log("Nothing to relieve.");
        return;
    }

    clearInterval(decayIntervals.bladderDecayInterval);
    decayIntervals.bladderDecayInterval = {};

    needIntervals.peeInterval = setInterval(() => {
        if (pet.bladder < MAX_NEEDS) {
            pet.bladder++;
            updateBladderP();
        }
        else {
            clearInterval(needIntervals.peeInterval);
            needIntervals.peeInterval = {};
            console.log("-Toilet flush-");
            decayIntervals.bladderDecayInterval = setInterval(() => decayFunctions.bladderDecay(), ONE_SEC); // ***TO DO*** TWEAK TIME
        }
    }, ONE_SEC);
}
// Increase social variable by social_value. Add delay based on social_value? If over max, set to max. Update socialP (React?).
function socialize() {
    // ***TO DO***
    let social_value = +petSelect.value;
    pet.social = pet.social + social_value > MAX_NEEDS ? MAX_NEEDS : pet.social + social_value;
    updateSocialP();
}
// Increase fun variable by fun_value. Add delay based on fun_value. If over max, set to max. Update funP (React?).
function play() {
    // ***TO DO***
    let fun_value = +playSelect.value;
    pet.fun = pet.fun + fun_value > MAX_NEEDS ? MAX_NEEDS : pet.fun + fun_value;
    updateFunP();
}

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

// TEMPORARY UPDATE HTML FUNCTIONS (Replace with React Components?)
function updateHungerP() {
    hungerP.innerText = `Hunger: ${pet.hunger} / ${MAX_NEEDS}`;
}
function updateEnergyP() {
    energyP.innerText = `Energy: ${pet.energy} / ${MAX_NEEDS}`;
}
function updateBladderP() {
    bladderP.innerText = `Bladder: ${pet.bladder} / ${MAX_NEEDS}`;
}
function updateHygieneP() {
    hygieneP.innerText = `Hygiene: ${pet.hygiene} / ${MAX_NEEDS}`;
}
function updateSocialP() {
    socialP.innerText = `Social: ${pet.social} / ${MAX_NEEDS}`;
}
function updateFunP() {
    funP.innerText = `Fun: ${pet.fun} / ${MAX_NEEDS}`;
}

// MAIN
enableButtons();
disableSpecificButton(WAKE);
hungerP.innerText = `Hunger: ${pet.hunger} / ${MAX_NEEDS}`;
energyP.innerText = `Energy: ${pet.energy} / ${MAX_NEEDS}`;
bladderP.innerText = `Bladder: ${pet.bladder} / ${MAX_NEEDS}`;
hygieneP.innerText = `Hygiene: ${pet.hygiene} / ${MAX_NEEDS}`;
socialP.innerText = `Social: ${pet.social} / ${MAX_NEEDS}`;
funP.innerText = `Fun: ${pet.fun} / ${MAX_NEEDS}`;