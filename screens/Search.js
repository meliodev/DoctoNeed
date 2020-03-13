//Presentation.js

import React from 'react'
//import LinearGradient from 'react-native-linear-gradient';
import { View, Button, Text, Image, TouchableOpacity, Dimensions, FlatList, Animated, StyleSheet, TextInput, SafeAreaView, TouchableHighlight, Slider  } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

import CountryPicker, { getAllCountries, getCallingCode } from 'react-native-country-picker-modal';
import RNPickerSelect from 'react-native-picker-select';

import { withNavigation } from 'react-navigation';

import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import DoctorItem from './DoctorItem'
import SearchInput, { createFilter } from 'react-native-search-filter';
import Modal from "react-native-modal";
import SideMenu from "./SideMenu";
//import { Actions } from 'react-native-router-flux';

const KEYS_TO_FILTERS_COUNTRY = ['country'];
const KEYS_TO_FILTERS_URGENCES = ['urgences'];
const KEYS_TO_FILTERS_SPECIALITY = ['speciality'];
const KEYS_TO_FILTERS_PRICE = ['price'];
const KEYS_TO_FILTERS = ['name', 'speciality'];

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioFooter = 254/668; // The actaul icon footer size is 254 * 668
const FOOTER_ICON_HEIGHT = Dimensions.get("window").width * ratioFooter ; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420/244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo ;

const db = firebase.firestore()
const doctorsRef = db.collection("Doctors");

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.filteredDoctors1 = []
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
      isPriceSelected: false
    }
  }

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

    firebase.firestore().collection('Doctors').doc(doctor.uid).collection('DoctorSchedule').orderBy('fullDate', 'asc').limit(56)
    .get().then( querySnapshot => {
      querySnapshot.forEach(doc => {

        let day= doc.data().day
        let month= doc.data().month
        let year= doc.data().year
        let fullDate= doc.data().fullDate
        let status= doc.data().status

        let dayandMonth={
          id: day+month+year,
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
  }).then( () => {
      this.props.navigation.navigate('Booking', {doctor: doctor, doctorSchedule: doctorSchedule, dayMonth: dayMonth})
  })
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
      "Dim", "Lun", "Mar","Mer","Jeu","Ven","Sam"
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
      monthIndex: monthIndex+1,
      year: year,
      timeslots: {
          ts0800: {time: '08h00', status: 'open'},
          ts0900: {time: '09h00', status: 'blocked'},
          ts1000: {time: '10h00', status: 'open'},
          ts1100: {time: '11h00', status: 'open'},
          ts1200: {time: '12h00', status: 'open'},
          ts1300: {time: '13h00', status: 'open'},
          ts1400: {time: '14h00', status: 'open'},
          ts1500: {time: '15h00', status: 'blocked'},
          ts1600: {time: '16h00', status: 'open'},
          ts1700: {time: '17h00', status: 'open'},
          ts1800: {time: '18h00', status: 'blocked'},    
          ts1900: {time: '19h00', status: 'open'},    
      }
    }

    return journee
  }
  
  //create and populate the doctor's schedule with dates and timeslots
      buildDoctorSchedule(){
      const date1 = new Date();
      const y = date1.getFullYear();
      const m = date1.getMonth();
      const d = date1.getDate();
  
      //generate 3months of schedule
      for(let i=0; i<84; i++) {
  
      const date = new Date(y, m, d + i )
  
      let journee = this.formatDate(date)
       let dayname = journee.dayname

       let day= journee.day
       if(journee.day < 10)
         day= "0"+journee.day;   

       let monthIndex = journee.monthIndex
       if(journee.monthIndex < 10)
         monthIndex= "0"+journee.monthIndex;   

         //console.log('day' + i + ': ' + day)

     //console.log(i + ': ' + journee.dayname + ' ' + journee.day + ' ' + journee.month + ' ' + ' ' + journee.year + ' '+ journee.timeslots.ts1730.time)
        db.collection('Doctors').doc('v88gAwcSdWTQzFpi3H2w').collection('DoctorSchedule').doc().set({
        //db.collection('Doctors').doc(doctorId).collection('DoctorSchedule').doc().set({
        dayname: dayname,
        day: day,
        month: journee.month,
        year: journee.year,
        status: 'open',
      
        fullDate: Number(journee.year+''+monthIndex+''+day), //field to use "order by" in queries
        formatedDate: journee.dayname + ' ' + journee.day + ' ' + journee.month,
        timeslots: journee.timeslots
        }).then( () => {
          console.log('The Doctor Schedule is now populated')
        }).catch(err => console.log(err))
      }
  }

  //-----------------------------------------------------------

  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  componentDidMount() {
    //this.buildDoctorSchedule()
    this._loadDoctors()
   // this.filterCountry()
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
    firebase.firestore().collection("Doctors").get()
    .then(querySnapshot => {

      querySnapshot.forEach( doc => {
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
    .catch(error => console.log ('Error getting documents:' + error))
  }

  toggleSideMenu = () => {
    this.setState({ isSideMenuVisible: !this.state.isSideMenuVisible });
  }

  onSelect (country) {
    this.setState({ country: country.name, isCountrySelected: true }) 
    //console.log(country.name)
  }

  placeHolder = () => {
    return this.state.country ? <Text style={styles.pays1}> {this.state.country} </Text> : <Text style={styles.placeHolder}> Choisissez un pays </Text>
  }

  toggleUrgence = () => {
    if (this.state.urgences === 'true' || this.state.urgences === '')
    this.setState({ urgences: 'false', isUrgencesSelected: false })
    if (this.state.urgences === 'false' || this.state.urgences === '')
    this.setState({ urgences: 'true', isUrgencesSelected: true })
  }

  clearAllFilters = () => {
    this.setState ({ country: '', urgences: '', speciality: '', price: 50,
                     isCountrySelected: false, isUrgencesSelected: false, isSpecialitySelected: false, isPriceSelected: false })
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
   console.log('price: ' +this.state.price)


     //  }
      // this.filteredDoctors1 = this.filteredDoctors1.filter(createFilter(this.state.PRICE, KEYS_TO_FILTERS_PRICE))
   // }
         this.filteredDoctors1 = this.filteredDoctors1.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
   //
   console.log('speciality: '+this.state.speciality)
    return (
      
      <View style={styles.container}>
        
      <Modal
        isVisible={this.state.isSideMenuVisible}
        coverScreen= 'true'
        onBackdropPress={this.toggleSideMenu} // Android back press
        onSwipeComplete={this.toggleSideMenu} // Swipe to discard
        animationIn="slideInRight" // Has others, we want slide in from the left
        animationOut="slideOutRight" // When discarding the drawer
        swipeDirection="right" // Discard the drawer with swipe to left
        useNativeDriver // Faster animation 
        hideModalContentWhileAnimating // Better performance, try with/without
        propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
        style={styles.sideMenuStyle} // Needs to contain the width, 75% of screen width in our case
        >
        <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.header_container}>
          <Text style={styles.header_text}>Trier par</Text>
          <TouchableHighlight style={styles.filter_button}
                onPress={this.toggleSideMenu}> 
                    <Icon1 name="filter" size={25} color="#93eafe" />
          </TouchableHighlight>   
        </View>

        <View style={styles.pays_container}>
           <Text style={styles.title_text}>Pays</Text>
             <CountryPicker 
                withFilter
                withEmoji
                withCountryNameButton
                withAlphaFilter
                translation = "fra"
                placeholder = {this.placeHolder()}
                onSelect= {country => this.onSelect(country)}
         />   
        </View>

        <View style={styles.urgence_container1}> 
           <Text style={styles.title_text}>Urgences</Text>
        </View>

        <View style={styles.urgence_container2}> 
          <TouchableHighlight style={styles.urgence_button}
                onPress={this.toggleUrgence}> 
                { this.state.urgences === 'true' ?  <View style= {{width: SCREEN_WIDTH * 0.02, height: SCREEN_WIDTH * 0.02, borderRadius: 25, backgroundColor: '#93eafe'}} /> 
                                                 :  <View style= {{width: 0.005, height: 0.005, backgroundColor: 'white'}} /> } 
          </TouchableHighlight>     
          <Text style={styles.urgence_text}>Afficher uniquement les médecins gérant les urgences</Text>    
        </View> 

        <View style={styles.speciality_container}>
        <Text style={styles.title_text}>Spécialité</Text>
        <RNPickerSelect
        onValueChange={(speciality, itemIndex) => {
          if(speciality === "")
          this.setState({ speciality: speciality, isSpecialitySelected: false }) 
          else
          this.setState({ speciality: speciality, isSpecialitySelected: true }) 
        }
        }
        style={pickerSelectStyles} 
        useNativeAndroidPickerStyle={false}
        items={[
            { label: 'Aucun filtre', value: '' },
            { label: 'Ophtalmologue', value: 'Ophtalmologue' },
            { label: 'Médecin généraliste', value: 'Médecin généraliste' },
            { label: 'Psychologue', value: 'Psychologue' },
            { label: 'Cardiologue', value: 'Cardiologue' },
            { label: 'Rhumatologue', value: 'Rhumatologue' },
            { label: 'Neurologue', value: 'Neurologue' },
            { label: 'Gynécologue', value: 'Gynécologue' }  
        ]}
        placeholder= {{
          label: 'Choisissez une spécialité',
          value: 'Choisissez une spécialité'
        }}
        />
        </View>

        <View style={styles.price_container}>
        <Text style={styles.title_text}>Tarifs</Text>
            <Slider 
              value={this.state.price}
              onValueChange={value => this.setState({ price: value, isPriceSelected: true })}
              minimumValue= {0}
              maximumValue= {50}
              step= {5}
              minimumTrackTintColor= '#93eafe'
              thumbTintColor= '#93eafe'
              style= {styles.slider}
            />
            <Text style={styles.title_text}>Maximum: {this.state.price} €</Text>
        </View>

        <View style={styles.buttons_container}>
        <TouchableOpacity onPress={this.clearAllFilters} style= {styles.CancelButton}>
          <Text style={styles.buttonText1}>Annuler</Text> 
          </TouchableOpacity>

          <TouchableOpacity
                onPress={this.toggleSideMenu}>         
                <LinearGradient 
                  start={{x: 0, y: 0}} 
                  end={{x: 1, y: 0}} 
                  colors={['#b3f3fd', '#84e2f4', '#5fe0fe']} 
                  style={styles.linearGradient}>
                  <Text style={styles.buttonText2}>Appliquer</Text>
                </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      </Modal>

          <View style={styles.logo_container}>
              <Image source={require('../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
          </View>

          <View style={styles.search_container}>
            
            <View style={styles.search_button}>
               <Icon1 name="search" size={20} color="#afbbbc" style={{ flex: 0.1, paddingRight: 5}}/>
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
            { this.state.isCountrySelected ?
              <View style= {styles.filterItem}>
              <Text style={styles.filterItem_text}>Pays</Text> 
              <Icon name="close" 
                    size={SCREEN_WIDTH*0.05} 
                    color="#93eafe"
                    onPress= {() => this.setState({ country: '', isCountrySelected: false })} />
              </View>
              : null
            }

          { this.state.isUrgencesSelected ?
          <View style= {styles.filterItem}>
          <Text style={styles.filterItem_text}>Urgences</Text> 
          <Icon name="close" 
                size={SCREEN_WIDTH*0.05} 
                color="#93eafe"
                onPress= {() => this.setState({ urgences: '', isUrgencesSelected: false })} />
          </View>
          : null }

          { this.state.isSpecialitySelected ?
          <View style= {styles.filterItem}>
          <Text style={styles.filterItem_text}>Specialité</Text> 
          <Icon name="close" 
                size={SCREEN_WIDTH*0.05} 
                color="#93eafe"
                onPress= {() => this.setState({ speciality: '', isSpecialitySelected: false })} />
          </View>
          : null }

          { this.state.isPriceSelected ?
          <View style= {styles.filterItem}>
          <Text style={styles.filterItem_text}>Tarifs</Text> 
          <Icon name="close" 
                size={SCREEN_WIDTH*0.05} 
                color="#93eafe"
                onPress= {() => this.setState({ price: 50, isPriceSelected: false })} />
          </View>
          : null }
          
          </View>
          <ScrollView style= {styles.doctorList_container}>
          {this.filteredDoctors1.map(doctor => {
            return (
              <View style={{ flex: 1,  alignItems: 'center'}}>
                <DoctorItem
                doctor={doctor}
                displayDetailForDoctor={() => this.onDoctorClick(doctor)}
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
  flex: 0.25,
  //justifyContent: 'center',
  alignItems: 'center',
  //backgroundColor: 'blue',
},
logoIcon: {
  height: SCREEN_WIDTH * 0.25,
  width: LOGO_WIDTH,
  marginTop: SCREEN_WIDTH * 0.05
},
search_container: {
  flex: 0.25,
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
  paddingLeft: SCREEN_WIDTH*0.02,
  paddingRight: SCREEN_WIDTH*0.02,
  width: SCREEN_WIDTH * 0.75,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.32,
  shadowRadius: 10,
  elevation: 5,
  marginTop: SCREEN_HEIGHT*0.01,
  marginBottom: SCREEN_HEIGHT*0.01,
  fontSize: 16,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between'
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
sideMenuStyle: {
  flex: 1,
  margin: 0,
  marginLeft: SCREEN_WIDTH * 0.25,
  width: SCREEN_WIDTH * 0.75, // SideMenu width
  height: SCREEN_HEIGHT,
  borderTopLeftRadius: 20,
  borderBottomLeftRadius: 20,
  borderLeftColor: '#93eafe',
  borderLeftWidth: 15,
  //backgroundColor: 'green'
},
safeAreaView: {
  flex: 1,
  height: SCREEN_HEIGHT,
  borderTopLeftRadius: 5,
  borderBottomLeftRadius: 5,
  backgroundColor: "white"
},  
header_container: {
  flex: 0.1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingLeft: SCREEN_WIDTH*0.13,
  paddingRight: SCREEN_WIDTH*0.03,
  alignItems: 'center',
  //backgroundColor: 'green'
 },
 header_text: {
  color: '#7c807f',
  fontWeight: 'bold',
  fontSize: 17,
  textDecorationLine: "underline",
 },
 pays_container: {
  flex: 0.15,
  paddingLeft: SCREEN_WIDTH*0.1,
  //backgroundColor: 'blue'
},
title_text: {
  marginTop: SCREEN_HEIGHT*0.02,
  fontSize: 17,
  //fontWeight: "bold"
},
urgence_container1: {
  flex: 0.075,
  paddingLeft: SCREEN_WIDTH*0.1,
 // backgroundColor: 'yellow'
},
urgence_container2: {
  flex: 0.075,
  flexDirection: 'row',
  paddingLeft: SCREEN_WIDTH*0.1,
  paddingRight: SCREEN_WIDTH*0.1,
  alignItems: 'center',
  justifyContent: 'space-between',
 // backgroundColor: 'blue'
},

urgence_button: {
  width: SCREEN_WIDTH * 0.07,
  height: SCREEN_WIDTH * 0.07,
  borderRadius: 25,
  backgroundColor: '#ffffff',
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.32,
  shadowRadius: 5.46,
 // marginTop: SCREEN_WIDTH*0.05,
  elevation: 9,    
  justifyContent: 'center',
  alignItems: 'center'
},
urgence_text: {
  fontSize: 10,
  fontFamily: 'bold',
  marginLeft: SCREEN_WIDTH*0.05,
  color: 'gray'
},
speciality_container: {
  flex: 0.15,
  paddingLeft: SCREEN_WIDTH*0.1,
  //backgroundColor: 'brown'
},
price_container: {
  flex: 0.2,
  paddingLeft: SCREEN_WIDTH*0.1,
 // backgroundColor: 'purple'
},
slider: {
   marginTop: SCREEN_HEIGHT*0.07,
   //marginRight: SCREEN_HEIGHT*0.07
},
buttons_container: {
  flex: 0.25,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  //backgroundColor: 'orange'
},
CancelButton: {
  textAlignVertical: 'top',
  textAlign: 'center',
  backgroundColor: '#ffffff',
  borderRadius: 30,
  paddingBottom: SCREEN_HEIGHT*0.005,
  paddingTop:SCREEN_HEIGHT*0.005,
  marginRight: SCREEN_WIDTH*0.05,
  width: SCREEN_WIDTH * 0.25,
  height: SCREEN_HEIGHT*0.06 ,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.32,
  shadowRadius: 5.46,
  elevation: 5,
  fontSize: 16,
  alignItems: 'center',
  justifyContent: 'space-between'
},
linearGradient: {
  paddingTop: SCREEN_HEIGHT*0.005,
  paddingBottom: SCREEN_HEIGHT*0.005,
  borderRadius: 30,
  width: SCREEN_WIDTH * 0.25,
  height: SCREEN_HEIGHT*0.06,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.32,
  shadowRadius: 5.46,
  elevation: 5,
},
buttonText1: {
  fontSize: SCREEN_HEIGHT * 0.016,
  fontFamily: 'Avenir',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: SCREEN_HEIGHT * 0.012,
  color: 'black',
  backgroundColor: 'transparent',
},
buttonText2: {
  fontSize: SCREEN_HEIGHT * 0.017,
  fontWeight: 'bold',
  fontFamily: 'Avenir',
  textAlign: 'center',
  margin: SCREEN_HEIGHT * 0.012,
  color: '#ffffff',
  backgroundColor: 'transparent',
},
searchText: {
  color: '#b2bbbc',
  fontSize: SCREEN_WIDTH*0.025,
  marginLeft: SCREEN_WIDTH * 0.03 
},
filters_selected_container:{
  flex: 0.1,
  flexDirection: 'row',
  alignItems: 'center',
  //justifyContent: 'space-between',
  //backgroundColor: 'brown'
},
filterItem: {
  width: SCREEN_WIDTH*0.21,
  textAlignVertical: 'top',
  textAlign: 'center',
  backgroundColor: '#ffffff',
  borderRadius: 50,
  padding: SCREEN_WIDTH*0.03,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.32,
  shadowRadius: 5.46,
  elevation: 5,
  marginLeft: SCREEN_WIDTH*0.03,
  //margin: 15,
  //marginTop: 15,
  //marginBottom: 15,
  fontSize: 16,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between'
},
filterItem_text: {
  fontSize: SCREEN_HEIGHT*0.013
},
doctorList_container: {
    flex: 0.4,
    //backgroundColor: 'yellow'
}
/*cnxButton_container: {
  flex: 0.38,
  justifyContent: 'flex-end',
  alignItems: 'center',
  //backgroundColor: 'yellow',
  paddingBottom: SCREEN_HEIGHT * 0.01
},
linearGradient: {
  paddingLeft: 15,
  paddingRight: 15,
  borderRadius: 5,
  marginTop:16,
  width: SCREEN_WIDTH * 0.68,
  borderRadius: 20
},
buttonText: {
  fontSize: 15,
  fontFamily: 'Gill Sans',
  textAlign: 'center',
  margin: 10,
  color: '#ffffff',
  backgroundColor: 'transparent',
},*/


});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: SCREEN_WIDTH*0.03,
    width: SCREEN_WIDTH * 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    //margin: 15,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  inputAndroid: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    paddingTop: SCREEN_WIDTH*0.05,
    paddingRight: SCREEN_WIDTH*0.07,
    width: SCREEN_WIDTH * 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    //margin: 15,
    marginTop: SCREEN_WIDTH*0.03,
    //marginBottom: 15,
    fontSize: 11,
    color: '#93eafe',
    //justifyContent: 'center',
   // alignItems: 'center'
  },
});