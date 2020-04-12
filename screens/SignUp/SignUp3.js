//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)

import React from 'react'

import { View, Text, TextInput, Image, Dimensions, StyleSheet } from 'react-native'

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
      nom: '',
      prenom: '',
      errorMessage1: null,
      errorMessage2: null
    }
  }

  componentDidMount() {

    const { currentUser } = firebase.auth()

    if (currentUser) {
     console.log('UID !!!!!!!!!!!! '+currentUser.uid)
    }
    else console.log('No user signed in !!!!!!!!!!!!!!!!!!!!!!')
  }

  _onPressButton() {

    const email =  this.props.navigation.getParam('email', 'nothing sent')
    const pays =  this.props.navigation.getParam('pays', 'nothing sent')
    const isDoctor =  this.props.navigation.getParam('isDoctor', 'nothing sent')

   if(this.state.nom === '' && this.state.prenom !== '') {
       this.setState({errorMessage1: 'Le champ "nom" est obligatoire'})
       this.setState({errorMessage2: ''})
   } 
   else if(this.state.prenom === '' && this.state.nom !== '') {
       this.setState({errorMessage1: ''})
       this.setState({errorMessage2: 'Le champ "prénom" est obligatoire'})
   }
   else if(this.state.prenom === '' && this.state.nom === '') {
       this.setState({errorMessage1: 'Le champ "nom" est obligatoire'})
       this.setState({errorMessage2: 'Le champ "prénom" est obligatoire'})
   }

   else {
      this.setState({errorMessage1: null, errorMessage2: null})
      this.props.navigation.navigate('SignUp4', {email: email, pays: pays, nom: this.state.nom, prenom: this.state.prenom, isDoctor: isDoctor })
    } 
  }

  render() {

    const isDoctor =  this.props.navigation.getParam('isDoctor', 'nothing sent')
    return (
      <View style={styles.container}>
           {isDoctor === 'nothing sent' ? 
          <View style={styles.bar_progression}>
            <View style={[styles.bar, styles.activeBar]}/>
            <View style={[styles.bar, styles.activeBar]}/>
            <View style={[styles.bar, styles.activeBar]}/>
            <View style={styles.bar}/>
            <View style={styles.bar}/>
            <View style={styles.bar}/>
          </View>
           : 
          <View style={styles.bar_progression}>
           <View style={[styles.bar_D, styles.activeBar]}/>
           <View style={[styles.bar_D, styles.activeBar]}/>
           <View style={[styles.bar_D, styles.activeBar]}/>
           <View style={styles.bar_D}/>
           <View style={styles.bar_D}/>
           <View style={styles.bar_D}/>
           <View style={styles.bar_D}/>
           <View style={styles.bar_D}/>
         </View>}

          <View style={styles.logo_container}>
              <Image source={require('../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
          </View>

          <View style={styles.header_container}>
          <Text style={styles.header}> Quel est votre nom et prénom ? </Text>
          </View>

          <View style={styles.form_container}>
             <TextInput style={styles.search_button} onChangeText={ (text) => this.setState({nom: text}) } placeholder= {'Votre nom'} value={this.state.nom}/>
             <TextInput style={styles.search_button} onChangeText={ (text) => this.setState({prenom: text}) } placeholder= {'Votre prénom'} value={this.state.prenom}/>     
          </View>
          <View style={styles.error_container}>
             <Text style={{ color: 'red' }}>
             {this.state.errorMessage1}
             </Text>
             <Text style={{ color: 'red' }}>
             {this.state.errorMessage2}
             </Text>
          </View>

          <View style={styles.button_container}>
              <Button width= {SCREEN_WIDTH*0.65} text="Suivant" onPress={this._onPressButton.bind(this) } />
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
bar_progression: {
  flex: 0.05,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  //backgroundColor: 'purple',
},
bar: {
  height: SCREEN_HEIGHT * 0.007,
  width: SCREEN_WIDTH/6.2,
 // marginLeft: SCREEN_WIDTH * 0.015,
  borderRadius: 20,
  backgroundColor: '#cdd6d5'
},
bar_D: {
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
});