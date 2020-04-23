
import React from 'react'
import { View, Text, Button, Dimensions, StyleSheet } from 'react-native'

import firebase from 'react-native-firebase'
import { signOutUser } from '../../../DB/CRUD'
import * as REFS from '../../../DB/CollectionsRefs'
import { ScrollView } from 'react-native-gesture-handler'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class AppointmentDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            doctor_id: '',
            doctorName: '',
            doctorSpeciality: '',

            comment: '',
            symptoms: [],
            day: 0,
            month: '',
            year: 0,

            allergies: [],
        }
    }

    componentWillMount() {
        this.getAppointmentDetails()
    }

    getAppointmentDetails() {
        const appId = this.props.navigation.getParam('appId', 'nothing sent')
        console.log(appId)
        REFS.appointments.doc(appId)
            .get().then((doc) => {
                this.setState({ doctor_id: doc.data().doctor_id })
                this.setState({ comment: doc.data().comment })
                this.setState({ symptoms: doc.data().symptomes })
                this.setState({ day: doc.data().day })
                this.setState({ month: doc.data().month })
                this.setState({ year: doc.data().year })

                this.setState({ doctorName: doc.data().doctorName })
                this.setState({ doctorSpeciality: doc.data().doctorSpeciality })
            })
    }

    renderSymptoms() {
        return this.state.symptoms.map((data) => {
            return (
                <Text>{data}</Text>
            )
        })
    }

  /*  renderAllergies() {
        return this.state.allergies.map((data) => {
            return (
                <Text>{data}</Text>
            )
        })
    }*/

    render() {
        const appId = this.props.navigation.getParam('appId', 'nothing sent')
        console.log(appId)
        return (
            <ScrollView style={{ flex: 1, padding: SCREEN_WIDTH*0.05 }}>

                <Text style={{ fontWeight: 'bold', color: 'blue' }}>Médecin consulté:</Text>
                <Text style={{ fontWeight: 'bold' }}>Nom:</Text>
                <Text>{this.state.doctorName}</Text>
                <Text style={{ fontWeight: 'bold' }}>Spécialité:</Text>
                <Text>{this.state.doctorSpeciality}</Text>

                <View style={{ borderBottomColor: '#d9dbda', marginTop: 45, borderBottomWidth: StyleSheet.hairlineWidth }} />

                <Text style={{ fontWeight: 'bold', color: 'blue' }}>Informations sur la visite</Text>
                <Text style={{ fontWeight: 'bold' }}>But de la consultation:</Text>
                <Text>{this.state.comment}</Text>
                <Text style={{ fontWeight: 'bold' }}>Symptomes:</Text>
                {this.renderSymptoms()}
                <Text style={{ fontWeight: 'bold' }}>Pièces jointes (documents/vidéo):</Text>
                <Text>X</Text>

                <View style={{ borderBottomColor: '#d9dbda', marginTop: 45, borderBottomWidth: StyleSheet.hairlineWidth }} />

                <Text style={{ fontWeight: 'bold', color: 'blue' }}>Profile</Text>
                <Text style={{ fontWeight: 'bold' }}>Allergies au {this.state.day} {this.state.month} {this.state.year}</Text>
                <Text> Allergie 1, Allergie 2, Allergie 3... </Text>
                <Text style={{ fontWeight: 'bold' }}>carte vitale utilisée? Oui/Non</Text>

                <View style={{ borderBottomColor: '#d9dbda', marginTop: 45, borderBottomWidth: StyleSheet.hairlineWidth }} />

                <Text style={{ fontWeight: 'bold', color: 'blue' }}>Ordonnance:</Text> 
                <Text>X</Text>

                <View style={{ borderBottomColor: '#d9dbda', marginTop: 45, borderBottomWidth: StyleSheet.hairlineWidth }} />

                <Text style={{ fontWeight: 'bold', color: 'blue' }}>Résumé</Text>
                <Text style={{ fontWeight: 'bold' }}>Durée de la consultation:</Text>
                <Text>XXmin YYs</Text>
                <Text style={{ fontWeight: 'bold' }}>Prix de la consultation:</Text>
                <Text>X $</Text>


            </ScrollView>
        );
    }
}


