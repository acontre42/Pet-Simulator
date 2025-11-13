import Pet from '../model/Pet.js';
const pet = new Pet();
const notifications = []; // To notify user of need failures

// NEED FAILURES
const MAX_FAILURE_HUNGER = 10, MAX_FAILURE_ENERGY = 2, MAX_FAILURE_SOCIAL = 10, MAX_FAILURE_FUN = 5; // ***TO DO*** TWEAK
const FAILURE_COUNTS = {
    hunger: 0,
    energy: 0,
    social: 0,
    fun: 0
};
function hungerFailure() { // Pause all intervals and set pet's alive attribute to false
    pauseAllDecay();
    pauseFill();
    pet.loss();
}


// DECAY NEEDS
const DECAY_TIME = { // How fast needs decay
    hunger: 14000,
    energy: 36000,
    bladder: 14500,
    hygiene: 45000,
    social: 15000,
    fun: 11500
};
const DECAY_INTERVALS = { // Will hold intervals for decaying needs
    hunger: {},
    energy: {},
    bladder: {},
    hygiene: {},
    social: {},
    fun: {}
};
const DECAY_FUNCTIONS = { // Holds functions that gradually decrement Pet needs
    hunger: function() {
        pet.alterHunger(-1);
        if (pet.hungerEmpty()) {
            FAILURE_COUNTS.hunger++;
            if (FAILURE_COUNTS.hunger == MAX_FAILURE_HUNGER) {
                console.log('HUNGER FAILURE'); // *** DELETE
                hungerFailure();
            }
        }
    },
    energy: function() {
        pet.alterEnergy(-1);
        if (pet.energyEmpty()) {
            FAILURE_COUNTS.energy++;
            if (FAILURE_COUNTS.energy == MAX_FAILURE_ENERGY) {
                console.log('ENERGY FAILURE'); // *** DELETE
                FILL_FUNCTIONS.sleep();
                notifications.push(`${pet.getName()} has fallen asleep from exhaustion.`);
            }
        }
    },
    bladder: function() {
        pet.alterBladder(-1);
        if (pet.bladderEmpty()) {
            console.log('BLADDER FAILURE'); // *** DELETE
            pet.bladderFailure();
            notifications.push(`Uh oh! ${pet.getName()} has had an accident.`);
        }
    },
    hygiene: function() {
        pet.alterHygiene(-1);
    },
    social: function() {
        pet.alterSocial(-1);
        if (pet.socialEmpty()) {
            FAILURE_COUNTS.social++;
            if (FAILURE_COUNTS.social == MAX_FAILURE_SOCIAL) {
                // *** TO DO: trigger social failure
                console.log('SOCIAL FAILURE'); // *** DELETE
                notifications.push(`${pet.getName()} has gone elsewhere for attention and will be back later.`);
            }
        }
    },
    fun: function() {
        pet.alterFun(-1);
        if (pet.funEmpty()) {
            FAILURE_COUNTS.fun++;
            if (FAILURE_COUNTS.fun == MAX_FAILURE_FUN) {
                // *** TO DO: fun failure
                console.log('FUN FAILURE'); // *** DELETE
                notifications.push(`${pet.getName()} has gotten the zoomies! He should calm down soon...`);
            }
        }
    },
    wakeUp: function() {
        if (!pet.isAlive()) {
            return false;
        }
        clearInterval(FILL_INTERVAL);
        pet.setStatusNeutral();
        DECAY_INTERVALS.energy = setInterval(() => DECAY_FUNCTIONS.energy(), DECAY_TIME.energy);
        return true;
    }
};
export const wakeUp = () => DECAY_FUNCTIONS.wakeUp();
export function startDecay() { // Resume all decay intervals
    pauseAllDecay(); // just in case
    DECAY_INTERVALS.hunger = setInterval(() => DECAY_FUNCTIONS.hunger(), DECAY_TIME.hunger);
    DECAY_INTERVALS.energy = setInterval(() => DECAY_FUNCTIONS.energy(), DECAY_TIME.energy);
    DECAY_INTERVALS.bladder = setInterval(() => DECAY_FUNCTIONS.bladder(), DECAY_TIME.bladder);
    DECAY_INTERVALS.hygiene = setInterval(() => DECAY_FUNCTIONS.hygiene(), DECAY_TIME.hygiene);
    DECAY_INTERVALS.social = setInterval(() => DECAY_FUNCTIONS.social(), DECAY_TIME.social);
    DECAY_INTERVALS.fun = setInterval(() => DECAY_FUNCTIONS.fun(), DECAY_TIME.fun);
}
export function pauseAllDecay() { // Pauses all decay intervals
    for (let interval in DECAY_INTERVALS) {
        clearInterval(DECAY_INTERVALS[interval]);
    }
}


// FILL NEEDS
let FILL_INTERVAL = {}; // Will hold interval for the need currently being filled.
const FILL_TIME = { // Rate at which needs fill
    eat: 1500,
    sleep: 4000,
    pee: 1500,
    bathe: 3000,
    socialize: 800,
    play: 3000
};
export const FILL_FUNCTIONS = { // Functions that fill needs
    eat: function(value) {
        if (!pet.isAlive() || typeof value !== 'number') {
            return false;
        }
        FAILURE_COUNTS.hunger = 0; // Reset hunger fail count
        clearCurrentFill(); // Clear fill, reset decay
        clearInterval(DECAY_INTERVALS.hunger); // Stop hunger decay
        pet.setStatusEat();
        let food = value;
        FILL_INTERVAL = setInterval(() => { // Gradually fill hunger need while there is food remaining
            if (food > 0) {
                pet.alterHunger(1);
                food--;
            }
            else {
                clearInterval(FILL_INTERVAL);
                pet.setStatusNeutral();
                DECAY_INTERVALS.hunger = setInterval(() => DECAY_FUNCTIONS.hunger(), DECAY_TIME.hunger);
            }
        }, FILL_TIME.eat);
        return true;
    },
    sleep: function() {
        if (!pet.isAlive() || pet.energyFilled()) {
            return false;
        }
        FAILURE_COUNTS.energy = 0; // Reset energy fail count
        clearCurrentFill(); // Clear fill, reset decay
        clearInterval(DECAY_INTERVALS.energy); // Stop energy decay
        pet.setStatusSleep();
        FILL_INTERVAL = setInterval(() => { 
            if (!pet.energyFilled()) { // Gradually fill energy need
                pet.alterEnergy(1);
            }
            else { // Clear sleep interval and resume energy decay
                DECAY_FUNCTIONS.wakeUp();
            }
        }, FILL_TIME.sleep);
        return true;
    },
    pee: function() {
        if (!pet.isAlive() || pet.bladderFilled()) {
            return false;
        }
        clearCurrentFill(); // Clear fill, reset decay
        clearInterval(DECAY_INTERVALS.bladder); // Stop bladder decay
        pet.setStatusPee();
        FILL_INTERVAL = setInterval(() => {
            if (!pet.bladderFilled()) { // Gradually fill bladder need
                pet.alterBladder(1);
            }
            else { // Clear pee interval and resume bladder decay
                clearInterval(FILL_INTERVAL);
                pet.setStatusNeutral();
                DECAY_INTERVALS.bladder = setInterval(() => DECAY_FUNCTIONS.bladder(), DECAY_TIME.bladder);
            }
        }, FILL_TIME.pee);
        return true;
    },
    bathe: function() {
        if (!pet.isAlive() || pet.hygieneFilled()) {
            return false;
        }
        clearCurrentFill(); // Clear fill, reset decay
        clearInterval(DECAY_INTERVALS.hygiene); // Stop hygiene decay
        pet.setStatusBathe();
        FILL_INTERVAL = setInterval(() => {
            if (!pet.hygieneFilled()) { // Gradually fill hygiene need
                pet.alterHygiene(1);
            }
            else { // Clear bathe interval and resume hygiene decay
                clearInterval(FILL_INTERVAL);
                pet.setStatusNeutral();
                DECAY_INTERVALS.hygiene = setInterval(() => DECAY_FUNCTIONS.hygiene(), DECAY_TIME.hygiene);
            }
        }, FILL_TIME.bathe);
        return true;
    },
    socialize: function(value) { 
        if (!pet.isAlive() || typeof value !== 'number') {
            return false;
        }
        FAILURE_COUNTS.social = 0; // Reset social fail count
        clearCurrentFill(); // Clear fill, reset decay
        clearInterval(DECAY_INTERVALS.social); // Stop social need decay
        pet.setStatusSocial();
        let hangout = value;
        FILL_INTERVAL = setInterval(() => { // Gradually fill social need while interaction remains
            if (hangout > 0) {
                pet.alterSocial(1);
                hangout--;
            }
            else { // Clear socialize interval and resume social decay
                clearInterval(FILL_INTERVAL);
                pet.setStatusNeutral();
                DECAY_INTERVALS.social = setInterval(() => DECAY_FUNCTIONS.social(), DECAY_TIME.social);
            }
        }, FILL_TIME.socialize);
        return true;
    },
    play: function(value) { 
        if (!pet.isAlive() || typeof value !== 'number') {
            return false;
        }
        FAILURE_COUNTS.fun = 0; // Reset fun fail count
        clearCurrentFill(); // Clear fill, reset decay
        clearInterval(DECAY_INTERVALS.fun); // Stop fun need decay
        pet.setStatusPlay();
        let playtime = value;
        FILL_INTERVAL = setInterval(() => { // Gradually fill fun need while playtime remains
            if (playtime > 0) {
                pet.alterFun(1);
                playtime--;
            }
            else { // Clear play interval and resume fun decay
                clearInterval(FILL_INTERVAL);
                pet.setStatusNeutral();
                DECAY_INTERVALS.fun = setInterval(() => DECAY_FUNCTIONS.fun(), DECAY_TIME.fun);
            }
        }, FILL_TIME.play);
        return true;
    }
}
export function pauseFill() { // Pauses fill interval, does not affect decay intervals
    clearInterval(FILL_INTERVAL);
}
export function clearCurrentFill() { // Clear current fill interval, restart all decay to avoid doubled/dead decay intervals
    clearInterval(FILL_INTERVAL);
    startDecay(); // Pauses all decay and restarts them
}

// PET 
export const getName = () => pet.getName();
export const getNeeds = () => pet.getInfo();
export const rename = (name) => pet.setName(name);

// NOTIFICATIONS
export function getNotifications() { // Return/remove messages from notifications array
    return notifications.splice(0);
}