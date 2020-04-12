//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)

import React from 'react'
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native'

import Button from '../../components/Button';

import CountryPicker, { getAllCountries, getCallingCode } from 'react-native-country-picker-modal';

import ValidationComponent from 'react-native-form-validator';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 420/244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo ;

export default class SignUp2 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      pays: '',
    }
  }

  onSelect (country) {
    this.setState({ pays: country.name }) 
    console.log(country.name)
  }

  placeHolder = () => {
    return this.state.pays ? <Text style={styles.pays1}> {this.state.pays} </Text> : <Text style={styles.placeHolder}> Choisir un pays </Text>
  }

  _onPressButton() {
    // Call ValidationComponent validate method
    const email =  this.props.navigation.getParam('email', 'nothing sent')
    const isDoctor =  this.props.navigation.getParam('isDoctor', 'nothing sent')
    
    this.validate({
      pays: {required: true},
    })

   if( this.validate({ pays: {required: true} }) ) {

      this.removeErrorMessages()

      this.props.navigation.navigate('SignUp3', {email: email, pays: this.state.pays, isDoctor: isDoctor })  
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
            <View style={styles.bar}/>
            <View style={styles.bar}/>
            <View style={styles.bar}/>
            <View style={styles.bar}/>
          </View>
           : 
          <View style={styles.bar_progression}>
           <View style={[styles.bar_D, styles.activeBar]}/>
           <View style={[styles.bar_D, styles.activeBar]}/>
           <View style={styles.bar_D}/>
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
             <Text style={styles.header}> Quel est votre pays de résidence ? </Text>
          </View>

          <View style={styles.form_container}>
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

          <View style={styles.error_container}>
             <Text style={{ color: 'red' }}>
             {this.getErrorMessages()}
             </Text>
          </View>

          <View style={styles.button_container}>
             <Button width={SCREEN_WIDTH*0.65} text="Suivant" onPress={this._onPressButton.bind(this) } />
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
placeHolder: {
  color: '#d5d5d5'
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