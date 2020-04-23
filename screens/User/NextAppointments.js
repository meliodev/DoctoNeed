//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)
//issues: we can not navigate to stack nav screens cause we are wrapped in tabs nav
import React from 'react'
import { View, TextInput, Text, Image, Dimensions, TouchableHighlight, ScrollView, StyleSheet } from 'react-native'
import SearchInput, { createFilter } from 'react-native-search-filter';

import LeftSideMenu from '../../components/LeftSideMenu'
import RightSideMenu from '../../components/RightSideMenu2'

import firebase from 'react-native-firebase'
import { signOutUser } from '../../DB/CRUD'
import * as REFS from '../../DB/CollectionsRefs'

import Icon1 from 'react-native-vector-icons/FontAwesome';

const KEYS_TO_FILTERS_DOCTOR = ['doctorName'];
const KEYS_TO_FILTERS_SPECIALITY = ['doctorSpeciality'];
const KEYS_TO_FILTERS_DATE = ['date'];

import Button from '../../components/Button';
import Button2 from '../../components/Button2';
import AppointmentItem from '../../components/NextAppointmentItem'

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
    this.signOutUser = this.signOutUser.bind(this);
    this.signOutUserandToggle = this.signOutUserandToggle.bind(this);
    this.navigateToAppointments = this.navigateToAppointments.bind(this);
    this.navigateToMedicalFolder = this.navigateToMedicalFolder.bind(this);

    this.state = {
      appointments: [],
      isUser: false,
      isLeftSideMenuVisible: false,
      isRightSideMenuVisible: false,
      currentUser: null,
      nom: "",
      prenom: "",
      email: "",
      age: "",

      doctor: null,
      speciality: null,
      isDoctorSelected: false,
      isSpecialitySelected: false,
    }
  }

  componentDidMount() {

    const {navigation} = this.props;
    navigation.addListener ('willFocus', () =>
    this.loadAppointments()
    );

    this.UserAuthStatus()

    const { currentUser } = firebase.auth()

    if (currentUser) {
      this.setState({ currentUser })

      REFS.users.doc(currentUser.uid).get().then(doc => {
        this.setState({ nom: doc.data().nom })
        this.setState({ prenom: doc.data().prenom })
        this.setState({ email: currentUser.email })
      })
    }
  }

  UserAuthStatus = () => {
    firebase
      .auth()
      .onAuthStateChanged(user => {
        if (user) {
          this.setState({ isUser: true })
        } else {
          this.setState({ isUser: false })
        }
      })
  };

  // Load appointments
  loadAppointments() {
    console.log('Appointments loading start...')
    this.appointments = []
    
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("appointments").orderBy('fullDate', 'desc').limit(100)
      .get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let id = doc.data().fullDate
          let day = doc.data().day
          let month = doc.data().month
          let year = doc.data().year
          let timeslot = doc.data().timeslot
          let doctorName = doc.data().doctorName
          let doctorSpeciality = doc.data().doctorSpeciality

          let app = {
            id: id,
            day: day,
            month: month,
            year: year,
            timeslot: timeslot,
            doctorName: doctorName,
            doctorSpeciality: doctorSpeciality
          }

          this.appointments.push(app)
        })

        //this.setState({ appointments: this.appointments })

      }).then(() => this.setState({ appointments: this.appointments }))
  }

  signOutUser() {
    signOutUser();
  }

  //RightSideMenu functions
  toggleRightSideMenu = () => {
    this.setState({ isRightSideMenuVisible: !this.state.isRightSideMenuVisible });
  }

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

  clearAllFilters = () => {
    this.setState({
      doctor: '', speciality: '',
      isDoctorSelected: false, isSpecialitySelected: false,
      isRightSideMenuVisible: false
    })
  }

  //LeftSideMenu functions
  toggleLeftSideMenu = () => {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible });
  }

  navigateToMedicalFolder() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('MedicalFolder'));
    //console.log(this.props)
  }

  navigateToAppointments() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('Appointments'));
  }

  signOutUserandToggle() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      this.signOutUser())
  }

  render() {

    this.filteredAppointments = this.state.appointments
    console.log(this.filteredAppointments)

    if (this.state.doctor) {
      this.filteredAppointments = this.filteredAppointments.filter(createFilter(this.state.doctor, KEYS_TO_FILTERS_DOCTOR))
      console.log(this.filteredAppointments)
    }
    if (this.state.speciality) {
      this.filteredAppointments = this.filteredAppointments.filter(createFilter(this.state.speciality, KEYS_TO_FILTERS_SPECIALITY))
    }
    /*if (this.state.date) {
      this.filteredAppointments = this.filteredAppointments.filter(createFilter(this.state.date, KEYS_TO_FILTERS_SPECIALITY))
    }*/

    console.log(this.state.appointments)
    console.log(this.state.doctor)
    return (
      <View style={styles.container}>

        <LeftSideMenu
          isSideMenuVisible={this.state.isLeftSideMenuVisible}
          toggleSideMenu={this.toggleLeftSideMenu}
          nom={this.state.nom}
          prenom={this.state.prenom}
          email={this.state.email}
          navigateToMedicalFolder={this.navigateToMedicalFolder}
          navigateToAppointments={this.navigateToAppointments}
          signOutUser={this.signOutUserandToggle}
          navigate={this.props.navigation} />

        <RightSideMenu
          isSideMenuVisible={this.state.isRightSideMenuVisible}
          toggleSideMenu={this.toggleRightSideMenu}
          onSelectDoctor={this.onSelectDoctor}
          onSelectSpeciality={this.onSelectSpeciality}
          clearAllFilters={this.clearAllFilters}
          /*toggleUrgence={this.toggleUrgence}
          urgences={this.state.urgences}
          price={this.state.price}*/
          clearAllFilters={this.clearAllFilters}
         /* onSelectCountry={this.onSelectCountry}
          onSelectSpeciality={this.onSelectSpeciality}
          onSelectPriceMax={this.onSelectPriceMax} *//>

        <View style={{ height: SCREEN_HEIGHT * 0.24, flexDirection: 'row', paddingTop: SCREEN_HEIGHT * 0.04, justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <TouchableHighlight style={styles.menu_button}
            onPress={this.toggleLeftSideMenu}>
            <Icon1 name="bars" size={25} color="#93eafe" />
          </TouchableHighlight>

         <Image source={require('../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />

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
          {this.filteredAppointments.map(app => {

            if (app.month === this.month) {
              return (
                <View>
                  <AppointmentItem appointment={app} />
                </View>
              )
            }

            else if (app.month !== this.month || this.month === '') {
              this.month = app.month
              this.year = app.year
              return (
                <View>
                  <Text style={{ fontWeight: 'bold', paddingLeft: SCREEN_WIDTH * 0.07, marginBottom: SCREEN_HEIGHT * 0.01, marginTop: SCREEN_HEIGHT * 0.015, color: 'gray' }}> {this.month} {this.year} </Text>
                  <AppointmentItem appointment={app} />
                </View>
              )
            }

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
