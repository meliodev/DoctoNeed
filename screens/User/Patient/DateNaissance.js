//Presentation.js
//TEST

//if isDoctor: READ-only
//if isAdmin or isPatient: Free 

import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, Button, ScrollView, ActivityIndicator, TextInput, Picker, Text, Image, TouchableOpacity, TouchableHighlight, Dimensions, Slider, StyleSheet, SafeAreaView, ActionSheetIOS } from 'react-native'
import Modal from 'react-native-modal';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

import { withNavigation } from 'react-navigation';

import * as REFS from '../../../DB/CollectionsRefs'

import { connect } from 'react-redux'

import { InitializePatientId } from '../../../functions/functions'

import moment from 'moment'
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')

import { toggleLeftSideMenu, navigateToMedicalFolder, navigateToScreen, signOutUserandToggle } from '../../../Navigation/Navigation_Functions'

import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';
import { CheckBox, Content, Header, Card, CardItem, ListItem, Radio, Right, Left } from 'native-base';
import DatePicker from 'react-native-date-picker'
import { imagePickerOptions, options2, getFileLocalPath, createStorageReferenceToFile, uploadFileToFireBase } from '../../../util/MediaPickerFunctions'

import ImagePicker from 'react-native-image-picker';

import LeftSideMenu from '../../../components/LeftSideMenu'
import Icon1 from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioHeader = 267 / 666; // The actaul icon headet size is 254 * 668
const HEADER_ICON_HEIGHT = Dimensions.get("window").width * ratioHeader; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

class DateNaissance extends React.Component {
  constructor(props) {
    super(props);
    this.updateDN = this.updateDN.bind(this);

    this.dateNaissance = this.props.navigation.getParam('dateNaissance', '')
    this.user_id_param = this.props.navigation.getParam('user_id', '')  //received from admin or doctor navigation params
    this.user_id = ''

    this.state = {
      date: moment(this.dateNaissance, 'DD/MM/YYYY').add(1, 'day').format()
    }

  }

  componentDidMount() {
    InitializePatientId(this)
  }

  async updateDN() { 
    let dateNaissance = moment(this.state.date).subtract(1, 'day').format("DD/MM/YYYY")
    await REFS.users.doc(this.user_id).update({ dateNaissance })
    this.props.navigation.goBack()
  }

  render = () => (
    <View style={{ flex: 1 }}>

      <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
        <DatePicker
          date={this.state.date}
          onDateChange={date => this.setState({ date })}
          mode={'date'}
          locale='fr' />
      </View>

      <View style={styles.modalButtons_container}>
        <TouchableOpacity style={styles.CancelButton} onPress={() => this.props.navigation.goBack()}>
          <Text style={styles.buttonText1}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ width: '40%' }} onPress={this.updateDN}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
            style={styles.linearGradient}>
            <Text style={styles.buttonText2}>Confirmer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const mapStateToProps = (state) => {
  return {
    role: state.roles.role,
  }
}

export default connect(mapStateToProps)(DateNaissance)


const styles = StyleSheet.create({
  //Buttons confirme/cancel
  modalButtons_container: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    //backgroundColor: 'blue'
  },
  linearGradient: {
    paddingTop: SCREEN_HEIGHT * 0.005,
    paddingBottom: SCREEN_HEIGHT * 0.005,
    borderRadius: 30,
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.06,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
  },
  buttonText1: {
    fontSize: 12,
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    color: 'gray',
    backgroundColor: 'transparent',
  },
  buttonText2: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  CancelButton: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingBottom: SCREEN_HEIGHT * 0.005,
    paddingTop: SCREEN_HEIGHT * 0.005,
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.06,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
})