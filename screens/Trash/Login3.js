import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, TextInput, Button, Text, Image, TouchableOpacity, Dimensions, FlatList, Animated, KeyboardAvoidingView, StyleSheet  } from 'react-native'

import firebase from 'react-native-firebase'

const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 420/244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo ;
const phoneNumber= '+212654621514'

export default class Login3 extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '+212',
      confirmResult: null,
      status: '',
      verificationId: '',
      showCodeInput: false

    };
  }
  
verifyPhoneNumber = () => {
firebase
  .firestore()
  .collection('users')
  .where('phoneNumber', '==', this.state.phoneNumber)
  .get()
  .then((querySnapshot) => {
    if (!querySnapshot.empty) {
      // User found with this phone number.
      throw new Error('already-exists');
    }

    // change status
    this.setState({ message: 'Sending confirmation code...' });

    // send confirmation OTP
    return firebase.auth().verifyPhoneNumber('+212654621514')
  })
  .then((phoneAuthSnapshot) => {
    // verification sent
    this.setState({
      message: 'Confirmation code sent.',
      verificationId: phoneAuthSnapshot.verificationId,
      confirmResult: 'true' // shows input field such as react-native-confirmation-code-field
    });
    console.log('Code sent'+ phoneAuthSnapshot.code)
  })
  .catch((error) => {
    // there was an error
    let newStatus;
    if (error.message === 'already-exists') {
      newStatus = 'Sorry, this phone number is already in use.';
    } else {
      // Other internal error
      // see https://firebase.google.com/docs/reference/js/firebase.firestore.html#firestore-error-code
      // see https://firebase.google.com/docs/reference/js/firebase.auth.PhoneAuthProvider#verify-phone-number
      // probably 'unavailable' or 'deadline-exceeded' for loss of connection while querying users
      newStatus = 'Failed to send verification code.';
      console.log('Unexpected error during firebase operation: ' + JSON.stringify(error));
    }
  

    this.setState({
      status: newStatus,
      processing: false
    });
  });
}

renderPhoneNumberInput() {
  const { phoneNumber } = this.state;

   return (
     <View style={{ padding: 25 }}>
       <Text>Enter phone number:</Text>
       <TextInput
         autoFocus
         style={{ height: 40, marginTop: 15, marginBottom: 15 }}
         onChangeText={value => this.setState({ phoneNumber: value })}
         placeholder={'Phone number ... '}
         value={phoneNumber}
       />
       <Button title="Sign In" color="green" onPress={this.verifyPhoneNumber} />
     </View>
   );
 }

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
}

/*renderMessage() {
  const { message } = this.state.message;

  if (!message.length) return null;

  return (
    <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
  );
}*/


  render() {
    const { user, confirmResult } = this.state;
    return (
        <View style={{ flex: 1 }}>
        
         {!user && !confirmResult && this.renderPhoneNumberInput()}

         {!user && confirmResult && this.renderVerificationCodeInput()}
        
         {user && (
          <View
            style={{
              padding: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#77dd77',
              flex: 1,
            }}
          >
            <Image source={{ uri: successImageUri }} style={{ width: 100, height: 100, marginBottom: 25 }} />
            <Text style={{ fontSize: 25 }}>Signed In!</Text>
            <Text>{JSON.stringify(user)}</Text>
            <Button title="Sign Out" color="red" onPress={this.signOut} />
          </View>
        )}

    </View>
  );
}

}