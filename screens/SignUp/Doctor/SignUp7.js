//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)

import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet  } from 'react-native'

import PhoneInput from "react-native-phone-input";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 420/244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo ;

export default class SignUp7 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      valid: "",
      type: "",
      value: "",
      errorMessage: null
    }

    this.updateInfo = this.updateInfo.bind(this);
    this.renderInfo = this.renderInfo.bind(this);
  }

  updateInfo() {
    this.setState({
      valid: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      value: this.phone.getValue()
    });
  }

  renderInfo() {
    if (this.state.value) {
      return (
        <View style={styles.info}>
          <Text>
            Is Valid:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {this.state.valid.toString()}
            </Text>
          </Text>
          <Text>
            Type: <Text style={{ fontWeight: "bold" }}>{this.state.type}</Text>
          </Text>
          <Text>
            Value:{" "}
            <Text style={{ fontWeight: "bold" }}>{this.state.value}</Text>
          </Text>
        </View>
      );
    }
  }

  updateInfoandNavigate(email) {
    //const email =  this.props.navigation.getParam('email', 'nothing sent')
    const pays =  this.props.navigation.getParam('pays', 'nothing sent')
    const nom =  this.props.navigation.getParam('nom', 'nothing sent')
    const prenom =  this.props.navigation.getParam('prenom', 'nothing sent')
    const date =  this.props.navigation.getParam('date', 'nothing sent')
    const speciality =  this.props.navigation.getParam('speciality', 'nothing sent')
    const isDoctor =  this.props.navigation.getParam('isDoctor', 'nothing sent')

    this.setState({
      valid: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      value: this.phone.getValue()
    }, () => {
     // console.log('value !!!!' + this.state.value)
      if (this.state.valid) {
      this.setState({errorMessage: null})
      this.props.navigation.navigate('PhoneAuth0', {email: email, pays: pays, nom: nom, prenom: prenom, date: date, speciality: speciality, phoneNumber: this.state.value, isDoctor: isDoctor })   //Add documents uploaded once defined 
      }
      else 
      this.setState({ errorMessage: 'Numéro de téléphone invalide' })
    });
  }

 /* onPress () {
    this.updateInfo()
    this.props.navigation.navigate('SignUp3', {email: email, phone: this.state.value} )
  }*/

  render() {
    const email =  this.props.navigation.getParam('email', 'nothing sent')
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
           <View style={[styles.bar_D, styles.activeBar]}/>
           <View style={[styles.bar_D, styles.activeBar]}/>
           <View style={[styles.bar_D, styles.activeBar]}/>
           <View style={[styles.bar_D, styles.activeBar]}/>
           <View style={[styles.bar_D, styles.activeBar]}/>      
           <View style={styles.bar_D}/>
         </View>}

          <View style={styles.logo_container}>
              <Image source={require('../../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
          </View>

          <View style={styles.header_container}>
          <Text style={styles.header}> Quel est votre numéro de téléphone ? </Text>
         {/* <Text>{email}</Text> */}
          </View>

          <View style={styles.form_container}>
          <PhoneInput ref={ref => { this.phone = ref; }} />            
          </View>

          <View style={styles.error_container}>
             <Text style={{ color: 'red' }}>
             {this.state.errorMessage}
             </Text>
          </View>

          <View style={styles.button_container}>
              <TouchableOpacity
                onPress={ () => this.updateInfoandNavigate(email) }>         
                <LinearGradient 
                  start={{x: 0, y: 0}} 
                  end={{x: 1, y: 0}} 
                  colors={['#b3f3fd', '#84e2f4', '#5fe0fe']} 
                  style={styles.linearGradient}>
                  <Text style={styles.buttonText}> Suivant </Text>
                </LinearGradient>
              </TouchableOpacity>
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
/*info: {
  // width: 200,
  borderRadius: 5,
  backgroundColor: "#f0f0f0",
  padding: 10,
  marginTop: 20
},*/
});