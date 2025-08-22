"use strict";
import {Notification, createNotification} from '../public/Notification.js';
import NotificationBar from '../public/NotificationBar.js';

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
        badNotif = createNotification('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        expect(badNotif).toEqual(null);
        badNotif = createNotification(400);
        expect(badNotif).toEqual(null);
    });
});

describe('Test NotificationBar', () => {
    const NB = new NotificationBar();

    test('Ensure only valid notifications are accepted', () => {
        NB.addNotification();
        NB.addNotification('');
        NB.addNotification(400);
        NB.addNotification('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        expect(NB.getLength()).toEqual(0);
        NB.addNotification('hi');
        NB.addNotification('I am less than 50 characters long. I am only 49!!')
        expect(NB.getLength()).toEqual(2);
    });
    
    test('Clearing notifications', () => {
        NB.clear();
        expect(NB.getNotifications()).toHaveLength(0);
    });
});