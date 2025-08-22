"use strict";

import {createNotification} from './Notification.js';

export default class NotificationBar {
    constructor() {
        this.notifications = [];
    }
    // Getters
    getLength() { return this.notifications.length; }
    getNotifications() { return this.notifications; }
    getStrings() {
        const strings = [];
        for (let notif of this.notifications) {
            strings.push(notif.toString());
        }
        return strings;
    }
    // Other Methods
    addNotification(msg) {
        const notif = createNotification(msg);
        if (notif) {
            this.notifications.push(notif);
        }
    }
    clear() {
        this.notifications = [];
    }
}