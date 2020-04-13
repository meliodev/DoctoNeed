//Presentation.js
//TEST

import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, Button, Text, Image, TouchableOpacity, Dimensions, Slider, StyleSheet } from 'react-native'
import Modal from 'react-native-modal';

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

export default class MedicalFolder extends React.Component {
  constructor(props) {
    super(props);
    this.openModalSex = this.openModalSex.bind(this);

    this.state = {
      currentUser: null,
      nom: "",
      prenom: "",
      dateNaissance: "00-00-0000",
      age: "",

      ismodalSexVisible: false,
      sexe: '',
      ismodalPoidsVisible: false,
      poids: 0,
      ismodalTailleVisible: false,
      taille: 0,
      ismodalGSVisible: false,
      GS: ''
    }
  }

  componentWillMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    firebase.firestore().collection("users").doc(currentUser.uid).get().then(doc => {
      this.setState({ nom: doc.data().nom })
      this.setState({ prenom: doc.data().prenom })
      this.setState({ dateNaissance: doc.data().dateNaissance })
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
  //Modal
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

  render() {
    // const currentUser= firebase.auth().currentUser.
    console.log(this.state.sexe)

    console.log(this.state.nom)
    console.log(this.state.prenom)
    console.log(this.state.dateNaissance)
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
            <Text style={styles.metadata_text2}>{this.state.dateNaissance} (x ans)</Text>
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
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>F/H</Text>
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
                  {this.state.sexe === 'female' || this.state.sexe === '' ? <TouchableOpacity onPress={() => {
                    if (this.state.sexe === 'female' || this.state.sexe === '') this.setState({ sexe: 'male' })
                  }}
                    style={modalStyles.item_inactive}><Text style={modalStyles.item_text}>Homme</Text></TouchableOpacity>
                    : <View style={modalStyles.item_active}><Text style={modalStyles.item_text}>Homme</Text></View>}

                  {this.state.sexe === 'male' || this.state.sexe === '' ? <TouchableOpacity onPress={() => {
                    if (this.state.sexe === 'male' || this.state.sexe === '') this.setState({ sexe: 'female' })
                  }}
                    style={modalStyles.item_inactive}><Text style={modalStyles.item_text}>Femme</Text></TouchableOpacity>
                    : <View style={modalStyles.item_active}><Text style={modalStyles.item_text}>Femme</Text></View>}
                </View>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', position: 'absolute', bottom: 0 }}>
                <View style={{ flexDirection: 'row', }}>
                  <TouchableOpacity style={{ backgroundColor: '#93eafe', width: '50%' }}>
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
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>68 kgs</Text>
            </TouchableOpacity>

            <Modal isVisible={this.state.ismodalPoidsVisible}
              onBackdropPress={() => this.closeModalPoids()}
              animationIn="slideInLeft"
              animationOut="slideOutLeft"
              style={{ flex: 1, backgroundColor: 'white', maxHeight: SCREEN_HEIGHT / 2, marginTop: SCREEN_HEIGHT * 0.25, alignItems: 'center', }}>

              <View style={{ flex: 1, paddingTop: SCREEN_HEIGHT*0.1 }}>
                  <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 28, marginBottom: SCREEN_HEIGHT*0.04  }}>Votre Poids</Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 40, textAlign: 'center', marginBottom: SCREEN_HEIGHT*0.07 }}>{this.state.poids} Kg</Text>
                  <Slider
                    value={this.state.poids}
                    onValueChange={value => this.setState({ poids: value })}
                    minimumValue={0}
                    maximumValue={200}
                    step={1}
                    minimumTrackTintColor='#93eafe'
                    thumbTintColor='#93eafe'
                    style={{ width: SCREEN_WIDTH * 0.7 }}
                  />               
              </View>
 
              <View style={{ justifyContent: 'center', position: 'absolute', bottom: 0 }}>
                <View style={{ flexDirection: 'row', }}>
                  <TouchableOpacity style={{ backgroundColor: '#93eafe', width: '50%' }}>
                    <Text style={{ color: 'white', textAlign: 'center', padding: 10 }}>Confirmer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ borderColor: 'light gray', borderWidth: 0.45, width: '50%' }} onPress={() => this.closeModalPoids()}>
                    <Text style={{ color: 'black', textAlign: 'center', padding: 10 }}>Annuler</Text>
                  </TouchableOpacity>
                </View>
              </View>
             

            </Modal>

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingLeft: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Taille</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>175 cm</Text>
            </View>

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingLeft: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Groupe sanguin</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>O+</Text>
            </View>

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

            <View style={{ paddingLeft: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Numéro de sécurité sociale</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>00000000</Text>
            </View>

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingLeft: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Mutuelle</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>-</Text>
            </View>

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingLeft: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Allergies</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>Fraises</Text>
            </View>

            <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

            <View style={{ paddingLeft: SCREEN_WIDTH * 0.04, paddingTop: SCREEN_WIDTH * 0.025 }}>
              <Text style={styles.title_text}>Documents médicaux</Text>
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: SCREEN_HEIGHT * 0.008 }}>-</Text>
            </View>

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