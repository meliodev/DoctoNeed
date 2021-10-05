//Presentation.js
//TEST

//if isDoctor: READ-only
//if isAdmin or isPatient: Free 

import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, ScrollView, ActivityIndicator, TextInput, Picker, Text, Image, TouchableOpacity, TouchableHighlight, Dimensions, Slider, StyleSheet, SafeAreaView, Alert } from 'react-native'
import Modal from 'react-native-modal';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';
import { Card } from 'native-base';
import ImageViewing from "react-native-image-viewing";
import ImagePicker from 'react-native-image-picker';

import moment from 'moment'
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')

import * as REFS from '../../../DB/CollectionsRefs'

import { connect } from 'react-redux'

import { toggleLeftSideMenu, navigateToMedicalFolder, navigateToScreen, signOutUserandToggle } from '../../../Navigation/Navigation_Functions'
import { imagePickerOptions, getFileLocalPath } from '../../../util/MediaPickerFunctions'

import LeftSideMenu from '../../../components/LeftSideMenu'

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

class MedicalFolder extends React.Component {
  constructor(props) {
    super(props);
    this.renderForm = this.renderForm.bind(this);
    this.rootingConfirm = this.rootingConfirm.bind(this);

    this.user_id_param = this.props.navigation.getParam('user_id', '')  //received from admin or doctor navigation params
    this.user_id = ''

    this.reRender = this.props.navigation.addListener('willFocus', () => {
      this.fetchFirebase()
      this.forceUpdate()
    })


    this.state = {
      currentUser: null,
      //Metadata fields
      nom: "",
      prenom: "",
      dateNaissance: "",
      age: "",
      Avatar: '',

      //Data fields
      Sexe: "",
      Poids: 100,
      Taille: 0,
      Profession: '',
      GS: '',
      Allergies: false,
      ListAllergies: [],
      Medication: '',
      NumSS: '',
      Mutuelle: '',
      CarteVitale: '',

      //Variables to toggle Modal
      isName: false,
      isSexe: false,
      isPoids: false,
      isTaille: false,
      isProfession: false,
      isGS: false,
      isAllergies: false,
      isMedication: false,
      isNumSS: false,
      isMutuelle: false,
      isCarteVitale: false,

      //Mutuelle & Carte Vitale refs
      MutuelleSource: '',
      MutuelleStorageRef: '',
      CarteVitaleSource: '',
      CarteVitaleStorageRef: '',
      AvatarSource: '',
      AvatarStorageRef: '',

      isUploading1: false,
      isUploading2: false,
      isUploading3: false,

      isModalImageVisible: false,
      ismodalVisible: false,
      ImageToShow: '',

      isLeftSideMenuVisible: false

      // //Antecedants
      // isCardioDisease: false,
      // isCardioDiseaseIndex: 0,
    }


  }


  componentDidMount() {
    //Initializing current user
    if (this.props.role === 'isPatient')
      this.user_id = firebase.auth().currentUser.uid

    else if (this.props.role === 'isAdmin' || this.props.role === 'isDoctor') {
      this.user_id = this.user_id_param
    }

    this.fetchFirebase()
  }

  // componentWillUnmount() {
  //   this.reRender;
  // }

  fetchFirebase() {

    REFS.users.doc(this.user_id).onSnapshot(doc => {
      this.setState({
        //Meta data
        nom: doc.data().nom,
        prenom: doc.data().prenom,
        dateNaissance: doc.data().dateNaissance,
        Avatar: doc.data().Avatar,

        //Infos personnelles
        Sexe: doc.data().Sexe,
        Poids: doc.data().Poids,
        Taille: doc.data().Taille,
        Profession: doc.data().Profession,
        GS: doc.data().GS,

        //Allergies
        Allergies: doc.data().isAllergies,
        ListAllergies: doc.data().Allergies,
        Medication: doc.data().Medication,

        //Antécédants médicaux
        isCardioDisease: doc.data().isCardioDisease,
        isCardioDiseaseFamily: doc.data().isCardioDiseaseFamily,
        isStress: doc.data().isStress,
        isNoMoral: doc.data().isNoMoral,
        isFollowUp: doc.data().isFollowUp,
        isAsthme: doc.data().isAsthme,

        //Infos sup
        NumSS: doc.data().NumSS,
        Mutuelle: doc.data().Mutuelle,
        CarteVitale: doc.data().CarteVitale,

      }, () => {
        //Initialize radio fields
        if (this.state.Sexe === 'Homme')
          this.setState({ sexeIndex: 0 })
        else
          this.setState({ sexeIndex: 1 })

        if (doc.data().isAllergies === 'Oui')
          this.setState({ isAllergiesIndex: 0 })
        else if (doc.data().isAllergies === 'Non')
          this.setState({ isAllergiesIndex: 1 })

        if (doc.data().isCardioDisease === 'Oui')
          this.setState({ isCardioDiseaseIndex: 0 })
        else if (doc.data().isCardioDisease === 'Non')
          this.setState({ isCardioDiseaseIndex: 1 })

        if (doc.data().isCardioDiseaseFamily === 'Oui')
          this.setState({ isCardioDiseaseFamilyIndex: 0 })
        else if (doc.data().isCardioDiseaseFamily === 'Non')
          this.setState({ isCardioDiseaseFamilyIndex: 1 })

        if (doc.data().isStress === 'Oui')
          this.setState({ isStressIndex: 0 })
        else if (doc.data().isStress === 'Non')
          this.setState({ isStressIndex: 1 })

        if (doc.data().isNoMoral === 'Oui')
          this.setState({ isNoMoralIndex: 0 })
        else if (doc.data().isNoMoral === 'Non')
          this.setState({ isNoMoralIndex: 1 })

        if (doc.data().isFollowUp === 'Oui')
          this.setState({ isFollowUpIndex: 0 })
        else if (doc.data().isFollowUp === 'Non')
          this.setState({ isFollowUpIndex: 1 })

        if (doc.data().isAsthme === 'Oui')
          this.setState({ isAsthmeIndex: 0 })
        else if (doc.data().isAsthme === 'Non')
          this.setState({ isAsthmeIndex: 1 })
      })

    })
  }

  signOutUser() {
    signOutUser();
  }

  toggleModal = (isField) => {

    const update = {};
    update[isField] = true
    this.setState(update);

    this.setState({
      ismodalVisible: !this.state.ismodalVisible
    })
  }

  async onConfirm(isField, Field, value) {
    this.toggleModal()
    var usersUpdate = {};
    usersUpdate[`${Field}`] = value;
    await REFS.users.doc(this.user_id).update(usersUpdate)
    this.setState({ isName: false, isSexe: false, isPoids: false, isTaille: false, isProfession: false, isGS: false, isCodeFinesse: false, isMedication: false })
  }

  rootingConfirm() {
    const { isName, nom, prenom, isSexe, Sexe, isPoids, Poids, isTaille, Taille, isProfession, Profession, isGS, GS, isMedication, Medication, isNumSS, NumSS } = this.state

    if (isName) {
      this.onConfirm('isName', 'nom', nom)
      this.onConfirm('', 'prenom', prenom)
    }

    else if (isSexe)
      this.onConfirm('isSexe', 'Sexe', Sexe)

    else if (isPoids)
      this.onConfirm('isPoids', 'Poids', Poids)

    else if (isTaille)
      this.onConfirm('isTaille', 'Taille', Taille)

    else if (isProfession)
      this.onConfirm('isProfession', 'Profession', Profession)

    else if (isGS)
      this.onConfirm('isGS', 'GS', GS)

    else if (isMedication)
      this.onConfirm('isMedication', 'Medication', Medication)

    else if (isNumSS)
      this.onConfirm('isNumSS', 'NumSS', NumSS)
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

          <View style={modalStyles.picker_container} >
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
          <RadioForm>
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
                    onPress={(value) => this.setState({ Sexe: value, sexeIndex: i })}
                    labelStyle={{ marginLeft: 10 }}
                  />
                </RadioButton>
              ))
            }
          </RadioForm>
        </View>
      )

    else if (this.state.isPoids)
      component = (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.1 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: SCREEN_HEIGHT * 0.04 }}>Quel est votre Poids ?</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 30, textAlign: 'center', marginBottom: SCREEN_HEIGHT * 0.07 }}>{this.state.Poids} Kg</Text>
          <Slider
            value={this.state.Poids}
            onValueChange={value => this.setState({ Poids: value })}
            minimumValue={0}
            maximumValue={200}
            step={1}
            minimumTrackTintColor='#93eafe'
            thumbTintColor='#93eafe'
            style={{ width: SCREEN_WIDTH * 0.7 }} />
        </View>
      )

    else if (this.state.isTaille)
      component = (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.1 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: SCREEN_HEIGHT * 0.04 }}>Quel est votre taille ?</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 30, textAlign: 'center', marginBottom: SCREEN_HEIGHT * 0.07 }}>{this.state.Taille} cm</Text>
          <Slider
            value={this.state.Taille}
            onValueChange={value => this.setState({ Taille: value })}
            minimumValue={0}
            maximumValue={300}
            step={1}
            minimumTrackTintColor='#93eafe'
            thumbTintColor='#93eafe'
            style={{ width: SCREEN_WIDTH * 0.7 }}
          />
        </View>
      )

    else if (this.state.isProfession)
      component = (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.1 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: SCREEN_HEIGHT * 0.04 }}>Quelle est votre profession ?</Text>
          <View style={modalStyles.picker_container} >
            <Picker selectedValue={this.state.Profession} onValueChange={(value) => this.setState({ Profession: value })} style={{ flex: 1, color: '#445870', width: SCREEN_WIDTH * 0.6, textAlign: "center" }}>
              <Picker.Item value='' label='Selectionnez votre profession' />
              {Professions.map((profession, key) => {
                return (<Picker.Item key={key} value={profession} label={profession} />);
              })}
            </Picker>
          </View>
        </View>
      )

    else if (this.state.isMedication)
      component = (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.1 }}>
          <View>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 22, marginBottom: SCREEN_HEIGHT * 0.04 }}>Quels médicaments prenez-vous actuellement ?</Text>
          </View>

          <View>
            <TextInput
              onChangeText={(Medication) => this.setState({ Medication: Medication })}
              placeholder={"Veuillez spécifier les médicaments que vous prenez en ce moment si c'est le cas. (exp: Zyrtec, Febrex, Doliprane, Panadol)"}
              value={this.state.Medication}
              style={{ height: 150, justifyContent: "flex-start", borderRadius: 20, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.32, shadowRadius: 5.46, backgroundColor: '#fff', padding: 15, margin: 5, textAlignVertical: 'top' }}
              numberOfLines={10}
              multiline={true} />
          </View>
        </View>
      )

    else if (this.state.isGS)
      component = (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.1 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: SCREEN_HEIGHT * 0.04 }}>Quel est votre groupe sanguin ?</Text>
          <View style={modalStyles.picker_container} >
            <Picker selectedValue={this.state.GS} onValueChange={(value) => this.setState({ GS: value })} style={{ flex: 1, color: '#445870', width: SCREEN_WIDTH * 0.6, textAlign: "center" }}>
              <Picker.Item value='' label='Selectionnez votre groupe sanguin' />
              {GS.map((GS, key) => {
                return (<Picker.Item key={key} value={GS} label={GS} />);
              })}
            </Picker>
          </View>
        </View>
      )

    //Infos sup
    else if (this.state.isNumSS)
      component = (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.1 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: SCREEN_HEIGHT * 0.04 }}>Quel est votre numéro de sécurité sociale ?</Text>
          <View style={modalStyles.picker_container} >
            <TextInput
              onChangeText={(NumSS) => this.setState({ NumSS: NumSS })}
              placeholder={'Votre numéro de sécurité sociale'}
              style={{ width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.1 }}
              value={this.state.NumSS} />
          </View>
        </View>
      )

    let buttonsComponent = (
      <View style={modalStyles.modalButtons_container}>
        <TouchableOpacity style={modalStyles.CancelButton} onPress={async () => {
          this.toggleModal()
          this.setState({ isName: false, isSexe: false, isPoids: false, isTaille: false, isProfession: false, isGS: false, isCodeFinesse: false, isMedication: false })
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
      </View>
    )

    return (
      <View style={{ flex: 1 }}>
        {component}
        {buttonsComponent}
      </View>
    )
  }

  //Handle Images (Mutuelle, Carte Vitale)
  uploadImage(field, source) {

    if (field === 'Mutuelle') {
      this.setState({ isUploading1: true })
      const MutuelleStorageRef = firebase.storage().ref('/Users/' + this.user_id + '/Dossier médical/Documents/Mutuelle')
      Promise.resolve(MutuelleStorageRef.putFile(source)).then((URLObject) => {
        REFS.users.doc(this.user_id).update({ Mutuelle: URLObject.downloadURL })
          .finally(this.setState({ isUploading1: false }))
      })
    }

    else if (field === 'Carte Vitale') {
      this.setState({ isUploading2: true })
      const CarteVitaleStorageRef = firebase.storage().ref('/Users/' + this.user_id + '/Dossier médical/DocumentsCarte-Vitale')
      Promise.resolve(CarteVitaleStorageRef.putFile(source)).then((URLObject) => {
        REFS.users.doc(this.user_id).update({ CarteVitale: URLObject.downloadURL })
          .finally(err => this.setState({ isUploading2: false }))
      })
    }

    else if (field === 'Avatar') {
      this.setState({ isUploading3: true })
      const AvatarStorageRef = firebase.storage().ref('/Users/' + this.user_id + '/Profile/Avatar')
      Promise.resolve(AvatarStorageRef.putFile(source)).then((URLObject) => {
        REFS.users.doc(this.user_id).update({ Avatar: URLObject.downloadURL })
          .finally(err => this.setState({ isUploading3: false }))
      })
    }

  }

  handleImage = async (field) => {
    await ImagePicker.showImagePicker(imagePickerOptions, imagePickerResponse => {
      const { didCancel, error } = imagePickerResponse;
      if (didCancel) console.log('Post canceled')
      else if (error) Alert.alert('Erreur, veuillez réessayer...')

      else {
        if (field === 'Mutuelle') {
          const MutuelleSource = getFileLocalPath((imagePickerResponse))
          this.uploadImage(field, MutuelleSource)
          //this.setState({ MutuelleSource })
        }

        else if (field === 'Carte Vitale') {
          const CarteVitaleSource = getFileLocalPath((imagePickerResponse))
          this.uploadImage(field, CarteVitaleSource)
          // this.setState({ CarteVitaleSource })
        }

        else if (field === 'Avatar') {
          const AvatarSource = getFileLocalPath((imagePickerResponse))
          this.uploadImage(field, AvatarSource)
          // this.setState({ AvatarSource })
        }

      }
    })
  }

  toggleModalImage(link) {
    this.setState({ isModalImageVisible: !this.state.isModalImageVisible, ImageToShow: link })
  }

  onPress1(Field) {
    if (this.props.role === 'isPatient' || this.props.role === 'isAdmin')
      this.toggleModal(Field)
  }

  onPress2() {
    if (this.props.role === 'isPatient' || this.props.role === 'isAdmin')
      this.props.navigation.navigate('Allergies', { user_id: this.user_id, isAllergies: this.state.Allergies, isAllergiesIndex: this.state.isAllergiesIndex, ListAllergies: this.state.ListAllergies })
  }

  onPress3() {
    if (this.props.role === 'isPatient' || this.props.role === 'isAdmin')
      this.props.navigation.navigate('Antecedants', {
        user_id: this.user_id,
        isCardioDisease: this.state.isCardioDisease, isCardioDiseaseIndex: this.state.isCardioDiseaseIndex,
        isCardioDiseaseFamily: this.state.isCardioDiseaseFamily, isCardioDiseaseFamilyIndex: this.state.isCardioDiseaseFamilyIndex,
        isStress: this.state.isStress, isStressIndex: this.state.isStressIndex,
        isNoMoral: this.state.isNoMoral, isNoMoralIndex: this.state.isNoMoralIndex,
        isFollowUp: this.state.isFollowUp, isFollowUpIndex: this.state.isFollowUpIndex,
        isAsthme: this.state.isAsthme, isAsthmeIndex: this.state.isAsthmeIndex,
      })
  }

  render() {

    let images = [
      {
        uri: this.state.ImageToShow,
      }
    ]

    return (
      <View style={styles.container}>

        <View style={styles.header_container}><Image source={require('../../../assets/header-image.png')} style={styles.headerIcon} /></View>

        <View style={{ height: SCREEN_HEIGHT * 0.01, flexDirection: 'row', paddingTop: SCREEN_HEIGHT * 0.00, justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', bottom: 80, }}>
          <LeftSideMenu />
        </View>

        {/* user metadata */}
        <View style={styles.metadata_container}>
          <TouchableOpacity onPress={() => {
            if (this.props.role === 'isPatient' || this.props.role === 'isAdmin')
              this.handleImage('Avatar')
          }}>
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

          <TouchableOpacity onPress={() => this.onPress1('isName')}>
            <View style={styles.metadata_box}>
              <Text style={styles.metadata_text1}>{this.state.prenom} {this.state.nom}</Text>
              <Text style={styles.metadata_text2}>{moment(this.state.dateNaissance).format('DD/MM/YYYY')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.infos_container}>
          <View style={styles.info_container}>

            <Modal
              isVisible={this.state.ismodalVisible}
              animationIn="slideInLeft"
              animationOut="slideOutLeft"
              style={{ flex: 1, backgroundColor: '#fff', }}>

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
                onPress={() => this.onPress1('isSexe')}>
                <Text style={fieldStyle.title_text}>Sexe</Text>
                <Text style={fieldStyle.value}>{this.state.Sexe}</Text>
              </TouchableOpacity>

              {line}

              {/* poids */}
              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.onPress1('isPoids')}>
                <Text style={fieldStyle.title_text}>Poids</Text>
                <Text style={fieldStyle.value}>{this.state.Poids} kgs</Text>
              </TouchableOpacity>

              {line}

              {/* taille */}
              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.onPress1('isTaille')}>
                <Text style={fieldStyle.title_text}>Taille</Text>
                <Text style={fieldStyle.value}>{this.state.Taille} cm</Text>
              </TouchableOpacity>

              {line}

              {/* date naissance */}
              <TouchableOpacity style={fieldStyle.container}
                onPress={() => {
                  if (this.props.role === 'isPatient' || this.props.role === 'isAdmin')
                    this.props.navigation.navigate('DateNaissance', { user_id: this.user_id, dateNaissance: this.state.dateNaissance })
                }}>
                <Text style={fieldStyle.title_text}>Date de naissance</Text>
                <Text style={fieldStyle.value}>{moment(this.state.dateNaissance).format('LL')}</Text>
              </TouchableOpacity>

              {line}

              {/* profession */}
              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.onPress1('isProfession')}>
                <Text style={fieldStyle.title_text}>Profession</Text>
                <Text style={fieldStyle.value}>{this.state.Profession}</Text>
              </TouchableOpacity>

              {line}

              {/* GS */}
              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.onPress1('isGS')}>
                <Text style={fieldStyle.title_text}>Groupe sanguin</Text>
                <Text style={fieldStyle.value}>{this.state.GS}</Text>
              </TouchableOpacity>
            </Card>

            {/*Allergies*/}
            <Card style={{ padding: SCREEN_HEIGHT * 0.02, marginBottom: SCREEN_HEIGHT * 0.03 }}>
              <View style={styles.edit_button}>
                <View style={styles.edit_button_inside}>
                  <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Allergies</Text>
                </View>
              </View>

              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.onPress2()}>
                <Text style={fieldStyle.title_text}>Avez-vous déja eu des allergies médicamenteuses ?</Text>
                <Text style={fieldStyle.value}>{this.state.Allergies}</Text>
              </TouchableOpacity>

              {line}

              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.onPress2()}>
                <Text style={fieldStyle.title_text}>A quels types d'allergies médicamenteuses êtes-vous sujet ?</Text>
                <View>
                  <Text style={{ flex: 1, flexWrap: 'wrap' }}>
                    {this.state.ListAllergies.map((allergy, key) => {
                      if (key !== this.state.ListAllergies.length - 1)
                        return (<Text style={fieldStyle.value}>{allergy}, </Text>)
                      else
                        return (<Text style={fieldStyle.value}>{allergy}</Text>)
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            </Card>

            {/*Antécédants médicaux*/}
            <Card style={{ padding: SCREEN_HEIGHT * 0.02, marginBottom: SCREEN_HEIGHT * 0.03 }}>
              <View style={styles.edit_button}>
                <View style={styles.edit_button_inside}>
                  <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Antécédants médicaux</Text>
                </View>
              </View>

              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.onPress3()}>
                <Text style={fieldStyle.title_text}>Etes-vous sujet à une ou plusieurs maladies cardiovasculaires (infarctus, AVC) ?</Text>
                <Text style={fieldStyle.value}>{this.state.isCardioDisease}</Text>
              </TouchableOpacity>

              {line}

              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.onPress3()}>
                <Text style={fieldStyle.title_text}>Avez-vous des Antécédents cardiovasculaires familiaux (infarctus, AVC) ?</Text>
                <Text style={fieldStyle.value}>{this.state.isCardioDiseaseFamily}</Text>
              </TouchableOpacity>

              {line}

              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.onPress3()}>
                <Text style={fieldStyle.title_text}>Vous sentez-vous stressé(e) ?</Text>
                <Text style={fieldStyle.value}>{this.state.isStress}</Text>
              </TouchableOpacity>

              {line}

              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.onPress3()}>
                <Text style={fieldStyle.title_text}>Avez-vous le moral ?</Text>
                <Text style={fieldStyle.value}>{this.state.isNoMoral}</Text>
              </TouchableOpacity>

              {line}

              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.onPress3()}>
                <Text style={fieldStyle.title_text}>Avez-vous accès à un suivi dentaire régulier ?</Text>
                <Text style={fieldStyle.value}>{this.state.isFollowUp}</Text>
              </TouchableOpacity>

              {line}

              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.onPress3()}>
                <Text style={fieldStyle.title_text}>Etes-vous asthmatique ?</Text>
                <Text style={fieldStyle.value}>{this.state.isAsthme}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.onPress1('isMedication')}>
                <Text style={fieldStyle.title_text}>Quels médicaments prenez-vous actuellement ?</Text>
                <View>
                  <Text style={{ flex: 1, flexWrap: 'wrap' }}>
                    {this.state.Medication}
                  </Text>
                </View>
              </TouchableOpacity>
            </Card>

            {/*Infos sup*/}
            <Card style={{ padding: SCREEN_HEIGHT * 0.02, marginBottom: SCREEN_HEIGHT * 0.03 }}>
              <View style={styles.edit_button}>
                <View style={styles.edit_button_inside}>
                  <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Informations supplémentaires</Text>
                </View>
              </View>


              {/* Numéro de sécurité sociale */}
              <TouchableOpacity style={fieldStyle.container}
                onPress={() => this.onPress1('isNumSS')}>
                <Text style={fieldStyle.title_text}>Numéro de sécurité sociale</Text>
                <Text style={fieldStyle.value}>{this.state.NumSS}</Text>
              </TouchableOpacity>

              {line}

              {/*Mutuelle*/}
              <TouchableOpacity style={fieldStyle.container}
                onPress={() => {
                  if (this.props.role === 'isPatient' || this.props.role === 'isAdmin')
                    this.handleImage('Mutuelle')
                }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={fieldStyle.title_text}>Mutuelle</Text>
                  <Icon name="upload"
                    size={SCREEN_WIDTH * 0.04}
                    color="#BDB7AD"
                    style={{ position: 'absolute', right: 0 }} />
                </View>


                {this.state.isUploading1 &&
                  <View style={{ alignItems: 'flex-start' }}>
                    <ActivityIndicator size='small' />
                  </View>}

                {this.state.Mutuelle !== '' &&
                  <View>
                    <Text style={[fieldStyle.image, { textDecorationLine: 'underline', width: '25%', padding: SCREEN_WIDTH * 0.01 }]}
                      onPress={() => this.toggleModalImage(this.state.Mutuelle)}>Mutuelle</Text>
                  </View>
                }
              </TouchableOpacity>

              {line}

              {/*Carte vitale*/}
              <TouchableOpacity style={fieldStyle.container}
                onPress={() => {
                  if (this.props.role === 'isPatient' || this.props.role === 'isAdmin')
                    this.handleImage('Carte Vitale')
                }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={fieldStyle.title_text}>Carte vitale</Text>
                  <Icon name="upload"
                    size={SCREEN_WIDTH * 0.04}
                    color="#BDB7AD"
                    style={{ position: 'absolute', right: 0 }} />
                </View>

                {this.state.isUploading2 &&
                  <View style={{ alignItems: 'flex-start' }}>
                    <ActivityIndicator size='small' />
                  </View>}

                {this.state.CarteVitale !== '' &&
                  <View>
                    <Text style={[fieldStyle.image, { textDecorationLine: 'underline', width: '25%', padding: SCREEN_WIDTH * 0.01 }]}
                      onPress={() => this.toggleModalImage(this.state.CarteVitale)}>Carte vitale</Text>
                  </View>}

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

export default connect(mapStateToProps)(MedicalFolder)

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
    marginBottom: SCREEN_HEIGHT * 0.01
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
})



