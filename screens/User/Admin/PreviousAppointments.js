//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)
//issues: we can not navigate to stack nav screens cause we are wrapped in tabs nav
import React from 'react'
import { View, TextInput, Text, Image, Dimensions, TouchableHighlight, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import SearchInput, { createFilter } from 'react-native-search-filter';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from "react-native-modal";

import moment from 'moment'
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')

import LeftSideMenu from '../../../components/LeftSideMenu2'
import RightSideMenu from '../../../components/RightSideMenu5'
import Button from '../../../components/Button';
import Button2 from '../../../components/Button2';

import firebase from 'react-native-firebase'
import { signOutUser } from '../../../DB/CRUD'
import * as REFS from '../../../DB/CollectionsRefs'

const KEYS_TO_FILTERS_DOCTOR = ['doctorName'];
const KEYS_TO_FILTERS_SPECIALITY = ['doctorSpeciality'];
const KEYS_TO_FILTERS_PATIENT = ['userName'];
const KEYS_TO_FILTERS_COUNTRY = ['userCountry'];
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.14 * ratioLogo;

export default class PreviousAppointments extends React.Component {
  constructor(props) {
    super(props);
    this.appointments = []
    this.month = ''
    this.year = 0
    this.itemHeight = SCREEN_HEIGHT * 0.13
    this.signOutUser = this.signOutUser.bind(this);

    //Menu
    this.signOutUserandToggle = this.signOutUserandToggle.bind(this);
    this.navigateToScreen = this.navigateToScreen.bind(this);

    //Filters
    this.onSelectDoctor = this.onSelectDoctor.bind(this);
    this.onSelectSpeciality = this.onSelectSpeciality.bind(this);
    this.onSelectPatient = this.onSelectPatient.bind(this);
    this.onSelectCountry = this.onSelectCountry.bind(this);
    this.onSelectDateFrom = this.onSelectDateFrom.bind(this);
    this.onSelectDateTo = this.onSelectDateTo.bind(this);
    this.filter = this.filter.bind(this);

    this.toggleAppointment = this.toggleAppointment.bind(this);
    this.defineItemStyle = this.defineItemStyle.bind(this);
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
      dateFrom: '',
      dateTo: '',
      isDoctorSelected: false,
      isSpecialitySelected: false,
      isPatientSelected: false,
      isCountrySelected: false,
      isDateFromSelected: false,
      isDateFromToSelected: false,

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

    //Get current user metadata
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
          this.loadAppointments()
        })
    }
  }

  // Load appointments
  loadAppointments() {

    this.appointments = []

    var query = REFS.appointments
    query = query.where('finished', '==', true)
    query = query.orderBy('date', 'desc')

    query
      .onSnapshot(function (querySnapshot) {
        //console.log(querySnapshot)
        let appointments = []
        querySnapshot.forEach(doc => {
          let id = doc.id
          let date = doc.data().date

          let state = doc.data().state
          let doctorName = doc.data().doctorName
          let doctorSpeciality = doc.data().doctorSpeciality
          let userName = doc.data().userName
          let userCountry = doc.data().userCountry

          let app = {
            id: id,
            date: date,
            doctorName: doctorName,
            doctorSpeciality: doctorSpeciality,
            userName: userName,
            userCountry: userCountry,
            state: state
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

  onSelectDateFrom = (dateFrom) => {
    if (dateFrom === "")
      this.setState({ dateFrom: dateFrom, isDateFromSelected: false })
    else
      this.setState({ dateFrom: dateFrom, isDateFromSelected: true })
  }

  onSelectDateTo = (dateTo) => {
    if (dateTo === "")
      this.setState({ dateTo: dateTo, isDateToSelected: false })
    else
      this.setState({ dateTo: dateTo, isDateToSelected: true })
  }


  //LeftSideMenu functions
  toggleLeftSideMenu = () => {
    this.month = ''
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible, appId: null });
  }

  navigateToScreen(screen) {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate(screen));
  }

  signOutUserandToggle() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      this.signOutUser())
  }

  //appointment card: roll/unroll effect
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

  //appointment card functions
  displayDetails = (appId) => {
    this.props.navigation.navigate('AppointmentDetails', { appId: appId, noinput: true })
  }

  toggleModalImage(doc) {
    this.setState({ isModalImageVisible: !this.state.isModalImageVisible, ImageToShow: doc })
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
    if (this.state.doctor) {
      this.filteredAppointments = this.filteredAppointments.filter(createFilter(this.state.doctor, KEYS_TO_FILTERS_DOCTOR))
    }
    if (this.state.speciality) {
      this.filteredAppointments = this.filteredAppointments.filter(createFilter(this.state.speciality, KEYS_TO_FILTERS_SPECIALITY))
    }

    if (this.state.patient) {
      this.filteredAppointments = this.filteredAppointments.filter(createFilter(this.state.patient, KEYS_TO_FILTERS_PATIENT))
    }
    if (this.state.country) {
      this.filteredAppointments = this.filteredAppointments.filter(createFilter(this.state.country, KEYS_TO_FILTERS_COUNTRY))
    }
  }

  render() {
    this.filter()

    return (
      <View style={styles.container}>

        <LeftSideMenu
          isSideMenuVisible={this.state.isLeftSideMenuVisible}
          toggleSideMenu={this.toggleLeftSideMenu}
          nom={this.state.nom}
          prenom={this.state.prenom}
          email={this.state.email}
          navigateToSearch={() => this.navigateToScreen('Search')}
          navigateToPatients={() => this.navigateToScreen('MyPatients')}
          navigateToRequests={() => this.navigateToScreen('SignUpRequests')}
          navigateToMedicalFolder={() => this.navigateToScreen('MedicalFolder')}
          navigateToAppointments={() => this.navigateToScreen('TabScreenAdmin')}
          signOutUser={this.signOutUserandToggle}
          navigate={this.props.navigation} />

        <RightSideMenu
          isSideMenuVisible={this.state.isRightSideMenuVisible}
          toggleSideMenu={this.toggleRightSideMenu}
          doctor={this.state.doctor}
          speciality={this.state.speciality}
          dateFrom={this.state.dateFrom}
          dateTo={this.state.dateTo}
          onSelectDoctor={this.onSelectDoctor}
          onSelectSpeciality={this.onSelectSpeciality}
          onSelectPatient={this.onSelectPatient}
          onSelectCountry={this.onSelectCountry}
          onSelectDateFrom={this.onSelectDateFrom}
          onSelectDateTo={this.onSelectDateTo} />

        {/*Display document on press*/}
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

        {/*Header*/}
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
                      <Text style={itemStyle.title_text}>Médecin</Text>
                      <Text style={itemStyle.title_text}>Spécialité</Text>
                      <Text style={itemStyle.title_text}>Heure</Text>
                    </View>

                    <View style={itemStyle.data_container}>
                      <Text style={itemStyle.data_text}>{appointment.doctorName}</Text>
                      <Text style={itemStyle.data_text}>{appointment.doctorSpeciality}</Text>
                      <Text style={itemStyle.data_text}>{moment(appointment.date).format("HH:mm")}</Text>
                    </View>

                    <View style={itemStyle.buttons_container}>
                      <TouchableHighlight
                        style={itemStyle.button}
                        onPress={() => this.displayDetails(appointment.id)}>
                        <View style={itemStyle.button_elements}>
                          <Text style={itemStyle.viewDetails}>Voir le rapport</Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  </View>

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
                        {this.state.documents.map(function (doc, key) {
                          return (
                            <View>
                              <Text style={[itemStyle.appDetailsText, { textDecorationLine: 'underline' }]}
                                onPress={() => this.toggleModalImage(doc)} >Document {key + 1}</Text>
                            </View>)
                        }.bind(this))}
                      </View>

                      <View style={itemStyle.appDetailsColumn}>
                        <Text style={itemStyle.appDetailsHeader}>Symptômes</Text>
                        {this.state.symptomes.map(symptom => {
                          return (<Text style={itemStyle.appDetailsText}>{symptom}</Text>)
                        })}
                      </View>

                    </View>
                    : null}
                </View>
              </View>
            )
          })}
        </ScrollView>

        {/*Booking buttons*/}
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
  }
})

