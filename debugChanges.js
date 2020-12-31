I-
0. check #edits comments on build.gradle & app/build.gradle
1. npm uninstall react-native-android-sms-listener
2. remove line <uses-permission android:name="android.permission.RECEIVE_SMS" tools:node="remove"/> from main Android manifest

-> Receiving code but error when confirming

II-
1. add log to display the error when confirming


Issue:
1. Auth/session-expired

Solution:
1. Firebase authenticates automtically (READS SMS): I have to add onAuthListener to PhoneAuth screen like it was before !