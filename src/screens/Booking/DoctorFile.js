
import React from 'react'
import { View, Text, Image, Dimensions, ActivityIndicator, StyleSheet, ImageBackground, ScrollView } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Button from '../../components/Button';

import firebase from '../../configs/firebase'
import * as REFS from '../../DB/CollectionsRefs'
import { connect } from 'react-redux'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioHeader = 267 / 666;
const HEADER_ICON_HEIGHT = Dimensions.get("window").width * ratioHeader;
const ratioLogo = 1;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo;

class DoctorFile extends React.Component {
  constructor(props) {
    super(props);
    this.isUrgence = this.props.navigation.getParam('isUrgence', false)
    this.doctor = this.props.navigation.getParam('doctor', null)
    this.doctorStatus = this.props.navigation.getParam('doctorStatus', null)

    this.doctor_id_param = this.props.navigation.getParam('doctor_id', '')  //received from admin or doctor navigation params
    this.doctor_id = ''

    this.state = {
      isLoading: false,
      bio: '',
      diplomes: [],
      codeFinesse: ''
    }
  }

  componentDidMount() {
    //Fetch doctor data
    this.setState({ isLoading: true })
    this.fetchDoctordata()
  }

  fetchDoctordata() {
    REFS.doctors.doc(this.doctor.id).get().then((doc) => {
      this.setState({ bio: doc.data().bio, diplomes: doc.data().diplomes, codeFinesse: doc.data().codeFinesse, avatarURL: doc.data().Avatar })
    })
      .finally(() => this.setState({ isLoading: false }))
  }

  renderButton() {
    if (this.props.role === 'isPatient') {
      if (this.doctor.urgences && this.isUrgence)
        return (
          <Button text="Prendre un rendez-vous en urgence" style={{ width: "100%" }} onPress={() => this.props.navigation.navigate('Booking', { doctorId: this.doctor.id, isUrgence: this.isUrgence })} />
        )
      else
        return (
          <Button text="Planifier une consultation" style={{ width: "100%" }} onPress={() => this.props.navigation.navigate('Booking', { doctorId: this.doctor.id, isUrgence: this.isUrgence })} />
        )
    }

    else if (this.props.role === 'isAdmin') {
      return (
        <View>
          <Button text="Consulter le profil du médecin" style={{ width: "100%" }} onPress={() => this.props.navigation.navigate('Profile', { doctor_id: this.doctor.id })} />
          <Button text="Voir l'historique des paiements" style={{ width: "100%" }} onPress={() => this.props.navigation.navigate('PaymentSummary', { doctor_id: this.doctor.id, doctor: `${this.doctor.prenom} ${this.doctor.nom}` })} />
        </View>
      )
    }

    else
      return (
        <View>
          <Button text="Planifier une consultation" style={{ width: "100%" }} onPress={() => this.props.navigation.navigate('Booking', { doctorId: this.doctor.id, isUrgence: this.isUrgence })} />
        </View>
      )

  }

  render() {

    return (
      <View style={styles.container}>

        <View style={styles.logo_container}>
          <ImageBackground source={require('../../assets/header-image.png')} style={styles.imagebg}>
            <View style={styles.Avatar_box}>
              {this.state.avatarURL !== '' ?
                <Image style={{ width: 90, height: 90, borderRadius: 45 }} source={{ uri: this.state.avatarURL }} />
                :
                <FontAwesome name="user" size={24} color="#93eafe" />
              }
            </View>
          </ImageBackground>
        </View>

        <View style={styles.header_container}>
          <Text style={styles.nameText}>{this.doctor.prenom} {this.doctor.nom}</Text>
          <Text style={styles.specialityText}>{this.doctor.speciality}</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: this.doctorStatus === 'Disponible' ? 'green' : 'gray' }}>{this.doctorStatus}</Text>
        </View>

        {this.state.isLoading ?
          <View style={[styles.data_container, { justifyContent: 'center' }]}>
            <ActivityIndicator size='large' />
          </View>
          :
          <View style={styles.data_container}>
            <ScrollView contentContainerStyle={styles.test}>
              <View style={{ marginBottom: SCREEN_HEIGHT * 0.04, alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333', marginBottom: SCREEN_HEIGHT * 0.02 }}>À propos</Text>
                <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.08 }}>{this.state.bio}</Text>
              </View>

              {this.state.diplomes.length > 0 &&
                <View style={{ marginBottom: SCREEN_HEIGHT * 0.04, alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333', marginBottom: SCREEN_HEIGHT * 0.02 }}>Diplômes</Text>
                  {this.state.diplomes.map(diplome => {
                    return (<Text>{'\u2022'} {diplome.titre} </Text>)
                  })}
                </View>
              }

              <View style={{ marginBottom: SCREEN_HEIGHT * 0.04, alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333', marginBottom: SCREEN_HEIGHT * 0.02 }}>Code Finesse</Text>
                <Text>{this.state.codeFinesse}</Text>
              </View>
            </ScrollView>

          </View>
        }

        <View style={styles.button_container}>
          {this.renderButton()}
        </View>

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    role: state.roles.role,
  }
}

export default connect(mapStateToProps)(DoctorFile)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imagebg: {
    width: SCREEN_WIDTH,
    height: HEADER_ICON_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
    //backgroundColor: 'blue'
  },
  logo_container: {
    flex: 0.25,
    //backgroundColor: 'red',
  },
  logoIcon: {
    height: SCREEN_WIDTH * 0.33,
    width: LOGO_WIDTH,
    marginHorizontal: 130,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: 'center',
    borderColor: '#ffffff',
    borderWidth: 7,
    borderStyle: "solid"
  },
  header_container: {
    flex: 0.17,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: SCREEN_HEIGHT * 0.025,
    //backgroundColor: 'green',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'black',
    marginBottom: 5
    //backgroundColor: 'yellow',
  },
  specialityText: {
    color: "#606060",
    fontStyle: "italic",
    //fontWeight: 'bold',
    fontSize: 15,
    marginBottom: SCREEN_HEIGHT * 0.025
  },
  Avatar_box: {
    width: 95,
    height: 95,
    margin: 5,
    borderRadius: 47.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    shadowColor: '#93eafe',
    backgroundColor: '#fff'
  },
  avatar_container: {
    flex: 0.3,
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: 'pink'
  },
  data_container: {
    flex: 0.4,
    //backgroundColor: 'brown',
  },
  test: {
    borderBottomColor: '#d9dbda',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#d9dbda',
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: SCREEN_WIDTH * 0.05,
    //backgroundColor: 'green'
  },
  button_container: {
    flex: 0.18,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    //backgroundColor: 'yellow',
    paddingBottom: SCREEN_HEIGHT * 0.01,
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