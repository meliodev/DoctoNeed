// export const backgroundMessageNotificationHandler = async (message: any) => {
//   const localNotification = new firebase.notifications.Notification().android
//     .setChannelId(androidNotificationsChannel.channelId)
//     .android.setSmallIcon('iconBlackAndWhite')
//     .android.setLargeIcon('iconBlackAndWhite')
//     .android.setPriority(firebase.notifications.Android.Priority.High)
//     .setNotificationId(message.messageId)
//     .setSound('default')
//     .setTitle(message.data.title)
//     .setBody(message.data.body)
//     .setData(message.data)

//   if (Platform.OS === 'android') {
//     createChannel()
//   }

//   firebase.notifications().displayNotification(localNotification)

//   return Promise.resolve()
// }

export async function firebaseBackgroundMessage(message) { 
  let notif=message['data']
  console.log(notif)
  return Promise.resolve()
}