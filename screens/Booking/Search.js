
import React from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet, TextInput, Picker } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Feather';
import { ScrollView } from 'react-native-gesture-handler';
import { createFilter } from 'react-native-search-filter';
import Button from '../../components/Button';
import Modal from "react-native-modal";
import { CheckBox } from 'native-base';

import moment from 'moment'
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')

import DoctorItem from '../../components/DoctorItem'
import RightSideMenu from '../../components/RightSideMenu1'
import EmptyList from '../../components/EmptyList'

import firebase from 'react-native-firebase';
import * as REFS from '../../DB/CollectionsRefs'

import { connect } from 'react-redux'
import { Alert } from 'react-native';

const KEYS_TO_FILTERS_COUNTRY = ['country'];
const KEYS_TO_FILTERS_URGENCES = ['urgences'];
const KEYS_TO_FILTERS_SPECIALITY = ['speciality'];
const KEYS_TO_FILTERS = ['name', 'speciality'];

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.15 * ratioLogo;

const specialities = ['Médecin généraliste', 'Pédiatre', 'Psychologue', 'Ophtalmologue', 'Rhumatologue']

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.filteredDoctors = []
    this.isUrgence = false
    this.doctorList = []
    this.appId = ''

    this.isUrgence = this.props.navigation.getParam('isUrgence', false)
    this.urgenceSpeciality = this.props.navigation.getParam('urgenceSpeciality', '')
    this.appId = this.props.navigation.getParam('appId', '')

    this.toggleModalUrgence = this.toggleModalUrgence.bind(this);
    this.countryPlaceHolder = this.countryPlaceHolder.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.inviteDoctors = this.inviteDoctors.bind(this);

    this.state = {
      isLoading: false,
      doctorList: [],
      searchTerm: '',

      //Filters
      country: "",
      urgences: "",
      speciality: "",
      price: 100,
      isCountrySelected: false,
      isUrgencesSelected: false,
      isSpecialitySelected: false,
      isPriceSelected: false,

      nextAvailableTime: '',
      noDoctors: true,

      //patient: URG2
      isModalUrgenceVisible: false,
      urgenceSpeciality: '',

      //admin: URG2
      selectedDoctors: []
    }
  }

  componentDidMount() {
    this.loadDoctors()
  }

  loadDoctors() {
    this.setState({ isLoading: true })

    REFS.doctors.get().then(querySnapshot => {
      let doctorList = []

      querySnapshot.forEach(async doc => {
        let doctor = {
          id: '',
          name: '',
          timeLeft: '',
          urgences: false,
        }

        doctor = doc.data()
        doctor.id = doc.id
        doctor.isSelected = false  //Urgence2: Admin select doctors 

        //Retrieve the next available timeslot for each doctor
        let maxTimeLeft = 31
        let timeLeft = ''
        let status = ''

        const response = await this.findNextAvailability(doc.id, maxTimeLeft)

        console.log(response.nextAvailableTime)
        if (response.nextAvailableTime)
          timeLeft = this.calculateTimeLeft(response.nextAvailableTime) //time left for next appointment

        doctor.timeLeft = timeLeft
        doctor.status = response.status
        doctorList.push(doctor)

        this.setState({ doctorList })
      })

    }).then(() => this.setState({ isLoading: false }))
  }

  //Check today next availability
  async findNextAvailability(doctorId, maxTimeLeft) {
    const today = moment().format('LL')

    return REFS.doctors.doc(doctorId).collection('DoctorSchedule').where('date', '==', today).get().then(querySnapshot => {
      let nextAvailableTime = ''

      //Pas de calendrier
      if (querySnapshot.empty) {
        return { nextAvailableTime, status: 'Indisponible' } //Indisponible (no schedule available)
      }

      //Aucun créneau aujourd'hui
      const doc = querySnapshot.docs[0]
      const todaySchedule = doc.data()
      if (!todaySchedule.available) {
        return { nextAvailableTime, status: "Indisponible aujourd'hui" } //Indisponible aujourd'hui
      }

      //Disponible aujourd'hui
      let timeslots = todaySchedule.timeslots.filter((item) => item.paid === false && moment(item.timeslot).isAfter(moment()))
      timeslots = timeslots.map((item) => item.timeslot)

      //Aucun créneau ajourd'hui (pendant les heures qui viennent)
      if (timeslots.length === 0) {
        return { nextAvailableTime, status: "Indisponible aujourd'hui" }
      }

      nextAvailableTime = timeslots[0]
      let i = 1

      while (i < timeslots.length) {
        if (moment(timeslots[i]).isBefore(moment(nextAvailableTime)))
          nextAvailableTime = moment(timeslots[i])
        i = i + 1
      }

      //Disponible
      return { nextAvailableTime: nextAvailableTime, status: "Disponible" }

    })

  }

  calculateTimeLeft(nextAvailableTime) {
    let now = moment().format()
    nextAvailableTime = moment(nextAvailableTime).format()
    const timeLeft = moment.utc(moment(nextAvailableTime).diff(moment(now))).format("HH:mm")
    return timeLeft
  }

  countryPlaceHolder = () => {
    return this.state.country ? <Text style={styles.pays1}> {this.state.country} </Text> : <Text style={styles.placeHolder}> Choisir un pays </Text>
  }

  displayDoctorDetails(doctor) {
    this.props.navigation.navigate('DoctorFile', { doctor: doctor, isUrgence: this.isUrgence, doctorStatus: doctor.status })
  }

  //Patient functions: URG2
  toggleModalUrgence() {
    this.setState({ isModalUrgenceVisible: !this.state.isModalUrgenceVisible })
  }

  handleConfirm() {
    this.setState({ isModalUrgenceVisible: false }, () =>
      this.props.navigation.navigate('Symptomes', {
        doctorId: '',
        isUrgence: true,
        speciality: this.state.urgenceSpeciality,
        date: moment().startOf('day').format()
      })
    )
  }

  //Admin functions: URG2 
  selectDoctor(doctorId) {
    this.filteredDoctors.forEach((doc) => {
      if (doc.id === doctorId) {
        doc.isSelected = !doc.isSelected
        this.forceUpdate()
      }
    })
  }

  async inviteDoctors() {
    let doctorsId = []
    this.filteredDoctors.forEach((doc) => {
      if (doc.isSelected)
        doctorsId.push(doc.id)
    })

    if (doctorsId === []) return

    await REFS.appointments.doc(this.appId).update({ doctor_id: doctorsId, state: { CBP: true, CBA: true, CBD: false } })
    Alert.alert('', 'Les médecins que vous avez selectionné ont reçu une demande de confirmation de rendez-vous avec succès ! Le premier ayant confirmer prendra en charge le rendez-vous.')
    this.props.navigation.navigate('TabScreenAdmin')
  }

  //Handle filters
  filterDoctors(doctorList) {
    const { country, urgences, speciality, price, searchTerm } = this.state

    this.filteredDoctors = doctorList

    const fields = [{ label: 'country', value: country }, { label: 'urgences', value: urgences }, { label: 'speciality', value: speciality }]
    const KEYS_TO_FILTERS = ['country', 'urgences', 'speciality']
    this.filteredDoctors = this.handleFilter(doctorList, this.filteredDoctors, fields, searchTerm, KEYS_TO_FILTERS)

    if (this.urgenceSpeciality !== '')
      this.filteredDoctors = this.filteredDoctors.filter((doctor) => { return doctor.speciality === this.urgenceSpeciality })

    if (this.isUrgence)
      this.filteredDoctors = this.filteredDoctors.filter((doctor) => { return doctor.timeLeft !== 'Invalid date' })
  }

  handleFilter = (inputList, outputList, fields, searchTerm, KEYS_TO_FILTERS) => {

    const { price } = this.state

    outputList = inputList

    for (const field of fields) {
      outputList = outputList.filter(createFilter(field.value, field.label))
    }

    if (price) {
      outputList = outputList.filter((doctor) => {
        if (this.isUrgence)
          return (doctor.urgencePrice <= price)
        else
          return (doctor.regularPrice <= price)
      })
    }

    outputList = outputList.filter(createFilter(searchTerm, KEYS_TO_FILTERS))

    return outputList
  }

  renderFiltersApplied() {
    return (
      <View style={styles.filters_selected_container}>
        {this.state.country !== '' &&
          <TouchableOpacity style={styles.filterItem} onPress={() => this.setState({ country: '' })}>
            <Text style={styles.filterItem_text}>Pays</Text>
            <Icon name="close"
              //size= {20}
              color="#93eafe" />
          </TouchableOpacity>
        }

        {/* {this.state.urgences !== '' &&
      <TouchableOpacity style={styles.filterItem}>
        <Text style={styles.filterItem_text}>Urgences</Text>
        <Icon name="close"
          size={SCREEN_WIDTH * 0.05}
          color="#93eafe"
          onPress={() => this.setState({ urgences: '' })} />
      </TouchableOpacity>
    } */}

        {this.state.speciality !== '' &&
          < TouchableOpacity style={styles.filterItem} onPress={() => this.setState({ speciality: '' })}>
            <Text style={styles.filterItem_text}>Specialité</Text>
            <Icon name="close"
              size={SCREEN_WIDTH * 0.05}
              color="#93eafe" />
          </TouchableOpacity>
        }

        {this.state.price < 100 &&
          <TouchableOpacity style={styles.filterItem} onPress={() => this.setState({ price: 100 })}>
            <Text style={styles.filterItem_text}>Tarifs</Text>
            <Icon name="close"
              size={SCREEN_WIDTH * 0.05}
              color="#93eafe" />
          </TouchableOpacity>
        }
      </View>
    )
  }

  render() {
    const { doctorList } = this.state
    this.filterDoctors(doctorList)

    return (
      <View style={styles.container}>

        {/* Search Bar + Filter button */}
        <View style={styles.search_container}>
          <View style={styles.search_button}>
            <Icon name="search" size={20} color="#afbbbc" style={{ flex: 0.07, paddingRight: 1 }} />
            <TextInput
              style={{ flex: 0.93 }}
              onChangeText={(term) => this.setState({ searchTerm: term })}
              placeholder="Rechercher un médecin ou une spécialité"
            />
          </View>

          <RightSideMenu
            main={this}
            countryPlaceHolder={this.countryPlaceHolder()}
            speciality={this.state.speciality}
            price={this.state.price} />
        </View>

        {/* Display the filters applied */}
        {this.renderFiltersApplied()}

        {/* Doctors List */}
        {this.state.isLoading ?
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>
          :
          this.filteredDoctors.length > 0 ?
            <ScrollView style={styles.doctorList_container} contentContainerStyle={{ paddingTop: 5 }}>

              {this.filteredDoctors.map((doctor, key) => {
                return (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingLeft: 5 }}>
                    {/* Admin: URG2: doctors selection */}
                    {this.urgenceSpeciality !== '' &&
                      <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                        title='check box'
                        checked={doctor.isSelected}
                        onPress={() => this.selectDoctor(doctor.id)} />}

                    <DoctorItem
                      doctor={doctor}
                      itemWidth={this.urgenceSpeciality === '' ? SCREEN_WIDTH * 0.95 : SCREEN_WIDTH * 0.8}
                      displayDoctorDetails={() => this.displayDoctorDetails(doctor)} />
                  </View>
                )
              })}

            </ScrollView>
            :
            <EmptyList iconName='account-search' header={this.isUrgence ? 'Aucun médecin disponible pour un rendez-vous en urgence' : 'Aucun médecin disponible'} description='' />
        }

        {/* URG2: Patient interface */}
        {this.isUrgence && this.props.role === 'isPatient' &&
          <View style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SCREEN_HEIGHT * 0.025 }}>
            <Button width={SCREEN_WIDTH * 0.7} text="Rendez-vous en urgence par choix de spécialité" onPress={this.toggleModalUrgence} />

            <TouchableOpacity style={{ marginLeft: SCREEN_WIDTH * 0.025, marginTop: SCREEN_HEIGHT * 0.02 }} onPress={() => alert('Explication du concept de la prise de rendez-vous en urgence par choix de spécialité...')}>
              <Icon1 name="info" size={20} color="#8febfe" />
            </TouchableOpacity>
          </View>}

        <Modal
          isVisible={this.state.isModalUrgenceVisible}
          onBackdropPress={() => this.setState({ isModalUrgenceVisible: false })}
          animationIn="fadeInUp"
          animationOut="fadeInDown"
          onSwipeComplete={() => this.setState({ isModalUrgenceVisible: false })}
          // swipeDirection="right"
          style={{ backgroundColor: 'white', height: 100, maxHeight: SCREEN_HEIGHT * 0.35, marginTop: SCREEN_HEIGHT * 0.35, width: SCREEN_WIDTH * 0.9 }}>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', alignSelf: 'center', fontSize: 18, marginBottom: SCREEN_HEIGHT * 0.033 }}>Choix de spécialité</Text>

            <View style={styles.picker_container} >
              <Picker selectedValue={this.state.urgenceSpeciality} onValueChange={(value) => this.setState({ urgenceSpeciality: value })} style={{ flex: 1, color: '#445870', width: SCREEN_WIDTH * 0.8, textAlign: "center" }}>
                <Picker.Item value='' label='Selectionnez une spécialité' />
                {specialities.map((spec, key) => {
                  return (<Picker.Item key={key} value={spec} label={spec} />);
                })}
              </Picker>
            </View>

            <Button
              style={{ marginBottom: 100 }}
              width={SCREEN_WIDTH * 0.8}
              paddingTop={0}
              paddingBottom={0}
              text="Confirmer"
              onPress={this.handleConfirm} />
          </View>

        </Modal>

        {/* URG2: Admin interface */}
        { this.isUrgence && this.props.role === 'isAdmin' &&
          <View style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Button width={SCREEN_WIDTH * 0.7} text="Inviter les médecins" onPress={this.inviteDoctors} />
          </View>
        }
      </View >
    );
  }
}


const mapStateToProps = (state) => {
  return {
    role: state.roles.role,
  }
}

export default connect(mapStateToProps)(Search)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // logo_container: {
  //   flex: 0.3,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'orange',
  // },
  // logoIcon: {
  //   height: SCREEN_WIDTH * 0.15,
  //   width: LOGO_WIDTH,
  //   marginTop: SCREEN_WIDTH * 0.05
  // },
  search_container: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // backgroundColor: 'green',
  },
  search_button: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffff',
    borderRadius: 50,
    paddingLeft: SCREEN_WIDTH * 0.02,
    paddingRight: SCREEN_WIDTH * 0.02,
    width: SCREEN_WIDTH * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 3,
    marginTop: SCREEN_HEIGHT * 0.01,
    marginBottom: SCREEN_HEIGHT * 0.01,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  placeHolder: {
    color: '#d5d5d5',
    fontSize: SCREEN_HEIGHT * 0.015
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  filters_selected_container: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'brown'
  },
  filterItem: {
    width: SCREEN_WIDTH * 0.21,
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: SCREEN_WIDTH * 0.03,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    marginLeft: SCREEN_WIDTH * 0.03,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filterItem_text: {
    fontSize: SCREEN_HEIGHT * 0.013
  },
  doctorList_container: {
    flex: 1,
    // backgroundColor: 'yellow'
  },
  loading_container: {
    flex: 1,
    justifyContent: 'center'
  },
  picker_container: {
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.8,
    paddingLeft: 20,
    paddingRight: 10,
    marginBottom: SCREEN_HEIGHT * 0.03
  }
});
