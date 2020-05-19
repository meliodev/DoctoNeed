
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

import firebase from 'react-native-firebase';
import * as REFS from '../../DB/CollectionsRefs'

const KEYS_TO_FILTERS_COUNTRY = ['country'];
const KEYS_TO_FILTERS_URGENCES = ['urgences'];
const KEYS_TO_FILTERS_SPECIALITY = ['speciality'];
const KEYS_TO_FILTERS = ['name', 'speciality'];

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

const specialities = ['Ophtalmologue', 'Médecin généraliste', 'Psychologue', 'Cardiologue', 'Rhumatologue', 'Neurologue', 'Gynécologue']

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.filteredDoctors1 = []
    this.isUrgence = false
    this.urgenceSpeciality = ''
    this.nextAvailableTime = ''
    this.doctorList = []
    this.doctorItemWidth = SCREEN_WIDTH * 0.95
    this.appId = ''

    this.toggleUrgence = this.toggleUrgence.bind(this);
    this.toggleModalUrgence = this.toggleModalUrgence.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.countryPlaceHolder = this.countryPlaceHolder.bind(this);
    this.inviteDoctors = this.inviteDoctors.bind(this);

    this.state = {
      isLoading: false,
      doctorList: [],
      searchTerm: '',

      //Filters
      isSideMenuVisible: false,
      country: "",
      urgences: "",
      speciality: "",
      price: 50,
      isCountrySelected: false,
      isUrgencesSelected: false,
      isSpecialitySelected: false,
      isPriceSelected: false,

      nextAvailableTime: '',
      noDoctors: true,

      //patient: URG2
      isModalUrgenceVisible: false,
      selectedSpeciality: '',

      //admin: URG2
      selectedDoctors: []
    }
  }

  componentDidMount() {
    this.displayLoading()

    this.isUrgence = this.props.navigation.getParam('isUrgence', '')
    this.urgenceSpeciality = this.props.navigation.getParam('urgenceSpeciality', '')
    this.appId = this.props.navigation.getParam('appId', '')

    if (this.urgenceSpeciality !== '')
      this.doctorItemWidth = SCREEN_WIDTH * 0.7

    this._loadDoctors()
  }

  displayLoading() {
    this.setState({ isLoading: true }, () => setTimeout(() => this.setState({ isLoading: false }), 1315))
  }

  //Load doctors data
  _loadDoctors() {
    let doctor = {
      uid: '',
      name: '',
      timeLeft: '',
      urgences: false,
    }

    //this.setState({ isLoading: true })

    REFS.doctors.get().then(querySnapshot => {

      querySnapshot.forEach(doc => {
        let maxTimeLeft = 5  //The value 60 slows down the doctor loading.. Solution: retrieve only the doctors available in the next 30min

        if (this.isUrgence === true) {
          maxTimeLeft = 31
        }

        //Retrieve the next available timeslot for each doctor
        this.findNextAvailability(doc.id, maxTimeLeft).then(() => {
          const id = doc.id
          doctor = doc.data()
          doctor.uid = id
          doctor.isSelected = false


          //Disponible dans X min: Fin X for each doctor
          let timeLeft = this.calculateTimeLeft(this.nextAvailableTime)
          doctor.timeLeft = timeLeft

          this.doctorList.push(doctor)
          this.setState({ doctorList: this.doctorList })
        })
      })

    }) //.then(() => this.setState({ isLoading: false }))
      .catch(error => console.log('Error getting doctors data:' + error))
  }

  async findNextAvailability(doctorId, maxTimeLeft) {

    await REFS.doctors.doc(doctorId).collection('DoctorSchedule').get().then(querySnapshot => {

      let currentDay = moment().seconds(0).milliseconds(0).format()

      let currentTime = ''
      let docTime = ''
      let nextAvailableTime = ''

      for (let m = 0; m < maxTimeLeft; m++) {

        if (nextAvailableTime === '') {

          currentTime = moment(currentDay).format()

          querySnapshot.forEach(doc => {
            docTime = moment(doc.data().ts).format()

            if (currentTime === docTime && doc.data().paid === false) {

              if (nextAvailableTime === '') {
                nextAvailableTime = docTime
                this.nextAvailableTime = docTime
              }

            }
          })

          currentDay = moment(currentDay).add(1, 'minutes').format()
        }

      }
    })

  }

  calculateTimeLeft(nextAvailableTime) {
    let nextTimeslot = moment(nextAvailableTime).format()
    let now = moment().format()
    let timeLeft = ''

    timeLeft = moment.utc(moment(nextTimeslot).diff(moment(now))).format("mm")
    return timeLeft
  }

  //Search bar
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  //Filters: Get data
  toggleSideMenu = () => {
    this.setState({ isSideMenuVisible: !this.state.isSideMenuVisible });
  }

  onSelectCountry = (childData) => {
    this.setState({ country: childData.name, isCountrySelected: true })
  }

  countryPlaceHolder = () => {
    return this.state.country ? <Text style={styles.pays1}> {this.state.country} </Text> : <Text style={styles.placeHolder}> Choisir un pays </Text>
  }

  onSelectSpeciality = (speciality) => {
    if (speciality === "")
      this.setState({ speciality: speciality, isSpecialitySelected: false })
    else
      this.setState({ speciality: speciality, isSpecialitySelected: true })
  }

  onSelectPriceMax = (value) => {
    this.setState({ price: value, isPriceSelected: true })
  }

  toggleUrgence = () => {
    if (this.state.urgences === 'true' || this.state.urgences === '')
      this.setState({ urgences: 'false', isUrgencesSelected: false })
    if (this.state.urgences === 'false' || this.state.urgences === '')
      this.setState({ urgences: 'true', isUrgencesSelected: true })
  }

  //Filters: filtering...
  filter(filteredDoctors1, field, isUrgence, keysToFilters) {
    if (field === 'price')
      return filteredDoctors1.filter((doctor) => { return doctor.price <= this.state.price })

    else
      return filteredDoctors1.filter(createFilter(field, keysToFilters))
  }

  filterDoctors(country, urgences, speciality) {
    this.filteredDoctors1 = this.state.doctorList

    this.filteredDoctors1 = this.filter(this.filteredDoctors1, 'price')

    if (country) {
      this.filteredDoctors1 = this.filter(this.filteredDoctors1, country, KEYS_TO_FILTERS_COUNTRY)
    }
    if (urgences === 'true') {
      this.filteredDoctors1 = this.filter(this.filteredDoctors1, speciality, KEYS_TO_FILTERS_URGENCES)
    }
    if (speciality) {
      this.filteredDoctors1 = this.filter(this.filteredDoctors1, speciality, KEYS_TO_FILTERS_SPECIALITY)
    }

    if (this.isUrgence === true) {
      this.filteredDoctors1 = this.filteredDoctors1.filter((doctor) => { return doctor.timeLeft !== 'Invalid date' })
    }

    this.filteredDoctors1 = this.filteredDoctors1.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

    /*URG2: show only doctors with the chosen speciality*/
    if (this.urgenceSpeciality !== '') {
      this.filteredDoctors1 = this.filteredDoctors1.filter((doctor) => {
        return doctor.speciality === this.urgenceSpeciality
      })
    }
  }

  //handle doctor click
  onDoctorClick(doctor) {
    this.props.navigation.navigate('Booking', { doctorId: doctor.uid, isUrgence: this.isUrgence })
  }

  displayDoctorDetails(doctor) {
    this.props.navigation.navigate('DoctorFile', { doctor: doctor, isUrgence: this.isUrgence })
  }

  //Patient functions: URG2
  toggleModalUrgence() {
    this.setState({ isModalUrgenceVisible: !this.state.isModalUrgenceVisible })
  }

  handleConfirm() {
    this.setState({ isModalUrgenceVisible: !this.state.isModalUrgenceVisible }, () =>
      this.props.navigation.navigate('Symptomes', { isUrgence: true, doctorId: '', speciality: this.state.selectedSpeciality, date: moment().startOf('day').format() })
    )

  }

  //Admin functions: URG2 
  selectDoctor(doctorId) {
    this.filteredDoctors1.forEach((doc) => {
      if (doc.uid === doctorId) {
        doc.isSelected = !doc.isSelected
        this.forceUpdate()
      }
    })
  }

  inviteDoctors() {
    let doctorsId = []
    this.filteredDoctors1.forEach((doc) => {
      if (doc.isSelected === true) {
        doctorsId.push(doc.uid)
      }
    })

    REFS.appointments.doc(this.appId).update({ doctor_id: doctorsId, state: { CBA: true } }).then(() => {
      alert('Les médecins que vous avez selectionné ont reçu une demande de confirmation de rendez-vous avec succès !')
      this.props.navigation.navigate('TabScreenAdmin')
    })
  }

  render() {
    console.log('loading: ' + this.state.isLoading)
    this.filterDoctors(this.state.country, this.state.urgences, this.state.speciality)

    return (

      <View style={styles.container}>

        <RightSideMenu
          isSideMenuVisible={this.state.isSideMenuVisible}
          toggleSideMenu={this.toggleSideMenu}
          isUrgence={this.isUrgence}
          countryPlaceHolder={this.countryPlaceHolder()}
          toggleUrgence={this.toggleUrgence}
          urgences={this.state.urgences}
          price={this.state.price}
          onSelectCountry={this.onSelectCountry}
          onSelectSpeciality={this.onSelectSpeciality}
          onSelectPriceMax={this.onSelectPriceMax} />

        <View style={styles.logo_container}>
          <Image source={require('../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
        </View>

        {/* Search Bar + Filter button */}
        <View style={styles.search_container}>
          <View style={styles.search_button}>
            <Icon name="search" size={20} color="#afbbbc" style={{ flex: 0.07, paddingRight: 1 }} />
            <TextInput
              style={{ flex: 0.93 }}
              onChangeText={(term) => { this.searchUpdated(term) }}
              placeholder="Rechercher un médecin ou une spécialité"
            />
          </View>

          <TouchableOpacity style={styles.filter_button}
            onPress={this.toggleSideMenu}>
            <Icon name="filter" size={25} color="#93eafe" />
          </TouchableOpacity>
        </View>

        {/* Display the filters applied */}
        <View style={styles.filters_selected_container}>
          {this.state.isCountrySelected ?
            <View style={styles.filterItem}>
              <Text style={styles.filterItem_text}>Pays</Text>
              <Icon name="close"
                //size= {20}
                color="#93eafe"
                onPress={() => this.setState({ country: '', isCountrySelected: false })} />
            </View>
            : null}

          {this.state.isUrgencesSelected ?
            <View style={styles.filterItem}>
              <Text style={styles.filterItem_text}>Urgences</Text>
              <Icon name="close"
                size={SCREEN_WIDTH * 0.05}
                color="#93eafe"
                onPress={() => this.setState({ urgences: '', isUrgencesSelected: false })} />
            </View>
            : null}

          {this.state.isSpecialitySelected ?
            <View style={styles.filterItem}>
              <Text style={styles.filterItem_text}>Specialité</Text>
              <Icon name="close"
                size={SCREEN_WIDTH * 0.05}
                color="#93eafe"
                onPress={() => this.setState({ speciality: '', isSpecialitySelected: false })} />
            </View>
            : null}

          {this.state.isPriceSelected ?
            <View style={styles.filterItem}>
              <Text style={styles.filterItem_text}>Tarifs</Text>
              <Icon name="close"
                size={SCREEN_WIDTH * 0.05}
                color="#93eafe"
                onPress={() => this.setState({ price: 50, isPriceSelected: false })} />
            </View>
            : null}
        </View>

        {/* Doctors List */}

        {this.state.isLoading === true ?
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>
          :
          <ScrollView style={styles.doctorList_container} >

            {this.filteredDoctors1.map((doctor, key) => {
              return (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingLeft: 5 }}>
                  {/* Admin: URG2: doctors selection */}
                  {this.urgenceSpeciality !== '' &&
                    <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                      title='check box'
                      checked={doctor.isSelected}
                      onPress={() => this.selectDoctor(doctor.uid)} />}

                  <DoctorItem
                    doctor={doctor}
                    itemWidth={this.doctorItemWidth}
                    timeLeft={doctor.timeLeft}
                    displayDoctorCalendar={() => this.onDoctorClick(doctor)}
                    displayDoctorDetails={() => this.displayDoctorDetails(doctor)} />
                </View>
              )
            })}

          </ScrollView>
        }


        {/* Patient: URG2 interface */}
        {this.isUrgence === true && this.urgenceSpeciality === '' ?
          <View style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Button width={SCREEN_WIDTH * 0.7} text="Rendez-vous en urgence par choix de spécialité" onPress={this.toggleModalUrgence} />

            <TouchableOpacity style={{ marginLeft: SCREEN_WIDTH * 0.025 }} onPress={() => alert('Explication du concept de la prise de rendez-vous en urgence par choix de spécialité...')}>
              <Icon1 name="info" size={20} color="#8febfe" />
            </TouchableOpacity>
          </View>
          : null}

        <Modal
          isVisible={this.state.isModalUrgenceVisible}
          onBackdropPress={() => this.setState({ isModalUrgenceVisible: false })}
          animationIn="fadeInUp"
          animationOut="fadeInDown"
          onSwipeComplete={() => this.setState({ isModalUrgenceVisible: false })}
          // swipeDirection="right"
          style={{ backgroundColor: 'white', height: 100, width: SCREEN_WIDTH * 0.9 }}>

          <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' }}>
            <View style={styles.picker_container} >
              <Picker selectedValue={this.state.selectedSpeciality} onValueChange={(value) => this.setState({ selectedSpeciality: value })} style={{ flex: 1, color: '#445870', width: SCREEN_WIDTH * 0.8, textAlign: "center" }}>
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

        {/* Admin: URG2 interface */}
        {this.isUrgence === true && this.urgenceSpeciality !== '' ?
          <View style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Button width={SCREEN_WIDTH * 0.5} text="Confirmer" onPress={this.inviteDoctors} />
          </View>
          : null}
      </View>
    );
  }
}

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  logo_container: {
    flex: 0.3,
    justifyContent: 'flex-start',
    alignItems: 'center',
    //backgroundColor: 'orange',
  },
  logoIcon: {
    height: SCREEN_WIDTH * 0.25,
    width: LOGO_WIDTH,
    marginTop: SCREEN_WIDTH * 0.05
  },
  search_container: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    //backgroundColor: 'green',
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
    elevation: 5,
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
    elevation: 9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filters_selected_container: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'brown'
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
    elevation: 5,
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
    //backgroundColor: 'yellow'
  },
  loading_container: {
    flex: 1,
  },
  picker_container: {
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.8,
    paddingLeft: 20,
    paddingRight: 10
  }
});



/*  clearAllFilters = () => {
    this.setState({
        country: '', urgences: '', speciality: '', price: 50,
        isCountrySelected: false, isUrgencesSelected: false, isSpecialitySelected: false, isPriceSelected: false,
      isSideMenuVisible: false
    })
  }*/

          //Check if there is at least one doctor available "in the next 30min for an urgent consultation"
        //util pour afficher: 'Aucun medecin disponible' 
/*  if (this.isUrgence === true) {
    if (doc.data().urgences === true) {
      if (timeLeft !== 'Invalid date') {
        this.setState({ noDoctors: false })
      }
    }
  }*/

        //let currentDay = moment().startOf('hours').format() //Jeudi 07 mai 2020 00:00

              //let currentDay = moment().startOf("hours").format() //Jeudi 07 mai 2020 00:00
