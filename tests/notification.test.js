"use strict";
import {Notification, createNotification} from '../public/Notification.js';
import NotificationBox from '../public/NotificationBox.js';

let tooBig = '';
for (let i = 1; i <= Notification.getMaxLength() + 1; i++) {
    tooBig += 'a';
}

describe('Test createNotification', () => {
    test('Testing valid Notification creation', () => {
        const goodNotif = createNotification('I am a good notification :)');
        expect(goodNotif).toBeInstanceOf(Notification);
    });

    test('Testing bad Notification creation', () => {
        let badNotif = createNotification();
        expect(badNotif).toEqual(null);
        badNotif = createNotification('');
        expect(badNotif).toEqual(null);
        badNotif = createNotification(tooBig);
        expect(badNotif).toEqual(null);
        badNotif = createNotification(400);
        expect(badNotif).toEqual(null);
    });
});

describe('Test NotificationBox', () => {
    const NB = new NotificationBox();

    test('Ensure only valid notifications are accepted', () => {
        NB.addNotification();
        NB.addNotification('');
        NB.addNotification(400);
        NB.addNotification(tooBig)
        expect(NB.getLength()).toEqual(0);
        NB.addNotification('hi');
        let maxLengthMsg = '';
        for (let i = 1; i <= Notification.getMaxLength(); i++) {
            maxLengthMsg += 'a';
        }
        NB.addNotification(maxLengthMsg);
        expect(NB.getLength()).toEqual(2);
    });
    
    test('Clearing notifications', () => {
        NB.clear();
        expect(NB.getNotifications()).toHaveLength(0);
    });
});