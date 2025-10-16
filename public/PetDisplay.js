//  Displays different pet and effect images depending on pet activity

// <img>
const activeImg = document.getElementById("active-img");
const petImg = document.getElementById("pet-img");
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
            url += 'Bathroom.png';
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
export const eating = (url) => setDisplay('eating', hungerP, url);
export const sleeping = setDisplay.bind(null, 'sleeping', energyP, null);

export function peeing() {
    // *** TO DO
}

export const bathing = setDisplay.bind(null, 'bathing', hygieneP, '/images/effects/SoapBubbles.png');

export function socializing() {
    // *** TO DO
}

export function playing() {
    // *** TO DO
}