//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)

import React from 'react'
import { View, TextInput, Text, Image, Dimensions, StyleSheet, ActivityIndicator } from 'react-native'

import Button from '../../components/Button';
 
import ValidationComponent from 'react-native-form-validator';

import firebase from 'react-native-firebase'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 420/244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo ;

export default class SignUp3 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      isLoading: false
    }
  }

  handleSignUp = () => {
    this.setState({ isLoading: true })

    const email =  this.props.navigation.getParam('email', 'nothing sent')
    const phoneNumber =  this.props.navigation.getParam('phoneNumber', 'nothing sent')
    const nom =  this.props.navigation.getParam('nom', 'nothing sent')
    const prenom =  this.props.navigation.getParam('prenom', 'nothing sent')
    const date =  this.props.navigation.getParam('date', 'nothing sent')
    const pays =  this.props.navigation.getParam('pays', 'nothing sent')
    const speciality =  this.props.navigation.getParam('speciality', 'nothing sent')
    const isDoctor =  this.props.navigation.getParam('isDoctor', 'nothing sent')

//CURRENTLY... We add the doctor right after he fills the form. We also assign to him the custom claim 'Doctor: true'. 
//BUT... We need later on to add an intermediary step: 
//The form's data is sent via email to the admin's email address. The admin then reviews the form's content and decides whether
// to accept and add the doctor as a user or decline his request depending on his profile. He can also contact him before deciding...
//if Admin decides to add him as a doctor... Admin assign to the doctor the custom claim 'Doctor: true'
//We will use this custom claim to display the Right UI for the doctor.
//We will also use this custom claim if needed in firestore/storage rules
if(isDoctor !== 'nothing sent') {

  var credential = firebase.auth.EmailAuthProvider.credential(email, this.state.password);

  firebase.auth().currentUser.linkWithCredential(credential)
  .then((usercred) => {
    var user = usercred.user;
    console.log("Account linking success", user);

    console.log('Doctor registred succesfully')
    const usr = {
      country: pays,
      nom: nom,
      prenom: prenom,
      price: 15,
      speciality: speciality,
      urgences: 'false',
      dateNaissance: date,
    }

    firebase.firestore().collection("Doctors").doc(user.uid).set(usr)
    .then(() => {
      console.log('doctoooooooooooooor added to firestooooooooooooore !!!!!!!!!!!!!!!')
      this.setState({ isLoading: false })
      this.props.navigation.navigate('AddDoctorClaim', {email: email})   
    })
    .catch((err) => console.error)

  })
    .catch((error) => {
    console.log("Account linking error", error);
  });
}

else {
  var credential = firebase.auth.EmailAuthProvider.credential(email, this.state.password);

  firebase.auth().currentUser.linkWithCredential(credential)
  .then((usercred) => {
    var user = usercred.user;
    console.log("Account linking success", user);

    console.log('Patient registred succesfully')
    const usr = {
      country: pays,
      nom: nom,
      prenom: prenom,
      price: 15,
      speciality: speciality,
      urgences: 'false',
      dateNaissance: date,
    }

    firebase.firestore().collection("users").doc(user.uid).set(usr)
    .then(() => {
      console.log('paaaaaaatieeeeent added to firestooooooooooooore !!!!!!!!!!!!!!!')
      this.setState({ isLoading: false })
      this.props.navigation.navigate('Home')   
    })
    .catch((err) => console.error)

  })
    .catch((error) => {
    console.log("Account linking error", error);
  });
}
    
};

_onPressButton() {
  // Call ValidationComponent validate method
  this.validate({
    password: {minlength:7, required: true}
  })

 if( this.validate({
    password: {minlength:7, required: true}
  })) {
        this.handleSignUp()
        console.log('password valid')
  } 
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

  render() {
    const email =  this.props.navigation.getParam('email', 'nothing sent')
    const phoneNumber =  this.props.navigation.getParam('phoneNumber', 'nothing sent')
    const nom =  this.props.navigation.getParam('nom', 'nothing sent')
    const prenom =  this.props.navigation.getParam('prenom', 'nothing sent')
    const date =  this.props.navigation.getParam('date', 'nothing sent')
    const pays =  this.props.navigation.getParam('pays', 'nothing sent')
    const speciality =  this.props.navigation.getParam('speciality', 'nothing sent')
    const isDoctor =  this.props.navigation.getParam('isDoctor', 'nothing sent')

    console.log(email)
    console.log(phoneNumber)
    console.log(nom)
    console.log(prenom)
    console.log(date)
    console.log(pays)
    console.log(speciality)
    console.log(isDoctor)
    return (
      <View style={styles.container}>
         { this.state.isLoading ?
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>
          :  
          <View style={styles.container}>
            <View style={styles.bar_progression}>
            <View style={[styles.bar, styles.activeBar]}/>
            <View style={[styles.bar, styles.activeBar]}/>
            <View style={[styles.bar, styles.activeBar]}/>
            <View style={[styles.bar, styles.activeBar]}/>
            <View style={[styles.bar, styles.activeBar]}/>
            <View style={[styles.bar, styles.activeBar]}/>
            <View style={[styles.bar, styles.activeBar]}/>
            <View style={[styles.bar, styles.activeBar]}/>

          </View>

          <View style={styles.logo_container}>
              <Image source={require('../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
          </View>

          <View style={styles.header_container}>
          <Text style={styles.header}> Choisissez un mot de passe: </Text>
          </View>

          <View style={styles.form_container}>
             <TextInput secureTextEntry style={styles.search_button} onChangeText={ (text) => this.setState({password: text}) } placeholder= {'Mot de passe'} value={this.state.password}/>
          </View>

          <View style={styles.error_container}>
             <Text style={{ color: 'red' }}>
             {this.getErrorMessages()}
             </Text>
          </View>

          <View style={styles.button_container}>
             <Button width= {SCREEN_WIDTH*0.65} text="Soumettre" onPress={this._onPressButton.bind(this) } />
          </View> 
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
bar_progression: {
  flex: 0.05,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  //backgroundColor: 'purple',
},
bar: {
  height: SCREEN_HEIGHT * 0.007,
  width: SCREEN_WIDTH/8.4,
 // marginLeft: SCREEN_WIDTH * 0.015,
  borderRadius: 20,
  backgroundColor: '#cdd6d5'
},
activeBar: {
  backgroundColor: '#48d8fb',
},
logo_container: {
  flex: 0.2,
  //justifyContent: 'center',
  alignItems: 'center',
  //backgroundColor: 'red',
},
logoIcon: {
  height: SCREEN_WIDTH * 0.2,
  width: LOGO_WIDTH,
  marginTop: SCREEN_WIDTH * 0.05
},
header_container: {
  flex: 0.12,
  justifyContent: 'center',
  alignItems: 'center',
  //backgroundColor: 'green',
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
form_container:{
  flex: 0.28,
  alignItems: 'center',
  justifyContent: 'space-evenly',
  //backgroundColor: 'brown',
},
error_container:{
  flex: 0.07,
  alignItems: 'center',
  justifyContent: 'center',
 // backgroundColor: 'green',
},
search_button: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  borderRadius: 50,
  padding: 15,
  paddingLeft: SCREEN_WIDTH*0.1,

  width: SCREEN_WIDTH * 0.8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.32,
  shadowRadius: 5.46,
  elevation: 4,
},
searchText: {
  color: '#b2bbbc',
  marginLeft: SCREEN_WIDTH * 0.03 
},
button_container: {
  flex: 0.28,
  justifyContent: 'flex-start',
  alignItems: 'center',
  //backgroundColor: 'yellow',
  paddingBottom: SCREEN_HEIGHT * 0.01
},
loading_container: {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 100,
  bottom: 0,
  alignItems: 'center',
  justifyContent: 'center'
}
});