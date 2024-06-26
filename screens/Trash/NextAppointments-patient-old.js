//Bugs: removed loadDoctors because it produces an error

import React from 'react'
import { View, Text, Image, Dimensions, TouchableHighlight, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native'
import ImageViewing from "react-native-image-viewing";

import { createFilter } from 'react-native-search-filter';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/AntDesign';

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')


import { connect } from 'react-redux'

import { toggleLeftSideMenu, navigateToMedicalFolder, navigateToScreen, signOutUserandToggle } from '../../Navigation/Navigation_Functions'
import { getMetaData } from '../../functions/functions'

//Components
import LeftSideMenu from '../../components/LeftSideMenu'
import RightSideMenu from '../../components/RightSideMenu2'
import Button from '../../components/Button';
import Button2 from '../../components/Button2';

//Firebase
import firebase from 'react-native-firebase'
import { signOutUser } from '../../DB/CRUD'
import * as REFS from '../../DB/CollectionsRefs'

//Constants
const functions = firebase.functions()

const KEYS_TO_FILTERS_DOCTOR = ['doctorName'];
const KEYS_TO_FILTERS_SPECIALITY = ['doctorSpeciality'];
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.14 * ratioLogo;


class NextAppointments extends React.Component {
  constructor(props) {
    super(props);
    this.appointments = []
    this.month = ''
    this.year = 0
    this.itemHeight = SCREEN_HEIGHT * 0.13
    this.doctorName = ''
    this.doctorSpeciality = ''
    this.consultations = []

    //Appointment card
    this.toggleAppointment = this.toggleAppointment.bind(this);
    this.defineItemStyle = this.defineItemStyle.bind(this);
    this.loadAppointments = this.loadAppointments.bind(this);
    this.displayDetails = this.displayDetails.bind(this);

    this.state = {
      isCanceling: false,
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

      var query = REFS.doctors
      query = query.where("myPatients", "array-contains", firebase.auth().currentUser.uid)
      query.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data().nom)
          doctorName = doc.data().prenom + ' ' + doc.data().nom
          doctorSpeciality = doc.data().speciality

          if (!this.state.doctorNames.includes(doctorName))
            doctorNames.push(doctorName)

          if (!this.state.doctorSpecialities.includes(doctorSpeciality))
            doctorSpecialities.push(doctorSpeciality)
        })

        //Remove duplicates
        doctorNames = [...new Set(doctorNames)]
        doctorSpecialities = [...new Set(doctorSpecialities)]

        this.setState({
          doctorNames: doctorNames,
          doctorSpecialities: doctorSpecialities,
          doctorsLoaded: true
        })

      })
        .catch(error => console.log('Error getting documents:' + error))
    }
  }

  componentDidMount() {
    //Unroll Cards on tab change
    const { navigation } = this.props;
    navigation.addListener('willFocus', async () => {
      await this.setState({ appId: null })
      this.month = ''
    });

    //Get current user metadata
    getMetaData(this, 'isPatient')
  }

  // Load appointments
  loadAppointments() {

    var query = REFS.appointments
    query = query.where('user_id', '==', this.state.uid)
    query = query.where('finished', '==', false)
    query = query.where('cancelBP', '==', false)
    query = query.orderBy('date', 'desc')

    query.onSnapshot(function (querySnapshot) {
      let appointments = []
      querySnapshot.forEach(doc => {
        let id = doc.id
        let date = doc.data().date
        let doctor_id = doc.data().doctor_id

        let state = doc.data().state
        let postponeBP = doc.data().postponeBP
        let postponeBD = doc.data().postponeBD
        let postponing = doc.data().postponing
        let urgence2 = doc.data().urgence2
        let pi_id = doc.data().pi_id

        //speciality in case of URG2
        let doctorSpeciality = ''
        if (doc.data().urgence2 === true)
          doctorSpeciality = doc.data().speciality

        let app = {
          id: id,
          date: date,
          state: state,
          doctor_id: doctor_id,
          doctorSpeciality: doctorSpeciality,
          postponeBP: postponeBP,
          postponeBD: postponeBD,
          postponing: postponing,
          urgence2: urgence2,
          pi_id: pi_id
        }

        appointments.push(app)
      })
      this.setState({ appointments: appointments }, () => {

        this.consultations = this.state.appointments

        this.consultations.forEach((cons) => {

          REFS.doctors.doc(cons.doctor_id[0]).get().then((doc) => {
            cons.doctorName = doc.data().name
            cons.doctorSpeciality = doc.data().speciality
          }).then(() => {
            this.setState({ appointments: this.consultations })
          })

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

  // louisanthony.kouassi@gmail.com A4oQiBZiDNRRNSozuPPoo1KHxZw1 Kouassi Louis
  // farhana348@yahoo.fr SYAL8d4unBUb39DUaFR7i01LmOP2 Farsi Farhana
  // christophe.caillet05@gmail.com  pfMXugnb2tVh51sOrJCKQwizaKH2 Christophe Caillet
  // pharmaciefarsi@yahoo.fr  qjCbP6UB5aV6Ipp4GYe92n1VQRd2

  // createCustomer() {
  //   const createStripeCustomer = functions.httpsCallable('createStripeCustomer2')
  //      createStripeCustomer({ email: 'christophe.caillet05@gmail.com', fullName: 'Christophe' + ' ' + 'Caillet', phone: '+33769289480 ', userId: 'pfMXugnb2tVh51sOrJCKQwizaKH2' })
  //     .then((response) => console.log(response))
  //     .catch((err) => console.error(err))
  // }

  //appointment card functions
  handlePostponeAppointment(appId) {
    this.props.navigation.navigate('Booking', { appId: appId })
  }

  //Done on cloud (webhook)
  handleCancelAppointment(pi_id) {
    this.setState({ isCanceling: true })

    const refundPayment = functions.httpsCallable('refundPayment')
    refundPayment({ pi_id: pi_id }).then((response) => {
      console.log(response)
      if (response.data.refunded)
        alert('La consultation a été annulée. Vous serez remboursé pendant les prochaines 48h.')
      else if (response.data.code && response.data.code === "charge_already_refunded")
        alert('Le remboursement devrait être effectué pendant les prochaines 48h, veuillez vérifier la balance de votre carte.')

      else if (response.data.error)
        alert(response.data.error)

    })
      .catch((err) => {
        console.log('error')
        console.error(err)
      })
      .finally(() => {
        this.setState({ isCanceling: false, appId: null })
      })

    //Cancel appointment(canceledByPatient = true) & get refund 
    //if logged in
    //if allowed user 
    //if finished = false
    //if refunded !== true //prevent re-refunding
    //stripe.refund(paymentintent) & onsuccess: paymentIntent.update({refunded: true, amount_refunded: refund.X})

    // REFS.appointments.doc(appId).get().then((doc1) => {
    //   REFS.doctors.doc(doc1.data().doctor_id).collection('DoctorSchedule').where('ts', '==', date).get().then(querySnapshot => {

    //     querySnapshot.forEach(doc => {
    //       REFS.doctors.doc(doc1.data().doctor_id).collection('DoctorSchedule').doc(doc.id).update({ paid: false })
    //         .then(() => console.log('document has been updated: paid = false'))
    //         .catch((err) => console.error(err))
    //     })

    //   }).then(() => console.log('document has been retrieved to be updated'))
    //     .catch((err) => console.error(err))

    // })

    // REFS.appointments.doc(appId).update({ cancelBP: true }).then(() => {
    //   this.setState({ appId: null })
    //   alert('Votre rendez-vous a été annulé.')
    // })
  }

  displayDetails = (appId) => {
    this.props.navigation.navigate('AppointmentDetails', { appId: appId })
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
    console.log(this.state.doctorNames)
    // console.log('lenght: '+ (this.state.symptomes.length > 2))
    this.filteredAppointments = this.state.appointments
    this.month = ''
    let images = [
      {
        uri: this.state.ImageToShow,
      }
    ]

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


        {/*
        <View style={styles.header_container}>
          <Text style={styles.header}>Mes consultations passées</Text>
          <Text style={{ color: 'gray', fontSize: SCREEN_HEIGHT * 0.0115 }}>( 18 derniers mois )</Text>
        </View> */}

        {this.state.isLoading || this.state.isCanceling
          ? <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>

          :

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
                    <View style={itemStyle.main_container}>
                      <View style={itemStyle.dot_container}>

                      </View>

                      <View style={itemStyle.date_container}>
                        <Text style={itemStyle.date_day}>{moment(appointment.date).format("Do")}</Text>
                      </View>

                      <View style={itemStyle.titles_container}>
                        <Text style={itemStyle.title_text}>Médecin</Text>
                        <Text style={itemStyle.title_text}>Spécialité</Text>
                        {appointment.urgence2 === true ?
                          <Text style={itemStyle.title_text}>Type</Text>
                          :
                          <Text style={itemStyle.title_text}>Heure</Text>
                        }
                      </View>

                      <View style={itemStyle.data_container}>
                        <Text style={itemStyle.data_text}>{appointment.doctorName}</Text>
                        <Text style={itemStyle.data_text}>{appointment.doctorSpeciality}</Text>
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


                    {this.state.appId === appointment.id && appointment.postponing === false ?  //&& !appointment.state.includes('CBA')
                      <View style={itemStyle.confirmButton_container}>
                        <Button
                          width={SCREEN_WIDTH * 0.35}
                          paddingTop={0}
                          paddingBottom={0}
                          text="Annuler"
                          onPress={() => this.handleCancelAppointment(appointment.pi_id)} />


                        {appointment.postponeBD === false ? // Can postpone only one time...
                          <Button
                            width={SCREEN_WIDTH * 0.35}
                            paddingTop={0}
                            paddingBottom={0}
                            text="Reporter"
                            onPress={() => this.handlePostponeAppointment(appointment.id)} />
                          :
                          <View style={{
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
                          }}>
                            <Text style={{
                              fontSize: SCREEN_HEIGHT * 0.021,
                              fontWeight: 'bold',
                              fontFamily: 'Avenir',
                              textAlign: 'center',
                              margin: SCREEN_HEIGHT * 0.012,
                              color: '#ffffff',
                              backgroundColor: 'transparent',
                            }}>Reporter</Text>
                          </View>}

                      </View>
                      : null}

                    {this.state.appId === appointment.id && appointment.postponing === true ?  //&& !appointment.state.includes('CBA')
                      <View style={itemStyle.confirmButton_container}>
                        <Text>Cette consultation est en cours de modification.</Text>
                      </View>
                      : null}

                  </View>
                </View>
              )
            })}
          </ScrollView>
        }
        <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center' }}>
          {!this.state.isCanceling &&
            <Button width={SCREEN_WIDTH * 0.87} text="Prendre un rendez-vous en urgence" onPress={() => this.props.navigation.navigate('Search', { isUrgence: true })} />
          }
          {!this.state.isCanceling &&
            <Button2 style={{ backgroundColor: "#ffffff", color: "#000000" }} text="Planifier une consultation" onPress={() => this.props.navigation.navigate('Search')} />
          }
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    role: state.roles.role,
  }
}

export default connect(mapStateToProps)(NextAppointments)

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
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH,
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