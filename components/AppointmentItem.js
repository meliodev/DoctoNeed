import React from 'react'
import { View, Text, Image, Dimensions, TouchableHighlight, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import Button from './Button'

//Firebase
import * as REFS from '../DB/CollectionsRefs'
import firebase from 'react-native-firebase'

import { withNavigation } from 'react-navigation';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

const functions = firebase.functions()

class AppointmentItem extends React.Component {

  //expand or shrink item 
  toggleAppointment(main, appId, appIdState) {
    //Expand
    if (appId !== appIdState) { 
      main.month = ''
      if (main.itemHeight === SCREEN_HEIGHT * 0.4) {
        main.itemHeight = SCREEN_HEIGHT * 0.13
      }

      REFS.appointments.doc(appId).get().then((doc) => {
        main.setState({ appId: appId, symptomes: doc.data().symptomes, documents: doc.data().DocumentsRefs, video: doc.data().Video })
      })
    }

    //Shrink
    else if (appId === appIdState) {
      main.month = ''
      main.setState({ appId: null })
      main.itemHeight = SCREEN_HEIGHT * 0.13
    }
  }

  //Set expand or shrink style
  setItemStyle = (main, appId, appIdState) => {

    if (appId === appIdState) {
      if (main.itemHeight === SCREEN_HEIGHT * 0.13)
        main.itemHeight = SCREEN_HEIGHT * 0.4

      else if (main.itemHeight === SCREEN_HEIGHT * 0.4)
        main.itemHeight = SCREEN_HEIGHT * 0.13


      return {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        height: main.itemHeight, //animated
        width: SCREEN_WIDTH * 0.95,
        alignItems: 'center',
        marginBottom: SCREEN_HEIGHT * 0.025,
        marginLeft: SCREEN_HEIGHT * 0.01,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
      }
    }

    else if (appId !== appIdState) {

      return {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        height: SCREEN_HEIGHT * 0.13,
        width: SCREEN_WIDTH * 0.95,
        alignItems: 'center',
        marginBottom: SCREEN_HEIGHT * 0.025,
        marginLeft: SCREEN_HEIGHT * 0.01,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
      }
    }
  }

  //appointment item functions
  displayDetails = (appId) => {
    this.props.navigation.navigate('AppointmentDetails', { appId: appId, noinput: this.props.type === 'next' ? false : true })
  }

  //display image (documents)
  toggleModalImage(main, doc) {
    console.log(doc.downloadURL)
    main.setState({ isModalImageVisible: !main.state.isModalImageVisible, ImageToShow: doc.downloadURL })
  }

  //ADMIN SPECIFIC UI
  renderAdminButtons(main, appointment, appIdState) {
    if (appIdState === appointment.id) {

      if (appointment.doctor_id.length > 0) {

        //Not confirmed OR Not postponed
        // const predicate1 = appointment.state.CBA && !appointment.postponing && !appointment.postponeBP && !appointment.postponeBA && !appointment.postponeBD
        // const predicate2 = appointment.state.CBA && appointment.postponing && appointment.postponeBP && !appointment.postponeBA && !appointment.postponeBD
        // if (predicate1 || predicate2)

        if (!appointment.state.CBA || appointment.postponing && !appointment.postponeBA)
          return (
            <View style={itemStyle.confirmButton_container}>
              <Button
                width={SCREEN_WIDTH * 0.35}
                paddingTop={0}
                paddingBottom={0}
                text='Confirmer'
                onPress={() => this.handleAdminConfirmAppointment(main, appointment.id, appointment.doctor_id, appointment.postponeBP)} />
            </View>
          )

        //Confirmed OR Postponed
        else if (appointment.state.CBA && !appointment.postponing || appointment.postponing && appointment.postponeBA)
          return (
            <View style={itemStyle.confirmButton_container}>
              <View style={{ backgroundColor: '#D3D3D3', borderRadius: 20, width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.05, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff' }}>Confirmé</Text>
              </View>
            </View>
          )
      }

      //Urgence 2
      else if (appointment.doctor_id.length === 0) {

        return (
          <View style={itemStyle.confirmButton_container}>
            <Button
              width={SCREEN_WIDTH * 0.6}
              paddingTop={0}
              paddingBottom={0}
              text='Attribuer un médecin'
              onPress={() => this.handleInviteDoctors(appointment)} />
          </View>
        )

      }

    }

  }

  handleAdminConfirmAppointment(main, appId, doctorId, postponeBP) {
    main.setState({ appId: null })

    if (postponeBP) {
      REFS.appointments.doc(appId).update({ postponeBA: true, 'state.CBA': true })
    }

    else
      REFS.appointments.doc(appId).update({ state: { CBP: true, CBA: true, CBD: false } })
  }

  handleInviteDoctors(appointment) {
    this.props.navigation.navigate('Search', { isUrgence: true, urgenceSpeciality: appointment.doctorSpeciality, appId: appointment.id })
  }

  //PATIENT SPECIFIC UI
  renderPatientButtons(main, appointment, appIdState) {
    if (appIdState === appointment.id) {
      if (!appointment.postponing) {
        return (
          <View style={itemStyle.confirmButton_container_patient}>
            <Button
              width={SCREEN_WIDTH * 0.35}
              paddingTop={0}
              paddingBottom={0}
              text="Annuler"
              contained={false}
              onPress={() => this.alertCancelAppointment(main, appointment.pi_id, appointment.started)} />

            {!appointment.postponeBD ? // Can postpone only one time...
              <Button width={SCREEN_WIDTH * 0.35}
                paddingTop={0}
                paddingBottom={0}
                text="Reporter"
                onPress={() => this.handlePostponeAppointment(appointment.id, appointment.urgence2)} />
              :
              <View style={itemStyle.reportButton}>
                <Text style={itemStyle.reportText}>Reporter</Text>
              </View>
            }
          </View>
        )
      }

      else if (appointment.postponing) {
        return (
          <View style={itemStyle.confirmButton_container_patient}>
            <Text>Cette consultation est en cours de report.</Text>
          </View>
        )
      }

    }
  }

  alertCancelAppointment(main, pi_id, started) {
    //disable if appointment is today
    console.log('started: '+started)
    
    if (started)
      Alert.alert('', "Impossible d'annuler le rendez-vous durant ou après la téléconsultation.")

    else Alert.alert(
      'Annulation du rendez-vous',
      "Êtes-vous sûr de vouloir annuler votre rendez-vous, cette opération est irréversible. En confirmant l'annulation, vous serez remboursé dans les 3 prochains jours.",
      [
        { text: 'Annuler', onPress: () => main.setState({ appId: null }), style: 'cancel' },
        { text: 'Confirmer', onPress: () => this.handleCancelAppointment(main, pi_id) }
      ],
      { cancelable: false }
    )
  }

  handleCancelAppointment(main, pi_id) {
    main.setState({ isLoading: true })

    const refundPayment = functions.httpsCallable('refundPayment')
    refundPayment({ pi_id: pi_id }).then((response) => {

      //Handle response
      if (response.data.refunded)
        Alert.alert('', 'La consultation a été annulée. Vous serez remboursé pendant les 3 prochains jours.')

      else if (response.data.code && response.data.code === "charge_already_refunded")
        Alert.alert('', 'Le remboursement devrait bientôt être effectué, veuillez vérifier la balance de votre carte.')

      else if (response.data.error)
        Alert.alert('', response.data.error)
    })
      .catch((err) => console.error(err))
      .finally(() => main.setState({ isLoading: false }))
  }

  handlePostponeAppointment(appId, isUrgence2) {
    if (!isUrgence2)
      this.props.navigation.navigate('Booking', { appId: appId })

    else
      Alert.alert(
        'Report impossible',
        "Une consultation en urgence ne peut pas être reportée. Un praticien vous contactera dans un très bref délai. Prière de patienter.",
        [
          { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        ],
        { cancelable: false }
      )
  }

  //DOCTOR SPECIFIC UI
  renderDoctorButtons(main, appointment, appIdState) {
    if (appIdState === appointment.id) {

      if (!appointment.state.CBD && !appointment.postponing || appointment.postponing && appointment.postponeBA && !appointment.postponeBD)

        return (
          <View style={itemStyle.confirmButton_container}>
            <Button
              width={SCREEN_WIDTH * 0.35}
              paddingTop={0}
              paddingBottom={0}
              text="Confirmer"
              onPress={() => this.handleDoctorConfirmAppointment(main, appointment.id, appointment.postponeBA, appointment.postponedBPto, appointment.urgence2, appointment.user_id, appointment.pi_id)} />
          </View>)

      else if (!appointment.postponing && appointment.state.CBD || appointment.postponing && appointment.state.CBD && !appointment.postponeBA || !appointment.postponing && appointment.state.CBD && appointment.postponeBA)
        return (
          <View style={itemStyle.camera_container}>
            <TouchableOpacity onPress={() => this.startCall(appointment.id, appointment.user_id)} style={itemStyle.buttonLaunchCall}>
              <Entypo name="video-camera"
                size={SCREEN_WIDTH * 0.05}
                color="#93eafe" />
            </TouchableOpacity>

            <View style={itemStyle.headerVideo_container}>
              <FontAwesome name="lock"
                size={SCREEN_WIDTH * 0.045}
                color="gray" />
              <View style={itemStyle.headerVideo_text_container}>
                <Text style={{ fontSize: SCREEN_HEIGHT * 0.017, fontWeight: 'bold', color: "gray", }}>  Lancez l'appel lorsque vous êtes prêt</Text>
                <Text style={{ fontSize: SCREEN_HEIGHT * 0.011, fontWeight: 'bold', color: "gray", }}>Vos appels video resteront confidentiels et sécurisés</Text>
              </View>
            </View>

          </View>
        )
    }
  }

  async handleDoctorConfirmAppointment(main, appId, postponeBA, postponedBPto, urgence2, user_id, pi_id) {
    main.setState({ appId: null })
    const { currentUser } = firebase.auth()

    if (postponeBA) {
      REFS.appointments.doc(appId).update({ date: postponedBPto, updatedBy: firebase.auth().currentUser.uid })
    }

    if (urgence2) {
      console.log('urgence2 ...')
      //remove other doctors Ids from doctor_id 
      const doctor_id = [currentUser.uid]
      const updatePaymentIntentDoctorId = functions.httpsCallable('updatePaymentIntentDoctorId')
      updatePaymentIntentDoctorId({ pi_id: pi_id, doctor_id: doctor_id[0], user_id: user_id, appId: appId }) //#security: don't allow client to send doctor_id
    }

    await REFS.appointments.doc(appId).update({ updatedBy: currentUser.uid, state: { CBP: true, CBA: true, CBD: true } })
  }

  startCall(appId, userId) {
    this.props.navigation.navigate('Video', { appId: appId, userId: userId })
  }

  render() {
    const { main, appointment, appIdState, dateComponent, role, documents, symptomes, type } = this.props

    const isPatient = role === 'isPatient'
    const isDoctor = role === 'isDoctor'
    const isAdmin = role === 'isAdmin'

    const isPrevious = type === 'previous'
    const isNext = type === 'next'

    return (
      <View>
        {dateComponent}
        <View style={this.setItemStyle(main, appointment.id, appIdState)}>
          <View style={itemStyle.main_container}>

            <View style={itemStyle.dot_container} />

            <View style={itemStyle.date_container}>
              <Text style={itemStyle.date_day}>{moment(appointment.date).format("Do")}</Text>
            </View>

            {(isPatient || isAdmin) &&
              <View style={itemStyle.titles_container}>
                < Text style={itemStyle.title_text}>Médecin</Text>
                <Text style={itemStyle.title_text}>Spécialité</Text>

                {isPrevious ?
                  <Text style={itemStyle.title_text}>Heure</Text>
                  :
                  appointment.urgence2 ?
                    <Text style={itemStyle.title_text}>Type</Text>
                    :
                    <Text style={itemStyle.title_text}>Heure</Text>
                }
              </View>
            }

            {isDoctor &&
              <View style={itemStyle.titles_container}>
                < Text style={itemStyle.title_text}>Patient</Text>
                <Text style={itemStyle.title_text}>Pays</Text>

                {isPrevious ?
                  <Text style={itemStyle.title_text}>Heure</Text>
                  :
                  appointment.urgence2 ?
                    <Text style={itemStyle.title_text}>Type</Text>
                    :
                    <Text style={itemStyle.title_text}>Heure</Text>
                }
              </View>
            }

            {(isPatient || isAdmin) &&
              <View style={itemStyle.data_container}>
                <Text style={[itemStyle.data_text, { color: appointment.urgence2 ? 'gray' : '#000' }]}>{appointment.doctorName}</Text>
                <Text style={itemStyle.data_text}>{appointment.doctorSpeciality}</Text>

                {isPrevious ?
                  <Text style={itemStyle.title_text}>{moment(appointment.date).format("HH:mm")}</Text>
                  :
                  appointment.urgence2 ?
                    <Text style={[itemStyle.data_text, { color: 'red' }]}>Urgence</Text>
                    :
                    <Text style={itemStyle.data_text}>{moment(appointment.date).format("HH:mm")}</Text>
                }
              </View>
            }

            {isDoctor &&
              <View style={itemStyle.data_container}>
                <Text style={itemStyle.data_text}>{appointment.userName}</Text>
                <Text style={itemStyle.data_text}>{appointment.userCountry}</Text>

                {isPrevious ?
                  <Text style={itemStyle.title_text}>{moment(appointment.date).format("HH:mm")}</Text>
                  :
                  appointment.urgence2 ?
                    <Text style={[itemStyle.data_text, { color: 'red' }]}>Urgence</Text>
                    :
                    <Text style={itemStyle.data_text}>{moment(appointment.date).format("HH:mm")}</Text>
                }
              </View>
            }

            <View style={itemStyle.buttons_container}>
              <TouchableHighlight
                style={itemStyle.button}
                onPress={() => this.displayDetails(appointment.id)}
                underlayColor="#93eafe"
              >
                <View style={itemStyle.button_elements}>
                  {isPrevious ?
                    <Text style={itemStyle.viewDetails}>Voir le rapport</Text>
                    :
                    <Text style={itemStyle.viewDetails}>Voir les détails</Text>
                  }
                </View>
              </TouchableHighlight>
            </View>
          </View>

          <View style={itemStyle.arrow_container}>
            <TouchableOpacity
              onPress={() => this.toggleAppointment(main, appointment.id, appIdState)}
              style={{ padding: 5 }}>
              {appIdState === appointment.id ?
                <AntDesign name="upcircleo"
                  size={SCREEN_WIDTH * 0.05}
                  color="#93eafe" />
                :
                <AntDesign name="downcircleo"
                  size={SCREEN_WIDTH * 0.05}
                  color="#93eafe" />}
            </TouchableOpacity>
          </View>

          {/******* View more details on expand *******/}

          {appIdState === appointment.id &&
            <View style={itemStyle.appDetails}>

              <View style={itemStyle.appDetailsColumn}>
                <Text style={itemStyle.appDetailsHeader}>Durée</Text>
                <Text style={itemStyle.appDetailsText}>30 min</Text>
              </View>

              <View style={itemStyle.appDetailsColumn}>
                <Text style={itemStyle.appDetailsHeader}>Documents médicaux</Text>
                {documents.slice(0, 2).map(function (doc, key) {
                  return (
                    <View>
                      <Text style={[itemStyle.appDetailsText, { textDecorationLine: 'underline' }]}
                        onPress={() => this.toggleModalImage(main, doc)} >Document {key + 1}</Text>
                    </View>)
                }.bind(this))}
                {documents.length > 2 && <Text style={itemStyle.appDetailsText}>...</Text>}
              </View>

              <View style={itemStyle.appDetailsColumn}>
                <Text style={itemStyle.appDetailsHeader}>Symptômes</Text>
                {symptomes.slice(0, 2).map(symptom => { return (<Text style={itemStyle.appDetailsText}>{symptom}</Text>) })}
                {symptomes.length > 2 && <Text style={itemStyle.appDetailsText}>...</Text>}
              </View>

            </View>
          }

          {isNext && isPatient && this.renderPatientButtons(main, appointment, appIdState)}
          {isNext && isDoctor && this.renderDoctorButtons(main, appointment, appIdState)}
          {isNext && isAdmin && this.renderAdminButtons(main, appointment, appIdState)}

        </View>

      </View >
    )
  }
}

const itemStyle = StyleSheet.create({
  ItemStyle: {
    flex: 1,

    backgroundColor: '#ffffff',
    borderRadius: 20,
    height: SCREEN_HEIGHT * 0.14, //animate to SCREEN_HEIGHT * 0.3
    width: SCREEN_WIDTH * 0.95,
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.025,
    marginLeft: SCREEN_HEIGHT * 0.01,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    //backgroundColor: 'green'
  },
  viewDetails: {
    fontSize: SCREEN_HEIGHT * 0.015,
    color: 'white',
    marginRight: SCREEN_WIDTH * 0.01
  },
  main_container: {
    height: SCREEN_HEIGHT * 0.1,
    width: SCREEN_WIDTH * 0.95,
    // justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    //backgroundColor: 'blue'
  },
  confirmButton_container: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.06,
    //backgroundColor: 'yellow'
  },
  confirmButton_container_patient: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH,
  },
  arrow_container: {
    position: 'absolute',
    bottom: 0,
    //backgroundColor: 'yellow'
  },

  dot_container: {
    flex: 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'black'
  },
  dot: {
    width: SCREEN_WIDTH * 0.02,
    height: SCREEN_WIDTH * 0.02,
    borderRadius: 50,
    backgroundColor: '#93eafe'
  },
  date_container: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: SCREEN_WIDTH * 0.016,
    //backgroundColor: 'orange'
  },
  date_day: {
    color: '#93eafe',
    fontSize: SCREEN_HEIGHT * 0.032,
    fontWeight: 'bold'
  },
  date_month: {
    color: '#93eafe',
    fontSize: SCREEN_HEIGHT * 0.015,
    fontWeight: 'bold'
  },
  titles_container: {
    flex: 0.17,
    justifyContent: 'center',
    //backgroundColor: 'pink'
  },
  title_text: {
    fontStyle: 'italic',
    fontSize: SCREEN_HEIGHT * 0.013,
  },
  data_container: {
    flex: 0.33,
    justifyContent: 'center',
    //backgroundColor: 'yellow'
  },
  data_text: {
    fontWeight: 'bold',
    fontSize: SCREEN_HEIGHT * 0.013,
  },
  buttons_container: {
    flex: 0.35,
    justifyContent: 'center',
    //backgroundColor: 'brown'
  },
  button: {
    height: SCREEN_HEIGHT * 0.035,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: SCREEN_WIDTH * 0.03,
    backgroundColor: '#93eafe',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  button_elements: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  //Appointment card: details
  appDetails: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.95,
    alignItems: 'flex-start',
    justifyContent: 'center',
    //backgroundColor: 'green'
  },
  appDetailsColumn: {
    width: SCREEN_WIDTH * 0.95 / 3,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'blue'
  },
  appDetailsHeader: {
    marginBottom: SCREEN_HEIGHT * 0.01,
    fontSize: SCREEN_HEIGHT * 0.014
  },
  appDetailsText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: SCREEN_HEIGHT * 0.014,
    marginBottom: SCREEN_HEIGHT * 0.01
  },
  reportButton: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 0,
    paddingTop: 0,
    borderRadius: 30,
    marginTop: 16,
    width: SCREEN_WIDTH * 0.35,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center'
  },
  reportText: {
    fontSize: SCREEN_HEIGHT * 0.021,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  camera_container: {
    //backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: SCREEN_WIDTH * 0.95,
    bottom: SCREEN_HEIGHT * 0.04,
  },
  buttonLaunchCall: {
    width: SCREEN_WIDTH * 0.13,
    height: SCREEN_WIDTH * 0.13,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
    //backgroundColor: 'green'
  },
  headerVideo_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    //backgroundColor: 'black',
    width: SCREEN_WIDTH * 0.95
  },
  headerVideo_text: {
    // flex: 0.1,
    //flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'purple',
    marginLeft: SCREEN_WIDTH * 0.005
  },
})

export default withNavigation(AppointmentItem)
