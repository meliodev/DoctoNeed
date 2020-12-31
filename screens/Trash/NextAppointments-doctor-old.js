
import React from 'react'
import { View, Text, Image, Dimensions, TouchableHighlight, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { createFilter } from 'react-native-search-filter';
import ImageViewing from "react-native-image-viewing";

import LeftSideMenu from '../../../components/LeftSideMenu'
import RightSideMenu from '../../../components/RightSideMenu4'
import Button from '../../../components/Button';

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import firebase from 'react-native-firebase'
import * as REFS from '../../../DB/CollectionsRefs'

import { toggleLeftSideMenu, navigateToScreen, signOutUserandToggle } from '../../../Navigation/Navigation_Functions'
import { getMetaData, sendNotification } from '../../../functions/functions'

import Icon2 from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from "react-native-modal";

const functions = firebase.functions()

const KEYS_TO_FILTERS_PATIENT = ['userName'];
const KEYS_TO_FILTERS_COUNTRY = ['userCountry'];
const KEYS_TO_FILTERS_STATE = ['state'];
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.14 * ratioLogo;

export default class NextAppointments extends React.Component {
  constructor(props) {
    super(props);
    this.appointments = []
    this.month = ''
    this.year = 0
    this.itemHeight = SCREEN_HEIGHT * 0.13
    this.consultations = []
    this.fcmTokenAdmin = ''

    //Filters
    this.filter = this.filter.bind(this);

    this.toggleAppointment = this.toggleAppointment.bind(this);
    this.defineItemStyle = this.defineItemStyle.bind(this);
    this.loadAppointments = this.loadAppointments.bind(this);
    this.displayDetails = this.displayDetails.bind(this);
    this.startCall = this.startCall.bind(this);

    this.state = {
      appointments: [],
      isUser: false,
      isLeftSideMenuVisible: false,
      isRightSideMenuVisible: false,
      currentUser: null,
      uid: null,
      nom: "",
      prenom: "",
      email: "",
      age: "",

      patient: '',
      country: '',
      appointmentState: '',
      isPatientSelected: false,
      isCountrySelected: false,
      isAppointmentStateSelected: false,

      patientNames: [],
      patientsCountries: [],
      patientsLoaded: false,

      //Appointment dynamic style: open & close
      itemHeight: SCREEN_HEIGHT * 0.13,
      appId: null,

      //Appointment details
      symptomes: [],
      documents: [],
      video: '',

      isModalImageVisible: false,
      ImageToShow: ''
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('willFocus', async () => {
      await this.setState({ appId: null })
      this.month = ''
    });
    this.setFcmTokenAdmin()
    //Get current user metadata
    getMetaData(this, 'isDoctor')
  }

  setFcmTokenAdmin() {
    REFS.fcmtokens.doc('rmSSnSUUe1bjIuYihD6fa6om3MA3').get().then((doc) => {
      this.fcmTokenAdmin = doc.data().fcmToken
    })
  }

  //Load appointments
  loadAppointments() {

    this.appointments = []

    var query = REFS.appointments
    // query = query.where('doctor_id', '==', firebase.auth().currentUser.uid)
    query = query.where('doctor_id', "array-contains", firebase.auth().currentUser.uid)
    query = query.where('finished', '==', false)
    query = query.where('cancelBP', '==', false)
    query = query.where('state.CBA', '==', true)
    query = query.orderBy('date', 'desc')

    query
      .onSnapshot(function (querySnapshot) {
        //console.log(querySnapshot)
        let appointments = []
        querySnapshot.forEach(doc => {
          let id = doc.id
          let date = ''

          if (doc.data().postponeBA) {
            date = doc.data().postponedBPto
          }

          else date = doc.data().date

          let urgence2 = doc.data().urgence2
          let state = doc.data().state
          let user_id = doc.data().user_id

          let postponing = doc.data().postponing
          let postponeBA = doc.data().postponeBA
          let postponeBD = doc.data().postponeBD
          let postponedBPto = doc.data().postponedBPto
          let postponedBPfrom = doc.data().postponedBPfrom

          let app = {
            id: id,
            date: date,
            user_id: user_id,
            urgence2: urgence2,
            state: state,
            postponing: postponing, 
            postponeBA: postponeBA,
            postponeBD: postponeBD,
            postponedBPto: postponedBPto,
            postponedBPfrom: postponedBPfrom
          }

          appointments.push(app)
        })
        //console.log("Current appointments are", appointments.join(", "))
        this.setState({ appointments: appointments }, () => {

          this.consultations = this.state.appointments

          this.consultations.forEach((cons) => {

            REFS.users.doc(cons.user_id).get().then((doc) => {
              cons.userName = doc.data().nom + ' ' + doc.data().prenom
              cons.userCountry = doc.data().country
            }).then(() => {
              this.setState({ appointments: this.consultations })
            })
          })
        })

      }.bind(this)) //.then(() => this.setState({ appointments: this.appointments }))
  }

  loadPatients() {
    if(!this.state.patientsLoaded) {
      let patientNames = []
      let patientsCountries = []
      let patientName = ''
      let patientCountry = ''
  
      var query = REFS.users
  
      query = query.where("myDoctors", "array-contains", firebase.auth().currentUser.uid)
  
      query.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data().nom)
          patientName = doc.data().prenom + ' ' + doc.data().nom
          patientCountry = doc.data().country
  
          if (!this.state.patientNames.includes(patientName))
            patientNames.push(patientName)
  
          if (!this.state.patientsCountries.includes(patientCountry))
            patientsCountries.push(patientCountry)
        })
  
        //Remove duplicates
        patientNames = [...new Set(patientNames)]
        patientsCountries = [...new Set(patientsCountries)]
  
        this.setState({
          patientNames: patientNames,
          patientsCountries: patientsCountries,
          patientsLoaded: true
        })
  
      })
        .catch(error => console.log('Error getting documents:' + error))
    }
    
  }

  //RightSideMenu functions 
  toggleRightSideMenu = () => {
    this.month = ''
    this.setState({ isRightSideMenuVisible: !this.state.isRightSideMenuVisible, appId: null })
    this.loadPatients()
  }

  //Get data from filters
  onSelectFilter = (value, field, isField) => {
    let update1 = {}
    update1[`${field}`] = value
    this.setState(update1)

    let update2 = {}
    if (field === "") {
      update2[isField] = false
      this.setState(update2)
    }
    else {
      update2[isField] = true
      this.setState(update2)
    }
  }

  //LeftSideMenu functions
  toggleAppointment(appId) {
    if (appId !== this.state.appId) {
      this.month = ''
      if (this.itemHeight === SCREEN_HEIGHT * 0.4) {
        this.itemHeight = SCREEN_HEIGHT * 0.13
      }

      REFS.appointments.doc(appId)
        .get().then((doc) => {
          //console.log(doc.data().DocumentsRefs)
          this.setState({ appId: appId, symptomes: doc.data().symptomes, documents: doc.data().DocumentsRefs, video: doc.data().Video })
        })
    }

    else if (appId === this.state.appId) {
      this.month = ''
      this.setState({ appId: null })
      this.itemHeight = SCREEN_HEIGHT * 0.13
    }
  }

  defineItemStyle = (appId) => {
    //  console.log('Before appId === this.state.appId')

    if (appId === this.state.appId) {
      //  console.log('Inside appId === this.state.appId')
      if (this.itemHeight === SCREEN_HEIGHT * 0.13) {
        this.itemHeight = SCREEN_HEIGHT * 0.4
        //  console.log('Changing from 0.13 to 0.4')
      }
      else if (this.itemHeight === SCREEN_HEIGHT * 0.4) {
        this.itemHeight = SCREEN_HEIGHT * 0.13
        //  console.log('Changing from 0.4 to 0.13')
      }

      return {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        height: this.itemHeight, //animated
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
      }
    }

    else if (appId !== this.state.appId) {

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
        //backgroundColor: 'green'
      }
    }
  }

  async handleConfirmAppointment(appId, postponeBA, postponedBPto, postponedBPfrom, urgence2, user_id) {
    this.setState({ appId: null })

    if (postponeBA) {

      //Change the old date to 'paid' = false --> the date will be available in calendar for patients
      REFS.doctors.doc(firebase.auth().currentUser.uid).collection('DoctorSchedule').where('ts', '==', postponedBPfrom).get().then(querySnapshot => {

        querySnapshot.forEach(doc => {
          REFS.doctors.doc(firebase.auth().currentUser.uid).collection('DoctorSchedule').doc(doc.id).update({ paid: false })
            .then(() => console.log('document has been updated: paid = false.'))
            .catch((err) => console.error(err))
          console.log('paid:')
          console.log(doc.data().paid)
        })

      }).then(() => console.log('document has been retrieved to be updated...'))
        .catch((err) => console.error(err))


      console.log('postponing')
      REFS.appointments.doc(appId).update({ postponeBD: true, date: postponedBPto, postponing: false })
    }

    if (urgence2 === true) {
      //remove other doctors Ids from doctor_id 
      const doctor_id = [firebase.auth().currentUser.uid]
      REFS.appointments.doc(appId).update({ doctor_id: doctor_id })

      //UPDATE PAYMENT INTENT: metadata.doctor_id
      let pi_id = ''
      await REFS.paymentintents.where('metadata.appointment_id', '==', appId).get().then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          pi_id = doc.data().id
        })

      }).then(() => {
        console.log('pi_id' + pi_id)
        console.log('doctor_id[0]' + doctor_id[0])
        console.log('user_id' + user_id)

        const updatePaymentIntentDoctorId = functions.httpsCallable('updatePaymentIntentDoctorId')
        updatePaymentIntentDoctorId({ pi_id: pi_id, doctor_id: doctor_id[0], user_id: user_id })
      })
    }


    const state = ['CBP', 'CBA', 'CBD']
    REFS.appointments.doc(appId).update({ state: { CBP: true, CBA: true, CBD: true } }).then(() => {
      console.log('Appointment confirmed by Doctor succesfuly')
      //Notification: send notification to admin to inform him about the appointment confirmation
      const body = 'Le médecin ' + this.state.prenom + ' ' + this.state.nom + ' ' + 'vient de confirmer une consultation'
      sendNotification(this.fcmTokenAdmin, 'Rendez-vous confirmé !', body, "default", '')
    })
      .catch((err) => console.error(err))
  }

  displayDetails = (appId) => {
    this.props.navigation.navigate('AppointmentDetails', { appId: appId })
  }

  toggleModalImage(doc) {
    this.setState({ isModalImageVisible: !this.state.isModalImageVisible, ImageToShow: doc })
  }

  renderButton(appointment) {
    if (this.state.appId === appointment.id) {

      if (appointment.postponing === false && appointment.state.CBD === false || appointment.postponing === true && appointment.postponeBA === true && appointment.postponeBD === false)

        return (
          <View style={itemStyle.confirmButton_container}>
            <Button
              width={SCREEN_WIDTH * 0.35}
              paddingTop={0}
              paddingBottom={0}
              text="Confirmer"
              onPress={() => this.handleConfirmAppointment(appointment.id, appointment.postponeBA, appointment.postponedBPto, appointment.postponedBPfrom, appointment.urgence2, appointment.user_id)} />
          </View>)

      else if (appointment.postponing === false && appointment.state.CBD === true || appointment.postponing === true && appointment.state.CBD === true && appointment.postponeBA === false || appointment.postponing === false && appointment.state.CBD === true && appointment.postponeBA === true)
        return (
          <View style={itemStyle.camera_container}>
            <TouchableOpacity onPress={() => this.startCall(appointment.id, appointment.user_id)} style={itemStyle.buttonLaunchCall}>
              <Icon2 name="video-camera"
                size={SCREEN_WIDTH * 0.05}
                color="#93eafe" />
            </TouchableOpacity>

            <View style={itemStyle.headerVideo_container}>
              <Icon1 name="lock"
                size={SCREEN_WIDTH * 0.045}
                color="gray" />
              <View style={itemStyle.headerVideo_text_container}>
                <Text style={{ fontSize: SCREEN_HEIGHT * 0.017, fontWeight: 'bold', color: "gray", }}>  Lancez l'appel lorsque vous êtes prêt</Text>
                <Text style={{ fontSize: SCREEN_HEIGHT * 0.011, fontWeight: 'bold', color: "gray", }}>Vos appels video resteront confidentiels lorem ipsum lorem</Text>
              </View>
            </View>

          </View>
        )
    }
  }

  filter() {

    this.filteredAppointments = this.state.appointments
    this.month = ''

    if (this.state.dateFrom) {
      this.filteredAppointments = this.filteredAppointments.filter((appointment) => {
        return moment(moment(appointment.date).format('YYYY-MM-DD')).isAfter(this.state.dateFrom) || moment(moment(appointment.date).format('YYYY-MM-DD')).isSame(this.state.dateFrom)
      })
    }
    if (this.state.dateTo) {
      this.filteredAppointments = this.filteredAppointments.filter((appointment) => {
        return moment(moment(appointment.date).format('YYYY-MM-DD')).isBefore(this.state.dateTo) || moment(moment(appointment.date).format('YYYY-MM-DD')).isSame(this.state.dateTo)
      })
    }

    if (this.state.patient) {
      this.filteredAppointments = this.filteredAppointments.filter(createFilter(this.state.patient, KEYS_TO_FILTERS_PATIENT))
      // console.log(this.filteredAppointments)
    }
    if (this.state.country) {
      this.filteredAppointments = this.filteredAppointments.filter(createFilter(this.state.country, KEYS_TO_FILTERS_COUNTRY))
    }

    if (this.state.appointmentState === 'CBD') {
      this.filteredAppointments = this.filteredAppointments.filter((appointment) => {
        return appointment.state.CBD === true
      })
    }

    else if (this.state.appointmentState === 'pending') {
      this.filteredAppointments = this.filteredAppointments.filter((appointment) => {
        return !appointment.state.CBD === true
      })
    }

  }

  startCall(appId, userId) {
    console.log('USERID:::' + userId)
    this.props.navigation.navigate('Video', { appId: appId, userId: userId })
  }

  
  clearAllFilters = () => {
    this.setState({
      patient: '', speciality: '', dateFrom: '', dateTo: '',
      isPatientSelected: false, isCountrySelected: false,
      isDateFromSelected: false, isDateFromToSelected: false,
      isRightSideMenuVisible: false
    })
  }

  render() {

    this.filter()

    return (
      <View style={styles.container}>

        <LeftSideMenu
          isSideMenuVisible={this.state.isLeftSideMenuVisible}
          toggleSideMenu={() => toggleLeftSideMenu(this)}
          nom={this.state.nom}
          prenom={this.state.prenom}
          email={this.state.email}
          navigateToProfile={() => navigateToScreen(this, this.props, 'Profile')}
          navigateToMyPatients={() => navigateToScreen(this, this.props, 'MyPatients')}
          navigateToDispoConfig={() => navigateToScreen(this, this.props, 'DispoConfig')}
          navigateToAppointments={() => navigateToScreen(this, this.props, 'TabScreenDoctor')}
          navigateToPaymentSummary={() => navigateToScreen(this, this.props, 'PaymentSummary')}
          signOutUser={() => signOutUserandToggle(this)}
          navigate={this.props.navigation} />

        <RightSideMenu
          isSideMenuVisible={this.state.isRightSideMenuVisible}
          toggleSideMenu={this.toggleRightSideMenu}
          patient={this.state.patient}
          country={this.state.country}
          dateFrom={this.state.dateFrom}
          dateTo={this.state.dateTo}
          patientNames={this.state.patientNames}
          patientsCountries={this.state.patientsCountries}
          onSelectPatient={this.onSelectFilter}
          onSelectCountry={this.onSelectFilter}
          onSelectDateFrom={this.onSelectFilter}
          onSelectDateTo={this.onSelectFilter} 
          clearAllFilters={this.clearAllFilters} />

        {/*Display document on press*/}
        <ImageViewing
          images={[{ uri: this.state.ImageToShow }]}
          imageIndex={0}
          presentationStyle="overFullScreen"
          visible={this.state.isModalImageVisible}
          onRequestClose={() => this.setState({ isModalImageVisible: false })}
        />

        {/*Header*/}
        <View style={{ height: SCREEN_HEIGHT * 0.24, flexDirection: 'row', paddingTop: SCREEN_HEIGHT * 0.04, justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <TouchableHighlight style={styles.menu_button}
            onPress={() => toggleLeftSideMenu(this)}>
            <Icon1 name="bars" size={25} color="#93eafe" />
          </TouchableHighlight>

          <Image source={require('../../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />

          <TouchableHighlight style={styles.filter_button}
            onPress={this.toggleRightSideMenu}>
            <Icon1 name="filter" size={25} color="#93eafe" />
          </TouchableHighlight>
        </View>

        {/*Appointments list*/}
        <ScrollView style={styles.appointments_container_scrollview}>
          {this.filteredAppointments.map(appointment => {

            let dateComponent = null

            if (moment(appointment.date).format("MMMM") !== this.month || this.month === '') {
              this.month = moment(appointment.date).format("MMMM")
              this.year = moment(appointment.date).format("YYYY")
              dateComponent = <Text style={{ fontWeight: 'bold', paddingLeft: SCREEN_WIDTH * 0.07, marginBottom: SCREEN_HEIGHT * 0.01, marginTop: SCREEN_HEIGHT * 0.015, color: 'gray' }}> {moment(appointment.date).format("MMMM")} {moment(appointment.date).format("YYYY")} </Text>
            }

            return (
              <View>
                {dateComponent}
                <View style={this.defineItemStyle(appointment.id)}>

                  {/*Appointment main data*/}
                  <View style={itemStyle.main_container}>
                    <View style={itemStyle.dot_container}>
                    </View>

                    <View style={itemStyle.date_container}>
                      <Text style={itemStyle.date_day}>{moment(appointment.date).format("Do")}</Text>
                    </View>

                    <View style={itemStyle.titles_container}>
                      <Text style={itemStyle.title_text}>Patient</Text>
                      <Text style={itemStyle.title_text}>Pays</Text>
                      {appointment.urgence2 === false ?
                        <Text style={itemStyle.title_text}>Heure</Text>
                        :
                        <Text style={itemStyle.title_text}>Type</Text>
                      }
                    </View>

                    <View style={itemStyle.data_container}>
                      <Text style={itemStyle.data_text}>{appointment.userName}</Text>
                      <Text style={itemStyle.data_text}>{appointment.userCountry}</Text>
                      {appointment.urgence2 === false ?
                        <Text style={itemStyle.data_text}>{moment(appointment.date).format("HH:mm")}</Text>
                        :
                        <Text style={[itemStyle.data_text, { color: 'red' }]}>Urgence</Text>
                      }
                    </View>

                    <View style={itemStyle.buttons_container}>
                      <TouchableHighlight
                        style={itemStyle.button}
                        onPress={() => this.displayDetails(appointment.id)}>
                        <View style={itemStyle.button_elements}>
                          <Text style={{ fontSize: SCREEN_HEIGHT * 0.015, color: 'white', marginRight: SCREEN_WIDTH * 0.01 }}>Voir les détails</Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  </View>

                  {this.renderButton(appointment)}

                  {/*Arrow (to display/hide detailed data)*/}
                  <View style={itemStyle.arrow_container}>
                    <TouchableOpacity
                      onPress={() => this.toggleAppointment(appointment.id)}>
                      {this.state.appId === appointment.id ?
                        <Icon name="upcircleo"
                          size={SCREEN_WIDTH * 0.05}
                          color="#93eafe" />
                        :
                        <Icon name="downcircleo"
                          size={SCREEN_WIDTH * 0.05}
                          color="#93eafe" />}

                    </TouchableOpacity>
                  </View>

                  {/*Appointment detailed data*/}
                  {this.state.appId === appointment.id ?
                    <View style={itemStyle.appDetails}>

                      <View style={itemStyle.appDetailsColumn}>
                        <Text style={itemStyle.appDetailsHeader}>Durée</Text>
                        <Text style={itemStyle.appDetailsText}>30 min</Text>
                      </View>

                      <View style={itemStyle.appDetailsColumn}>
                        <Text style={itemStyle.appDetailsHeader}>Documents médicaux</Text>
                        {this.state.documents.slice(0, 2).map(function (doc, key) {
                          return (
                            <View>
                              <Text style={[itemStyle.appDetailsText, { textDecorationLine: 'underline' }]}
                                onPress={() => this.toggleModalImage(doc)} >Document {key + 1}</Text>
                            </View>)
                        }.bind(this))}
                        {this.state.documents.length > 2 ?
                          <Text style={itemStyle.appDetailsText}>...</Text>
                          : null}
                      </View>

                      <View style={itemStyle.appDetailsColumn}>
                        <Text style={itemStyle.appDetailsHeader}>Symptômes</Text>
                        {this.state.symptomes.slice(0, 2).map(symptom => {
                          return (<Text style={itemStyle.appDetailsText}>{symptom}</Text>)
                        })}
                        {this.state.symptomes.length > 2 ?
                          <Text style={itemStyle.appDetailsText}>...</Text>
                          : null}
                      </View>

                    </View>
                    : null}

                </View>
              </View>
            )
          })}
        </ScrollView>

        <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
          <Button width={SCREEN_WIDTH * 0.87} text="Voir mes patients" onPress={() => this.props.navigation.navigate('MyPatients')} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo_container: {
    flex: 0.3,
    //justifyContent: 'flex-end',
    //alignItems: 'center',
    //backgroundColor: 'green',
  },
  logoIcon: {
    height: SCREEN_WIDTH * 0.14,
    width: LOGO_WIDTH,
    /*position: 'absolute',
    top: 0,
    right: 0*/
    //marginTop: SCREEN_WIDTH * 0.05
  },
  header_container: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'blue',
  },
  header: {
    fontSize: SCREEN_HEIGHT * 0.02,
    fontWeight: 'bold',
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'black',
    //backgroundColor: 'yellow',
    //marginBottom: SCREEN_HEIGHT * 0.01
  },
  menu_button: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: 25,
    backgroundColor: '#ffffff',

    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    left: SCREEN_WIDTH * 0.03,    /*position: 'relative',
    left: SCREEN_WIDTH * 0.05,
    top: SCREEN_WIDTH * 0.05,*/
  },
  filter_button: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    position: 'relative',
    right: SCREEN_WIDTH * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SCREEN_WIDTH * 0.02
  },
  appointments_container_scrollview: {
    flex: 1,
    //alignItems: 'center',
    //justifyContent: 'center',
    //paddingTop: SCREEN_HEIGHT*0.05,
    //paddingLeft: SCREEN_WIDTH*0.025,
    //backgroundColor: 'brown'
  },
  Button2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 2,
    paddingTop: 2,
    borderRadius: 30,
    marginTop: SCREEN_HEIGHT * 0.02,
    width: SCREEN_WIDTH * 0.87,
  },
  Button2_Text: {
    color: 'black',
    fontSize: SCREEN_HEIGHT * 0.02,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    backgroundColor: 'transparent',
  },
});

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
    //alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    //backgroundColor: 'green'
  },
  main_container: {
    height: SCREEN_HEIGHT * 0.1,
    //alignItems: 'flex-start',
    justifyContent: 'center',
    //marginTop: SCREEN_HEIGHT*0.02,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    flexDirection: 'row',
    //backgroundColor: 'blue'
  },
  confirmButton_container: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.06,
    //backgroundColor: 'yellow'
  },
  arrow_container: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.01,
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
  viewDetails: {
    fontSize: SCREEN_HEIGHT * 0.015,
    color: 'white',
    marginRight: SCREEN_WIDTH * 0.01
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
    marginBottom: SCREEN_HEIGHT * 0.04,
    //backgroundColor: 'green'
  },
  camera_container: {
    //backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: SCREEN_WIDTH * 0.95,
    bottom: SCREEN_HEIGHT * 0.05,
  },
  cameraButton_container: {
    position: 'absolute',

    bottom: SCREEN_HEIGHT * 0.11,
    backgroundColor: 'yellow'
  },
  headerVideo_container: {
    //position: 'absolute',
    //bottom: SCREEN_HEIGHT * 0.05,
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
