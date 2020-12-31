
import React from 'react'
//import LinearGradient from 'react-native-linear-gradient';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import SearchInput, { createFilter } from 'react-native-search-filter';

import DoctorItem from '../../components/DoctorItem'
import RightSideMenu from '../../components/RightSideMenu1'

import firebase from 'react-native-firebase';
import * as REFS from '../../DB/CollectionsRefs'

import { withNavigation } from 'react-navigation';

const KEYS_TO_FILTERS_COUNTRY = ['country'];
const KEYS_TO_FILTERS_URGENCES = ['urgences'];
const KEYS_TO_FILTERS_SPECIALITY = ['speciality'];
const KEYS_TO_FILTERS_PRICE = ['price'];
const KEYS_TO_FILTERS = ['name', 'speciality'];

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioFooter = 254 / 668; // The actaul icon footer size is 254 * 668
const FOOTER_ICON_HEIGHT = Dimensions.get("window").width * ratioFooter; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

const db = firebase.firestore()
const doctorsRef = db.collection("Doctors");

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.filteredDoctors1 = []
    this.toggleUrgence = this.toggleUrgence.bind(this);
    this.countryPlaceHolder = this.countryPlaceHolder.bind(this);

    this.state = {
      doctorList: [],
      searchTerm: '',
      isSideMenuVisible: false,
      isLoading: false,
      country: "",
      urgences: "",
      speciality: "",
      price: 50,
      isCountrySelected: false,
      isUrgencesSelected: false,
      isSpecialitySelected: false,
      isPriceSelected: false,
    }
  }

  //Handle sidemenu filters
  toggleSideMenu = () => {
    this.setState({ isSideMenuVisible: !this.state.isSideMenuVisible });
  }

  countryPlaceHolder = () => {
    return this.state.country ? <Text style={styles.pays1}> {this.state.country} </Text> : <Text style={styles.placeHolder}> Choisir un pays </Text>
  }

  toggleUrgence = () => {
    if (this.state.urgences === 'true' || this.state.urgences === '')
      this.setState({ urgences: 'false', isUrgencesSelected: false })
    if (this.state.urgences === 'false' || this.state.urgences === '')
      this.setState({ urgences: 'true', isUrgencesSelected: true })
  }

  clearAllFilters = () => {
    this.setState({
      country: '', urgences: '', speciality: '', price: 50,
      isCountrySelected: false, isUrgencesSelected: false, isSpecialitySelected: false, isPriceSelected: false
    })
  }

  //Get data from filters
  onSelectCountry = (childData) => {
    this.setState({ country: childData.name, isCountrySelected: true })
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


  //handle doctor click
  onDoctorClick(doctor) {
    let ts0800 = {
      id: null,
      time: '',
      status: ''
    }
    let ts0815 = {
      id: null,
      time: '',
      status: ''
    }
    let ts0830 = {
      id: null,
      time: '',
      status: ''
    }
    let timeslots = []
    let doctorSchedule = []
    let dayMonth = []

    REFS.doctors.doc(doctor.uid).collection('DoctorSchedule').orderBy('fullDate', 'asc').limit(56)
      .get().then(querySnapshot => {
        querySnapshot.forEach(doc => {

          let day = doc.data().day
          let month = doc.data().month
          let year = doc.data().year
          let fullDate = doc.data().fullDate
          let status = doc.data().status

          let dayandMonth = {
            id: day + month + year,
            day: day,
            month: month,
            year: year,
            fullDate: fullDate,
            status: status
          }

          timeslots.push(doc.data().timeslots.ts0800)
          timeslots.push(doc.data().timeslots.ts0900)
          timeslots.push(doc.data().timeslots.ts1000)
          timeslots.push(doc.data().timeslots.ts1100)
          timeslots.push(doc.data().timeslots.ts1200)
          timeslots.push(doc.data().timeslots.ts1300)
          timeslots.push(doc.data().timeslots.ts1400)
          timeslots.push(doc.data().timeslots.ts1500)
          timeslots.push(doc.data().timeslots.ts1600)
          timeslots.push(doc.data().timeslots.ts1700)
          timeslots.push(doc.data().timeslots.ts1800)
          timeslots.push(doc.data().timeslots.ts1900)
          doctorSchedule.push(timeslots)
          dayMonth.push(dayandMonth)
          timeslots = []

        })
      }).then(() => {
        this.props.navigation.navigate('Booking', { doctor: doctor, doctorSchedule: doctorSchedule, dayMonth: dayMonth })
      })
  }

  displayDoctorDetails(doctor) {
    //console.log(doctor)
    this.props.navigation.navigate('DoctorFile', { doctor: doctor })
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }

  formatDate(date) {
    let monthNames = [
      "Janvier", "Février", "Mars",
      "Avril", "Mai", "Juin", "Juillet",
      "Aout", "Septembre", "Octobre",
      "Novembre", "Decembre"
    ];

    let dayNames = [
      "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"
    ]

    let day = date.getDate();
    let dayindex = date.getDay();
    let dayname = dayNames[dayindex]
    let monthIndex = date.getMonth();
    let month = monthNames[monthIndex]
    let year = date.getFullYear();

    let journee = {
      dayname: dayname,
      day: day,
      month: month,
      monthIndex: monthIndex + 1,
      year: year,
      timeslots: {
        ts0800: { time: '08h00', status: 'open' },
        ts0900: { time: '09h00', status: 'blocked' },
        ts1000: { time: '10h00', status: 'open' },
        ts1100: { time: '11h00', status: 'open' },
        ts1200: { time: '12h00', status: 'open' },
        ts1300: { time: '13h00', status: 'open' },
        ts1400: { time: '14h00', status: 'open' },
        ts1500: { time: '15h00', status: 'blocked' },
        ts1600: { time: '16h00', status: 'open' },
        ts1700: { time: '17h00', status: 'open' },
        ts1800: { time: '18h00', status: 'blocked' },
        ts1900: { time: '19h00', status: 'open' },
      }
    }

    return journee
  }

  //create and populate the doctor's schedule with dates and timeslots
  buildDoctorSchedule() {
    const date1 = new Date();
    const y = date1.getFullYear();
    const m = date1.getMonth();
    const d = date1.getDate();

    //generate 3months of schedule
    for (let i = 0; i < 84; i++) {

      const date = new Date(y, m, d + i)

      let journee = this.formatDate(date)
      let dayname = journee.dayname

      let day = journee.day
      if (journee.day < 10)
        day = "0" + journee.day;

      let monthIndex = journee.monthIndex
      if (journee.monthIndex < 10)
        monthIndex = "0" + journee.monthIndex;

      //console.log('day' + i + ': ' + day)

      //console.log(i + ': ' + journee.dayname + ' ' + journee.day + ' ' + journee.month + ' ' + ' ' + journee.year + ' '+ journee.timeslots.ts1730.time)
      db.collection('Doctors').doc('v88gAwcSdWTQzFpi3H2w').collection('DoctorSchedule').doc().set({
        //db.collection('Doctors').doc(doctorId).collection('DoctorSchedule').doc().set({
        dayname: dayname,
        day: day,
        month: journee.month,
        year: journee.year,
        status: 'open',

        fullDate: Number(journee.year + '' + monthIndex + '' + day), //field to use "order by" in queries
        formatedDate: journee.dayname + ' ' + journee.day + ' ' + journee.month,
        timeslots: journee.timeslots
      }).then(() => {
        console.log('The Doctor Schedule is now populated')
      }).catch(err => console.log(err))
    }
  }

  //-----------------------------------------------------------

  componentDidMount() {
    //this.buildDoctorSchedule()
    this._loadDoctors()
    // this.filterCountry()
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  _loadDoctors() {
    const doctorList = []
    let doctor = {
      uid: '',
      Adresse: '',
      name: '',
      phone: '',
      type: '',
      //doctorSchedule: []
    }
    //get the doctor selected
    //firebase.firestore().collection("Doctors").doc('zMl7Olfq3GeRDzrk4fCd').get()
    REFS.doctors.get()
      .then(querySnapshot => {

        querySnapshot.forEach(doc => {
          const id = doc.id
          doctor = doc.data()
          doctor.uid = id
          doctorList.push(doctor)
        })

        this.setState({
          doctorList: doctorList
        }
          //,console.log(doctorList)
        )

      })
      .catch(error => console.log('Error getting documents:' + error))
  }

  render() {

    this.filteredDoctors1 = this.state.doctorList
    console.log(this.filteredDoctors1)

    this.filteredDoctors1 = this.filteredDoctors1.filter((doctor) => {
      return doctor.price <= this.state.price
    })

    if (this.state.country) {
      this.filteredDoctors1 = this.filteredDoctors1.filter(createFilter(this.state.country, KEYS_TO_FILTERS_COUNTRY))
    }
    if (this.state.urgences === 'true') {
      this.filteredDoctors1 = this.filteredDoctors1.filter(createFilter(this.state.urgences, KEYS_TO_FILTERS_URGENCES))
    }
    if (this.state.speciality) {
      this.filteredDoctors1 = this.filteredDoctors1.filter(createFilter(this.state.speciality, KEYS_TO_FILTERS_SPECIALITY))
    }

    console.log('country: ' + this.state.country)
    console.log('urgences: ' + this.state.urgences)
    console.log('speciality: ' + this.state.speciality)
    console.log('price: ' + this.state.price)


    //  }
    // this.filteredDoctors1 = this.filteredDoctors1.filter(createFilter(this.state.PRICE, KEYS_TO_FILTERS_PRICE))
    // }
    this.filteredDoctors1 = this.filteredDoctors1.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    //
    console.log('speciality: ' + this.state.speciality)
    return (

      <View style={styles.container}>

        <RightSideMenu
          isSideMenuVisible={this.state.isSideMenuVisible}
          toggleSideMenu={this.toggleSideMenu}
          countryPlaceHolder={this.countryPlaceHolder()}
          toggleUrgence={this.toggleUrgence}
          urgences={this.state.urgences}
          price={this.state.price}
          clearAllFilters={this.clearAllFilters}
          onSelectCountry={this.onSelectCountry}
          onSelectSpeciality={this.onSelectSpeciality}
          onSelectPriceMax={this.onSelectPriceMax} />

        <View style={styles.logo_container}>
          <Image source={require('../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
        </View>

        <View style={styles.search_container}>

          <View style={styles.search_button}>
            <Icon1 name="search" size={20} color="#afbbbc" style={{ flex: 0.1, paddingRight: 5 }} />
            <TextInput
              onChangeText={(term) => { this.searchUpdated(term) }}
              placeholder="Rechercher un médecin"
              style={{ flex: 0.9 }}
            />
          </View>


          <TouchableOpacity style={styles.filter_button}
            onPress={this.toggleSideMenu}>
            <Icon1 name="filter" size={25} color="#93eafe" />
          </TouchableOpacity>
        </View>

        <View style={styles.filters_selected_container}>
          {this.state.isCountrySelected ?
            <View style={styles.filterItem}>
              <Text style={styles.filterItem_text}>Pays</Text>
              <Icon name="close"
                //size= {20}
                color="#93eafe"
                onPress={() => this.setState({ country: '', isCountrySelected: false })} />
            </View>
            : null
          }

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

        <ScrollView style={styles.doctorList_container}>
          {this.filteredDoctors1.map(doctor => {
            return (
              <View style={{ flex: 1, alignItems: 'center' }}>
                <DoctorItem
                  doctor={doctor}
                  displayDoctorCalendar={() => this.onDoctorClick(doctor)}
                  displayDoctorDetails={() => this.displayDoctorDetails(doctor)}
                />
              </View>
            )
          })}
        </ScrollView>

      </View>
    );
  }
}

export default withNavigation(Search);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo_container: {
    flex: 0.3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //backgroundColor: 'blue',
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
    //borderWidth: 1, 
    //borderColor: '#93eafe',
    paddingLeft: SCREEN_WIDTH * 0.02,
    paddingRight: SCREEN_WIDTH * 0.02,
    width: SCREEN_WIDTH * 0.75,
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
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'space-between',
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
    elevation: 3,
    marginLeft: SCREEN_WIDTH * 0.03,
    //margin: 15,
    //marginTop: 15,
    //marginBottom: 15,
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
  }

});

