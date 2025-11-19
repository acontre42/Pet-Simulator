//  Displays different pet/effect images and adds/removes animation classes depending on pet activity

// HTML Class Names
const ACTIVE = "active";
const UP_DOWN = "animateUpDown", LEFT_RIGHT = "animateLeftRight", CLOCKWISE = "animateClockwise", 
        SQUEEZE = "animateSqueeze", FETCH = "animateFetch", BACK_FORTH = "animateBackForth";
const ANIMATION_CLASSES = [UP_DOWN, LEFT_RIGHT, CLOCKWISE, SQUEEZE, FETCH, BACK_FORTH];
const RUN_AROUND = "animateRunAround", RUN_AROUND_STINK = "animateRunAroundStink";
// <img>
const activeImg = document.getElementById("active-img");
const petImg = document.getElementById("pet-img");
const stinkImg = document.getElementById("stink-img");
// <p>
const hungerP = document.getElementById("hunger");
const energyP = document.getElementById("energy");
const bladderP = document.getElementById("bladder");
const hygieneP = document.getElementById("hygiene");
const socialP = document.getElementById("social");
const funP = document.getElementById("fun");
const needsPArray = [hungerP, energyP, bladderP, hygieneP, socialP, funP];

// Set src of active-img and display it.
function setActiveEffect(url) {
    activeImg.src = url;
    activeImg.hidden = false;
}

// Clear src of active-img and hide it. Return need <p> text to default color. Remove any animation-related classes.
export function clearActiveEffect() {
    activeImg.src = "";
    activeImg.hidden = true;
    for (let p of needsPArray) {
        p.classList.remove(ACTIVE);
    }
    for (let AC of ANIMATION_CLASSES) {
        activeImg.classList.remove(AC);
    }
    petImg.classList.remove(RUN_AROUND);
    stinkImg.classList.remove(RUN_AROUND_STINK);
}

// Set pet-img src based on status to match current activity.
function setPetImg(status) {
    let url = '/images/pets/';
    switch (status) {
        case 'eating':
            url += 'Eat.png';
            break;
        case 'sleeping':
            url += 'Sleep.png';
            break;
        case 'peeing':
            url += 'Outhouse.png';
            break;
        case 'socializing':
            url += 'Happy.png';
            break;
        case 'playing':
            url += 'Fun.png';
            break;
        case 'runaway':
            url += 'Outhouse.png';//'Runaway.png'; // *** TO DO: add correct images
            break;
        case 'restless':
            url += 'Fun.png';//'Restless.png'; // *** TO DO: add correct images
            break;
        default: url += 'Alien.png'; // Status: Neutral, Bathing
    }
    petImg.src = url;
}

// Sets pet's image, clears previous activity's effect, highlights need text (if applicable), sets current activity effect (if applicable)
function setDisplay(status, needP, url) {
    clearActiveEffect();
    setPetImg(status);
    if (needP) {
        needP.classList.add(ACTIVE);
    }
    if (url) {
        setActiveEffect(url);
    }
}
export const neutral = setDisplay.bind(null, null, null, null);
export const eating = (index) => {
    let url = '/images/effects/food/';
    switch (index) {
        case 0:
            url += 'Spoonful.png';
            break;
        case 1:
            url += 'Rubber.png';
            break;
        case 2:
        default: url += 'Confetti.png';
    }
    setDisplay('eating', hungerP, url);
};
export const sleeping = setDisplay.bind(null, 'sleeping', energyP, null);
export const peeing = setDisplay.bind(null, 'peeing', bladderP, null);
export const bathing = setDisplay.bind(null, 'bathing', hygieneP, '/images/effects/SoapBubbles.png');
export const socializing = (index) => {
    let url = '/images/effects/hands/';
    let animationClass;
    switch (index) {
        case 0:
            url += 'Head.png';
            animationClass = UP_DOWN;
            break;
        case 1:
            url += 'Chin.png';
            animationClass = LEFT_RIGHT;
            break;
        case 2:
        default: 
            url += 'Belly.png';
            animationClass = CLOCKWISE;
    }
    setDisplay('socializing', socialP, url);
    activeImg.classList.add(animationClass);
};
export const playing = (index) => {
    let url = '/images/effects/toys/';
    let animationClass;
    switch (index) {
        case 0:
            url += 'Chew.png';
            animationClass = SQUEEZE;
            break;
        case 1:
            url += 'Rock.png';
            animationClass = FETCH;
            break;
        case 2:
        default: 
            url += 'Tug.png';
            animationClass = BACK_FORTH;
    }
    setDisplay('playing', funP, url);
    activeImg.classList.add(animationClass);
};
export const runaway = setDisplay.bind(null, 'runaway', socialP, null);
export function restless() {
    setDisplay('restless', funP, null);
    petImg.classList.add(RUN_AROUND);
    stinkImg.classList.add(RUN_AROUND_STINK);
}
export function deceased() {
    const effects = document.getElementsByClassName("effects");
    for (let effect of effects) { // Hide all effects
        effect.hidden = true;
    }
    for (let p of needsPArray) { // Return text to normal color
        p.classList.remove(ACTIVE);
    }
    petImg.src = '/images/pets/Gravestone.png';
}

// Display stink effect depending on if pet is stinky
export function setStink(stinky) {
    stinkImg.style.opacity = (stinky ? 1 : 0);
}