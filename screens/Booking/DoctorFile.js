
import React from 'react'
import { View, Text, Image, Dimensions, ActivityIndicator, StyleSheet, ImageBackground, ScrollView } from 'react-native'
import Button from '../../components/Button';

import firebase from 'react-native-firebase'
import * as REFS from '../../DB/CollectionsRefs'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioHeader = 267 / 666;
const HEADER_ICON_HEIGHT = Dimensions.get("window").width * ratioHeader;
const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo;

export default class DoctorFile extends React.Component {
  constructor(props) {
    super(props);
    this.isUrgence = this.props.navigation.getParam('isUrgence', 'nothing sent')
    this.doctor = this.props.navigation.getParam('doctor', 'nothing sent')

    this.state = {
      isLoading: false,
      bio: '',
      diplomes: [],
      codeFinesse: ''
    }
  }

  componentDidMount() {
    //Retrieve bio, diplomes & code finesse
    this.setState({ isLoading: true })
    REFS.doctors.doc(this.doctor.uid).get().then((doc) => {
      this.setState({ bio: doc.data().bio, diplomes: doc.data().diplomes, codeFinesse: doc.data().codeFinesse })
    }).then(() => this.setState({ isLoading: false }))
  }

  render() {

    return (
      <View style={styles.container}>

        <View style={styles.logo_container}>
          <ImageBackground source={require('../../assets/header-image.png')} style={styles.imagebg}>
            <Image source={require('../../assets/profile.jpg')} style={styles.logoIcon} />
          </ImageBackground>
        </View>

        <View style={styles.header_container}>
          <Text style={styles.header}>{this.doctor.name}</Text>
          <Text style={{ color: "#606060", fontStyle: "italic", fontWeight: 'bold', fontSize: 18, marginBottom: SCREEN_HEIGHT * 0.025 }}>{this.doctor.speciality}</Text>
          <Text style={{ color: '#47D885', fontSize: 15, fontWeight: 'bold' }}>Disponible maintenant</Text>
        </View>

        {this.state.isLoading === true ?
          <View style={[styles.data_container, {justifyContent: 'center'}]}>
            <ActivityIndicator size='large' />
          </View>
          :
          <View style={styles.data_container}>
            <ScrollView contentContainerStyle={styles.test}>
              <View style={{ marginBottom: SCREEN_HEIGHT * 0.03, alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333', marginBottom: SCREEN_HEIGHT * 0.02 }}>À propos</Text>
                <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.08 }}>{this.state.bio}</Text>
              </View>

              <View style={{ marginBottom: SCREEN_HEIGHT * 0.03, alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333', marginBottom: SCREEN_HEIGHT * 0.02 }}>Diplômes</Text>
                {this.state.diplomes.map(diplome => {
                  return (<Text>{'\u2022'} {diplome} </Text>)
                })}
              </View>

              <View style={{ marginBottom: SCREEN_HEIGHT * 0.03, alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333', marginBottom: SCREEN_HEIGHT * 0.02 }}>Code Finesse</Text>
                <Text>{this.state.codeFinesse}</Text>
              </View>
            </ScrollView>

          </View>
        }

        <View style={styles.button_container}>
          {this.doctor.urgences === true && this.isUrgence === true ?
            <Button text="Prendre un rendez-vous en urgence" style={{ width: "100%" }} onPress={() => this.props.navigation.navigate('Booking', { doctorId: this.doctor.uid })} />
            :
            <Button text="Planifier une consultation" style={{ width: "100%" }} onPress={() => this.props.navigation.navigate('Booking', { doctorId: this.doctor.uid })} />
          }
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imagebg: {
    width: SCREEN_WIDTH,
    height: HEADER_ICON_HEIGHT,
    justifyContent: 'flex-end',
    //backgroundColor: 'blue'
  },
  logo_container: {
    flex: 0.25,
    //backgroundColor: 'red',
  },
  logoIcon: {
    height: SCREEN_WIDTH * 0.33,
    width: LOGO_WIDTH,
    marginTop: SCREEN_WIDTH * 0.0,
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
    // backgroundColor: 'green',
  },
  header: {
    fontSize: SCREEN_HEIGHT * 0.025,
    fontWeight: 'bold',
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'black',
    //backgroundColor: 'yellow',
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