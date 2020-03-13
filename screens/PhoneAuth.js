import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ActivityIndicator,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import Button from '../components/Button';
import CodeInput from '../components/CodeInput';

import firebase from 'react-native-firebase'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const imageUrl = 'https://www.shareicon.net/data/512x512/2016/07/19/798524_sms_512x512.png';

export default class PhoneAuth extends Component {
  static getDefaultState() {
    return {
      error: '',
      codeInput: '',
      auto: Platform.OS === 'android',
      autoVerifyCountDown: 0,
      sent: false,
      started: false,
      user: null,
    };
  }

  constructor(props) {
    super(props);
    this.timeout = 20;
    this._autoVerifyInterval = null;
    this.state = PhoneAuth.getDefaultState();
  }

  componentDidMount() {
    this.signIn()
}

  _tick() {
    this.setState({
      autoVerifyCountDown: this.state.autoVerifyCountDown - 1,
    });
  }

  /**
   * Called when confirm code is pressed - we should have the code and verificationId now in state.
   */
  afterVerify = () => {
    const { codeInput, verificationId } = this.state;
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      codeInput
    );

    // TODO do something with credential for example:
   /* firebase
      .auth()
      .signInWithCredential(credential)
      .then(user => {
        console.log('PHONE AUTH USER ->>>>>', user);
        this.setState({ user: user });
      })
      .catch(console.error);*/
     // const email = 'Rn@gmail.com'
      //const password = 'Azerty111'
      const email =  this.props.navigation.getParam('email', 'nothing sent')
      const password =  this.props.navigation.getParam('password', 'nothing sent')

      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => this.props.navigation.navigate('LandingScreen'))
        .catch(error => console.log(error.message))

      //firebase.auth().currentUser.linkWithCredential(credential);
  };

  signIn = () => { 
    const phoneNumber =  this.props.navigation.getParam('phoneNumber', 'nothing sent')
    console.log('signIn method received the phone number: ' + phoneNumber)
    //const { phoneNumber } = this.state;
    this.setState(
      {
        error: '',
        started: true,
        autoVerifyCountDown: this.timeout,
      },
      () => {
        firebase
          .auth()
          .verifyPhoneNumber(phoneNumber)
          .on('state_changed', phoneAuthSnapshot => {
            console.log(phoneAuthSnapshot);
            switch (phoneAuthSnapshot.state) {
              case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
                // update state with code sent and if android start a interval timer
                // for auto verify - to provide visual feedback
                this.setState(
                  {
                    sent: true,
                    verificationId: phoneAuthSnapshot.verificationId,
                    autoVerifyCountDown: this.timeout,
                  },
                  () => {
                    if (this.state.auto) {
                      this._autoVerifyInterval = setInterval(
                        this._tick.bind(this),
                        1000
                      );
                    }
                  }
                );
                break;
              case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                // restart the phone flow again on error
                clearInterval(this._autoVerifyInterval);
                this.setState({
                  ...PhoneAuth.getDefaultState(),
                  error: phoneAuthSnapshot.error.message,
                });
                break;

              // ---------------------
              // ANDROID ONLY EVENTS
              // ---------------------
              case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                clearInterval(this._autoVerifyInterval);
                this.setState({
                  sent: true,
                  auto: false,
                  verificationId: phoneAuthSnapshot.verificationId,
                });
                break;
              case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
                clearInterval(this._autoVerifyInterval);
                this.setState({
                  sent: true,
                  codeInput: phoneAuthSnapshot.code,
                  verificationId: phoneAuthSnapshot.verificationId,
                });
                break;
              default:
              // will never get here - just for linting
            }
          });
      }
    );
  };

  /*
  renderInputPhoneNumber() {
    const phoneNumber =  this.props.navigation.getParam('phoneNumber', 'nothing sent')
    return (
      <View style={{ flex: 1 }}>
        <Text>Enter phone number:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ phoneNumber: value })}
          placeholder="Phone number ... "
          value={phoneNumber}
          keyboardType = 'phone-pad'
        />
        <Button
          title="Begin Verification"
         // color="green"
          onPress={this.signIn}
        />
      </View>
    );
  }*/

  
  renderSendingCode() {
    const phoneNumber =  this.props.navigation.getParam('phoneNumber', 'nothing sent')

    return (
      <View style={{ paddingBottom: 15 }}>
        <Text style={{ paddingBottom: 25 }}>
          {`Envoie du code au '${phoneNumber}'.`}
        </Text>
        <ActivityIndicator animating style={{ padding: 50 }} size="large" />
      </View>
    );
  }

  renderAutoVerifyProgress() {
    const {
      autoVerifyCountDown,
      started,
      error,
      sent,
    } = this.state;
    const phoneNumber =  this.props.navigation.getParam('phoneNumber', 'nothing sent')
    if (!sent && started && !error.length) {
      return this.renderSendingCode();
    }
    return (
      <View style={{ padding: 0, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ paddingBottom: 25, textAlign: 'center' }}>
          {`Le code de vérification a été envoyé avec succès au '${phoneNumber}'.`}
        </Text>
        <Text style={{ marginBottom: 25, textAlign: 'center' }}>
          {`Nous allons essayer de vérifier automatiquement le code pour vous. Cela expirera dans ${autoVerifyCountDown} secondes.`}
        </Text>
         <Button text="J'ai déjà un code" onPress={() => this.setState({ auto: false })} />
      </View>
    );
  }

  renderError() {
    const { error } = this.state;

    return (
      <View
        style={{
          padding: 10,
          borderRadius: 5,
          margin: 10,
          backgroundColor: 'rgb(255,0,0)',
        }}
      >
        <Text style={{ color: '#fff' }}>{error}</Text>
      </View>
    );
  }

  render() {
    const { started, error, codeInput, sent, auto, user } = this.state;
    return (
      <View
        style={{ flex: 1, backgroundColor: user ? 'rgb(0, 200, 0)' : '#fff' }}
      >
        <View
          style={{
            //padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            //backgroundColor: 'orange'
          }}
        >
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: 128,
              height: 128,
              marginTop: SCREEN_HEIGHT*0.03,
              marginBottom: SCREEN_HEIGHT*0.1,
            }}
          />
          <Text style={{ fontSize: 25, marginBottom: 20 }}>
             Authentification par SMS          
          </Text>
          {error && error.length ? this.renderError() : null}
         {/* {!started && !sent ? this.renderInputPhoneNumber() : null} */}
          {started && auto && !codeInput.length
            ? this.renderAutoVerifyProgress()
            : null} 
          {!user && started && sent && (codeInput.length || !auto) ? (
            <SafeAreaView style={{flex: 1, }}>
              <View style={{flex: 0.5, alignItems: 'center' }}>
              <Text>Veuillez entrer votre code de vérification:</Text>
              </View>
              <CodeInput  onChangeText={value => this.setState({ codeInput: value })} value={codeInput}/>
            {/*  <TextInput
                autoFocus
                style={{ height: 40, marginTop: 15, marginBottom: 15 }}
                onChangeText={value => this.setState({ codeInput: value })}
                placeholder="Code ... "
                value={codeInput}
            /> */}
              <View style={{flex: 2,  }}>
              <Button text="Confirmer" onPress={this.afterVerify} />
              </View>
            </SafeAreaView>
          ) : null}
          {user ? (
            <View style={{ marginTop: 15 }}>
              <Text>{`Signed in with new user id: '${user.uid}'`}</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}

/*
 { user ? (
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
 </View>
 ) : null}
 */

// Example usage if handling here and not in optionalCompleteCb:
// const { verificationId, code } = phoneAuthSnapshot;
// const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

// Do something with your new credential, e.g.:
// firebase.auth().signInWithCredential(credential);
// firebase.auth().linkWithCredential(credential);
// etc ...