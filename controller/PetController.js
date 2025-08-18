import Pet from '../model/Pet.js';
const pet = new Pet();

const MAX_FAILURE_HUNGER = 10, MAX_FAILURE_ENERGY = 15, MAX_FAILURE_SOCIAL = 25, MAX_FAILURE_FUN = 5; // ***TO DO*** TWEAK
const {min} = pet.getAll();

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
        if (pet.alterHunger(-1) == min) {
            FAILURE_COUNTS.hunger++;
            if (FAILURE_COUNTS.hunger == MAX_FAILURE_HUNGER) {
                // *** TO DO: trigger hunger failure
            }
        }
        else {
            FAILURE_COUNTS.hunger = 0;
        }
    },
    energy: function() {
        if (pet.alterEnergy(-1) == min) {
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
        if (pet.alterBladder(-1) == min) {
            // *** TO DO: trigger bladder failure
        }
        else {
            FAILURE_COUNTS.bladder = 0;
        }
    },
    hygiene: function() {
        if (pet.alterHygiene(-1) < 3) {
            // *** TO DO: trigger stinky
        }
    },
    social: function() {
        if (pet.alterSocial(-1) == min) {
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
        if (pet.alterFun(-1) == min) {
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
    sleep: {},
    pee: {},
    bathe: {}
};

const FILL_TIME = { // Rate at which needs fill // *** TO DO: TWEAK
    eat: 1500,
    sleep: 5000,
    pee: 2000,
    bathe: 3000,
    socialize: 1000,
    play: 3000
};

const FILL_FUNCTIONS = { // Functions that fill needs
    eat: function(value) { // *** TO DO: stop hunger decay, gradually fill hunger by value
        pet.alterHunger(value);
    },
    sleep: function() {
        clearInterval(DECAY_INTERVALS.energy); // Stop energy decay
        FILL_INTERVALS.sleep = setInterval(() => { 
            if (!pet.energyFilled()) { // Gradually fill energy need
                pet.alterEnergy(1);
            }
            else { // Clear sleep interval and resume energy decay
                wakeUp();
            }
        }, FILL_TIME.sleep);
    },
    pee: function() {
        clearInterval(DECAY_INTERVALS.bladder); // Stop bladder decay
        FILL_INTERVALS.pee = setInterval(() => {
            if (!pet.bladderFilled()) { // Gradually fill bladder need
                pet.alterBladder(1);
            }
            else { // Clear pee interval and resume bladder decay
                clearInterval(FILL_INTERVALS.bladder);
                DECAY_INTERVALS.bladder = setInterval(() => DECAY_FUNCTIONS.bladder, DECAY_TIME.bladder);
            }
        }, FILL_TIME.bladder);
    },
    bathe: function() {
        clearInterval(DECAY_INTERVALS.hygiene); // Stop hygiene decay
        FILL_INTERVALS.bathe = setInterval(() => {
            if (!pet.hygieneFilled()) { // Gradually fill hygiene need
                pet.alterHygiene(1);
            }
            else { // Clear bathe interval and resume hygiene decay
                clearInterval(FILL_INTERVALS.bathe);
                DECAY_INTERVALS.hygiene = setInterval(() => DECAY_FUNCTIONS.hygiene, DECAY_TIME.hygiene);
            }
        }, FILL_TIME.bathe);
    },
    socialize: function(value) { // *** TO DO: same as hunger
       pet.alterSocial(value);
    },
    play: function(value) { // *** TO DO: same as hunger
        pet.alterFun(value);
    }
}

// Can be called by FILL_FUNCTIONS.sleep or by user
function wakeUp() {
    clearInterval(FILL_INTERVALS.sleep);
    DECAY_INTERVALS.energy = setInterval(() => DECAY_FUNCTIONS.energy, DECAY_TIME.energy);
}