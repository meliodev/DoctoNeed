//Bugs: removed loadDoctors because it produces an error

//Libraries
import React from 'react'
import { View, Text, Image, Dimensions, TouchableHighlight, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, BackHandler } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import ImageViewing from "react-native-image-viewing";
import { createFilter } from 'react-native-search-filter';

//Components
import LeftSideMenu from './LeftSideMenu'

import Header from './Header'
import RightSideMenuPatient from './RightSideMenu2'
import RightSideMenuAdmin from './RightSideMenu5'
import RightSideMenuDoctor from './RightSideMenu4'

import Button from './Button'
import Button2 from './Button2'
import Loading from './Loading'
import AppointmentItem from './AppointmentItem'

//Firebase
import firebase from 'react-native-firebase'
import { signOutUser } from '../DB/CRUD'
import * as REFS from '../DB/CollectionsRefs'

//Redux
import { connect } from 'react-redux'

import { withNavigation } from 'react-navigation';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.14 * ratioLogo;

class Appointments extends React.Component {
  constructor(props) {
    super(props);
    this.currentUser = firebase.auth().currentUser
    this.appointments = []
    this.filteredAppointments = []
    this.month = ''
    this.year = 0
    this.itemHeight = SCREEN_HEIGHT * 0.13

    //Appointment item
    this.loadAppointments = this.loadAppointments.bind(this);
    this.handleFilter = this.handleFilter.bind(this);

    this.state = {
      appointments: [],
      isLeftSideMenuVisible: false,
      isRightSideMenuVisible: false,

      //Menu metadata
      nom: "",
      prenom: "",
      email: "",
      age: "",

      //ALL Filter fields
      doctor: '',
      speciality: '',
      patient: '',
      country: '',
      appointmentState: '',
      dateFrom: '',
      dateTo: '',

      itemHeight: SCREEN_HEIGHT * 0.13,

      isLoading: false,

      //Appointment dynamic style: roll/unroll
      appId: null,

      //Appointment details
      symptomes: [],
      documents: [],
      isModalImageVisible: false,
      ImageToShow: '',

      //filters values (dynamic)
      doctorNames: [],
      doctorSpecialities: [],
      patientNames: [],
      patientsCountries: [],
      doctorsLoaded: false,
    }
  }

  componentDidMount() {
    //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    //Unroll Cards on tab change
    const { navigation } = this.props;
    navigation.addListener('willFocus', () => {
      this.setState({ appId: null })
      this.month = ''
    })

    this.loadAppointments()
  }

  componentWillUnmount() {
    this.unsubscribe()
    //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  // handleBackButton() {
  //   return true
  // }

  //load appointments

  loadAppointments() {

    this.unsubscribe = this.props.query.onSnapshot((querySnapshot) => {
      this.setState({ appId: null })

      let appointments = []
      querySnapshot.forEach(doc => {

        let app = {
          id: doc.id,
          date: doc.data().date,
          state: doc.data().state,
        }

        if (this.props.role === 'isPatient') {
          app.doctor_id = doc.data().doctor_id
          app.doctorName = doc.data().doctorName
          app.doctorSpeciality = doc.data().doctorSpeciality

          if (this.props.appointmentType === 'next') {
            app.postponing = doc.data().postponing
            app.postponeBP = doc.data().postponeBP
            app.postponeBD = doc.data().postponeBD
            app.urgence2 = doc.data().urgence2
            app.pi_id = doc.data().pi_id
            app.started = doc.data().started

            //Speciality in case of URG2
            if (doc.data().urgence2 && app.doctorName == '') {
              app.doctorName = 'Indéfini'
              app.doctorSpeciality = doc.data().speciality
            }
          }

        }

        else if (this.props.role === 'isDoctor') {
          app.user_id = doc.data().user_id
          app.userName = doc.data().userName
          app.userCountry = doc.data().userCountry

          if (this.props.appointmentType === 'next') {
            app.postponing = doc.data().postponing
            app.postponeBA = doc.data().postponeBA
            app.postponeBD = doc.data().postponeBD
            app.postponedBPto = doc.data().postponedBPto
            app.postponedBPfrom = doc.data().postponedBPfrom
            app.urgence2 = doc.data().urgence2
            app.pi_id = doc.data().pi_id
          }
        }

        else if (this.props.role === 'isAdmin') {
          app.doctor_id = doc.data().doctor_id
          app.user_id = doc.data().user_id
          app.doctorName = doc.data().doctorName
          app.doctorSpeciality = doc.data().doctorSpeciality
          app.userName = doc.data().userName
          app.userCountry = doc.data().userCountry

          if (this.props.appointmentType === 'next') {
            app.postponing = doc.data().postponing
            app.postponeBP = doc.data().postponeBP
            app.postponeBA = doc.data().postponeBA
            app.postponedBPto = doc.data().postponedBPto
            app.postponedBPfrom = doc.data().postponedBPfrom
            app.urgence2 = doc.data().urgence2

            //speciality in case of URG2
            if (doc.data().urgence2 && app.doctorName == '') {
              app.doctorName = 'Indéfini'
              app.doctorSpeciality = doc.data().speciality
            }
          }

        }

        appointments.push(app)
      })

      this.setState({ appointments })
    })
  }

  //Filter values
  loadFilterValues() {
    if (this.props.role === 'isPatient')
      this.loadDoctors()

    else if (this.props.role === 'isDoctor')
      this.loadPatients()

    // else if (this.props.role === 'isAdmin')
  }

  loadDoctors() {
    if (!this.state.doctorsLoaded) {

      let doctorNames = []
      let doctorSpecialities = []
      let doctorName = ''
      let doctorSpeciality = ''

      var query = REFS.users.doc(this.currentUser.uid)
      query.get().then((doc) => {
        const myDoctors = doc.data().myDoctors
        myDoctors.forEach((doctorId) => {
          REFS.doctors.doc(doctorId).get().then((doc) => {

            doctorName = doc.data().prenom + ' ' + doc.data().nom
            doctorSpeciality = doc.data().speciality

            if (!this.state.doctorNames.includes(doctorName))
              doctorNames.push(doctorName)

            if (!this.state.doctorSpecialities.includes(doctorSpeciality))
              doctorSpecialities.push(doctorSpeciality)

            // doctorNames = [...new Set(doctorNames)]
            // doctorSpecialities = [...new Set(doctorSpecialities)]

            this.setState({
              doctorNames: doctorNames,
              doctorSpecialities: doctorSpecialities,
              doctorsLoaded: true
            })
          })
        })
      })

    }
  }

  loadPatients() {
    if (!this.state.patientsLoaded) {
      let patientNames = []
      let patientsCountries = []
      let patientName = ''
      let patientCountry = ''

      var query = REFS.doctors.doc(this.currentUser.uid)
      query.get().then((doc) => {
        const myPatients = doc.data().myPatients
        myPatients.forEach((patientId) => {
          REFS.users.doc(patientId).get().then((doc) => {

            patientName = doc.data().prenom + ' ' + doc.data().nom
            patientCountry = doc.data().country

            if (!this.state.patientNames.includes(patientName))
              patientNames.push(patientName)

            if (!this.state.patientsCountries.includes(patientCountry))
              patientsCountries.push(patientCountry)

            // patientNames = [...new Set(patientNames)]
            // patientsCountries = [...new Set(patientsCountries)]

            this.setState({
              patientNames,
              patientsCountries,
              patientsLoaded: true
            })
          })
        })
      })

    }

  }

  //RightSideMenu functions
  toggleRightSideMenu = () => {
    this.month = ''
    this.setState({ isRightSideMenuVisible: !this.state.isRightSideMenuVisible, appId: null });
    this.loadFilterValues()
  }

  handleFilter = (inputList, outputList, fields, KEYS_TO_FILTERS) => {

    const { dateFrom, dateTo, appointmentState } = this.state

    outputList = inputList

    for (const field of fields) {
      outputList = outputList.filter(createFilter(field.value, field.label))
    }

    if (dateFrom) {
      outputList = outputList.filter((appointment) => {
        return (moment(moment(appointment.date).format('YYYY-MM-DD')).isAfter(dateFrom) || moment(moment(appointment.date).format('YYYY-MM-DD')).isSame(dateFrom))
      })
    }

    if (dateTo) {
      outputList = outputList.filter((appointment) => {
        return (moment(moment(appointment.date).format('YYYY-MM-DD')).isBefore(dateTo) || moment(moment(appointment.date).format('YYYY-MM-DD')).isSame(dateTo))
      })
    }

    // if (this.props.role === 'isAdmin' && this.props.appointmentType === 'next') {
    if (appointmentState === 'CBA') {
      outputList = outputList.filter((appointment) => {
        const predicate1 = appointment.state.CBA && !appointment.postponing && !appointment.postponeBP && !appointment.postponeBA && !appointment.postponeBD
        const predicate2 = appointment.state.CBA && appointment.postponing && appointment.postponeBP && !appointment.postponeBA && !appointment.postponeBD
        return (predicate1 || predicate2)
      })
    }

    else if (appointmentState === 'pending') {
      outputList = outputList.filter((appointment) => {
        return (!appointment.state.CBA || appointment.state.CBA && !appointment.postponeBA)
      })
    }

    return outputList
  }

  clearAllFilters = () => {
    this.setState({
      doctor: '', speciality: '', dateFrom: '', dateTo: '',
      patient: '', country: '',
      appointmentState: '',
      isRightSideMenuVisible: false
    })
  }

  //UI renderers

  renderRightSideMenu() {
    if (this.props.role === 'isPatient')
      return (
        <RightSideMenuPatient
          main={this}
          isSideMenuVisible={this.state.isRightSideMenuVisible}
          toggleSideMenu={this.toggleRightSideMenu}

          doctor={this.state.doctor}
          speciality={this.state.speciality}
          dateFrom={this.state.dateFrom}
          dateTo={this.state.dateTo}

          doctorNames={this.state.doctorNames}
          doctorSpecialities={this.state.doctorSpecialities}
          clearAllFilters={this.clearAllFilters} />
      )

    if (this.props.role === 'isDoctor')
      return (
        <RightSideMenuDoctor
          main={this}
          isSideMenuVisible={this.state.isRightSideMenuVisible}
          toggleSideMenu={this.toggleRightSideMenu}
          patient={this.state.patient}
          country={this.state.country}
          dateFrom={this.state.dateFrom}
          dateTo={this.state.dateTo}
          patientNames={this.state.patientNames}
          patientsCountries={this.state.patientsCountries}
          clearAllFilters={this.clearAllFilters} />
      )

    if (this.props.role === 'isAdmin')
      return (
        <RightSideMenuAdmin
          main={this}
          isSideMenuVisible={this.state.isRightSideMenuVisible}
          toggleSideMenu={this.toggleRightSideMenu}
          isNextAppointments={this.props.appointmentType === 'next' ? true : false}

          doctor={this.state.doctor}
          speciality={this.state.speciality}
          patient={this.state.patient}
          country={this.state.country}
          dateFrom={this.state.dateFrom}
          dateTo={this.state.dateTo}
          appointmentState={this.state.appointmentState}

          clearAllFilters={this.clearAllFilters} />
      )
  }

  renderHeader() {
    return (
      <View style={{ height: SCREEN_HEIGHT * 0.24, flexDirection: 'row', paddingTop: SCREEN_HEIGHT * 0.04, justifyContent: 'space-between', alignItems: 'flex-start' }}>

        <LeftSideMenu />

        <Image source={require('../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />

        <TouchableHighlight style={styles.filter_button}
          onPress={this.toggleRightSideMenu}>
          <FontAwesome name="filter" size={25} color="#93eafe" />
        </TouchableHighlight>
      </View >
    )
  }

  renderFooter() {
    if (this.props.role === 'isPatient')
      return (
        <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center' }}>
          <Button width={SCREEN_WIDTH * 0.87} text="Prendre un rendez-vous en urgence" onPress={() => this.props.navigation.navigate('Search', { isUrgence: true })} />
          <Button2 style={{ backgroundColor: "#ffffff", color: "#000000" }} text="Planifier une consultation" onPress={() => this.props.navigation.navigate('Search')} />
        </View>
      )

    else if (this.props.role === 'isDoctor')
      return (
        <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
          <Button width={SCREEN_WIDTH * 0.87} text="Voir mes patients" onPress={() => this.props.navigation.navigate('MyPatients')} />
        </View>
      )
  }

  setFilterFields() {
    const { doctor, speciality, patient, country, dateTo, dateFrom } = this.state

    let fields = []
    let KEYS_TO_FILTERS = []

    if (this.props.role === 'isPatient') {
      fields = [{ label: 'doctorName', value: doctor }, { label: 'doctorSpeciality', value: speciality }]
      KEYS_TO_FILTERS = ['doctorName', 'doctorSpeciality']
    }

    if (this.props.role === 'isDoctor') {
      fields = [{ label: 'userName', value: patient }, { label: 'userCountry', value: country }]
      KEYS_TO_FILTERS = ['userName', 'userCountry']
    }

    if (this.props.role === 'isAdmin') {
      fields = [{ label: 'doctorName', value: doctor }, { label: 'doctorSpeciality', value: speciality }, { label: 'userName', value: patient }, { label: 'userCountry', value: country }]
      KEYS_TO_FILTERS = ['userName', 'userCountry', 'doctorName', 'doctorSpeciality']
    }

    return { fields, KEYS_TO_FILTERS }
  }
 
  render() {
    const { appointments, isLoading } = this.state
    const { appId, ImageToShow, isModalImageVisible } = this.state
    const { documents, symptomes } = this.state

    this.filteredAppointments = appointments
    this.month = ''

    let fieldsAndKeys = this.setFilterFields()
    this.filteredAppointments = this.handleFilter(appointments, this.filteredAppointments, fieldsAndKeys.fields, fieldsAndKeys.KEYS_TO_FILTERS)

    const filterCount = this.filteredAppointments.length
    const appointmentsCount = appointments.length
    const filterActivated = filterCount < appointmentsCount

    return (
      <View style={styles.container}>

        {this.renderRightSideMenu()}

        <Header
          filter={
            <TouchableHighlight style={styles.filter_button}
              onPress={this.toggleRightSideMenu}>
              <FontAwesome name="filter" size={25} color="#93eafe" />
            </TouchableHighlight>
          } />

        {/*Display document on press*/}
        <ImageViewing
          images={[{ uri: this.state.ImageToShow }]}
          imageIndex={0}
          presentationStyle="overFullScreen"
          visible={this.state.isModalImageVisible}
          onRequestClose={() => this.setState({ isModalImageVisible: false })}
        />

        {isLoading ?
          <Loading />
          :
          <ScrollView style={styles.appointments_container_scrollview}>
            {filterActivated && <View style={{ backgroundColor: '#93eafe', justifyContent: 'center', alignItems: 'center', paddingVertical: 5 }}><Text style={{ fontWeight: 'bold', color: '#fff' }}>Filtre activé</Text></View>}

            {this.filteredAppointments.map((appointment) => {

              let dateComponent = null

              if (moment(appointment.date).format("MMMM") !== this.month || !this.month) {
                this.month = moment(appointment.date).format("MMMM")
                this.year = moment(appointment.date).format("YYYY")
                dateComponent = <Text style={{ fontWeight: 'bold', paddingLeft: SCREEN_WIDTH * 0.07, marginBottom: SCREEN_HEIGHT * 0.01, marginTop: SCREEN_HEIGHT * 0.015, color: 'gray' }}> {moment(appointment.date).format("MMMM")} {moment(appointment.date).format("YYYY")} </Text>
              }

              return <AppointmentItem
                main={this}
                type={this.props.appointmentType}
                appointment={appointment}
                appIdState={appId}
                dateComponent={dateComponent}
                role={this.props.role}
                documents={documents}
                symptomes={symptomes}
              />

            })}
          </ScrollView>
        }

        {!isLoading && this.renderFooter()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    role: state.roles.role,
  }
}

export default withNavigation(connect(mapStateToProps)(Appointments))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  logo_container: {
    flex: 0.3,
    //backgroundColor: 'green',
  },
  logoIcon: {
    height: SCREEN_WIDTH * 0.14,
    width: LOGO_WIDTH,
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
  },
  menu_button: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    left: SCREEN_WIDTH * 0.03,
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
    marginTop: SCREEN_HEIGHT * 0.1
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
})