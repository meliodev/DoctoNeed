/* eslint-disable consistent-this */
/* eslint-disable prettier/prettier */
import requestCameraAndAudioPermission from './permission';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert, Platform } from 'react-native';
import RtcEngine, { RtcLocalView, RtcRemoteView } from 'react-native-agora';
import firebase from '../../configs/firebase'
import { connect } from 'react-redux'
import * as REFS from '../../DB/CollectionsRefs'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import NavigationService from '../../Navigation/NavigationService'


import Button from '../../components/Button'

import { sendNotification } from '../../functions/functions'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const recordingConfig = require('./Cloud_Recording.postman_environment.json');

//import UUIDGenerator from 'react-native-uuid-generator';
import styles from './Style';

let LocalView = RtcLocalView.SurfaceView;
let RemoteView = RtcRemoteView.SurfaceView;
let engine;

const functions = firebase.functions()

let Buffer = require('buffer/').Buffer

class Video extends Component {

  constructor(props) {
    super(props);
    this.appId = this.props.navigation.getParam('appId', '')
    this.userId = this.props.navigation.getParam('userId', '')
    this.fcmTokenPatient = ''

    this.state = {
      peerIds: [],                                       //Array for storing connected peers
      appid: '66a3bea50e5d498d860667718de624d5',
      channelName: this.appId,  //use Appointment id                      //Channel Name for the current session
      joinSucceed: false,                                //State variable for storing success
      uid: '',
      callRunning: false,
      hasHungUp: false,
      finished: false,
    };
    if (Platform.OS === 'android') {                    //Request required permissions from Android
      requestCameraAndAudioPermission().then(_ => {
        console.log('requested!');
      });
    }
  }

  componentDidMount() {
    //Listen when the videoconference has finished
    // this.unsubscribe = REFS.appointments.doc(this.appId).onSnapshot((doc) => {
    //   this.setState({ finished: doc.data().finished })
    // })

    console.log('APPID: ' + this.appId)
    // this.acquireRecording().then(() => {
    //   this.startRecording()
    // })

    this.setFcmTokenPatient()

    if (this.state.peerIds.length === 0)
      this.setState({ uid: 0 })

    if (this.state.peerIds.length === 1)
      this.setState({ uid: 1 })

    let self = this;
    /**
    * @name init
    * @description Function to initialize the Rtc Engine, attach event listeners and actions
    */
    async function init() {
      engine = await RtcEngine.create(self.state.appid);
      engine.enableVideo();

      engine.addListener('UserJoined', (data) => {          //If user joins the channel
        const { peerIds } = self.state;                     //Get currrent peer IDs
        if (peerIds.indexOf(data) === -1) {                 //If new user
          self.setState({ peerIds: [...peerIds, data] });   //add peer ID to state array
        }
      });

      engine.addListener('UserOffline', (data) => {                 //If user leaves
        self.setState({
          peerIds: self.state.peerIds.filter(uid => uid !== data), //remove peer ID from state array
        });
      });

      engine.addListener('JoinChannelSuccess', (data) => {          //If Local user joins RTC channel
        self.setState({ joinSucceed: true });                       //Set state variable to true
      });

      engine.addListener('Warning', (warn) => {          //If Local user joins RTC channel
        console.warn(warn)
      });

      engine.addListener('Error', (err) => {          //If Local user joins RTC channel
        console.error(err)
      });

    }
    init();
  }

  // componentWillUnmount() {
  //   this.unsubscribe()
  // }

  // componentDidUpdate() {
  //   console.log('DID UPDATE !!! '+this.state.finished)
  //   if (this.state.finished) {
  //     let title = ''
  //     let desc = ''
  //     if (this.props.role === 'isPatient') {
  //       title = 'Consultation terminé'
  //       desc = 'Le rapport de cette consultation sera bientôt disponible dans la page "détails de la consultation"'
  //     }

  //     else if (this.props.role === 'isDoctor') {
  //       title = 'Consultation terminé'
  //       desc = 'Veuillez rédiger un rapport sur cette consultation dans la page "Détails de la consultation"'
  //     }

  //     Alert.alert(
  //       title,
  //       desc,
  //       [
  //         {
  //           text: 'OK', onPress: function () {
  //             NavigationService.navigate('Home')
  //           }.bind(this)
  //         },
  //       ],
  //     )
  //   }
  // }

  //Agora recording functions
  acquireRecording = async () => {
    let APPID = recordingConfig.values[0].value
    let CustomerID = recordingConfig.values[1].value
    let CustomerCertificate = recordingConfig.values[2].value

    let auth = 'Basic ' + Buffer(CustomerID + ':' + CustomerCertificate).toString('base64');

    await fetch("https://api.agora.io/v1/apps/" + APPID + "/cloud_recording/acquire", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Authorization': auth,
        'Content-Type': "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        uid: '527841',
        cname: 'pLaHyFscIlHZRU2jcS2B',
        clientRequest: {}
      })
    })
      .then(response => response.json())
      .then((responseJson) => {
        console.log('getting data from fetch ACQUIRE: ', responseJson.resourceId)
        this.setState({ resourceId: responseJson.resourceId })
      })
      .catch(error => console.log(error))
  }

  startRecording = () => {
    let APPID = recordingConfig.values[0].value
    let CustomerID = recordingConfig.values[1].value
    let CustomerCertificate = recordingConfig.values[2].value
    let Token = recordingConfig.values[3].value
    let Vendor = recordingConfig.values[7].value
    let Region = recordingConfig.values[8].value
    let Bucket = recordingConfig.values[9].value
    let AccessKey = recordingConfig.values[10].value
    let SecretKey = recordingConfig.values[11].value

    let auth = 'Basic ' + Buffer(CustomerID + ':' + CustomerCertificate).toString('base64');

    fetch("https://api.agora.io/v1/apps/" + APPID + "/cloud_recording/resourceid/" + this.state.resourceId + "/mode/mix/start", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Authorization': auth,
        'Content-Type': "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        cname: 'pLaHyFscIlHZRU2jcS2B',
        uid: '527841',
        clientRequest: {
          token: Token,
          recordingConfig: {
            maxIdleTime: 120,
            streamTypes: 2,
            audioProfile: 1,
            channelType: 1, // 0: Communication profile & 1: Live broadcast profile.
            videoStreamType: 1, //0: High quality & 1: low quality
            transcodingConfig: {
              width: 360,
              height: 640,
              fps: 15, //was 30
              bitrate: 500, //was 600
              mixedVideoLayout: 1,
              maxResolutionUid: "1"
            }
          },
          storageConfig: {
            vendor: Vendor,
            region: Region,
            bucket: Bucket,
            accessKey: AccessKey,
            secretKey: SecretKey
          }
        }
      })
    })
      .then(response => response.json())
      .then((responseJson) => {
        console.log('getting data from fetch START', responseJson)
      })
      .catch(error => console.log(error))
  }

  setFcmTokenPatient() {
    REFS.fcmtokens.doc(this.userId).get().then((doc) => {
      this.fcmTokenPatient = doc.data().fcmToken
    })
  }

  sendDataMessage() {
    const sendDataMessage = functions.httpsCallable('sendDataMessage')
    sendDataMessage({ fcmToken: this.fcmTokenPatient, roomId: this.appId })
      .then((response) => console.log(response))
      .catch((err) => console.error(err))
  }

  /**
  * @name startCall
  * @description Function to start the call
  */
  startCall = () => {
    //this.setState({ joinSucceed: true }); //Set state variable to true
    this.setState({ callRunning: true }); //Set state variable to true
    engine.joinChannel(null, this.state.channelName, null, this.state.uid);  //Join Channel using null token and channel name

    if (this.props.role === 'isDoctor') {
      //send call notification to patient
      this.sendDataMessage()
    }

    REFS.appointments.doc(this.appId).update({ started: true })
  }

  /**
  * @name endCall
  * @description Function to end the call
  */
  endCall = () => {
    this.setState({ callRunning: false, hasHungUp: true }); //Set state variable to true
    engine.leaveChannel();
    this.setState({ peerIds: [], joinSucceed: false });
  }

  terminateAppointment(appId, main) {
    Alert.alert(
      'Terminer la consultation',
      'Etes-vous sûr(e) de vouloir terminer cette consultation ?',
      [
        { text: 'Annuler', onPress: () => console.log('Cancel Pressed!') },
        {
          text: 'OK', onPress: function () {
            REFS.appointments.doc(appId).update({ finished: true })
              .then(() => NavigationService.navigate('Home'))
              .catch((e) => console.error(e))
          }.bind(this)
        },
      ],
    )

  }

  /**
  * @name videoView
  * @description Function to return the view for the app
  */
  videoView() {
    let ButtonTitle = ''
    if (this.props.role === 'isDoctor' && !this.state.hasHungUp)
      ButtonTitle = "Commencer la consultation"

    else if (this.props.role === 'isDoctor' && this.state.hasHungUp)
      ButtonTitle = "Reprendre la consultation"

    else if (this.props.role === 'isPatient' && !this.state.hasHungUp)
      ButtonTitle = "Rejoindre la consultation"

    else if (this.props.role === 'isPatient' && this.state.hasHungUp)
      ButtonTitle = "Reprendre la consultation"


    return (
      <View style={styles.max}>
        {
          <View style={styles.max}>
            <View style={styles.buttonHolder}>

              {!this.state.callRunning &&
                <Button
                  width={SCREEN_WIDTH * 0.75}
                  text={ButtonTitle}
                  paddingBottom={SCREEN_HEIGHT * 0.03}
                  paddingTop={SCREEN_HEIGHT * 0.03}
                  fontSize={SCREEN_HEIGHT * 0.025}
                  marginBottom={SCREEN_HEIGHT * 0.03}
                  onPress={this.startCall} />}

              {!this.state.callRunning && this.state.hasHungUp &&
                <Button
                  width={SCREEN_WIDTH * 0.75}
                  text='Terminer la consultation'
                  paddingBottom={SCREEN_HEIGHT * 0.03}
                  paddingTop={SCREEN_HEIGHT * 0.03}
                  fontSize={SCREEN_HEIGHT * 0.025}
                  marginBottom={SCREEN_HEIGHT * 0.03}
                  onPress={() => this.terminateAppointment(this.appId, this.props)} />}
            </View>
            {
              !this.state.joinSucceed ?
                <View />
                :
                <View style={styles.fullView}>
                  {
                    this.state.peerIds.length > 3                   //view for four videostreams
                      ? <View style={styles.full}>
                        <View style={styles.halfViewRow}>
                          <RemoteView style={styles.half} channelId={this.state.channelName}
                            uid={this.state.peerIds[0]} renderMode={1} />
                          <RemoteView style={styles.half} channelId={this.state.channelName}
                            uid={this.state.peerIds[1]} renderMode={1} />
                        </View>
                        <View style={styles.halfViewRow}>
                          <RemoteView style={styles.half} channelId={this.state.channelName}
                            uid={this.state.peerIds[2]} renderMode={1} />
                          <RemoteView style={styles.half} channelId={this.state.channelName}
                            uid={this.state.peerIds[3]} renderMode={1} />
                        </View>
                      </View>
                      : this.state.peerIds.length > 2                   //view for three videostreams
                        ? <View style={styles.full}>
                          <View style={styles.half} channelId={this.state.channelName}>
                            <RemoteView style={styles.full}
                              uid={this.state.peerIds[0]} renderMode={1} />
                          </View>
                          <View style={styles.halfViewRow}>
                            <RemoteView style={styles.half} channelId={this.state.channelName}
                              uid={this.state.peerIds[1]} renderMode={1} />
                            <RemoteView style={styles.half} channelId={this.state.channelName}
                              uid={this.state.peerIds[2]} renderMode={1} />
                          </View>
                        </View>
                        : this.state.peerIds.length > 1                   //view for two videostreams
                          ? <View style={styles.full}>
                            <RemoteView style={styles.full}
                              uid={this.state.peerIds[0]} renderMode={1} />
                            <RemoteView style={styles.full}
                              uid={this.state.peerIds[1]} renderMode={1} />
                          </View>
                          : this.state.peerIds.length > 0                   //view for videostream
                            ? <RemoteView style={styles.full}
                              uid={this.state.peerIds[0]} renderMode={1} />
                            : <View>
                              <View style={{ width: SCREEN_WIDTH * 0.6, marginTop: 25, paddingLeft: 10 }}>
                                <Text style={styles.noUserText}> Appel en cours... </Text>
                                <Text style={{ color: '#333' }}>Si le patient ne réponds pas après 30sec, veuillez raccrocher et rappeler de nouveau.</Text>
                                <Text style={{ color: '#333' }}>Veuillez répéter cette opération jusqu'à ce que vous joignez le patient.</Text>
                                <Text style={{ color: '#333' }}>Le cas échéant, si le patient ne répond pas, veuillez le rappeler quelques instants plus tard ou bien informer l'administrateur.</Text>
                              </View>
                            </View>
                  }
                  <LocalView style={styles.localVideoStyle}               //view for local videofeed
                    channelId={this.state.channelName} renderMode={1} zOrderMediaOverlay={true} />
                </View>
            }
          </View>
        }

        {this.state.callRunning &&
          <View style={{ position: 'absolute', bottom: 0, alignSelf: 'center' }}>
            <TouchableOpacity onPress={this.endCall} style={styles.buttonLaunchCall}>
              <Icon
                name="phone-hangup"
                size={SCREEN_WIDTH * 0.12}
                color="#ffffff" />
            </TouchableOpacity>
          </View>}

      </View>
    )
  }

  render() {
    return this.videoView()
  }

}


const mapStateToProps = (state) => {
  return {
    fcmToken: state.fcmtoken.fcmToken,
    role: state.roles.role,
  }
}

export default connect(mapStateToProps)(Video)