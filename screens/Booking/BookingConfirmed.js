// Home.js
// Customize Home page for: Patient, Doctor, Admin
// A patient can not read/write any other patient's data (users)
import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button, SafeAreaView, FlatList, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

import moment from 'moment'
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')

import firebase from 'react-native-firebase'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const db = firebase.firestore()

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.doctor = this.props.navigation.getParam('doctor', '')
    this.speciality = this.props.navigation.getParam('speciality', '')
    this.date = this.props.navigation.getParam('date', 'nothing sent')

    this.state = {
      currentUser: null,
      phone: '',
      nom: '',
      prenom: '',
      pays: '',
    }


  }

  componentDidMount() {
    console.log('DOC ::::::::::' + this.doctor)
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    firebase.firestore().collection("users").doc(currentUser.uid).get().then(doc => {
      this.setState({ phone: doc.data().phone })
      this.setState({ nom: doc.data().nom })
      this.setState({ prenom: doc.data().prenom })
      this.setState({ pays: doc.data().pays })
    })
    //this.updateUser()
  }

  getUser = () => {
    db.collection('users').get().then(snapshot => {
      <SafeAreaView style={styles.container}>

      </SafeAreaView>
    })
  }

  UserAuthStatus = () => {
    firebase
      .auth()
      .onAuthStateChanged(user => {
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

  renderConfirmationMessage() {
    if (this.doctor === '')
      return (
        <ScrollView contentContainerStyle={styles.appointments_container} >
          <Text style={styles.paragraph}>
            Votre rendez-vous avec un
            </Text>
          <Text style={styles.paragraph}>
            <Text style={[styles.paragraph, { color: '#93eafe' }]}>{this.speciality}</Text> a été fixé.
           </Text>

          <Text style={styles.text_details1}>
            Un spécialiste vous contactera dans les plus
          </Text>
          <Text style={[styles.text_details1, {marginTop: 0}]}>
            brefs délais. Nous vous prions de patienter.
          </Text>

        </ScrollView>
      )

    else {
      return (
        <ScrollView contentContainerStyle={styles.appointments_container} >
          <Text style={styles.paragraph}>
            Votre rendez-vous avec Dr. <Text style={[styles.paragraph, { color: '#93eafe' }]}>{this.doctor}</Text> est fixé
          </Text>
          <Text style={styles.paragraph}>
            pour le <Text style={[styles.paragraph, { color: '#93eafe' }]}>{moment(this.date).format("Do MMMM YYYY")}</Text> à <Text style={[styles.paragraph, { color: '#93eafe' }]}>{moment(this.date).format('HH:mm')}</Text>
          </Text>
          {/* <Text style={styles.text_details1}>
            Une notification de rappel vous sera envoyée
          </Text>
          <Text style={styles.text_details2}>
            30 min avant la consultation.
          </Text> */}
        </ScrollView>
      )
    }

  }

  render() {
    const { currentUser } = this.state
    //console.log(users)
    const content = '<Text>Username: {currentUser && currentUser.displayName}</Text>'

    return (
      //<Text>   Test    </Text> 
      /* <FlatList
         data={users}
         renderItem={({item}) => <Text>{item.title}</Text>}
       />   */
      <View style={styles.container}>

        <View styles={styles.header_container}>
          <Text style={styles.header}>
            Consultation confirmée !
        </Text>
        </View>

        {this.renderConfirmationMessage()}

        <View style={styles.button_container}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('TabScreenPatient')}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
              style={styles.linearGradient}>
              <Text style={styles.buttonText}> Retour à mon profile </Text>
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
    justifyContent: 'center',
    paddingTop: 100,
    // alignItems: 'center'
  },
  header_container: {
    flex: 0.33,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
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
  appointments_container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: SCREEN_HEIGHT*0.1
    //justifyContent: 'center',
    //backgroundColor: 'green'
  },
  paragraph: {
    fontSize: SCREEN_HEIGHT * 0.017,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text_details1: {
    marginTop: 20,
    fontSize: SCREEN_HEIGHT * 0.015,
  },
  text_details2: {
    fontSize: SCREEN_HEIGHT * 0.015,
  },
  //Logout button style
  button_container: {
    flex: 0.33,
    justifyContent: 'flex-start',
    alignItems: 'center',
    //backgroundColor: 'blue',
    paddingBottom: SCREEN_HEIGHT * 0.01
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    marginTop: 16,
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