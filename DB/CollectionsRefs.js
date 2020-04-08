
import firebase from 'react-native-firebase'

let db = firebase.firestore()

export const users = db.collection("users")

export const doctors = db.collection("Doctors")