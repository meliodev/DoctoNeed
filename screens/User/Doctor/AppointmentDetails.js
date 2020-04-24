
import React from 'react'
import { View, Text, Button, Dimensions, Image, TouchableOpacity, StyleSheet } from 'react-native'

import firebase from 'react-native-firebase'
import { signOutUser } from '../../../DB/CRUD'
import * as REFS from '../../../DB/CollectionsRefs'
import { ScrollView } from 'react-native-gesture-handler'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import LeftSideMenu from '../../../components/LeftSideMenu'


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

      
  //LeftSideMenu functions
  toggleLeftSideMenu = () => {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible });
  }

  navigateToProfile() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('Profile'));
    //console.log(this.props)
  }
  navigateToDispoConfig() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('DispoConfig'));
    //console.log(this.props)
  }

  navigateToAppointments() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('TabScreen'));
  }

  signOutUserandToggle() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      this.signOutUser())
  }

    render() {
        const appId = this.props.navigation.getParam('appId', 'nothing sent')
        const noinput = this.props.navigation.getParam('noinput', 'nothing sent')

        const doctor = {
            name: this.state.doctorName,
            speciality: this.state.doctorSpeciality
        }

        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>

                    <View style={styles.card}>
                        <Text style={{ fontWeight: 'bold', color: '#93eafe', marginBottom: SCREEN_HEIGHT*0.02 }}>Médecin consulté:</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold' }}>Nom:</Text>
                            <Text style={{ fontWeight: 'bold', color: '#93eafe', marginLeft: SCREEN_WIDTH * 0.12 }}
                                onPress={() => this.props.navigation.navigate('DoctorFile', { doctor: doctor })}>{this.state.doctorName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold' }}>Spécialité:</Text>
                            <Text style={{ marginLeft: SCREEN_WIDTH * 0.039 }}>{this.state.doctorSpeciality}</Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={{ fontWeight: 'bold', color: '#93eafe', marginBottom: SCREEN_HEIGHT*0.02 }}>Informations sur la visite</Text>
                        <Text style={{ fontWeight: 'bold' }}>But de la consultation:</Text>
                        <Text>{this.state.comment}</Text>
                        <Text style={{ fontWeight: 'bold' }}>Symptomes:</Text>
                        {this.renderSymptoms()}
                        <Text style={{ fontWeight: 'bold' }}>Pièces jointes (documents/vidéo):</Text>
                        <Text>X</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={{ fontWeight: 'bold', color: '#93eafe', marginBottom: SCREEN_HEIGHT*0.02 }}>Profile</Text>
                        <Text style={{ fontWeight: 'bold' }}>Allergies</Text>
                        <Text>Allergie 1, Allergie 2, Allergie 3</Text>
                        <Text style={{ fontWeight: 'bold' }}>carte vitale utilisée ? Oui/Non</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={{ fontWeight: 'bold', color: '#93eafe', marginBottom: SCREEN_HEIGHT*0.02 }}>Résumé</Text>
                        <Text style={{ fontWeight: 'bold' }}>Durée de la consultation:</Text>
                        <Text>XXmin YYs</Text>
                        <Text style={{ fontWeight: 'bold' }}>Prix de la consultation:</Text>
                        <Text>X €</Text>
                    </View>
                </ScrollView>
            </View>

        );
    }
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: SCREEN_WIDTH * 0.7,
        padding: SCREEN_WIDTH * 0.07,
        margin: SCREEN_HEIGHT*0.02,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 4,
    },
    logoIcon: {
        height: SCREEN_WIDTH * 0.2,
        width: SCREEN_WIDTH * 0.2,
        //marginTop: SCREEN_WIDTH * 0.0,
        //marginHorizontal: 130,
        borderRadius: 100,
        //justifyContent: "center",
        //alignItems: 'center',
        borderColor: '#ffffff',
        borderWidth: 7,
        borderStyle: "solid"
    },
});


