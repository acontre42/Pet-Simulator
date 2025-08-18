"use strict";
import Pet from '../model/Pet.js';

describe('Testing Pet class methods', () => {
    const pet = new Pet();
    const {min, max} = pet.getAll();

    test('Ensure that Pet only accepts names with at least one letter and no more than 10 characters', () => {
        const name = pet.getName();
        expect(pet.setName()).not.toBe(true);
        expect(pet.setName('')).not.toBe(true);
        expect(pet.setName('!')).not.toBe(true);
        expect(pet.setName(5)).not.toBe(true);
        expect(pet.setName('aaaaaaaaaaa')).not.toBe(true);
        expect(pet.getName()).toBe(name);
        expect(pet.setName('a')).toBe(true);
        expect(pet.getName()).toBe('a');
        expect(pet.setName('a!!!!!!6')).toBe(true);
        expect(pet.getName()).toBe('a!!!!!!6');
        expect(pet.setName('Alien')).toBe(true);
        expect(pet.getName()).toBe('Alien');
    });

    test('Ensure that passing non-numeric values to alter methods returns null and does not affect need values', () => {
        const bladder = pet.getBladder();
        expect(pet.alterBladder()).toBeNull();
        expect(pet.alterBladder({value: 5})).toBeNull();
        expect(pet.alterBladder('9')).toBeNull();
        expect(pet.getBladder()).toBe(bladder);
    });

    test('Ensure that passing non-numeric values to set methods does not affect need values', () => {
        const social = pet.getSocial();
        pet.setSocial();
        expect(pet.getSocial()).toBe(social);
        pet.setSocial({value: 5});
        expect(pet.getSocial()).toBe(social);
        pet.setSocial('5');
        expect(pet.getSocial()).toBe(social);
    });

    test('Ensure that passing positive numbers to alter methods increases need values', () => {
        const expected = pet.getEnergy() + 2;
        expect(pet.alterEnergy(2)).toBe(expected);
        expect(pet.getEnergy()).toBe(expected);
    });

    test('Ensure that passing negative numbers to alter methods decreases need values', () => {
        const expected = pet.getHunger() - 5;
        expect(pet.alterHunger(-5)).toBe(expected);
        expect(pet.getHunger()).toBe(expected);
    });

    test('Ensure values of needs stay within min and max range', () => {
        expect(pet.alterFun(10000)).toBe(max);
        expect(pet.getFun()).toBe(max);
        expect(pet.alterFun(-10000)).toBe(min);
        expect(pet.getFun()).toBe(min);

        pet.setHygiene(min);
        expect(pet.getHygiene()).toBe(min);
        pet.setHygiene((min - 1));
        expect(pet.getHygiene()).toBe(min);
        pet.setHygiene((max + 1));
        expect(pet.getHygiene()).toBe(min);
    });

    test('Testing functions that check if need is full', () => {
        pet.setEnergy((max/2));
        expect(pet.energyFilled()).toBe(false);
        pet.setBladder((max - 1));
        expect(pet.bladderFilled()).toBe(false);
        pet.setHygiene(max);
        expect(pet.hygieneFilled()).toBe(true);
    });
});