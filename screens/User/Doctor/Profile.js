//Presentation.js
//TEST

import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, ScrollView, Picker, ActivityIndicator, TextInput, Text, Image, TouchableOpacity, TouchableHighlight, Dimensions, StyleSheet, Alert } from 'react-native'
import Modal from 'react-native-modal';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import ImageViewing from "react-native-image-viewing";

import * as REFS from '../../../DB/CollectionsRefs'

import firebase from 'react-native-firebase';
import { connect } from 'react-redux'

import { toggleLeftSideMenu, navigateToScreen, signOutUserandToggle } from '../../../Navigation/Navigation_Functions'
import { InitializeUserId } from '../../../functions/functions'

import { Card } from 'native-base';
import DatePicker from 'react-native-datepicker'
import { imagePickerOptions, getFileLocalPath } from '../../../util/MediaPickerFunctions'

import ImagePicker from 'react-native-image-picker';

import LeftSideMenu from '../../../components/LeftSideMenu'

import Icon1 from 'react-native-vector-icons/FontAwesome';

import moment from 'moment'
import 'moment/locale/fr'
import { SafeAreaView } from 'react-navigation';
moment.locale('fr')

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioHeader = 267 / 666; // The actaul icon headet size is 254 * 668
const HEADER_ICON_HEIGHT = Dimensions.get("window").width * ratioHeader; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

const line = <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />
const GS = ['A', 'B', 'O', 'AB']
const Professions = ['Enseignant', 'Salarié', 'Commercant', 'Etudiant', 'Retraité', 'Sans profession', 'Fonctionnaire', 'Artisan']
const Allergies = ['Antibiotique', 'Anti-inflammatoires', 'non-stéroidiens', 'Aspirine', 'Autre', 'Antibiotique', 'Anti-inflammatoires', 'non-stéroidiens', 'Aspirine', 'Autre']

const options = {
  title: 'Select Image',
  takePhotoButtonTitle: 'Take photo with your camera',
  chooseFromLibraryButtonTitle: 'Choose photo from library',
  // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const specialities = ['Médecin généraliste', 'Pédiatre', 'Psychologue', 'Ophtalmologue', 'Rhumatologue']


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.renderForm = this.renderForm.bind(this);
    this.rootingConfirm = this.rootingConfirm.bind(this);

    this.doctor_id_param = this.props.navigation.getParam('doctor_id', '')  //received from admin or doctor navigation params
    this.doctor_id = ''

    this.state = {
      currentUser: null,
      //Metadata fields
      nom: undefined,
      prenom: undefined,
      dateNaissance: "",
      age: undefined,
      Avatar: '',
      AvatarSource: '',
      AvatarStorageRef: '',

      //Data fields
      Sexe: "",
      speciality: '',
      bio: '',
      codeFinesse: '',
      diplomes: [],


      //Variables to toggle Modal
      isName: false,
      isSexe: false,
      isSpeciality: false,
      isBio: false,
      isCodeFinesse: false,

      isModalVisible: false,
      //Mutuelle & Carte Vitale refs
      isModalImageVisible: false,
      ImageToShow: ''
    }

  }


  componentDidMount() {
    InitializeUserId(this)
    this.fetchData()
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  fetchData() {

    this.unsubscribe = REFS.doctors.doc(this.doctor_id).onSnapshot(doc => {

      this.setState({
        //Meta data
        Avatar: doc.data().Avatar,
        nom: doc.data().nom,
        prenom: doc.data().prenom,
        //Infos personnelles
        Sexe: doc.data().Sexe,
        dateNaissance: doc.data().dateNaissance,

        //Infos professionnelles
        speciality: doc.data().speciality,
        bio: doc.data().bio,
        codeFinesse: doc.data().codeFinesse,

        //Diplomes
        diplomes: doc.data().diplomes,

      }, () => {

        //Initialize radio fields
        if (this.state.Sexe === 'Homme')
          this.setState({ sexeIndex: 0 })
        else
          this.setState({ sexeIndex: 1 })
      })
    })
  }

  toggleModal = (isField) => {

    const update = {};
    update[isField] = true
    this.setState(update);

    this.setState({
      isModalVisible: !this.state.isModalVisible
    })
  }

  onConfirm(isField, Field, value) {
    var usersUpdate = {};
    usersUpdate[`${Field}`] = this.trimString(value);

    REFS.doctors.doc(this.doctor_id).update(usersUpdate)
      .then(() => {
        const update = {};
        update[isField] = false
        this.setState(update);
        if (isField !== '')
          this.toggleModal()
      })
      .catch((err) => console.error(err))
  }


  rootingConfirm() {
    if (this.state.isName === true) {
      this.onConfirm('isName', 'nom', this.state.nom)
      this.onConfirm('', 'prenom', this.state.prenom)
      this.onConfirm('', 'name', this.state.nom + ' ' + this.state.prenom)
    }

    if (this.state.isSexe === true)
      this.onConfirm('isSexe', 'Sexe', this.state.Sexe)

    if (this.state.isBio === true)
      this.onConfirm('isBio', 'bio', this.state.bio)

    if (this.state.isSpeciality === true)
      this.onConfirm('isSpeciality', 'speciality', this.state.speciality)

    if (this.state.isCodeFinesse === true)
      this.onConfirm('isCodeFinesse', 'codeFinesse', this.state.codeFinesse)
  }

  trimString(string) {
    let str = ''
    str = string
    str = str.trim()
    return str
  }

  renderForm() {

    var radio_props1 = [
      { label: 'Homme', value: 'Homme' },
      { label: 'Femme', value: 'Femme' }
    ];

    let component = null

    //Metadata (nom & prenom)
    if (this.state.isName)
      component = (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.1 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: SCREEN_HEIGHT * 0.04 }}>Quels sont vos nom et prénom ?</Text>
          <View style={[modalStyles.picker_container, { marginBottom: SCREEN_HEIGHT * 0.03 }]} >
            <TextInput
              onChangeText={(nom) => this.setState({ nom })}
              placeholder={'Votre nom'}
              value={this.state.nom}
              style={{ width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.1 }} />
          </View>

          <View style={[modalStyles.picker_container, { marginBottom: SCREEN_HEIGHT * 0.03 }]} >
            <TextInput
              onChangeText={(prenom) => this.setState({ prenom })}
              placeholder={'Votre prénom'}
              value={this.state.prenom}
              style={{ width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.1 }} />
          </View>
        </View>
      )

    //Infos personnelles
    else if (this.state.isSexe)
      component = (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.1 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: SCREEN_HEIGHT * 0.05 }}>Quel est votre sexe ?</Text>
          <RadioForm style={{ alignSelf: 'center' }}>
            {
              radio_props1.map((obj, i) => (
                <RadioButton labelHorizontal={true} key={i} style={{ marginBottom: SCREEN_HEIGHT * 0.02 }}>
                  {/*  You can set RadioButtonLabel before RadioButtonInput */}
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={this.state.sexeIndex === i}
                    onPress={(value) => { this.setState({ Sexe: value, sexeIndex: i }) }}
                    buttonColor={'#93eafe'}
                    selectedButtonColor={'#93eafe'}
                  />
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    onPress={() => console.log('nothing happens')}
                    labelStyle={{ marginLeft: 10 }}
                  />
                </RadioButton>
              ))
            }
          </RadioForm>
        </View>
      )

    if (this.state.isSpeciality)
      component = (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.1 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: SCREEN_HEIGHT * 0.04 }}>Quelle est votre spécialité ?</Text>
          <View style={[modalStyles.picker_container, { marginBottom: SCREEN_HEIGHT * 0.03 }]} >
            <Picker selectedValue={this.state.speciality} onValueChange={(speciality) => this.setState({ speciality })} style={{ flex: 1, color: '#445870', width: SCREEN_WIDTH * 0.6, textAlign: "center" }}>
              <Picker.Item value='' label='Selectionnez votre spécialité' />
              {specialities.map((speciality, key) => {
                return (<Picker.Item key={key} value={speciality} label={speciality} />);
              })}
            </Picker>
          </View>
        </View>
      )

    if (this.state.isBio)
      component = (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.05 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: SCREEN_HEIGHT * 0.04 }}>Présentez vous brièvemment.</Text>
          <SafeAreaView style={{}}>
            <ScrollView>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="Présentez vous..."
                placeholderTextColor="grey"
                numberOfLines={3}
                multiline={true}
                onChangeText={(bio) => this.setState({ bio })}
                value={this.state.bio}
                style={modalStyles.bio} />
            </ScrollView>
          </SafeAreaView>
        </View>
      )


    //Infos sup
    else if (this.state.isCodeFinesse)
      component = (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.1 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: SCREEN_HEIGHT * 0.04 }}>Quel est votre code finesse ?</Text>
          <View style={modalStyles.picker_container} >
            <TextInput
              onChangeText={(codeFinesse) => this.setState({ codeFinesse })}
              placeholder={'Votre code finesse'}
              value={this.state.codeFinesse} 
              style={{ width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.1 }} />
          </View>
        </View>
      )

    let buttonsComponent = (
      <View style={modalStyles.modalButtons_container}>
        <TouchableOpacity style={modalStyles.CancelButton} onPress={async () => {
          this.toggleModal()
          this.setState({ isSexe: false, isName: false, isCodeFinesse: false, isBio: false, isSpeciality: false })
        }}>
          <Text style={modalStyles.buttonText1}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.rootingConfirm}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
            style={modalStyles.ConfirmButton}>
            <Text style={modalStyles.buttonText2}>Confirmer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>)



    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {component}
        {buttonsComponent}
      </View>
    )
  }


  handleImage = async () => {
    await ImagePicker.showImagePicker(imagePickerOptions, imagePickerResponse => {
      const { didCancel, error } = imagePickerResponse;
      if (didCancel) console.log('Post canceled')

      else if (error) Alert.alert('', 'Erreur inattendue, veuillez réessayer plus tard.')

      else {
        const AvatarSource = getFileLocalPath((imagePickerResponse))
        this.uploadAvatar(AvatarSource)
      }
    })
  }

  uploadAvatar(source) {
    this.setState({ isUploading3: true })
    const AvatarStorageRef = firebase.storage().ref('/Doctors/' + this.doctor_id + '/Informations personnelles/Avatar')
    Promise.resolve(AvatarStorageRef.putFile(source)).then((URLObject) => {
      REFS.doctors.doc(this.doctor_id).update({ Avatar: URLObject.downloadURL })
        .finally(err => this.setState({ isUploading3: false }))
    })
  }

  toggleModalImage(link) {
    this.setState({ isModalImageVisible: !this.state.isModalImageVisible, ImageToShow: link })
  }

  render() {
    let images = [{ uri: this.state.ImageToShow }]

    return (
      <View style={styles.container}>

        <View style={styles.header_container}><Image source={require('../../../assets/header-image.png')} style={styles.headerIcon} /></View>

        <View style={{ height: SCREEN_HEIGHT * 0.01, flexDirection: 'row', paddingTop: SCREEN_HEIGHT * 0.00, justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', bottom: 80, }}>
          <LeftSideMenu />
        </View>

        {/* user metadata */}
        <View style={styles.metadata_container}>
          <TouchableOpacity onPress={() => this.handleImage('Avatar')}>
            <View style={styles.Avatar_box}>
              {this.state.isUploading3
                ?
                <View style={{ alignItems: 'flex-start' }}>
                  <ActivityIndicator size='small' />
                </View>
                :
                <Image style={{
                  width: SCREEN_WIDTH * 0.11,
                  height: SCREEN_WIDTH * 0.11,
                  borderRadius: 25,
                }}
                  source={{ uri: this.state.Avatar }} />
              }
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.toggleModal('isName')}>
            <View style={styles.metadata_box}>
              <Text style={styles.metadata_text1}>{this.state.nom} {this.state.prenom}</Text>
              <Text style={styles.metadata_text2}>{this.state.dateNaissance}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.infos_container}>
          <View style={styles.info_container}>

            <Modal
              isVisible={this.state.isModalVisible}
              animationIn="slideInLeft"
              animationOut="slideOutLeft"
              style={{ backgroundColor: 'white', maxHeight: SCREEN_HEIGHT }}>

              {this.renderForm()}

            </Modal>

            {/*Info personnelles*/}
            <Card style={{ padding: SCREEN_HEIGHT * 0.02, marginBottom: SCREEN_HEIGHT * 0.03 }}>

              <View style={styles.edit_button}>
                <View style={styles.edit_button_inside}>
                  <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Informations personnelles</Text>
                </View>
              </View>

              {/* sexe */}
              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.toggleModal('isSexe')}>
                <Text style={fieldStyle.title_text}>Sexe</Text>
                <Text style={fieldStyle.value}>{this.state.Sexe}</Text>
              </TouchableOpacity>

              {line}

              {/* date naissance */}
              <View style={{ paddingLeft: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
                <Text style={fieldStyle.title_text}>Date de naissance</Text>

                <DatePicker
                  date={this.state.dateNaissance}
                  mode="date"
                  locale='fr'
                  placeholder={this.state.dateNaissance}
                  format="DD-MM-YYYY"
                  minDate="01-01-1900"
                  //maxDate="01-01-2020"
                  confirmBtnText="Confirmer"
                  cancelBtnText="Annuler"
                  customStyles={{
                    dateIcon: {
                      width: 0,
                      height: 0
                    },
                    dateInput: {
                      padding: 0,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      height: 30,
                      borderWidth: 0,
                    },
                    dateText: {
                      // fontWeight: 'bold',
                    }
                  }}

                  onDateChange={(dateNaissance) => {
                    REFS.doctors.doc(this.doctor_id).update({ 'dateNaissance': dateNaissance })
                      .then(() => { this.setState({ dateNaissance: dateNaissance }) })
                      .catch((err) => console.error(err))
                  }} />
              </View>

            </Card>

            {/*Infos sup*/}
            <Card style={{ padding: SCREEN_HEIGHT * 0.02, marginBottom: SCREEN_HEIGHT * 0.03 }}>
              <View style={styles.edit_button}>
                <View style={styles.edit_button_inside}>
                  <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Informations professionnelles</Text>
                </View>
              </View>

              {/* Bio */}
              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.toggleModal('isSpeciality')}>
                <Text style={fieldStyle.title_text}>Spécialité</Text>
                <Text style={fieldStyle.value}>{this.state.speciality}</Text>
              </TouchableOpacity>

              {line}

              {/* Bio */}
              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.toggleModal('isBio')}>
                <Text style={fieldStyle.title_text}>Bio</Text>
                <Text style={fieldStyle.value}>{this.state.bio}</Text>
              </TouchableOpacity>

              {line}

              {/* Code finesse */}
              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.toggleModal('isCodeFinesse')}>
                <Text style={fieldStyle.title_text}>Code finesse</Text>
                <Text style={fieldStyle.value}>{this.state.codeFinesse}</Text>
              </TouchableOpacity>

              {line}

              {/* Diplomes */}
              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.props.navigation.navigate('Diplomes', { diplomes: this.state.diplomes, doctor_id: this.doctor_id })}>
                <Text style={fieldStyle.title_text}>Diplômes</Text>
                {this.state.diplomes.map(function (diplome) {
                  return (
                    <View>
                      <Text style={[fieldStyle.image, { textDecorationLine: 'underline', alignSelf: 'flex-start' }]}
                        onPress={() => this.toggleModalImage(diplome.image)} >{diplome.titre}</Text>
                    </View>)
                }.bind(this))}
              </TouchableOpacity>

            </Card>

          </View>

        </ScrollView>

        <ImageViewing
          images={images}
          imageIndex={0}
          presentationStyle="overFullScreen"
          visible={this.state.isModalImageVisible}
          onRequestClose={() => this.setState({ isModalImageVisible: false })}
        />

      </View >

    );
  }
}

const mapStateToProps = (state) => {
  return {
    role: state.roles.role,
  }
}

export default connect(mapStateToProps)(Profile)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  header_container: {
    flex: 0.28,
    //justifyContent: 'flex-end',
    //alignItems: 'stretch',
    //backgroundColor: 'brown',
  },
  headerIcon: {
    width: SCREEN_WIDTH,
    height: HEADER_ICON_HEIGHT,
  },
  metadata_container: {
    flex: 0.12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    //backgroundColor: 'green',
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
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'orange'
  },
  metadata_box: {
    height: SCREEN_WIDTH * 0.12,
    marginLeft: SCREEN_WIDTH * 0.04,
    justifyContent: 'center',
    //backgroundColor: 'yellow'
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
  infos_container: {
    flex: 1,
    //backgroundColor: 'brown',
  },
  edit_button: {
    height: SCREEN_HEIGHT * 0.045,
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: '#93eafe',
    borderWidth: 1,
    borderColor: '#93eafe',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  edit_button_inside: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: SCREEN_WIDTH * 0.05
  },
  info_container: {
    flex: 1,
    //alignItems: 'center',
    //justifyContent: 'center',
    //flexDirection: 'row',
    //marginLeft: SCREEN_WIDTH * 0.01
    paddingTop: SCREEN_HEIGHT * 0.03,
    //backgroundColor: 'brown',
  },
  title_text: {
    color: '#93eafe',
    marginBottom: SCREEN_HEIGHT * 0.006
  }
});

const fieldStyle = StyleSheet.create({
  container: {
    paddingLeft: SCREEN_WIDTH * 0.04,
    paddingTop: SCREEN_WIDTH * 0.025
  },
  title_text: {
    color: '#333',
    fontWeight: 'bold',
    marginBottom: SCREEN_HEIGHT * 0.006
  },
  value: {
    color: '#333',
    marginBottom: SCREEN_HEIGHT * 0.008
  },
  image: {
    color: '#333',
    fontSize: SCREEN_HEIGHT * 0.014,
    marginBottom: SCREEN_HEIGHT * 0.01,
    paddingTop: SCREEN_WIDTH * 0.01,
    paddingBottom: SCREEN_WIDTH * 0.01,
    paddingRight: SCREEN_WIDTH * 0.1,
  }
});

const modalStyles = StyleSheet.create({

  picker_container: {
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // marginVertical: 0, 
    //marginTop: 5, 
    height: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.6,
    paddingLeft: 20,
    paddingRight: 10
  },
  //Buttons confirme/cancel
  modalButtons_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 15
  },
  ConfirmButton: {
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
  CancelButton: {
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
    backgroundColor: '#fff'
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
  buttonText1: {
    fontSize: 12,
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    color: 'gray',
    backgroundColor: 'transparent',
  },
  bio: {
    height: 150,
    width: SCREEN_WIDTH*0.8,
    justifyContent: "flex-start",
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 50,
    margin: 5,
    textAlignVertical: 'top'
  }
})
