// Home.js
// Customize Home page for: Patient, Doctor, Admin
// A patient can not read/write any other patient's data (users)
import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button, SafeAreaView, FlatList, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

import firebase from 'react-native-firebase'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const db = firebase.firestore()

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.doctor = this.props.navigation.getParam('doctor', 'nothing sent')
    this.daySelected = this.props.navigation.getParam('daySelected', 'nothing sent')
    this.monthSelected = this.props.navigation.getParam('monthSelected', 'nothing sent')
    this.yearSelected = this.props.navigation.getParam('yearSelected', 'nothing sent')
    this.timeSelected = this.props.navigation.getParam('timeSelected', 'nothing sent')
    this.symptomes = this.props.navigation.getParam('symptomes', 'nothing sent')
    this.comment = this.props.navigation.getParam('comment', 'nothing sent')

    this.state = {
      currentUser: null,
      phone: '',
      nom: '',
      prenom: '',
      pays: '',
    }


  }

  componentWillMount() {
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

        <ScrollView contentContainerStyle={styles.appointments_container} >
          <Text style={styles.paragraph}>
            Votre rendez-vous avec Dr. {this.doctor.nom} {this.doctor.prenom} est fixé
            </Text>
          <Text style={styles.paragraph}>
            pour le {this.daySelected} {this.monthSelected} {this.yearSelected} à {this.timeSelected}
          </Text>
          <Text style={styles.text_details1}>
            Une notification de rappel vous sera envoyée
            </Text>
          <Text style={styles.text_details2}>
            30min avant la consultation.
            </Text>
        </ScrollView>

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
    justifyContent: 'center',
    //backgroundColor: 'green'
  },
  paragraph: {
    fontSize: SCREEN_HEIGHT * 0.017,
    fontWeight: 'bold',
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