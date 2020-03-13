//Presentation.js
//App presentation (no slides)

//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)

import React from 'react'
import MyComponant from './MyComponant'
import LinearGradient from 'react-native-linear-gradient';
import { View, TextInput, Button, Text, Image, TouchableOpacity, Dimensions, FlatList, Animated, StyleSheet  } from 'react-native'


//import {Block} from '../components/Block'
import { theme } from '../constants';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const activeColor = '#93eafe'
const passiveColor = '#cdd6d5'
const smallBullet = 9
const largeBullet = 15

const ratio = 254/668; // The actaul icon footer size is 254 * 668
const FOOTER_ICON_HEIGHT = Dimensions.get("window").width * ratio ; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

export default class Test1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      ActiveBullet: 1,
      ColorBullet1: activeColor,
      ColorBullet2: passiveColor,
      ColorBullet3: passiveColor,
      ButtonText: 'Suivant',
      sizeBullet1: largeBullet,
      sizeBullet2: smallBullet,
      sizeBullet3: smallBullet,
      textHeader1: 'Bienvenue sur',
      textHeader2: 'DoctoNeed',
      descriptionText1: 'Lorem ipsum dolor sit amet, consectetuer',
      descriptionText2: 'adipiscing elit, sed diam nonummy', 
      isHidden: false,
    }
  }

  bullet1Style = () => {
    return {
    backgroundColor: this.state.ColorBullet1,
    width: this.state.sizeBullet1,
    height: this.state.sizeBullet1,
    borderRadius: 50,
    marginRight: 22
    }
  }

  bullet2Style = () => {
    return {
    backgroundColor: this.state.ColorBullet2,
    width: this.state.sizeBullet2,
    height: this.state.sizeBullet2,
    borderRadius: 50,
    //marginRight: 10
    }
  }

  bullet3Style = () => {
    return {
    backgroundColor: this.state.ColorBullet3,
    width: this.state.sizeBullet3,
    height: this.state.sizeBullet3,
    borderRadius: 50,
    marginLeft: 22
    }
  }

  // Makes the next bullet active (blue) after on "Next" Button Press
  nextBullet = () => {
    this.setState({ ActiveBullet: this.state.ActiveBullet + 1 }, () => {
        console.log(this.state.ActiveBullet)
        // code called after the setState is finished. (callback)
        if (this.state.ActiveBullet == 1) {
          this.setState({ ColorBullet1: activeColor, ColorBullet2: passiveColor, ColorBullet3: passiveColor,  })
          this.setState({ sizeBullet1: largeBullet, sizeBullet2: smallBullet, sizeBullet3: smallBullet })
        }
       if (this.state.ActiveBullet == 2) {
       this.setState({ ColorBullet1: passiveColor, ColorBullet2: activeColor, ColorBullet3: passiveColor,  }) //handle bullets (active/passive)
       this.setState({ sizeBullet1: smallBullet, sizeBullet2: largeBullet, sizeBullet3: smallBullet }) // Increase size of the active bullet
       this.setState({ textHeader1: 'Lorem ipsum' }) // change text description
       this.setState({ isHidden: true })
     }
     
     else if (this.state.ActiveBullet == 3) {
       this.setState({ ColorBullet1: passiveColor, ColorBullet2: passiveColor, ColorBullet3: activeColor,  })
       this.setState({ sizeBullet1: smallBullet, sizeBullet2: smallBullet, sizeBullet3: largeBullet })
       this.setState({ ButtonText: 'Commencer' })
     } 

     else {
      this.props.navigation.navigate('Test3')
     }  
  })   
} 

  // Display Presentation of The app on first launch
  displayPresentation = () => {
    return <View style={styles.presentation_container}>
    <Text style={styles.textHeader1}>{this.state.textHeader1}</Text>
    {this.state.isHidden? null : <Text style={styles.textHeader2}>{this.state.textHeader2}</Text> }  
    <Text style={styles.textPresentationLine1}>{this.state.descriptionText1}</Text>
    <Text style={styles.textPresentationLinex}>{this.state.descriptionText2}</Text>          
  </View>
  }

  render() {
    const { ActiveBullet } = this.state
    return (
      <View style={styles.container}>
          <View style={styles.logo_container}>
              <Image source={require('../assets/logoIcon.png')} style={styles.logoIcon} />
          </View>

          {this.displayPresentation()} 

          <View style={styles.steps_container}>
            <Animated.View style={this.bullet1Style()}>
            </Animated.View>
            <Animated.View style={this.bullet2Style()}>
            </Animated.View>
            <Animated.View style={this.bullet3Style()}>
            </Animated.View>          
          </View>
          <View style={styles.buttons_container}>

              <TouchableOpacity
                onPress={this.nextBullet}>         
                <LinearGradient 
                  start={{x: 0, y: 0}} 
                  end={{x: 1, y: 0}} 
                  colors={['#b3f3fd', '#84e2f4', '#5fe0fe']} 
                  style={styles.linearGradient}>
                    <Text style={styles.buttonText}> {this.state.ButtonText} </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.loginButton_container}>
              <Text style={styles.text}> Vous avez un compte?  </Text>
              {/*Horizontal Gradient*/}
              <TouchableOpacity>
              <Text style={{ textDecorationLine: 'underline', color: '#70e2f9' }}>Connectez-vous</Text>
              </TouchableOpacity>
              </View>
          </View>
          <View style={styles.footer_container}>
              <Image source={require('../assets/footerIconReduced.png')} style={styles.footerIcon} />
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
  flex: 0.22,
  //justifyContent: 'center',
  alignItems: 'center',
  //backgroundColor: 'red',
},
logoIcon: {
  height: SCREEN_WIDTH * 0.17,
  width: SCREEN_WIDTH * 0.17,
  marginTop: SCREEN_WIDTH * 0.05
},
presentation_container: {
  flex: 0.20,
  //justifyContent: 'center',
  //alignItems: 'center',
  //backgroundColor: 'green',
},
steps_container: {
  flex: 0.05,
  //justifyContent: 'center',
  //alignItems: 'center',
  flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  //backgroundColor: 'blue',
},

buttons_container: {
  flex: 0.19,
  justifyContent: 'center',
  alignItems: 'center',
  //backgroundColor: 'yellow',
},
loginButton_container: {
  flex: 0.17,
  flexDirection: 'row',
  marginTop: 10,
  //justifyContent: 'center',
  alignItems: 'center',
  //backgroundColor: 'yellow',
},
footer_container: {
  flex: 0.34,

  justifyContent: 'flex-end',
  //alignItems: 'stretch',
  //backgroundColor: 'brown',
},
footerIcon: {
    width: SCREEN_WIDTH,
    height: FOOTER_ICON_HEIGHT ,
},
accountView: {
  flex: 1,
  flexDirection: "row",
},
linearGradient: {
  paddingLeft: 15,
  paddingRight: 15,
  borderRadius: 5,
  marginTop:16,
  width: SCREEN_WIDTH * 0.75,
  borderRadius: 20
},
buttonText: {
  fontSize: 18,
  fontFamily: 'Gill Sans',
  textAlign: 'center',
  margin: 10,
  color: '#ffffff',
  backgroundColor: 'transparent',
},
text: {
  fontSize: 12,
  fontFamily: 'Gill Sans',
  textAlign: 'center',
 // margin: 10,
  color: '#959a98',
  backgroundColor: 'transparent',
},
textHeader1: {
  fontSize: 26,
  fontWeight: 'bold',
  fontFamily: 'Gill Sans',
  textAlign: 'center',
 // margin: 10,
  color: 'black',
  //backgroundColor: 'blue',
},
textHeader2: {
  fontSize: 26,
  fontWeight: 'bold',
  fontFamily: 'Gill Sans',
  textAlign: 'center',
 // margin: 10,
  color: 'black',
 // backgroundColor: 'green',
},
textPresentationLine1: {
  fontSize: 12,
  fontFamily: 'Gill Sans',
  textAlign: 'center',
  marginTop: 10,
  color: '#8f9595',
  backgroundColor: 'transparent',
},
textPresentationLinex: {
  fontSize: 12,
  fontFamily: 'Gill Sans',
  textAlign: 'center',
  //marginTop: 10,
  color: '#8f9595',
  backgroundColor: 'transparent',
},
animation_view1: {
  backgroundColor: '#93eafe',
  width: 20,
  height: 20,
  borderRadius: 50,
  marginRight: 10
},
animation_view2: {
  backgroundColor: '#cdd6d5',
  width: 20,
  height: 20,
  borderRadius: 50,
  //marginLeft: 5
},
animation_view3: {
  backgroundColor: '#cdd6d5',
  width: 20,
  height: 20,
  borderRadius: 50,
  marginLeft: 10
},
});