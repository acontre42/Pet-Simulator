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
        if (this.hunger > MAX_NEEDS) {
            this.hunger = MAX_NEEDS;
        }
        if (this.hunger < MIN_NEEDS) {
            this.hunger = MIN_NEEDS;
        }
        return this.hunger;
    }
    alterEnergy(value) {
        if (!value || typeof value !== 'number') {
            return null;
        }
        this.energy += value;
        if (this.energy > MAX_NEEDS) {
            this.energy = MAX_NEEDS;
        }
        if (this.energy < MIN_NEEDS) {
            this.energy = MIN_NEEDS;
        }
        return this.energy;
    }
    alterBladder(value) {
        if (!value || typeof value !== 'number') {
            return null;
        }
        this.bladder += value;
        if (this.bladder > MAX_NEEDS) {
            this.bladder = MAX_NEEDS;
        }
        if (this.bladder < MIN_NEEDS) {
            this.bladder = MIN_NEEDS;
        }
        return this.bladder;
    }
    alterHygiene(value) {
        if (!value || typeof value !== 'number') {
            return null;
        }
        this.hygiene += value;
        if (this.hygiene > MAX_NEEDS) {
            this.hygiene = MAX_NEEDS;
        }
        if (this.hygiene < MIN_NEEDS) {
            this.hygiene = MIN_NEEDS;
        }
        return this.hygiene;
    }
    alterSocial(value) {
        if (!value || typeof value !== 'number') {
            return null;
        }
        this.social += value;
        if (this.social > MAX_NEEDS) {
            this.social = MAX_NEEDS;
        }
        if (this.social < MIN_NEEDS) {
            this.social = MIN_NEEDS;
        }
        return this.social;
    }
    alterFun(value) {
        if (!value || typeof value !== 'number') {
            return null;
        }
        this.fun += value;
        if (this.fun > MAX_NEEDS) {
            this.fun = MAX_NEEDS;
        }
        if (this.fun < MIN_NEEDS) {
            this.fun = MIN_NEEDS;
        }
        return this.fun;
    }
}