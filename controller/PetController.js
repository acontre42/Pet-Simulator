import Pet from '../model/Pet.js';
const pet = new Pet();

const MAX_FAILURE_HUNGER = 10, MAX_FAILURE_ENERGY = 15, MAX_FAILURE_SOCIAL = 25, MAX_FAILURE_FUN = 5; // ***TO DO*** TWEAK

const FAILURE_COUNTS = {
    hunger: 0,
    energy: 0,
    social: 0,
    fun: 0
};

const DECAY_TIME = { // How fast needs decay *** TO DO: TWEAK
    hunger: 30000,
    energy: 60000,
    bladder: 45000,
    hygiene: 90000,
    social: 20000,
    fun: 25000
};

const DECAY_INTERVALS = { // Holds intervals for decaying needs
    hunger: setInterval(() => DECAY_FUNCTIONS.hunger(), DECAY_TIME.hunger),
    energy: setInterval(() => DECAY_FUNCTIONS.energy(), DECAY_TIME.energy),
    bladder: setInterval(() => DECAY_FUNCTIONS.bladder(), DECAY_TIME.bladder),
    hygiene: setInterval(() => DECAY_FUNCTIONS.hygiene(), DECAY_TIME.hygiene),
    social: setInterval(() => DECAY_FUNCTIONS.social(), DECAY_TIME.social),
    fun: setInterval(() => DECAY_FUNCTIONS.fun(), DECAY_TIME.fun)
};

const DECAY_FUNCTIONS = { // Holds functions that gradually decrement Pet needs
    hunger: function() {
        pet.alterHunger(-1);
        if (pet.hungerEmpty()) {
            FAILURE_COUNTS.hunger++;
            if (FAILURE_COUNTS.hunger == MAX_FAILURE_HUNGER) {
                hungerFailure();
            }
        }
        else {
            FAILURE_COUNTS.hunger = 0;
        }
    },
    energy: function() {
        pet.alterEnergy(-1);
        if (pet.energyEmpty()) {
            FAILURE_COUNTS.energy++;
            if (FAILURE_COUNTS.energy == MAX_FAILURE_ENERGY) {
                // *** TO DO: trigger energy failure
            }
        }
        else {
            FAILURE_COUNTS.energy = 0;
        }
    },
    bladder: function() {
        pet.alterBladder(-1);
        if (pet.bladderEmpty()) {
            pet.bladderFailure();
        }
    },
    hygiene: function() {
        pet.alterHygiene(-1);
        if (pet.hygieneLow()) {
            // *** TO DO: trigger stinky
        }
    },
    social: function() {
        pet.alterSocial(-1);
        if (pet.socialEmpty()) {
            FAILURE_COUNTS.social++;
            if (FAILURE_COUNTS.social == MAX_FAILURE_SOCIAL) {
                // *** TO DO: trigger social failure
            }
        }
        else {
            FAILURE_COUNTS.social = 0;
        }
    },
    fun: function() {
        pet.alterFun(-1);
        if (pet.funEmpty()) {
            FAILURE_COUNTS.fun++;
            if (FAILURE_COUNTS.fun == MAX_FAILURE_FUN) {
                // *** TO DO: fun failure
            }
        }
        else {
            FAILURE_COUNTS.fun = 0;
        }
    }
};

const FILL_INTERVALS = { // Will hold intervals for needs when being filled.
    eat: {},
    sleep: {},
    pee: {},
    bathe: {},
    socialize: {},
    play: {}
};

const FILL_TIME = { // Rate at which needs fill // *** TO DO: TWEAK
    eat: 1500,
    sleep: 5000,
    pee: 2000,
    bathe: 3000,
    socialize: 1000,
    play: 3000
};

export const FILL_FUNCTIONS = { // Functions that fill needs
    eat: function(value) {
        if (!pet.isAlive() || typeof value !== 'number') {
            return false;
        }
        clearInterval(DECAY_INTERVALS.hunger); // Stop hunger decay
        let food = value;
        FILL_INTERVALS.eat = setInterval(() => { // Gradually fill hunger need while there is food remaining
            if (food > 0) {
                pet.alterHunger(1);
                food--;
            }
            else {
                clearInterval(FILL_INTERVALS.eat);
                DECAY_INTERVALS.hunger = setInterval(() => DECAY_FUNCTIONS.hunger(), DECAY_TIME.hunger);
            }
        }, FILL_TIME.eat);
        return true;
    },
    sleep: function() {
        if (!pet.isAlive() || pet.energyFilled()) {
            return false;
        }
        clearInterval(DECAY_INTERVALS.energy); // Stop energy decay
        FILL_INTERVALS.sleep = setInterval(() => { 
            if (!pet.energyFilled()) { // Gradually fill energy need
                pet.alterEnergy(1);
            }
            else { // Clear sleep interval and resume energy decay
                wakeUp();
            }
        }, FILL_TIME.sleep);
        return true;
    },
    pee: function() {
        if (!pet.isAlive() || pet.bladderFilled()) {
            return false;
        }
        clearInterval(DECAY_INTERVALS.bladder); // Stop bladder decay
        FILL_INTERVALS.pee = setInterval(() => {
            if (!pet.bladderFilled()) { // Gradually fill bladder need
                pet.alterBladder(1);
            }
            else { // Clear pee interval and resume bladder decay
                clearInterval(FILL_INTERVALS.bladder);
                DECAY_INTERVALS.bladder = setInterval(() => DECAY_FUNCTIONS.bladder(), DECAY_TIME.bladder);
            }
        }, FILL_TIME.bladder);
        return true;
    },
    bathe: function() {
        if (!pet.isAlive() || pet.hygieneFilled()) {
            return false;
        }
        clearInterval(DECAY_INTERVALS.hygiene); // Stop hygiene decay
        FILL_INTERVALS.bathe = setInterval(() => {
            if (!pet.hygieneFilled()) { // Gradually fill hygiene need
                pet.alterHygiene(1);
            }
            else { // Clear bathe interval and resume hygiene decay
                clearInterval(FILL_INTERVALS.bathe);
                DECAY_INTERVALS.hygiene = setInterval(() => DECAY_FUNCTIONS.hygiene(), DECAY_TIME.hygiene);
            }
        }, FILL_TIME.bathe);
        return true;
    },
    socialize: function(value) { 
        if (!pet.isAlive() || typeof value !== 'number') {
            return false;
        }
        clearInterval(DECAY_INTERVALS.social); // Stop social need decay
        let hangout = value;
        FILL_INTERVALS.socialize = setInterval(() => { // Gradually fill social need while interaction remains
            if (hangout > 0) {
                pet.alterSocial(1);
                hangout--;
            }
            else { // Clear socialize interval and resume social decay
                clearInterval(FILL_INTERVALS.socialize);
                DECAY_INTERVALS.social = setInterval(() => DECAY_FUNCTIONS.social(), DECAY_TIME.social);
            }
        }, FILL_TIME.socialize);
        return true;
    },
    play: function(value) { 
        if (!pet.isAlive() || typeof value !== 'number') {
            return false;
        }
        clearInterval(DECAY_INTERVALS.fun); // Stop fun need decay
        let playtime = value;
        FILL_INTERVALS.play = setInterval(() => { // Gradually fill fun need while playtime remains
            if (playtime > 0) {
                pet.alterFun(1);
                playtime--;
            }
            else { // Clear play interval and resume fun decay
                clearInterval(FILL_INTERVALS.play);
                DECAY_INTERVALS.fun = setInterval(() => DECAY_FUNCTIONS.fun(), DECAY_TIME.fun);
            }
        }, FILL_TIME.play);
        return true;
    }
}

// Can be called by FILL_FUNCTIONS.sleep or by user
export function wakeUp() {
    if (!pet.isAlive()) {
        return false;
    }
    clearInterval(FILL_INTERVALS.sleep);
    DECAY_INTERVALS.energy = setInterval(() => DECAY_FUNCTIONS.energy(), DECAY_TIME.energy);
    return true;
}

export function getNeeds() {
    const {hunger, energy, bladder, hygiene, social, fun, max} = pet.getAll();
    const needs = { hunger, energy, bladder, hygiene, social, fun, max };
    return needs;
}

// Resumes all decay intervals
function resumeAllDecay() {
    pauseAllDecay(); // just in case
    DECAY_INTERVALS.hunger = setInterval(() => DECAY_FUNCTIONS.hunger(), DECAY_TIME.hunger);
    DECAY_INTERVALS.energy = setInterval(() => DECAY_FUNCTIONS.energy(), DECAY_TIME.energy);
    DECAY_INTERVALS.bladder = setInterval(() => DECAY_FUNCTIONS.bladder(), DECAY_TIME.bladder);
    DECAY_INTERVALS.hygiene = setInterval(() => DECAY_FUNCTIONS.hygiene(), DECAY_TIME.hygiene);
    DECAY_INTERVALS.social = setInterval(() => DECAY_FUNCTIONS.social(), DECAY_TIME.social);
    DECAY_INTERVALS.fun = setInterval(() => DECAY_FUNCTIONS.fun(), DECAY_TIME.fun);
}

// Pauses all decay intervals
function pauseAllDecay() {
    for (let interval in DECAY_INTERVALS) {
        clearInterval(DECAY_INTERVALS[interval]);
    }
}

// Pauses all fill intervals
function pauseAllFill() {
    for (let interval in FILL_INTERVALS) {
        clearInterval(FILL_INTERVALS[interval]);
    }
}

// Pause all intervals and set pet's alive attribute to false
function hungerFailure() {
    pauseAllDecay();
    pauseAllFill();
    pet.loss();
}

export function getName() {
    return pet.getName();
}