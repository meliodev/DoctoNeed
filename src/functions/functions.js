
import firebase from '../configs/firebase'
import * as REFS from '../DB/CollectionsRefs'
const functions = firebase.functions()


//-ALL ROLES
//-- Firestore 
/* Get MetaData then LoadAppointments */
export const getMetaData = async (main, role) => {
    const { currentUser } = firebase.auth()
    if (currentUser) {
        main.setState({ currentUser })

        let ref = ''

        if (role === 'isAdmin')
            ref = REFS.admins
        if (role === 'isDoctor')
            ref = REFS.doctors
        if (role === 'isPatient')
            ref = REFS.users

        await ref.doc(currentUser.uid).get().then(doc => {
            main.setState({ uid: doc.id, nom: doc.data().nom, prenom: doc.data().prenom, email: currentUser.email })
        })
    }
}

export const InitializeDoctorId = (main) => {
    if (main.props.role === 'isDoctor')
        main.doctor_id = firebase.auth().currentUser.uid

    else if (main.props.role === 'isAdmin')
        main.doctor_id = main.doctor_id_param
}

export const InitializePatientId = (main) => {
    if (main.props.role === 'isPatient')
        main.user_id = firebase.auth().currentUser.uid

    else if (main.props.role === 'isAdmin')
        main.user_id = main.user_id_param
}

//Redux
export const setReduxState = (type, value, main) => {
    const action = { type: type, value: value }
    main.props.dispatch(action)
}

//Notifications
export const sendNotification = (fcmToken, title, body, sound, roomId) => {
    const sendCallNotification = functions.httpsCallable('sendCallNotification')
    sendCallNotification({ fcmToken: fcmToken, title: title, body: body, sound: sound, roomId: roomId })
        .then((response) => console.log(response))
        .catch((err) => console.error(err))
}

