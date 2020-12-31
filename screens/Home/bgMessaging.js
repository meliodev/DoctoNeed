// @flow
import firebase from 'react-native-firebase';
import { Platform } from 'react-native'
// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';

export default async (message: RemoteMessage) => {
    // handle your message
    console.log('message:::::::::::::::::::::::::')
    console.log(message)

    if (Platform.OS === 'android') {
        const channel = new firebase.notifications.Android.Channel(
            "channelCall",
            "Channel Name",
            firebase.notifications.Android.Importance.Max
        )
            .setDescription("Video Call Channel")
            .setSound('ringtone');

        firebase.notifications().android.createChannel(channel);

        const localNotification = new firebase.notifications.Notification()
            .android.setChannelId("channelCall")
            .android.setPriority(firebase.notifications.Android.Priority.High)
            .setSound(channel.sound)
            .setTitle('La téléconsultation va commencer...')
            .setBody('Votre médecin vous attend, veuillez rejoindre la téléconsultation')
            .setData(message.data)

        firebase.notifications().displayNotification(localNotification)
            .then(() => console.log('Message displayed'))
            .catch((e) => console.error(e))
    }


    if (Platform.OS === "ios") {
        const localNotification = new firebase.notifications.Notification()
            .setNotificationId(notification.notificationId)
            .setTitle(notification.title)
            .setSound('ringtone')  //task: ringtone should be configured on IOS (put ringtone.mp3 file on the suitable directory)
            .setSubtitle(notification.subtitle)
            .setBody(notification.body)
            .setData(notification.data)
            .ios.setBadge(notification.ios.badge);

        firebase.notifications().displayNotification(localNotification)
            .catch(err => console.error(err));
    }

    return Promise.resolve()
}