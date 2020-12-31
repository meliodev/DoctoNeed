//Bugs: removed loadDoctors because it produces an error

import React from 'react'
import { View, Text, Image, Dimensions, TouchableHighlight, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import ImageViewing from "react-native-image-viewing";
import { createFilter } from 'react-native-search-filter';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/AntDesign';

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import { connect } from 'react-redux'

import { toggleLeftSideMenu, navigateToMedicalFolder, navigateToScreen, signOutUserandToggle } from '../../../Navigation/Navigation_Functions'
import { getMetaData } from '../../../functions/functions'

//Components
import LeftSideMenu from '../../../components/LeftSideMenu'
import RightSideMenu from '../../../components/RightSideMenu2'
import Button from '../../../components/Button';
import Button2 from '../../../components/Button2';

//Firebase
import firebase from 'react-native-firebase'
import { signOutUser } from '../../../DB/CRUD'
import * as REFS from '../../../DB/CollectionsRefs'

//Constants
const KEYS_TO_FILTERS_DOCTOR = ['doctorName'];
const KEYS_TO_FILTERS_SPECIALITY = ['doctorSpeciality'];
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.14 * ratioLogo;

class PreviousAppointments extends React.Component {
  constructor(props) {
    super(props);
    this.appointments = []
    this.month = ''
    this.year = 0
    this.itemHeight = SCREEN_HEIGHT * 0.13
    this.doctorName = ''
    this.doctorSpeciality = ''
    this.appointments = []

    //Appointment item
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

      doctor: '',
      speciality: '',
      dateFrom: '',
      dateTo: '',
      isDoctorSelected: false,
      isSpecialitySelected: false,
      isDateFromSelected: false,
      isDateFromToSelected: false,
      isLoading: false,

      //Appointment dynamic style: roll/unroll
      itemHeight: SCREEN_HEIGHT * 0.13,
      appId: null,

      //Appointment details
      symptomes: [],
      documents: [],
      video: '',
      isModalImageVisible: false,
      ImageToShow: '',

      //filters data from 'MyDoctors'
      doctorNames: [],
      doctorSpecialities: [],
      doctorsLoaded: false,
    }
  }

  loadDoctors() {
    if (!this.state.doctorsLoaded) {

      let doctorNames = []
      let doctorSpecialities = []
      let doctorName = ''
      let doctorSpeciality = ''

      var query = REFS.users.doc(firebase.auth().currentUser.uid)
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

  componentDidMount() {
    //Unroll Cards on tab change
    const { navigation } = this.props;
    navigation.addListener('willFocus', () => {
      this.setState({ appId: null })
      this.month = ''
    })

    //Get current user metadata
    getMetaData(this, 'isPatient')
  }

  // Load appointments
  loadAppointments() {

    var query = REFS.appointments
    query = query.where('user_id', '==', this.state.uid)
    query = query.where('finished', '==', true)
    query = query.orderBy('date', 'desc')

    query.onSnapshot(function (querySnapshot) {

      let appointments = []

      querySnapshot.forEach(doc => {

        let app = {
          id: doc.id,
          date: doc.data().date,
          state: doc.data().state,
          doctor_id: doc.data().doctor_id
        }

        appointments.push(app)
      })

      //Update Doctor Name and speciality
      this.setState({ appointments }, () => {

        this.appointments = this.state.appointments
        this.appointments.forEach((cons) => {

          REFS.doctors.doc(cons.doctor_id[0]).get()
            .then((doc) => {
              cons.doctorName = doc.data().name
              cons.doctorSpeciality = doc.data().speciality
            })
            .then(() => this.setState({ appointments: this.appointments }))

        })

      })

    }.bind(this))
  }

  //RightSideMenu functions
  toggleRightSideMenu = () => {
    this.month = ''
    this.setState({ isRightSideMenuVisible: !this.state.isRightSideMenuVisible, appId: null });
    this.loadDoctors()
  }

  //Filters data
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

  //appointment card: roll/unroll effect
  toggleAppointment(appId) {
    //Unroll
    if (appId !== this.state.appId) {
      this.month = ''
      if (this.itemHeight === SCREEN_HEIGHT * 0.35) {
        this.itemHeight = SCREEN_HEIGHT * 0.13
      }

      REFS.appointments.doc(appId).get().then((doc) => {
        this.setState({ appId: appId, symptomes: doc.data().symptomes, documents: doc.data().DocumentsRefs, video: doc.data().Video })
      })
    }

    //Roll
    else if (appId === this.state.appId) {
      this.month = ''
      this.setState({ appId: null })
      this.itemHeight = SCREEN_HEIGHT * 0.13
    }
  }

  defineItemStyle = (appId) => {

    if (appId === this.state.appId) {
      if (this.itemHeight === SCREEN_HEIGHT * 0.13)
        this.itemHeight = SCREEN_HEIGHT * 0.35

      else if (this.itemHeight === SCREEN_HEIGHT * 0.35)
        this.itemHeight = SCREEN_HEIGHT * 0.13


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
      }
    }
  }

  //appointment item functions
  displayDetails = (appId) => {
    this.props.navigation.navigate('AppointmentDetails', { appId: appId, noinput: true })
  }

  toggleModalImage(doc) {
    this.setState({ isModalImageVisible: !this.state.isModalImageVisible, ImageToShow: doc })
  }

  clearAllFilters = () => {
    this.setState({
      doctor: '', speciality: '', dateFrom: '', dateTo: '',
      isDoctorSelected: false, isSpecialitySelected: false,
      isDateFromSelected: false, isDateFromToSelected: false,
      isRightSideMenuVisible: false
    })
  }

  render() {
    this.filteredAppointments = this.state.appointments
    this.month = ''

    //Filtering...
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

    return (
      <View style={styles.container}>

        <LeftSideMenu
          isSideMenuVisible={this.state.isLeftSideMenuVisible}
          toggleSideMenu={() => toggleLeftSideMenu(this)}
          nom={this.state.nom}
          prenom={this.state.prenom}
          email={this.state.email}
          navigateToMedicalFolder={() => navigateToMedicalFolder(this, this.props)}
          navigateToAppointments={() => navigateToScreen(this, this.props, 'TabScreenPatient')}
          navigateToSearch={() => navigateToScreen(this, this.props, 'Search')}
          signOutUser={() => signOutUserandToggle(this)}
          navigation={this.props.navigation} />

        <RightSideMenu
          isSideMenuVisible={this.state.isRightSideMenuVisible}
          toggleSideMenu={this.toggleRightSideMenu}
          doctor={this.state.doctor}
          speciality={this.state.speciality}
          doctorNames={this.state.doctorNames}
          doctorSpecialities={this.state.doctorSpecialities}
          dateFrom={this.state.dateFrom}
          dateTo={this.state.dateTo}
          onSelectDoctor={this.onSelectFilter}
          onSelectSpeciality={this.onSelectFilter}
          onSelectDateFrom={this.onSelectFilter}
          onSelectDateTo={this.onSelectFilter}
          clearAllFilters={this.clearAllFilters} />

        <ImageViewing
          images={[{ uri: this.state.ImageToShow }]}
          imageIndex={0}
          presentationStyle="overFullScreen"
          visible={this.state.isModalImageVisible}
          onRequestClose={() => this.setState({ isModalImageVisible: false })}
        />

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

        {this.state.isLoading ?
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>
          :
          <ScrollView style={styles.appointments_container_scrollview}>
            {this.filteredAppointments.map(appointment => {

              let dateComponent = null

              if (moment(appointment.date).format("MMMM") !== this.month || !this.month) {
                this.month = moment(appointment.date).format("MMMM")
                this.year = moment(appointment.date).format("YYYY")
                dateComponent = <Text style={{ fontWeight: 'bold', paddingLeft: SCREEN_WIDTH * 0.07, marginBottom: SCREEN_HEIGHT * 0.01, marginTop: SCREEN_HEIGHT * 0.015, color: 'gray' }}> {moment(appointment.date).format("MMMM")} {moment(appointment.date).format("YYYY")} </Text>
              }

              return (
                <View>
                  {dateComponent}
                  <View style={this.defineItemStyle(appointment.id)}>
                    
                    <View style={itemStyle.main_container}>
                      <View style={itemStyle.dot_container}>


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
                            <Text style={{ fontSize: SCREEN_HEIGHT * 0.015, color: 'white', marginRight: SCREEN_WIDTH * 0.01 }}>Voir le rapport</Text>
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

                    {this.state.appId === appointment.id &&
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
                          {this.state.symptomes.length > 2 && <Text style={itemStyle.appDetailsText}>...</Text>}
                        </View>

                        <View style={itemStyle.appDetailsColumn}>
                          <Text style={itemStyle.appDetailsHeader}>Symptômes</Text>
                          {this.state.symptomes.slice(0, 2).map(symptom => {
                            return (<Text style={itemStyle.appDetailsText}>{symptom}</Text>)
                          })}

                          {this.state.symptomes.length > 2 && <Text style={itemStyle.appDetailsText}>...</Text>}
                        </View>

                      </View>
                    }

                  </View>
                </View>
              )
            })}
          </ScrollView>
        }

        <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center' }}>
          <Button width={SCREEN_WIDTH * 0.87} text="Prendre un rendez-vous en urgence" onPress={() => this.props.navigation.navigate('Search', { isUrgence: true })} />
          <Button2 style={{ backgroundColor: "#ffffff", color: "#000000" }} text="Planifier une consultation" onPress={() => this.props.navigation.navigate('Search')} />
        </View>
      </View>
    );
  } //MAKE THIS SCREEN REUSABLE BY OTHER ROLES
}

const mapStateToProps = (state) => {
  return {
    role: state.roles.role,
  }
}

export default connect(mapStateToProps)(PreviousAppointments)

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    //backgroundColor: 'green'
  },
  main_container: {
    height: SCREEN_HEIGHT * 0.1,
    justifyContent: 'center',
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


/*clearAllFilters = () => {
    this.setState({
      doctor: '', speciality: '', dateFrom: '', dateTo: '',
      isDoctorSelected: false, isSpecialitySelected: false, isDateFromSelected: false, isDateToSelected: false,
      isRightSideMenuVisible: false
    })
  }*/