//Presentation.js
//TEST

import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, Button, Text, Image, TouchableHighlight, Dimensions, FlatList, Animated, StyleSheet } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import DeviceInfo from 'react-native-device-info';
import {timezones} from '../../../util/helpers/timezones'

import { withNavigation } from 'react-navigation';

import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';
import { ScrollView } from 'react-native-gesture-handler';


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioHeader = 267 / 666; // The actaul icon headet size is 254 * 668
const HEADER_ICON_HEIGHT = Dimensions.get("window").width * ratioHeader; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

export default class DispoConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      nom: "",
      prenom: "",
      speciality: "00-00-0000",
      age: ""
    }
  }

  componentWillMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    firebase.firestore().collection("Doctors").doc(currentUser.uid).get().then(doc => {
      this.setState({ nom: doc.data().nom, prenom: doc.data().prenom })
      this.setState({ speciality: doc.data().speciality })
    })
  }

  componentDidMount() {
    this.UserAuthStatus()
  }

  UserAuthStatus = () => {
    firebase
      .auth()
      .onAuthStateChanged(user => {
        if (user) {
          this.setState({ isUser: true })
        } else {
          this.setState({ isUser: false })
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
    const placeholder = {
      label: 'Selectionnez votre fuseau horaire',
      value: null,
      color: '#9EA0A4',
    };

   /* let timezones = require('../../../util/helpers/timezones.json')
    var date = new Date();
    var offsetInHours = date.toUTCString();*/

    //console.log(DeviceInfo.getTimezone()); 
    console.log(timezones)

    // const currentUser= firebase.auth().currentUser.
    console.log(this.state.nom)
    console.log(this.state.prenom)
    console.log(this.state.speciality)
    return (
      <View style={styles.container}>

        <View style={styles.header_container}>
          <Image source={require('../../../assets/header-image.png')} style={styles.headerIcon} />
        </View>

        <View style={styles.metadata_container}>
          <View style={styles.Avatar_box}>
            <Icon name="user"
              size={SCREEN_WIDTH * 0.05}
              color="#93eafe" />
          </View>
          <View style={styles.metadata_box}>
            <Text style={styles.metadata_text1}>{this.state.nom} {this.state.prenom}</Text>
            <Text style={styles.metadata_text2}>{this.state.speciality}</Text>
          </View>
        </View>

        <ScrollView style={styles.dispos_container}>
          <Text> Mes disponibilités</Text>
          <Text> Fuseau Horaire </Text>
          <RNPickerSelect
            onValueChange={(value) => console.log(value)}
            placeholder={placeholder}
            items={timezones}
          />
          <Text> Horaires disponibles </Text>
          

        </ScrollView>

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
  header_container: {
    flex: 0.32,
    //justifyContent: 'flex-end',
    //alignItems: 'stretch',
    //backgroundColor: 'brown',
  },
  headerIcon: {
    width: SCREEN_WIDTH,
    height: HEADER_ICON_HEIGHT,
  },
  metadata_container: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'green',
  },
  Avatar_box: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange'
  },
  metadata_box: {
    height: SCREEN_WIDTH * 0.12,
    marginLeft: SCREEN_WIDTH * 0.04,
    justifyContent: 'center',
    backgroundColor: 'yellow'
  },
  metadata_text1: {
    fontSize: SCREEN_HEIGHT * 0.015,
    color: 'gray',
    fontWeight: 'bold'
  },
  metadata_text2: {
    fontSize: SCREEN_HEIGHT * 0.015,
    color: 'gray'
  },
  dispos_container: {
    flex: 1,
    //backgroundColor: 'brown',
  },

});