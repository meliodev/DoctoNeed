//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)

import React from 'react'
import { View, TextInput, Text, Image, Dimensions, TouchableHighlight, ScrollView, StyleSheet } from 'react-native'

import firebase from 'react-native-firebase'

import Button from '../components/Button';
import AppointmentItem from './PreviousAppointments/AppointmentItem'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 420/244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.14 * ratioLogo ;

export default class NextAppointments extends React.Component {
  constructor(props) {
    super(props);
    this.appointments= []
    this.month= ''
    this.year= 0

    this.state = {
       appointments: [],
    }
  }

  componentDidMount() {
    this.forceUpdate()
    this.loadAppointments()
  }
  
  loadAppointments() {
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("appointments").orderBy('fullDate', 'asc').limit(100)
    .get().then( querySnapshot => {
      querySnapshot.forEach(doc => {
        let id= doc.data().fullDate
        let day= doc.data().day
        let month= doc.data().month
        let year= doc.data().year
        let timeslot= doc.data().timeslot
        let doctorName= doc.data().doctorName
        let doctorSpeciality= doc.data().doctorSpeciality
  
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

  _onPressButton1() { 
      this.props.navigation.navigate('Search')
  }

  _onPressButton2() {
      this.props.navigation.navigate('Search')
  }

  render() {
    console.log(this.state.appointments)
    return (
      <View style={styles.container}>

          <View style={styles.logo_container}>
              <Image source={require('../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
          </View>

          <View style={styles.header_container}>
          <Text style={styles.header}>Mes consultations passées</Text>
          <Text style={{color: 'gray', fontSize: SCREEN_HEIGHT*0.0115}}>( 18 derniers mois )</Text>
          </View>

          {this.state.appointments.length !==0 ?  <ScrollView style= {styles.appointments_container_scrollview}>
                                        {this.state.appointments.map(app => {

                                        if(app.month === this.month) {
                                            return ( 
                                                <View>
                                                    <AppointmentItem appointment= {app}/>
                                                </View>
                                                )
                                        }

                                        else if(app.month !== this.month || this.month === '') {
                                        this.month= app.month
                                        this.year= app.year
                                        return ( 
                                                 <View>
                                                 <Text style= {{fontWeight: 'bold', paddingLeft: SCREEN_WIDTH*0.07, marginBottom:SCREEN_HEIGHT*0.01, marginTop: SCREEN_HEIGHT*0.015, color: 'gray' }}> {this.month} {this.year} </Text>
                                                 <AppointmentItem appointment= {app}/>
                                                 </View>
                                                 )
                                        }

                                        })}
                                        </ScrollView>

                                    :  <View style= {styles.appointments_container_view}>
                                        <Text style={styles.paragraph}>
                                           Aucune consultation prévue pour le moment.
                                        </Text>
                                        <Text style={styles.paragraph}>
                                           Vos futures consultations seront affichées ici...
                                        </Text>
                                        </View> }

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
  flex: 0.15,
  justifyContent: 'flex-end',
  alignItems: 'center',
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
  //marginBottom: SCREEN_HEIGHT * 0.01
},
appointments_container_scrollview: {
    flex: 0.01,
    //alignItems: 'center',
    //justifyContent: 'center',
    //paddingTop: SCREEN_HEIGHT*0.05,
    //paddingLeft: SCREEN_WIDTH*0.025,
  // backgroundColor: 'brown'
  },
  appointments_container_view: {
    flex: 0.01,
    alignItems: 'center',
    //justifyContent: 'center',
    paddingLeft: SCREEN_WIDTH*0.025,
   // backgroundColor: 'brown'
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
  paddingTop:2,
  borderRadius: 30,
  marginTop:SCREEN_HEIGHT*0.02,
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
