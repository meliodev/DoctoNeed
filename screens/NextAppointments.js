//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)

import React from 'react'
import { View, TextInput, Text, Image, Dimensions, ScrollView, StyleSheet } from 'react-native'

import firebase from 'react-native-firebase'

import Button from '../components/Button';
import AppointmentItem from './AppointmentItem'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 420/244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.15 * ratioLogo ;

export default class NextAppointments extends React.Component {
  constructor(props) {
    super(props);
    this.appointments= []

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
  
        let app = {
            id: id,
            day: day,
            month: month,
            year: year,
            timeslot: timeslot,
            doctorName: doctorName
        }
        
        this.appointments.push(app)
      })
  
      //this.setState({ appointments: this.appointments })
  
  }).then(() => this.setState({ appointments: this.appointments }))
  }

  _onPressButton1() {
    // Call ValidationComponent validate method
    this.validate({
      email: {email: true, required: true}
    })

   if( this.validate({
      email: {email: true, required: true}
    })) {
      this.removeErrorMessages()
      this.props.navigation.navigate('SignUp2', {email: this.state.email.toString() })
    } 
  }

  _onPressButton2() {
      this.props.navigation.navigate('NextAppointments')
  }

  render() {
    
    return (
      <View style={styles.container}>

          <View style={styles.logo_container}>
              <Image source={require('../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
          </View>

          <View style={styles.header_container}>
          <Text style={styles.header}> Mes consultations à venir </Text>
          </View>

          {this.state.appointments.length !==0 ?  <ScrollView style= {styles.appointments_container_scrollview}>
                                        {this.state.appointments.map(app => {
                                        return ( <AppointmentItem appointment= {app}/> )
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

          <View style={styles.button_container}>              
               <Button fontSize= {SCREEN_HEIGHT*0.02} text="Prendre un rendez-vous en urgence" onPress={this._onPressButton1.bind(this) } />
               <Button fontSize= {SCREEN_HEIGHT*0.02} text="Planifier une consultation" onPress={this._onPressButton2.bind(this) } />
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
  flex: 0.25,
  //justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'green',
},
logoIcon: {
  height: SCREEN_WIDTH * 0.15,
  width: LOGO_WIDTH,
  marginTop: SCREEN_WIDTH * 0.05
},
header_container: {
  flex: 0.1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'blue',
},
header: {
  fontSize: SCREEN_HEIGHT * 0.025,
  fontWeight: 'bold',
  fontFamily: 'Gill Sans',
  textAlign: 'center',
  color: 'black',
  //backgroundColor: 'yellow',
  marginBottom: SCREEN_HEIGHT * 0.01
},
appointments_container_scrollview: {
    flex: 0.35,
    //alignItems: 'center',
    //justifyContent: 'center',
    paddingTop: SCREEN_HEIGHT*0.05,
    paddingLeft: SCREEN_WIDTH*0.025,
    //backgroundColor: 'brown'
  },
  appointments_container_view: {
    flex: 0.3,
    alignItems: 'center',
    //justifyContent: 'center',
    paddingLeft: SCREEN_WIDTH*0.025,
    //backgroundColor: 'brown'
  },
button_container: {
  flex: 0.35,
  justifyContent: 'flex-end',
  alignItems: 'center',
  backgroundColor: 'yellow',
  paddingBottom: SCREEN_HEIGHT * 0.03
},
});
