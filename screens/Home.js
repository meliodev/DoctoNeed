// Home.js
// Customize Home page for: Patient, Doctor, Admin
// A patient can not read/write any other patient's data (users)
import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button, SafeAreaView, FlatList, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

import firebase from 'react-native-firebase'
import AppointmentItem from './AppointmentItem';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const db = firebase.firestore()

export default class Main extends React.Component {
  constructor(props) {
  super(props);
  this.appointments= []

  this.state = { 
      currentUser: null,
      phone: '',
      nom: '',
      prenom: '',
      pays: '',
      appointments: [],
  }
}
 
  componentWillMount() {
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


getUser = () => {
  db.collection('users').get().then(snapshot => {
    <SafeAreaView style={styles.container}>
    
  </SafeAreaView>  })
}

UserAuthStatus = () => {
  firebase 
  .auth()
  .onAuthStateChanged (user => {
    if (user) {
      this.getUsers();
    } else {
      console.log('cannot get data... user logged out')
    }
  })
};



signOutUser = async () => {
  try {
      await firebase.auth().signOut();
      this.props.navigation.navigate('LandingScreen');
  } catch (e) {
      console.log(e);
  }
}

updateUser = async () => {
const update = {
  displayName: 'Alias',
  photoURL: 'https://my-cdn.com/assets/user/123.png',
  phoneNumber: '0664568974',
};

await firebase.auth().currentUser.updateProfile(update);
}

  render() {
    const { currentUser } = this.state
    console.log('hey')
    const content = '<Text>Username: {currentUser && currentUser.displayName}</Text>'

    return (
     //<Text>   Test    </Text> 
 /* <FlatList
    data={users}
    renderItem={({item}) => <Text>{item.title}</Text>}
  />   */
        <View style={styles.container}>
            <View style= {styles.header_container}>
               <Text style={styles.header}>
                  Consultations à venir
               </Text>
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

            <View style= {styles.buttons_container}>
                <TouchableOpacity
                onPress={ () => this.props.navigation.navigate('LandingScreen') }>         
                <LinearGradient 
                  start={{x: 0, y: 0}} 
                  end={{x: 1, y: 0}} 
                  colors={['#b3f3fd', '#84e2f4', '#5fe0fe']} 
                  style={styles.linearGradient}>
                    <Text style={styles.buttonText}> Retour à la page d'accueil </Text>
                </LinearGradient>
                </TouchableOpacity>
            </View>
        
        </View>
      
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //paddingTop: SCREEN_HEIGHT*0.1,
   // alignItems: 'center',
   //backgroundColor: 'green'
  },
  header_container: {
    flex: 0.35,
    //backgroundColor: 'orange',
    justifyContent: 'center',
    //alignItems: 'center',
   //marginLeft: SCREEN_WIDTH *0.25
  },
  header: {
    fontSize: SCREEN_HEIGHT * 0.03,
    fontWeight: 'bold',
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'black',
    //backgroundColor: 'yellow',
    marginBottom: SCREEN_HEIGHT * 0.01
  },
  appointments_container_scrollview: {
    flex: 0.4,
    //alignItems: 'center',
    //justifyContent: 'center',
    paddingLeft: SCREEN_WIDTH*0.025,
    //backgroundColor: 'brown'
  },
  appointments_container_view: {
    flex: 0.4,
    alignItems: 'center',
    //justifyContent: 'center',
    paddingLeft: SCREEN_WIDTH*0.025,
    //backgroundColor: 'brown'
  },
  paragraph: {
    fontSize: SCREEN_HEIGHT*0.017,
    fontWeight: 'bold',
  },
  //Logout button style
  buttons_container: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: SCREEN_HEIGHT*0.2,
    //backgroundColor: 'blue',
    //paddingBottom: SCREEN_HEIGHT * 0.01
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    marginTop:16,
    marginBottom: SCREEN_HEIGHT*0.04,
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
  },


})