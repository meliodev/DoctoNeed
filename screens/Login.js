//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)

import React from 'react'
import { View, TextInput, Text, Image, Dimensions, ActivityIndicator, StyleSheet  } from 'react-native'

import firebase from 'react-native-firebase' 

import Button from '../components/Button';

//const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';
//import DisplayLoading from '../util/DisplayLoading';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 420/244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo ;

export default class Login extends React.Component {

    state = { email: '', password: '', errorMessage: null, message: '', confirmResult: null,
              user: null, codeInput: '', phoneNumber: '', isLoading: false
            }


     /* signIn = () => {
        const { phoneNumber } = this.state;
        this.setState({ message: 'Sending code ...' });
    
        firebase.auth().signInWithPhoneNumber(phoneNumber)
          .then(confirmResult => this.setState({ confirmResult, message: 'Code has been sent!' }))
          .catch(error => this.setState({ message: `Sign In With Phone Number Error: ${error.message}` }));
      };*/
/*
      signOut = () => {
        firebase.auth().signOut();
      }*/

      renderMessage() {
        const { message } = this.state;
    
        if (!message.length) return null;
    
        return (
          <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
        );
      }
    
  
    handleLogin = () => {
     // this.setState({ isLoading: true })
      const { email, password } = this.state
      
      if (this.state.email && this.state.password) {
      this.setState({isLoading: true})
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((cred) => {
          // +212654621514 is a phone number test registred on FireBase.
            firebase.firestore().collection("users").doc(cred.user.uid).get().then(doc => {
            this.setState({phoneNumber: '+212654621514'})
            firebase.auth().signOut    
            this.setState({isLoading: false})
            this.props.navigation.navigate('PhoneAuth', {email: this.state.email.toString(), password: this.state.password.toString(), phoneNumber: this.state.phoneNumber})
        }).catch(error => alert('Erreur! Veuillez réessayer de vous connecter.'))

        }).catch(error => { this.setState({isLoading: false})
                            alert('Mot de passe et/ou adresse email non valide(s).')})
      }

        else {
          alert('Veuillez saisir votre email et votre mot de passe.')
        }

      /*  .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
      
          if (errorCode === 'auth/wrong-password') {
            alert('Mot de passe ou adresse email non valide.');
          } 
          if (errorCode === 'auth/invalid-email') {
            alert('Mot de passe et/ou adresse email non valide(s).');
          } 
          if (errorCode === 'auth/unknown') {
            alert('Mot de passe et/ou adresse email non valide(s).');
          } 
          if (errorCode === 'auth/user-disabled') {
            alert('Mot de passe et/ou adresse email non valide(s).');
          } 
          if (errorCode === 'auth/user-not-found') {
            alert('Mot de passe et/ou adresse email non valide(s).');
          } 
              else {
              alert(error.code + '. ' + error.message);
            }
        });*/
      
    }

    /*
    renderVerificationCodeInput() {
      const { codeInput } = this.state;
  
      return (
        <View style={{ marginTop: 25, padding: 25 }}>
          <Text>Enter verification code below:</Text>
          <TextInput
            autoFocus
            style={{ height: 40, marginTop: 15, marginBottom: 15 }}
            onChangeText={value => this.setState({ codeInput: value })}
            placeholder={'Code ... '}
            value={codeInput}
          />
          <Button title="Confirm Code" color="#841584" onPress={this.confirmCode} />
        </View>
      );
    }*/
/*
    confirmCode = () => {
      const { codeInput, confirmResult } = this.state;
  
      if (confirmResult && codeInput.length) {
        confirmResult.confirm(codeInput)
          .then((user) => {
            this.setState({ message: 'Code Confirmed!', user: 'true' });
          })
          .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
      }
    };*/

  render() {
    const { user, confirmResult, isLoading } = this.state;
    return (
      <View style={styles.container}>
      {isLoading
        ? <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
          </View>

        : <View style={styles.container}>
              
         <View style={styles.bar_progression}>
         </View>

         {/* Display Message Success/Error */}
         {this.renderMessage()}

         <View style={styles.logo_container}>
             <Image source={require('../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
         </View>

         <View style={styles.header_container}>
         <Text style={styles.header}> Se connecter </Text>
         </View>

         <View style={styles.form_container}>
            <TextInput style={styles.search_button} onChangeText={ (text) => this.setState({email: text}) } placeholder= {'Votre email'} value={this.state.email}/>
            <TextInput secureTextEntry style={styles.search_button} onChangeText={ (text) => this.setState({password: text}) } placeholder= {'Votre mot de passe'} value={this.state.password}/>   
         </View>

         <View style={styles.button_container}>
             <Button text="Se Connecter" onPress={ this.handleLogin } />
             <Text style={styles.text}>Vous n'avez pas de compte? <Text onPress={() => this.props.navigation.navigate('SignUp1')} style={{ textDecorationLine: 'underline', color: '#70e2f9', fontFamily: 'Avenir', }}>
             Inscrivez-vous</Text> 
             </Text>
         </View> 
   </View>
      }
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
  flex: 0.1,
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
  flex: 0.37,
  alignItems: 'center',
  justifyContent: 'space-evenly',
  //backgroundColor: 'brown',
},
search_button: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  borderRadius: 22,
  padding: 15,
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
text: {
    color: '#8f9595',
    fontFamily: 'Avenir',
    fontSize: SCREEN_HEIGHT * 0.018,
    marginTop: SCREEN_HEIGHT*0.02
    //textAlign: 'center',
   //backgroundColor: 'yellow',
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