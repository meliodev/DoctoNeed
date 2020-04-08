//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)

import React from 'react'
import { View, Text, Image, Dimensions, StyleSheet  } from 'react-native'

import Button from '../../components/Button';

import ValidationComponent from 'react-native-form-validator';

import DatePicker from 'react-native-datepicker'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 420/244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo ;

export default class SignUp4 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      errorMessage: null,
    }
  }

  _onPressButton() {
    // Call ValidationComponent validate method
    const email =  this.props.navigation.getParam('email', 'nothing sent')
    const pays =  this.props.navigation.getParam('pays', 'nothing sent')
    const nom =  this.props.navigation.getParam('nom', 'nothing sent')
    const prenom =  this.props.navigation.getParam('prenom', 'nothing sent')
    const isDoctor =  this.props.navigation.getParam('isDoctor', 'nothing sent')
    
     if(this.state.date === '') {
         this.setState({errorMessage: 'Le champ "Date de naissance" est obligatoire'})
     }
  
     else {
        this.setState({errorMessage: null})
        if(isDoctor !== 'nothing sent'){
          this.props.navigation.navigate('SignUp5D', {email: email, pays: pays, nom: nom, prenom: prenom, date: this.state.date, isDoctor: isDoctor })
        }
        else 
        this.props.navigation.navigate('SignUp5P', {email: email, pays: pays, nom: nom, prenom: prenom, date: this.state.date, isDoctor: isDoctor })
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
            <View style={[styles.bar, styles.activeBar]}/>
            <View style={styles.bar}/>
            <View style={styles.bar}/>
          </View>
           : 
          <View style={styles.bar_progression}>
           <View style={[styles.bar_D, styles.activeBar]}/>
           <View style={[styles.bar_D, styles.activeBar]}/>
           <View style={[styles.bar_D, styles.activeBar]}/>
           <View style={[styles.bar_D, styles.activeBar]}/>
           <View style={styles.bar_D}/>
           <View style={styles.bar_D}/>
           <View style={styles.bar_D}/>
           <View style={styles.bar_D}/>
         </View>}

          <View style={styles.logo_container}>
              <Image source={require('../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
          </View>

          <View style={styles.header_container}>
          <Text style={styles.header}> Quel est votre date de naissance ? </Text>
          </View>

          <View style={styles.form_container}>
           
           <DatePicker
           style={{width: 300}}
           date={this.state.date}
           mode="date"
           placeholder="Jour - Mois - Année"
           format="DD-MM-YYYY"
           //minDate="1920-01-01"
           //maxDate="2000-01-01"
           confirmBtnText="Confirm"
           cancelBtnText="Cancel"
           customStyles={{
             dateIcon: {
               position: 'absolute',
               left: 90,
               top: 40,
               marginLeft: 0
             },
            dateInput: {
              marginLeft: 40,
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 20,
              padding: 15,
              shadowColor: "#000",
              //shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.32,
              shadowRadius: 5.46,
              elevation: 9,
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {this.setState({date: date})}}
      />    
          </View>
             <View style={styles.error_container}>
             <Text style={{ color: 'red' }}>
             {this.state.errorMessage}
             </Text>
          </View>

          <View style={styles.button_container}>
             <Button text="Suivant" onPress={this._onPressButton.bind(this) } />
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
  //flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  //backgroundColor: 'brown',
},
error_container:{
  flex: 0.07,
  alignItems: 'center',
  justifyContent: 'center',
 // backgroundColor: 'green',
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
},


});