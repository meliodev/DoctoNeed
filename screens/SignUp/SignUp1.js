//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)

import React from 'react'
import { View, TextInput, Text, Image, Dimensions, StyleSheet } from 'react-native'

//Redux test
//import { connect } from 'react-redux'
import ValidationComponent from 'react-native-form-validator';

import Button from '../../components/Button';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 420/244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo ;

export default class SignUp1 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    }
  }

  componentDidUpdate() {
    console.log("componentDidUpdate : ")
    console.log(this.props.favoritesFilm)
  }

  /*Redux test
  _toggleFavorite() {
    const action = { type: "TOGGLE_FAVORITE", value: this.state.email }
    this.props.dispatch(action)
}
*/

  _onPressButton() {
    const isDoctor =  this.props.navigation.getParam('isDoctor', 'nothing sent')

    // Call ValidationComponent validate method
    this.validate({
      email: {email: true, required: true}
    })

   if( this.validate({
      email: {email: true, required: true}
    })) {
      this.removeErrorMessages()
      this.props.navigation.navigate('SignUp2', {email: this.state.email.toString(), isDoctor: isDoctor })
    } 
  }

  render() {
    const isDoctor =  this.props.navigation.getParam('isDoctor', 'nothing sent')

    return (
      <View style={styles.container}>
          {isDoctor === 'nothing sent' ? 
          <View style={styles.bar_progression}>
            <View style={[styles.bar, styles.activeBar]}/>
            <View style={styles.bar}/>
            <View style={styles.bar}/>
            <View style={styles.bar}/>
            <View style={styles.bar}/>
            <View style={styles.bar}/>
          </View>
           : 
          <View style={styles.bar_progression}>
           <View style={[styles.bar_D, styles.activeBar]}/>
           <View style={styles.bar_D}/>
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
          <Text style={styles.header}> Quel est votre adresse mail ? </Text>
          </View>

          <View style={styles.form_container}>
             <TextInput style={styles.search_button} onChangeText={ (text) => this.setState({email: text}) } placeholder= {'Adresse mail'} value={this.state.email}/>
          </View>

          <View style={styles.error_container}>
             <Text style={{ color: 'red' }}>
             {this.getErrorMessages()}
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
 // backgroundColor: 'green',
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
  justifyContent: 'center',
 // backgroundColor: 'brown',
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

/*Redux test
const mapStateToProps = (state) => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}

export default connect(mapStateToProps)(SignUp1)
*/