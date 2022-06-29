import React from 'react'
import { StyleSheet, ScrollView, Text, ActivityIndicator, View, Alert } from 'react-native'
import firebase from '../../../configs/firebase'
import DoctorItem from '../../../components/DoctorItem3'
import * as REFS from '../../../DB/CollectionsRefs'

const functions = firebase.functions()

export default class SignUpRequests extends React.Component {
    constructor(props) {
        super(props)
        this.addDoctorRole = this.addDoctorRole.bind(this);

        this.state = {
            doctorList: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.fetchSignUpRequests()
    }

    fetchSignUpRequests() {
        let doctor = null

        REFS.signuprequests.where('disabled', '==', true).onSnapshot(querySnapshot => {
            this.doctorList = []

            querySnapshot.forEach(doc => {
                doctor = doc.data()
                doctor.id = doc.id
                this.doctorList.push(doctor)
            })

            this.setState({ doctorList: this.doctorList })
        })
    }

    async activateUser(doctor) {
        const doctorId = doctor.id

        const activateUser = await functions.httpsCallable('activateUser')
        activateUser({ uid: doctorId }).then(async result => {
            //set disabled to false on firestore
            await REFS.signuprequests.doc(doctorId).update({ disabled: false })
            await REFS.doctors.doc(doctorId).set(doctor)
            this.setState({ isLoading: false })
        })
            .catch((e) => console.error(e))
    }

    async addDoctorRole(email) {
        const addDoctorRole = functions.httpsCallable('addDoctorRole')
        await addDoctorRole({ email: email })
        this.setState({ isLoading: false })
    }

    handleAccept(doctor) {
        console.log('accepting sign up...')
        this.setState({ isLoading: true })
        //1 & 2. Set auth disabled to false && Add doctor to Doctor collection
        this.activateUser(doctor)

        //3. add custom claim: doctor role
        this.addDoctorRole(doctor.email)

        //4. send email: Acceptance (email & default password)
    }

    async handleReject(doctorId, email, phone) {
        console.log('rejecting sign up...')
        this.setState({ isLoading: true })
        //1. remove email from 'Emails' collection and phone from 'Phone' collection (so doctor can apply other times)
        REFS.emails.where('email', '==', email).get().then(querySnapshotEmails => {
            const doc = querySnapshotEmails.docs[0]
            doc.ref.delete()
        })

        REFS.phones.where('phone', '==', phone).get().then(querySnapshotPhones => {
            const doc = querySnapshotPhones.docs[0]
            REFS.phones.doc(doc.id).delete()
        })

        //2.Delete user auth
        const deleteUser = await functions.httpsCallable('deleteUser')
        deleteUser({ uid: doctorId }).then(async result => {
            //set disabled to false on firestore
            await REFS.signuprequests.doc(doctorId).update({ disabled: false })
            this.setState({ isLoading: false })
        })

        //3. Send email: Rejection  (reason of rejection)
    }

    alertRejection(doctorId, email, phone) {
        Alert.alert(
            'Rejet de la demande',
            `Êtes-vous sûr de vouloir rejeter cette demande d'inscription ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Oui', onPress: () => this.handleReject(doctorId, email, phone) }
            ],
            { cancelable: false }
        )
    }

    renderSignupRequests() {
        if (this.state.doctorList.length > 0)
            return (
                this.state.doctorList.map((doctor, key) => {
                    return (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingLeft: 5 }}>
                            <DoctorItem
                                doctor={doctor}
                                handleAccept={() => this.handleAccept(doctor)}
                                handleReject={() => this.alertRejection(doctor.id, doctor.email, doctor.phone)} />
                        </View>
                    )
                })
            )

        else return (
            <View style={{ flex: 1, marginTop: 50, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Aucune demande d'inscription.</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.isLoading === true ?
                        <View style={styles.loading_container}>
                            <ActivityIndicator size='large' />
                        </View>
                        :
                        <ScrollView style={styles.doctorList_container} >
                            {this.renderSignupRequests()}
                        </ScrollView>
                }

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})