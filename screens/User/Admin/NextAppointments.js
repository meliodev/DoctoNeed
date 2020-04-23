//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)
//issues: we can not navigate to stack nav screens cause we are wrapped in tabs nav
import React from 'react'
import { View, TextInput, Text, Image, Dimensions, TouchableHighlight, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import SearchInput, { createFilter } from 'react-native-search-filter';

import LeftSideMenu from '../../../components/LeftSideMenu2'
import RightSideMenu from '../../../components/RightSideMenu5'

import firebase from 'react-native-firebase'
import { signOutUser } from '../../../DB/CRUD'
import * as REFS from '../../../DB/CollectionsRefs'

import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from "react-native-modal";

const KEYS_TO_FILTERS_DOCTOR = ['doctorName'];
const KEYS_TO_FILTERS_SPECIALITY = ['doctorSpeciality'];
const KEYS_TO_FILTERS_PATIENT = ['userName'];
const KEYS_TO_FILTERS_COUNTRY = ['userCountry'];
const KEYS_TO_FILTERS_DATE = ['date'];

import Button from '../../../components/Button';
import Button2 from '../../../components/Button2';
import AppointmentItem from '../../../components/Admin/NextAppointmentItem'

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
    this.signOutUser = this.signOutUser.bind(this);

    //Menu
    this.signOutUserandToggle = this.signOutUserandToggle.bind(this);
    this.navigateToSearch = this.navigateToSearch.bind(this);
    this.navigateToPatients = this.navigateToPatients.bind(this);
    this.navigateToAppointments = this.navigateToAppointments.bind(this);
    this.navigateToMedicalFolder = this.navigateToMedicalFolder.bind(this);

    //Filters
    this.onSelectDoctor = this.onSelectDoctor.bind(this);
    this.onSelectSpeciality = this.onSelectSpeciality.bind(this);
    this.onSelectPatient = this.onSelectPatient.bind(this);
    this.onSelectCountry = this.onSelectCountry.bind(this);
    this.onSelectState = this.onSelectState.bind(this);


    this.toggleAppointment = this.toggleAppointment.bind(this);
    this.defineItemStyle = this.defineItemStyle.bind(this);
    this.renderAppointmentDetails = this.renderAppointmentDetails.bind(this);
    this.loadAppointments = this.loadAppointments.bind(this);
    this.displayDetails = this.displayDetails.bind(this);

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

      doctor: null,
      speciality: null,
      patient: null,
      country: null,
      appointmentState: '',
      isDoctorSelected: false,
      isSpecialitySelected: false,
      isPatientSelected: false,
      isCountrySelected: false,
      isAppointmentStateSelected: false,


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

  componentWillMount() {
    console.log('componentWillMount')

    const { navigation } = this.props;
    navigation.addListener('willFocus', async () => {
      await this.setState({ appId: null })
      this.month = ''
    });
  }

  componentDidMount() {

    const { currentUser } = firebase.auth()

    if (currentUser) {
      this.setState({ currentUser })

      REFS.admins.doc(currentUser.uid).get().then(doc => {
        this.setState({ uid: doc.id })
        this.setState({ nom: doc.data().nom })
        this.setState({ prenom: doc.data().prenom })
        this.setState({ email: currentUser.email })
      })
        .then(() => {
          const { navigation } = this.props;
          //navigation.addListener('willFocus', () =>
          this.loadAppointments()
          //);
        })
    }
  }

  // Load appointments
  loadAppointments() {

    this.appointments = []

    var query = REFS.appointments
    query = query.where('finished', '==', false)
    query = query.orderBy('fullDate', 'desc')

    query
      .onSnapshot(function (querySnapshot) {
        //console.log(querySnapshot)
        let appointments = []
        querySnapshot.forEach(doc => {
          let id = doc.id
          let day = doc.data().day
          let month = doc.data().month
          let year = doc.data().year
          let timeslot = doc.data().timeslot
          let doctorName = doc.data().doctorName
          let doctorSpeciality = doc.data().doctorSpeciality
          let state = doc.data().state
          let userName = doc.data().userName
          let userCountry = doc.data().userCountry

          let app = {
            id: id,
            day: day,
            month: month,
            year: year,
            timeslot: timeslot,
            doctorName: doctorName,
            doctorSpeciality: doctorSpeciality,
            userName: userName,
            userCountry: userCountry,
            state: state,
          }

          appointments.push(app)
        })
        //console.log("Current appointments are", appointments.join(", "))
        this.setState({ appointments: appointments })

      }.bind(this)) //.then(() => this.setState({ appointments: this.appointments }))
  }

  signOutUser() {
    signOutUser();
  }

  //RightSideMenu functions
  toggleRightSideMenu = () => {
    this.month = ''
    this.setState({ isRightSideMenuVisible: !this.state.isRightSideMenuVisible, appId: null });
  }

  clearAllFilters = () => {
    this.setState({
      doctor: '', speciality: '', patient: '', country: '', appointmentState: '',
      isDoctorSelected: false, isSpecialitySelected: false, isPatientSelected: false, isCountrySelected: false, isAppointmentStateSelected: false,
      isRightSideMenuVisible: false
    })
  }

  //Get data from filters
  onSelectDoctor = (doctor) => {
    if (doctor === "")
      this.setState({ doctor: doctor, isDoctorSelected: false })
    else
      this.setState({ doctor: doctor, isDoctorSelected: true })
  }

  onSelectSpeciality = (speciality) => {
    if (speciality === "")
      this.setState({ speciality: speciality, isSpecialitySelected: false })
    else
      this.setState({ speciality: speciality, isSpecialitySelected: true })
  }

  onSelectPatient = (patient) => {
    if (patient === "")
      this.setState({ patient: patient, isPatientSelected: false })
    else
      this.setState({ patient: patient, isPatientSelected: true })
  }

  onSelectCountry = (country) => {
    if (country === "")
      this.setState({ country: country, isCountrySelected: false })
    else
      this.setState({ country: country, isCountrySelected: true })
  }

  onSelectState = (appointmentState) => {
    if (appointmentState === "")
      this.setState({ appointmentState: appointmentState, isAppointmentStateSelected: false })
    else
      this.setState({ appointmentState: appointmentState, isAppointmentStateSelected: true })
  }

  //LeftSideMenu functions
  toggleLeftSideMenu = () => {
    this.month = ''
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible, appId: null });
  }

  navigateToSearch() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('Search'));
    //console.log(this.props)
  }

  navigateToPatients() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('MyPatients'));
    //console.log(this.props)
  }

  navigateToMedicalFolder() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('MedicalFolder'));
    //console.log(this.props)
  }

  navigateToAppointments() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('TabScreenAdmin'));
  }

  signOutUserandToggle() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      this.signOutUser())
  }

  toggleAppointment(appId) {
    if (appId !== this.state.appId) {
      this.month = ''
      if (this.itemHeight === SCREEN_HEIGHT * 0.35) {
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
        this.itemHeight = SCREEN_HEIGHT * 0.35
        //  console.log('Changing from 0.13 to 0.35')
      }
      else if (this.itemHeight === SCREEN_HEIGHT * 0.35) {
        this.itemHeight = SCREEN_HEIGHT * 0.13
        //  console.log('Changing from 0.35 to 0.13')
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
        elevation: 4,
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
        elevation: 4,
        //backgroundColor: 'green'
      }
    }
  }

  renderAppointmentDetails() {
    /*  REFS.appointments.doc(appId)
        .get().then((doc) => {
          this.setState({ symptomes: doc.data().symptomes })
          console.log(doc.data().symptomes)
        })*/




    return (<Text> {appId} </Text>);

  }

  handleConfirmAppointment(appId) {
    this.setState({ appId: null })

    //Add state of the appointment: Confirmed By Admin
    const state = ['CBP', 'CBA']
    REFS.appointments.doc(appId).update("state", state)
      .then(() => {

        REFS.appointments.doc(appId).get().then((appDoc) => {

          REFS.users.doc(appDoc.data().user_id).get().then((userdoc) => {
            let myDoctors = []

            //Check if there is at Least one doctor assigned to to patient
            if (userdoc.data().myDoctors) {
              myDoctors = userdoc.data().myDoctors
            }

            //Check if the doctor exists: Add him if not..
            if (!myDoctors.includes(appDoc.data().doctor_id)) {
              myDoctors.push(appDoc.data().doctor_id)
              REFS.users.doc(appDoc.data().user_id).update("myDoctors", myDoctors)
            }

          }).catch((err) => console.error('1' + err))

        }).catch((err) => console.error('2' + err))

      }).catch((err) => console.error('3' + err))
  }

  displayDetails = (appId) => {
    this.props.navigation.navigate('AppointmentDetails', { appId: appId })
    //console.log(appId)
  }

  toggleModalImage(doc) {
    this.setState({ isModalImageVisible: !this.state.isModalImageVisible, ImageToShow: doc })
  }

  render() {
    this.filteredAppointments = this.state.appointments
    this.month = ''
    console.log('month : ' + this.month)
    //console.log(this.filteredAppointments)
    //      firebase.auth().signOut()
    // console.log(this.state.documents)
    //console.log('rr' + this.state.documents)

    if (this.state.doctor) {
      this.filteredAppointments = this.filteredAppointments.filter(createFilter(this.state.doctor, KEYS_TO_FILTERS_DOCTOR))
      // console.log(this.filteredAppointments)
    }
    if (this.state.speciality) {
      this.filteredAppointments = this.filteredAppointments.filter(createFilter(this.state.speciality, KEYS_TO_FILTERS_SPECIALITY))
    }
    
    if (this.state.patient) {
      this.filteredAppointments = this.filteredAppointments.filter(createFilter(this.state.patient, KEYS_TO_FILTERS_PATIENT))
      // console.log(this.filteredAppointments)
    }
    if (this.state.country) {
      this.filteredAppointments = this.filteredAppointments.filter(createFilter(this.state.country, KEYS_TO_FILTERS_COUNTRY))
    }

    if (this.state.appointmentState === 'CBA') {
      this.filteredAppointments = this.filteredAppointments.filter((appointment) => {
        return appointment.state.includes('CBA')
      })
    }

    else if (this.state.appointmentState === 'pending') {
      this.filteredAppointments = this.filteredAppointments.filter((appointment) => {
        return !appointment.state.includes('CBA')
      })
    }

    /*if (this.state.date) {
      this.filteredAppointments = this.filteredAppointments.filter(createFilter(this.state.date, KEYS_TO_FILTERS_SPECIALITY))
    }*/

    //console.log(this.state.appointments)
    //console.log(this.state.doctor)
    return (
      <View style={styles.container}>

        <LeftSideMenu
          isSideMenuVisible={this.state.isLeftSideMenuVisible}
          toggleSideMenu={this.toggleLeftSideMenu}
          nom={this.state.nom}
          prenom={this.state.prenom}
          email={this.state.email}
          navigateToSearch={this.navigateToSearch}
          navigateToPatients={this.navigateToPatients}
          navigateToMedicalFolder={this.navigateToMedicalFolder}
          navigateToAppointments={this.navigateToAppointments}
          signOutUser={this.signOutUserandToggle}
          navigate={this.props.navigation} />

        <RightSideMenu
          isSideMenuVisible={this.state.isRightSideMenuVisible}
          toggleSideMenu={this.toggleRightSideMenu}
          isNextAppointments={true}
          doctor={this.state.doctor}
          speciality={this.state.speciality}
          patient={this.state.patient}
          country={this.state.country}
          appointmentState={this.state.appointmentState}
          onSelectDoctor={this.onSelectDoctor}
          onSelectSpeciality={this.onSelectSpeciality}
          onSelectPatient={this.onSelectPatient}
          onSelectCountry={this.onSelectCountry}
          onSelectState={this.onSelectState}
          clearAllFilters={this.clearAllFilters} />

        <Modal isVisible={this.state.isModalImageVisible}
          onBackdropPress={() => this.setState({ isModalImageVisible: false })}
          animationIn="zoomIn"
          animationOut="zoomOut"
          onSwipeComplete={() => this.setState({ isModalImageVisible: false })}
          swipeDirection="left"
          style={{ backgroundColor: 'white' }}>

          < Icon1 name="remove"
            size={SCREEN_WIDTH * 0.1}
            color="#93eafe"
            onPress={() => {
              console.log('icon pressed')
              this.setState({ isModalImageVisible: false })
            }}
            style={{ position: 'absolute', top: 0, right: 0 }} />

          < Image style={{ width: SCREEN_WIDTH * 0.8, height: SCREEN_HEIGHT * 0.8, alignSelf: 'center' }}
            source={{ uri: this.state.ImageToShow }} />

        </Modal>

        <View style={{ height: SCREEN_HEIGHT * 0.24, flexDirection: 'row', paddingTop: SCREEN_HEIGHT * 0.04, justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <TouchableHighlight style={styles.menu_button}
            onPress={this.toggleLeftSideMenu}>
            <Icon1 name="bars" size={25} color="#93eafe" />
          </TouchableHighlight>

          <Image source={require('../../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />

          <TouchableHighlight style={styles.filter_button}
            onPress={this.toggleRightSideMenu}>
            <Icon1 name="filter" size={25} color="#93eafe" />
          </TouchableHighlight>
        </View>


        {/*
        <View style={styles.header_container}>
          <Text style={styles.header}>Mes consultations passées</Text>
          <Text style={{ color: 'gray', fontSize: SCREEN_HEIGHT * 0.0115 }}>( 18 derniers mois )</Text>
        </View> */}

        <ScrollView style={styles.appointments_container_scrollview}>
          {this.filteredAppointments.map(appointment => {

            let dateComponent = null

            if (appointment.month !== this.month || this.month === '') {
              this.month = appointment.month
              this.year = appointment.year
              dateComponent = <Text style={{ fontWeight: 'bold', paddingLeft: SCREEN_WIDTH * 0.07, marginBottom: SCREEN_HEIGHT * 0.01, marginTop: SCREEN_HEIGHT * 0.015, color: 'gray' }}> {appointment.month} {appointment.year} </Text>
            }

            return (
              <View>
                {dateComponent}
                <View style={this.defineItemStyle(appointment.id)}>
                  <View style={itemStyle.main_container}>
                    <View style={itemStyle.dot_container}>

                    </View>

                    <View style={itemStyle.date_container}>
                      <Text style={itemStyle.date_day}>{appointment.day}</Text>
                    </View>

                    <View style={itemStyle.titles_container}>
                      <Text style={itemStyle.title_text}>Médecin</Text>
                      <Text style={itemStyle.title_text}>Spécialité</Text>
                      <Text style={itemStyle.title_text}>Heure</Text>
                    </View>

                    <View style={itemStyle.data_container}>
                      <Text style={itemStyle.data_text}>{appointment.doctorName}</Text>
                      <Text style={itemStyle.data_text}>{appointment.doctorSpeciality}</Text>
                      <Text style={itemStyle.data_text}>{appointment.timeslot}</Text>
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

                  {this.state.appId === appointment.id ?
                    <View style={{ flexDirection: 'row', width: SCREEN_WIDTH * 0.95, alignItems: 'flex-start', justifyContent: 'space-evenly' }}>

                      <View style={{ marginBottom: SCREEN_HEIGHT * 0.02 }}>
                        <Text style={{ marginBottom: SCREEN_HEIGHT * 0.01 }}>Durée</Text>
                        <Text style={{ fontWeight: 'bold' }}>30 min</Text>
                      </View>

                      <View style={{}}>
                        <Text style={{ marginBottom: SCREEN_HEIGHT * 0.01 }}>Documents médicaux</Text>
                        {this.state.documents.map(function (doc, key) {
                          return (
                            <View>
                              <Text style={{ color: '#333', fontWeight: 'bold', textDecorationLine: 'underline', marginBottom: SCREEN_HEIGHT * 0.01 }}
                                onPress={() => this.toggleModalImage(doc)} >Document {key + 1}</Text>
                            </View>)
                        }.bind(this))}

                      </View>

                      <View >
                        <Text style={{ marginBottom: SCREEN_HEIGHT * 0.01 }}>Symptômes</Text>
                        {this.state.symptomes.map(symptom => {
                          return (<Text style={{ fontWeight: 'bold' }}>{symptom}</Text>)
                        })}
                      </View>

                    </View>
                    : null}

                  {this.state.appId === appointment.id && !appointment.state.includes('CBA') ?
                    <View style={itemStyle.confirmButton_container}>
                      <Button
                        width={SCREEN_WIDTH * 0.35}
                        paddingTop={0}
                        paddingBottom={0}
                        text="Confirmer"
                        onPress={() => this.handleConfirmAppointment(appointment.id)} />
                    </View>
                    : null}

                  {this.state.appId === appointment.id && appointment.state.includes('CBA') ?
                    <View style={itemStyle.confirmButton_container}>
                      <View style={{ backgroundColor: '#b2b2b2', borderRadius: 20, width: SCREEN_WIDTH * 0.3, height: SCREEN_HEIGHT * 0.05, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#ffffff' }}>Confirmé</Text>
                      </View>
                    </View>
                    : null}

                </View>
              </View>
            )
          })}
        </ScrollView>

        <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center' }}>
          <Button width={SCREEN_WIDTH * 0.87} text="Prendre un rendez-vous en urgence"/* onPress={ this.handleLogin } */ />
          <Button2 style={{ backgroundColor: "#ffffff", color: "#000000" }} text="Planifier une consultation" onPress={() => this.props.navigation.navigate('Search')} />
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
    elevation: 9,
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
    elevation: 4,
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
    elevation: 4,
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
})