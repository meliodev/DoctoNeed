
import firebase from '../configs/firebase'

let db = firebase.firestore()

export const users = db.collection("users")
export const doctors = db.collection("Doctors")
export const admins = db.collection("Admins")
export const appointments = db.collection("Appointments")
export const chats = db.collection("Chats")
export const paymentintents = db.collection("PaymentIntents")
export const specialities = db.collection("Specialities")
export const emails = db.collection("Emails")
export const phones = db.collection("Phones")
export const devices = db.collection("Devices")
export const signuprequests = db.collection("SignUpRequests")
export const fcmtokens = db.collection("FcmTokens")