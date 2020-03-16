//Presentation.js
//TEST

import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, Button, Text, Image, TouchableOpacity, Dimensions, FlatList, Animated, StyleSheet  } from 'react-native'

import { withNavigation } from 'react-navigation';

import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import firebase from 'react-native-firebase';


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioFooter = 254/668; // The actaul icon footer size is 254 * 668
const FOOTER_ICON_HEIGHT = Dimensions.get("window").width * ratioFooter ; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420/244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo ;

class LandingScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.state= {
      isUser: false
    }
  }

  componentDidMount() {
this.UserAuthStatus()
  }

  UserAuthStatus = () => {
    firebase 
    .auth()
    .onAuthStateChanged (user => {
      if (user) {
        this.setState({isUser: true})
      } else {
        this.setState({isUser: false})
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

  render() {
    console.log(firebase.auth().currentUser)
    console.log('LandingScreen')
    return (
      <View style={styles.container}>
       <View style={styles.logo_container}>
              <Image source={require('../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
          </View>

          <View style={styles.search_container}>
             <TouchableOpacity style={styles.search_button}
                onPress={() => this.props.navigation.navigate('Search')}> 
                    <Icon1 name="search" size={20} color="#afbbbc" />
                    <Text style={styles.searchText}> Rechercher un médecin </Text>
             </TouchableOpacity>         
          </View>

        
          
              {this.state.isUser ?   <View style={styles.cnxButton_container}>
                                             <TouchableOpacity
                                              onPress={() => this.props.navigation.navigate('NextAppointments') }>         
                                              <LinearGradient 
                                               start={{x: 0, y: 0}} 
                                               end={{x: 1, y: 0}} 
                                               colors={['#b3f3fd', '#84e2f4', '#5fe0fe']} 
                                               style={styles.linearGradient}>
                                                 <Text style={styles.buttonText}> Mes Consultations </Text>
                                              </LinearGradient>
                                              </TouchableOpacity> 

                                   <TouchableOpacity
                                   onPress={this.signOutUser}>         
                                   <LinearGradient 
                                     start={{x: 0, y: 0}} 
                                     end={{x: 1, y: 0}} 
                                     colors={['#b3f3fd', '#84e2f4', '#5fe0fe']} 
                                     style={styles.linearGradient}>
                                       <Text style={styles.buttonText}> Se déconnecter </Text>
                                   </LinearGradient>
                                   </TouchableOpacity>           
                                   </View>
                         
                                          : 
                                          <View style={styles.cnxButton_container}>
                                              <TouchableOpacity
                                              onPress={() => this.props.navigation.navigate('Login') }>         
                                              <LinearGradient 
                                                start={{x: 0, y: 0}} 
                                                end={{x: 1, y: 0}} 
                                                colors={['#b3f3fd', '#84e2f4', '#5fe0fe']} 
                                                style={styles.linearGradient}>
                                                  <Text style={styles.buttonText}> Connexion/Inscription </Text>
                                              </LinearGradient>
                                              </TouchableOpacity>
                                          </View> }
              

          <View style={styles.terms_container}>
          <Text style={styles.termsText}> En cliquant sur Inscription, vous acceptez les <Text onPress={() => {alert("Conditions générales d'utilisation");}} style={styles.termsLink}>
            Conditions{'\n'}générales d'utilisation</Text> 
          </Text>
          <TouchableOpacity style={{ marginLeft: SCREEN_WIDTH * 0.025}}>
              <Icon2 name="info" size={20} color="#8febfe" />
          </TouchableOpacity>
          </View>  


      {/*  
        <View style={styles.terms_container}>
              <View style={styles.termsRow1}>
              <Text style={styles.termsText1}> En cliquant sur Inscription, vous acceptez les </Text>
              <TouchableOpacity>
              <Text style={styles.termsText2}>Conditions </Text>
              </TouchableOpacity>
              <TouchableOpacity>
              <Icon2 name="info" size={20} color="#8febfe" />
              </TouchableOpacity>
              </View>

              <View style={styles.termsRow2}>
              <TouchableOpacity >
              <Text style={styles.termsText2}>générales d'utilisation</Text>
              </TouchableOpacity>
              </View>  

              <TouchableOpacity> 
              </TouchableOpacity> 
      </View> */}

          <View style={styles.footer_container}>
              <Image source={require('../assets/footerIconReduced.png')} style={styles.footerIcon} />
          </View>  
      </View>

  );
}
}

export default withNavigation(LandingScreen);

const styles = StyleSheet.create({
container: {
  flex: 1,
  //justifyContent: 'center',
  //alignItems: 'center',
  backgroundColor: '#ffffff',
},
logo_container: {
  flex: 0.25,
  //justifyContent: 'center',
  alignItems: 'center',
  //backgroundColor: 'red',
},
logoIcon: {
  height: SCREEN_WIDTH * 0.25,
  width: LOGO_WIDTH,
  marginTop: SCREEN_WIDTH * 0.05
},
search_container: {
  flex: 0.23,
  justifyContent: 'center',
  alignItems: 'center',
 // backgroundColor: 'green',
},
search_button: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  borderRadius: 20,
  padding: 13,
  width: SCREEN_WIDTH * 0.8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.32,
  shadowRadius: 5.46,
  elevation: 9,
},
searchText: {
  color: '#b2bbbc',
  marginLeft: SCREEN_WIDTH * 0.03 
},
cnxButton_container: {
  flex: 0.38,
  justifyContent: 'flex-end',
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
terms_container: {
flex: 0.06,
//alignItems: 'center',
justifyContent: 'center',
flexDirection: 'row',
marginLeft: SCREEN_WIDTH * 0.01
//backgroundColor: 'brown',
},

termsText: {
  color: '#c3c9c9',
  fontSize: 11,
  //backgroundColor: 'green'
},
termsLink: {
  textDecorationLine: 'underline',
  color: '#b0bcbf',
  fontSize: 11,
  fontWeight: 'bold'
},
footer_container: {
  flex: 0.25,
  justifyContent: 'flex-end',
  //alignItems: 'stretch',
  //backgroundColor: 'brown',
},
footerIcon: {
    width: SCREEN_WIDTH,
    height: FOOTER_ICON_HEIGHT ,
},

});