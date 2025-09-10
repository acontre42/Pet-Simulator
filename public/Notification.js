"use strict";

const MAX_LENGTH = 50;

export class Notification {
    constructor(message) {
        this.message = message;
        this.date = new Date();
    }
    // Getters
    getMessage() { return this.message; }
    getDate() { return this.date; }
    // Other Methods
    toString() {
        let hours = this.date.getHours();
        const meridiem = ( hours < 12 ? "am" : "pm");
        hours %= 12;
        if (hours == 0) {
            hours = 12;
        }
        const minutes = this.date.getMinutes();
        
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${meridiem} // ${this.message}`;
    }
}

// Use this instead of constructor when attempting to create a Notification
export function createNotification(message) {
    if (typeof message !== "string" || message.length > MAX_LENGTH || message.length <= 0) {
        return null;
    }
    else {
        const notif = new Notification(message);
        return notif;
    }
}