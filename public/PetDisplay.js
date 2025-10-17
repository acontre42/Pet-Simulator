//  Displays different pet and effect images depending on pet activity

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

// Clear src of active-img and hide it. Return need <p> text to default color.
export function clearActiveEffect() {
    activeImg.src = "";
    activeImg.hidden = true;
    for (let p of needsPArray) {
        p.classList.remove("active");
    }
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
        case 'playing':
            url += 'Fun.png';
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
        needP.classList.add("active");
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
    let url = '/images/effects/toys/';
    switch (index) {
        case 0:
            url += 'Chew.png';
            break;
        case 1:
            url += 'Rock.png';
            break;
        case 2:
        default: url += 'Tug.png';
    }
    setDisplay('socializing', socialP, url);
};
export const playing = (index) => {
    let url = '/images/effects/hands/';
    switch (index) {
        case 0:
            url += 'Head.png';
            break;
        case 1:
            url += 'Chin.png';
            break;
        case 2:
        default: url += 'Belly.png';
    }
    setDisplay('playing', funP, url);
};
export function deceased() {
    const effects = document.getElementsByClassName("effects");
    for (let effect of effects) { // Hide all effects
        effect.hidden = true;
    }
    for (let p of needsPArray) { // Return text to normal color
        p.classList.remove("active");
    }
    petImg.src = '/images/pets/Gravestone.png';
}

// Display stink effect depending on if pet is stinky
export function setStink(stinky) {
    stinkImg.hidden = !stinky; //(stinky === true ? false : true);
}