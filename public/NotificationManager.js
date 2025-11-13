"use strict";
import NotificationBox from './NotificationBox.js';
const NB = new NotificationBox();
const notificationBox = document.getElementById('notification-box');

let updateId; // Will hold interval that calls getNotifications

// Get notification strings from server, add to NB, and update display.
async function getNotifications() {
    const response = await fetch('/notifications', {
        method: 'GET'
    });

    const notifications = await response.json();
    if (notifications.length > 0) {
        for (let notif of notifications) {
            NB.addNotification(notif);
        }
        updateNB();
    }
}

// Clear notification-box
export function clearNB() {
    NB.clear();
    notificationBox.innerHTML = `<p>No notifications to display.</p>`;
}

// Adds notification to notification box and updates display.
export function notify(msg) {
    if (typeof msg !== 'string') {
        return;
    }
    NB.addNotification(msg);
    updateNB();
}

// Update display of notifications in notification-box. Scrolls to bottom of notification box.
function updateNB() {
    if (NB.getLength() < 1) {
        return;
    }
    const notifications = NB.getNotifications();
    notificationBox.innerHTML = ``;
    for (let n of notifications) {
        notificationBox.innerHTML += `<p class='notification'>${n.toString()}</p>`;
    }
    notificationBox.scrollTop = notificationBox.scrollHeight;
}

// Start interval for checking for new notifications from server every second
export function startInterval() {
    updateId = setInterval(() => getNotifications(), 1000);
}

// Clear interval that checks for new notifications
export function stopInterval() {
    clearInterval(updateId);
}