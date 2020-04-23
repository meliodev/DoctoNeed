//Presentation.js
//TEST

import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, Button, Text, Image, TouchableOpacity, TouchableHighlight, Dimensions, Slider, StyleSheet } from 'react-native'
import Modal from 'react-native-modal';

import { withNavigation } from 'react-navigation';

import * as REFS from '../../../DB/CollectionsRefs'

import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Picker, CheckBox, Content, Card, CardItem } from 'native-base';
import DatePicker from 'react-native-datepicker'
import { imagePickerOptions, options2, getFileLocalPath, createStorageReferenceToFile, uploadFileToFireBase } from '../../../util/MediaPickerFunctions'


//import { RadioButton } from 'react-native-paper';
//import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import ImagePicker from 'react-native-image-picker';

import LeftSideMenu from '../../../components/LeftSideMenu'
import RightSideMenu from '../../../components/RightSideMenu2'
import Icon1 from 'react-native-vector-icons/FontAwesome';




const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioHeader = 267 / 666; // The actaul icon headet size is 254 * 668
const HEADER_ICON_HEIGHT = Dimensions.get("window").width * ratioHeader; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

const options = {
  title: 'Select Image',
  // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default class DoctorFolder extends React.Component {
  constructor(props) {
    super(props);
    this.openModalSex = this.openModalSex.bind(this);


    this.state = {
      currentUser: null,
      nom: "",
      prenom: "",
      dateNaissance: "",
      age: "",
      Sexe: "",
      date: "1990-01-01",
      ismodalSexVisible: false,

      ismodalPoidsVisible: false,
      Poids: 0,
      ismodalTailleVisible: false,
      Taille: 0,
      ismodalGSVisible: false,
      GS: '',

      oui: false,
      non: false
    

    }
    this.signOutUser = this.signOutUser.bind(this);
    this.signOutUserandToggle = this.signOutUserandToggle.bind(this);
    this.navigateToAppointments = this.navigateToAppointments.bind(this);
    this.navigateToDoctorFolder = this.navigateToDoctorFolder.bind(this);
    this.navigateToDispoConfig = this.navigateToDispoConfig.bind(this);



   /* ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    });*/

    


  }

  getImages = () => {
    ImagePicker.showImagePicker(imagePickerOptions, imagePickerResponse => {
      const { didCancel, error } = imagePickerResponse;
      if (didCancel) { console.log('Post canceled'); }
      else if (error) { alert('An error occurred: ', error); }
      else {
        this.fileSrce = getFileLocalPath((imagePickerResponse))
        this.stgRef = createStorageReferenceToFile(imagePickerResponse)
        this.ImageObjects = this.state.ImageObjects
        this.ImageObjects.push({ fileSource: this.fileSrce, storageRef: this.stgRef })
        this.setState({
          ImageURI: imagePickerResponse.uri,
          ImageObjects: this.ImageObjects
        }, console.log(this.state.ImageObjects[0].storageRef))
      }
      
    }
    );
  };


  componentWillMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    firebase.firestore().collection("users").doc(currentUser.uid).get().then(doc => {
      this.setState({ Sexe: doc.data().Sexe })
      this.setState({ Poids: doc.data().Poids })
      this.setState({ Taille: doc.data().Taille })
      this.setState({ nom: doc.data().nom })
      this.setState({ prenom: doc.data().prenom })
      this.setState({ dateNaissance: doc.data().dateNaissance })
      this.setState({ Profession: doc.data().Profession })
      this.setState({ Sanguin: doc.data().Sanguin })
      this.setState({ date: doc.data().date})

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

  //Modals for edit
  //Modal Sexe
  openModalSex() {
    this.setState({ ismodalSexVisible: true })
  }

  toggleModalSex = () => {
    this.setState({
      ismodalSexVisible: !this.state.ismodalSexVisible
    })
  }

  closeModalSex = () => {
    this.setState({
      ismodalSexVisible: false
    })
  }

  //Poids
  openModalPoids() {
    this.setState({ ismodalPoidsVisible: true })
  }

  toggleModalPoids = () => {
    this.setState({
      ismodalPoidsVisible: !this.state.ismodalPoidsVisible
    })
  }

  closeModalPoids = () => {
    this.setState({
      ismodalPoidsVisible: false
    })
  }

  //Taille
  openModalTaille() {
    this.setState({ ismodalTailleVisible: true })
  }

  toggleModalTaille = () => {
    this.setState({
      ismodalTailleVisible: !this.state.ismodalTailleVisible
    })
  }

  closeModalTaille = () => {
    this.setState({
      ismodalTailleVisible: false
    })
  }

   //RightSideMenu functions
  toggleRightSideMenu = () => {
    this.setState({ isRightSideMenuVisible: !this.state.isRightSideMenuVisible });
  }

  onSelectDoctor = (doctor) => {
    if (doctor === "")
      this.setState({ doctor: doctor, isDoctorSelected: false })
    else
      this.setState({ doctor: doctor, isDoctorSelected: true })
  }

  onSelectSpeciality = (speciality) => {
    if (speciality === "")
      this.setState({ speciality: speciality, isSpecialitySelected: false })
    else
      this.setState({ speciality: speciality, isSpecialitySelected: true })
  }

  clearAllFilters = () => {
    this.setState({
      doctor: '', speciality: '',
      isDoctorSelected: false, isSpecialitySelected: false,
      isRightSideMenuVisible: false
    })
  }

  //LeftSideMenu functions
  toggleLeftSideMenu = () => {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible });
  }

  navigateToDoctorFolder() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('DoctorFolder'));
    //console.log(this.props)
  }
  navigateToDispoConfig() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('DispoConfig'));
    //console.log(this.props)
  }

  navigateToAppointments() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('TabScreen'));
  }

  signOutUserandToggle() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      this.signOutUser())
  }

 

  PressOui(){
    console.log(this.state.oui);
    this.setState({oui:true, non:false})
  }
  PressNon(){
    console.log(this.state.non);
    this.setState({oui:false, non:true})

  }

  render() {
    // const currentUser= firebase.auth().currentUser.
    console.log(this.state.Sexe)
    console.log(this.state.nom)
    console.log(this.state.prenom)
    console.log(this.state.dateNaissance)

    return (
      <View style={styles.container}>

<View style={styles.header_container}><Image source={require('../../../assets/header-image.png')} style={styles.headerIcon} /></View>

<LeftSideMenu
          isSideMenuVisible={this.state.isLeftSideMenuVisible}
          toggleSideMenu={this.toggleLeftSideMenu}
          nom={this.state.nom}
          prenom={this.state.prenom}
          email={this.state.email}
          navigateToDoctorFolder={this.navigateToDoctorFolder}
          navigateToDispoConfig={this.navigateToDispoConfig}
          navigateToAppointments={this.navigateToAppointments}
          signOutUser={this.signOutUserandToggle}
          navigate={this.props.navigation} />

        <RightSideMenu
          isSideMenuVisible={this.state.isRightSideMenuVisible}
          toggleSideMenu={this.toggleRightSideMenu}
          onSelectDoctor={this.onSelectDoctor}
          onSelectSpeciality={this.onSelectSpeciality}
          clearAllFilters={this.clearAllFilters}
          /*toggleUrgence={this.toggleUrgence}
          urgences={this.state.urgences}
          price={this.state.price}*/
          clearAllFilters={this.clearAllFilters}
         /* onSelectCountry={this.onSelectCountry}
          onSelectSpeciality={this.onSelectSpeciality}
          onSelectPriceMax={this.onSelectPriceMax} *//>

<View style={{ height: SCREEN_HEIGHT * 0.01, flexDirection: 'row', paddingTop: SCREEN_HEIGHT * 0.00, justifyContent: 'space-between', alignItems: 'flex-start',position:'relative', bottom:80,
         }}>


          <TouchableHighlight 
          style={{ 
                  width: SCREEN_WIDTH * 0.12,
                  height: SCREEN_WIDTH * 0.12,
                  borderRadius: 25,
                  backgroundColor: '#ffffff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  left: SCREEN_WIDTH * 0.05
                }}

            onPress={this.toggleLeftSideMenu}>
            <Icon1 name="bars" size={25} color="#93eafe" />
          </TouchableHighlight>

          <TouchableHighlight 
          style={{
                width: SCREEN_WIDTH * 0.12,
                height: SCREEN_WIDTH * 0.12,
                borderRadius: 25,
                backgroundColor: '#ffffff',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,
                elevation: 9,
                position: 'relative',
                right: SCREEN_WIDTH * 0.05,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: SCREEN_WIDTH * 0.02
          }}
            onPress={this.toggleRightSideMenu}>
            <Icon1 name="filter" size={25} color="#93eafe" />
          </TouchableHighlight>
         </View>
         
         
         
          <View style={styles.metadata_container}>
          <View style={styles.Avatar_box}>
            <Icon name="user"
              size={SCREEN_WIDTH * 0.05}
              color="#93eafe" />
          </View>
          <View style={styles.metadata_box}>
            <Text style={styles.metadata_text1}>{this.state.nom} {this.state.prenom}</Text>
            <Text style={styles.metadata_text2}>{this.state.dateNaissance} (28 ans)</Text>
          </View>
        </View>

        <ScrollView style={styles.infos_container}>
          <View style={styles.info_container}>
            <View
              style={styles.edit_button}
              onPress={() => displayDetailForDoctor(doctor.uid)}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <Text style={{ color: 'black', fontWeight: 'bold' }}>Informations personnelles</Text>
                <Icon name="pencil"
                  size={SCREEN_WIDTH * 0.04}
                  color="#93eafe" />
              </View>
            </View>

            <TouchableOpacity style={{ paddingLeft: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}
              onPress={() => this.openModalSex()}>
              <Text style={styles.title_text}>Sexe</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>{this.state.Sexe}</Text>
            </TouchableOpacity>

            <Modal isVisible={this.state.ismodalSexVisible}
              onBackdropPress={() => this.closeModalSex()}
              animationIn="slideInLeft"
              animationOut="slideOutLeft"
              onSwipeComplete={() => this.closeModalSex()}
              swipeDirection="left"
              style={{ backgroundColor: 'white', maxHeight: SCREEN_HEIGHT / 2, marginTop: SCREEN_HEIGHT * 0.25, alignItems: 'center', }}>

              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: SCREEN_HEIGHT * 0.1 }}>Votre Sexe</Text>
                <View style={{ flexDirection: 'row', marginBottom: SCREEN_HEIGHT * 0.07, }}>
                  {this.state.Sexe === 'Femme' || this.state.Sexe === '' ? <TouchableOpacity onPress={() => {
                    if (this.state.Sexe === 'Femme' || this.state.Sexe === '') this.setState({ Sexe: 'Homme' })
                  }}
                    style={modalStyles.item_inactive}><Text style={modalStyles.item_text}>Homme</Text></TouchableOpacity>
                    : <View style={modalStyles.item_active}><Text style={modalStyles.item_text}>Homme</Text></View>}

                  {this.state.Sexe === 'Homme' || this.state.Sexe === '' ? <TouchableOpacity onPress={() => {
                    if (this.state.Sexe === 'Homme' || this.state.Sexe === '') this.setState({ Sexe: 'Femme' })
                  }}
                    style={modalStyles.item_inactive}><Text style={modalStyles.item_text}>Femme</Text></TouchableOpacity>
                    : <View style={modalStyles.item_active}><Text style={modalStyles.item_text}>Femme</Text></View>}
                </View>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', position: 'absolute', bottom: 0 }}>
                <View style={{ flexDirection: 'row', }}>
                  <TouchableOpacity style={{ backgroundColor: '#93eafe', width: '50%' }} onPress={() => {
                             REFS.users.doc(firebase.auth().currentUser.uid).update({'Sexe': this.state.Sexe})
                             .then(()=> this.closeModalSex())
                             .catch((err)=> console.error(err)) }}>
                    <Text style={{ color: 'white', textAlign: 'center', padding: 10 }}>Confirmer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ borderColor: 'light gray', borderWidth: 0.45, width: '50%' }} onPress={() => this.closeModalSex()}>
                    <Text style={{ color: 'black', textAlign: 'center', padding: 10 }}>Annuler</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />


            <TouchableOpacity style={{ paddingLeft: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}
              onPress={() => this.openModalPoids()}>
              <Text style={styles.title_text}>Poids</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>{this.state.Poids} kgs</Text>
            </TouchableOpacity>

            <Modal isVisible={this.state.ismodalPoidsVisible}
              onBackdropPress={() => this.closeModalPoids()}
              animationIn="slideInLeft"
              animationOut="slideOutLeft"
              style={{ flex: 1, backgroundColor: 'white', maxHeight: SCREEN_HEIGHT / 2, marginTop: SCREEN_HEIGHT * 0.25, alignItems: 'center', }}>

              <View style={{ flex: 1, paddingTop: SCREEN_HEIGHT * 0.1 }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 28, marginBottom: SCREEN_HEIGHT * 0.04 }}>Votre Poids</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 40, textAlign: 'center', marginBottom: SCREEN_HEIGHT * 0.07 }}>{this.state.Poids} Kg</Text>
                <Slider
                  value={this.state.Poids}
                  onValueChange={value => this.setState({ Poids: value })}
                  minimumValue={0}
                  maximumValue={400}
                  step={1}
                  minimumTrackTintColor='#93eafe'
                  thumbTintColor='#93eafe'
                  style={{ width: SCREEN_WIDTH * 0.7 }}
                />
              </View>

              <View style={{ justifyContent: 'center', position: 'absolute', bottom: 0 }}>
                <View style={{ flexDirection: 'row', }}>
                  <TouchableOpacity style={{ backgroundColor: '#93eafe', width: '50%' }}  onPress={() => {
                             REFS.users.doc(firebase.auth().currentUser.uid).update({'Poids': this.state.Poids})
                             .then(()=> this.closeModalPoids())
                             .catch((err)=> console.error(err)) }}>
                    <Text style={{ color: 'white', textAlign: 'center', padding: 10 }}>Confirmer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ borderColor: 'light gray', borderWidth: 0.45, width: '50%' }} onPress={() => this.closeModalPoids()}>
                    <Text style={{ color: 'black', textAlign: 'center', padding: 10 }}>Annuler</Text>
                  </TouchableOpacity>
                </View>
              </View>


            </Modal>

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />



            <TouchableOpacity style={{ paddingLeft: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}
              onPress={() => this.openModalTaille()}>
              <Text style={styles.title_text}>Taille</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>{this.state.Taille} cm</Text>
            </TouchableOpacity>

            <Modal isVisible={this.state.ismodalTailleVisible}
              onBackdropPress={() => this.closeModalTaille()}
              animationIn="slideInLeft"
              animationOut="slideOutLeft"
              style={{ flex: 1, backgroundColor: 'white', maxHeight: SCREEN_HEIGHT / 2, marginTop: SCREEN_HEIGHT * 0.25, alignItems: 'center', }}>

              <View style={{ flex: 1, paddingTop: SCREEN_HEIGHT * 0.1 }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 28, marginBottom: SCREEN_HEIGHT * 0.04 }}>Votre Taille</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 40, textAlign: 'center', marginBottom: SCREEN_HEIGHT * 0.07 }}>{this.state.Taille} cm</Text>
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

              <View style={{ justifyContent: 'center', position: 'absolute', bottom: 0 }}>
                <View style={{ flexDirection: 'row', }}>
                  <TouchableOpacity style={{ backgroundColor: '#93eafe', width: '50%' }}>
                    <Text style={{ color: 'white', textAlign: 'center', padding: 10 }} onPress={() => {
                             REFS.users.doc(firebase.auth().currentUser.uid).update({'Taille': this.state.Taille})
                             .then(()=> this.closeModalTaille())
                             .catch((err)=> console.error(err)) }}>Confirmer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ borderColor: 'light gray', borderWidth: 0.45, width: '50%' }} onPress={() => this.closeModalTaille()}>
                    <Text style={{ color: 'black', textAlign: 'center', padding: 10 }}>Annuler</Text>
                  </TouchableOpacity>
                </View>
              </View>


            </Modal>



            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingLeft: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Date de naissance</Text>
              {// <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>01.01.1990</Text> 
              }
              <DatePicker
                style={{ width: 200, borderWidth: 0 }}
                date={this.state.dateNaissance}
                mode="date"
                placeholder={this.state.dateNaissance}
                format="DD-MM-YYYY"
                minDate="01-01-1990"
                maxDate="01-01-2030"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }}}
                
                onDateChange={(dateNaissance) => {
                  REFS.users.doc(firebase.auth().currentUser.uid).update({'dateNaissance': this.state.dateNaissance})
                  .then(()=> {this.setState({dateNaissance : dateNaissance})})
                  .catch((err)=> console.error(err)) }}
              />
            </View>

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingLeft: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Profession</Text>
              <View style={{
                borderRadius: 30,
                borderWidth: 0,
                borderColor: '#bdc3c7',
                overflow: 'hidden',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,
                elevation: 9,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                marginHorizontal: SCREEN_WIDTH * 0.02, marginBottom: 10, paddingVertical: 0, width: SCREEN_WIDTH * 0.35
              }}>

                <Picker mode="dropdown" selectedValue={this.state.Profession}  style={{ flex: 1, color: '#445870', width: SCREEN_WIDTH * 0.35, textAlign: "left" }} 
                onValueChange={(Profession) => {
                  REFS.users.doc(firebase.auth().currentUser.uid).update({'Profession': this.state.Profession})
                  .then(()=> {this.setState({Profession : Profession})} ).then(()=> {console.log('updated : ' + this.state.Profession)})
                  .catch((err)=> console.error(err)) }}
                >
                  <Picker.Item value='Enseignant' label='Enseignant' />
                  <Picker.Item value='Salarié' label='Salarié' />
                  <Picker.Item value='Commercant' label='Commercant' />
                  <Picker.Item value='Etudiant' label='Etudiant' />
                  <Picker.Item value='Retraité' label='Retraité' />
                  <Picker.Item value='Sans_Profession' label='Sans Profession' />
                  <Picker.Item value='Fonctionnaire' label='Fonctionnaire' />
                  <Picker.Item value='Artisan' label='Artisan' />
                </Picker></View>
            </View>


            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingLeft: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Groupe sanguin</Text>

              <View style={{
                borderRadius: 30,
                borderWidth: 0,
                borderColor: '#bdc3c7',
                overflow: 'hidden',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,
                elevation: 9,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                marginHorizontal: SCREEN_WIDTH * 0.02, marginBottom: 10, paddingVertical: 0, width: SCREEN_WIDTH * 0.35
              }}>

                <Picker mode="dropdown" selectedValue={this.state.Sanguin} onValueChange={this.updateDays} style={{ flex: 1, color: '#445870', width: SCREEN_WIDTH * 0.35, textAlign: "left" }}>
                  <Picker.Item value='O' label='O' />
                  <Picker.Item value='A' label='A' />
                  <Picker.Item value='B' label='B' />
                  <Picker.Item value='AB' label='AB' />

                </Picker></View>

            </View>

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: SCREEN_HEIGHT * 0.04 }} />



            <View
              style={styles.edit_button}
              onPress={() => displayDetailForDoctor(doctor.uid)}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <Text style={{ color: 'black', fontWeight: 'bold' }}>Allergies</Text>
                <Icon name="pencil"
                  size={SCREEN_WIDTH * 0.04}
                  color="#93eafe" />
              </View>
            </View>

            <Content>
              <Card>

                <CardItem header>
                <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}></View>
              <Text style={styles.title_text}>Avez-vous déja eu des allergies médicamenteuses ?</Text>
                </CardItem>
                <CardItem body>
                <CheckBox checked={this.state.oui} onPress={() => this.PressOui()} style={{marginRight:20}}/><Text>Oui</Text>

                <CheckBox checked={this.state.non} onPress={() => this.PressNon()} style={{marginRight:20}} /><Text>Non</Text>
                </CardItem>

              </Card>

            </Content>

            
     {/*       <Content>
              <Card>
                <CardItem header><Text style={styles.title_text} >A quels types d'allergies médicamenteuses étes-vous sujet?</Text></CardItem>
                <CardItem body style={{flexDirection:'column', flexWrap: 'wrap'}}>
                <CheckBox checked={this.state.oui} onPress={() => this.PressOui()} style={{marginRight:20,borderRadius:10}}/><Text style={{flexDirection:'row', flexWrap: 'wrap', alignItems:'baseline',textAlign:'left'}}>Antibiotique</Text>

                <CheckBox checked={this.state.non} onPress={() => this.PressNon()} style={{marginRight:20,borderRadius:10}} /><Text>Anti-inflammatoires non-stéroidiens (AINS)</Text>

                <CheckBox checked={this.state.non} onPress={() => this.PressOui()} style={{marginRight:20,borderRadius:10}} /><Text>Aspirine</Text>

                <CheckBox checked={this.state.non} onPress={() => this.PressNon()} style={{marginRight:20,borderRadius:10}} /><Text>Autres</Text>
                </CardItem>
              </Card>
     </Content> */}


            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>A quels types d'allergies médicamenteuses étes-vous sujet?</Text>

            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: SCREEN_HEIGHT * 0.02 }}>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Antibiotique</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: SCREEN_HEIGHT * 0.02 }}>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Anti-inflammatoires non-stéroidiens (AINS)</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: SCREEN_HEIGHT * 0.02 }}>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Aspirine</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: SCREEN_HEIGHT * 0.02 }}>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Autres</Text>
            </View>


            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: SCREEN_HEIGHT * 0.04 }} />

            <View
              style={styles.edit_button}
              onPress={() => displayDetailForDoctor(doctor.uid)}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <Text style={{ color: 'black', fontWeight: 'bold' }}>Antécédents Médicaux</Text>
                <Icon name="pencil"
                  size={SCREEN_WIDTH * 0.04}
                  color="#93eafe" />
              </View>
            </View>

            <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Etes-vous sujet à une ou plusieurs maladies cardiovasculaires (infarctus, AVC) ?</Text>

            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: SCREEN_HEIGHT * 0.02 }}>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Oui</Text>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Non</Text>
            </View>


            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Avez-vous des Antécédents cardiovasculaires familiaux (infarctus, AVC) ?</Text>

            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: SCREEN_HEIGHT * 0.02 }}>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Oui</Text>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Non</Text>
            </View>


            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Vous sentez-vous stressé(e) ?</Text>

            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: SCREEN_HEIGHT * 0.02 }}>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Oui</Text>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Non</Text>
            </View>


            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Avez-vous le moral ?</Text>

            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: SCREEN_HEIGHT * 0.02 }}>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Oui</Text>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Non</Text>
            </View>


            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Avez-vous accès à un suivi dentaire régulier ?</Text>

            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: SCREEN_HEIGHT * 0.02 }}>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Oui</Text>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Non</Text>
            </View>


            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Etes-vous asthmatique ?</Text>

            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: SCREEN_HEIGHT * 0.02 }}>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Oui</Text>
              <CheckBox center style={{ borderRadius: 10 }} title='check box' checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} />
              <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Non</Text>
            </View>


            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />


            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: SCREEN_HEIGHT * 0.04 }} />

            <View
              style={styles.edit_button}
              onPress={() => displayDetailForDoctor(doctor.uid)}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <Text style={{ color: 'black', fontWeight: 'bold' }}>Informations suplémentaires</Text>
                <Icon name="pencil"
                  size={SCREEN_WIDTH * 0.04}
                  color="#93eafe" />
              </View>
            </View>

            <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Numéro de sécurité sociale</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>00000000</Text>
            </View>

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingLeft: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Mutuelle</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>-</Text>
            </View>

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />



            <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Documents médicaux</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>-</Text>
            </View>

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Remboursements</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>-</Text>
            </View>

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <TouchableHighlight style={styles.uploadButton} onPress={this.getImages}>
            <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Carte Vitale</Text>
             
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'gray' }}> Télécharger un document </Text>
                <Icon name="upload"
                  size={SCREEN_WIDTH * 0.04}
                  color="#BDB7AD" />
              </View>
            
            </View></TouchableHighlight>

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />
            <TouchableHighlight style={styles.uploadButton} onPress={this.getImages}>
            <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Mutuel</Text>
             
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'gray' }}> Télécharger un document </Text>
                <Icon name="upload"
                  size={SCREEN_WIDTH * 0.04}
                  color="#BDB7AD" />
              </View>
            
            </View>
            </TouchableHighlight>
            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

   

          </View>

        </ScrollView>

      </View >

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
    elevation: 9,
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
    //alignItems: 'flex-end',
    //justifyContent: 'center',
    //paddingRight: SCREEN_WIDTH*0.05,
    //backgroundColor: 'green',
    // backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#93eafe',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
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


const modalStyles = StyleSheet.create({
  item_inactive: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.07,
    //borderWidth: 1, 
    //borderColor: 'blue', 
    marginLeft: SCREEN_WIDTH * 0.015,
    marginRight: SCREEN_WIDTH * 0.015,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    //borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 5,
  },
  item_active: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.07,
    borderWidth: 1,
    borderColor: '#93eafe',
    marginLeft: SCREEN_WIDTH * 0.015,
    marginRight: SCREEN_WIDTH * 0.015,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_text: {
    //fontWeight: 'bold',
    fontSize: SCREEN_HEIGHT * 0.016,
    textAlign: 'center'
  },  
})