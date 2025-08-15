"use strict";

// Pet Need Constants
const MIN_NEEDS = 0,
    MAX_NEEDS = 10,
    STARTER_NEEDS = {hunger: 7, energy: 8, bladder: 6, hygiene: 10, social: 5, fun: 5};

export default class Pet {
    // Private:
    #isValidValue(value) {
        if (typeof value === 'number' && value <= MAX_NEEDS && value >= MIN_NEEDS) {
            return true;
        }
        else {
            return false;
        }
    }
    #correctNeedValue(value) { // Return value within [MIN_NEEDS, MAX_NEEDS] to ensure needs stay within range.
        if (value > MAX_NEEDS) { return MAX_NEEDS; }
        else if (value < MIN_NEEDS) { return MIN_NEEDS; }
        else { return value; }
    }
    // Public:
    constructor() {
        this.hunger = STARTER_NEEDS.hunger;
        this.energy = STARTER_NEEDS.energy;
        this.bladder = STARTER_NEEDS.bladder;
        this.hygiene = STARTER_NEEDS.hygiene;
        this.social = STARTER_NEEDS.social;
        this.fun = STARTER_NEEDS.fun;
    }
    // Getters
    getHunger() { return this.hunger; }
    getEnergy() { return this.energy; }
    getBladder() { return this.bladder; }
    getHygiene() { return this.hygiene; }
    getSocial() { return this.social; }
    getFun() { return this.fun; }
    getAll() {
        const all = {
            hunger: this.hunger,
            energy: this.energy,
            bladder: this.bladder,
            hygiene: this.hygiene,
            social: this.social,
            fun: this.fun,
            max: MAX_NEEDS,
            min: MIN_NEEDS
        };
        return all;
    }
    // Setters
    setHunger(value) { if (this.#isValidValue(value)) this.hunger = value; }
    setEnergy(value) { if (this.#isValidValue(value)) this.energy = value; }
    setBladder(value) { if (this.#isValidValue(value)) this.bladder = value; }
    setHygiene(value) { if (this.#isValidValue(value)) this.hygiene = value; }
    setSocial(value) { if (this.#isValidValue(value)) this.social = value; }
    setFun(value) { if (this.#isValidValue(value)) this.fun = value; }
    // Other Methods
    alterHunger(value) {
        if (!value || typeof value !== 'number') {
            return null;
        }
        this.hunger += value;
        this.hunger = this.#correctNeedValue(this.hunger);
        return this.hunger;
    }
    alterEnergy(value) {
        if (!value || typeof value !== 'number') {
            return null;
        }
        this.energy += value;
        this.energy = this.#correctNeedValue(this.energy);
        return this.energy;
    }
    alterBladder(value) {
        if (!value || typeof value !== 'number') {
            return null;
        }
        this.bladder += value;
        this.bladder = this.#correctNeedValue(this.bladder);
        return this.bladder;
    }
    alterHygiene(value) {
        if (!value || typeof value !== 'number') {
            return null;
        }
        this.hygiene += value;
        this.hygiene = this.#correctNeedValue(this.hygiene);
        return this.hygiene;
    }
    alterSocial(value) {
        if (!value || typeof value !== 'number') {
            return null;
        }
        this.social += value;
        this.social = this.#correctNeedValue(this.social);
        return this.social;
    }
    alterFun(value) {
        if (!value || typeof value !== 'number') {
            return null;
        }
        this.fun += value;
        this.fun = this.#correctNeedValue(this.fun);
        return this.fun;
    }
}