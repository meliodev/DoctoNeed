//To do: 1. Disponible maintenant doit être affichée si le prochain créneau horaire du médecin est disponible
//          Disponible dans X min/heures doit être affichée si le prochain créneau horaire est indisponible (d'autres créneaux ultérieur son dispo)
//       -> A faire après avoir finit l'interface de config de disponilbités
//       2. Le texte descriptif et les diplomes seront affichées selon les données saisies (et validées par l'admin durant l'inscription)
//       -> Ajouter la saisie des données ci-dessus dans le form d'inscription

import React from 'react'
import { View, Text, Image, Dimensions, ActivityIndicator, StyleSheet, ImageBackground , ScrollView} from 'react-native'

import firebase from 'react-native-firebase'
import Button from '../../components/Button';
import Button2 from '../../components/Button2';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioHeader = 267 / 666; // The actaul icon headet size is 254 * 668
const HEADER_ICON_HEIGHT = Dimensions.get("window").width * ratioHeader; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo;

export default class DoctorFile extends React.Component {

  render() {
    const doctor =  this.props.navigation.getParam('doctor', 'nothing sent')

    return (
      <ScrollView>

      <View style={styles.container}>

        <View style={styles.logo_container}>
          <ImageBackground source={require('../../assets/header-image.png')} style={styles.imagebg}>
            <Image source={require('../../assets/profile.jpg')} style={styles.logoIcon} />
          </ImageBackground>
        </View>

        <View style={styles.header_container}>
          <Text style={styles.header}>{doctor.name}</Text>
          <Text style={{ color: "#606060", fontStyle: "italic", fontWeight: 'bold', fontSize: 18, marginBottom: SCREEN_HEIGHT*0.025  }}>{doctor.speciality}</Text>
          <Text style={{ color: '#47D885', fontSize: 15, fontWeight: 'bold'}}> Disponible maintenant </Text>
        </View>

        <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />

        <View style={styles.data_container}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>À propos</Text>
          <Text style={{ paddingHorizontal: SCREEN_WIDTH*0.08  }}>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups. </Text>

          <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>Diplômes</Text>
          <Text>{'\u2022'} Diplomes Université en l'année 0000. </Text>
          <Text>{'\u2022'} Diplomes Université en l'année 0000. </Text>

          <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>Code Finesse</Text>
          <Text>{'\u2022'} 0000 0000 0000 0000. </Text>
        </View>

        <View style={styles.button_container}>
          <Button text="Prendre un rendez-vous en urgence" style={{ width:"100%" }} /* onPress={ this.handleLogin } */ />
          <Button2 style={{ backgroundColor: "#ffffff", color: "#000000" }} text="Planifier une consultation" onPress={ () =>     this.props.navigation.navigate('DoctorFile') } />
          
          {// This  Button is not yet working ,  when i use onPress navigation to Booking it shows errors}
  }
          <Button text="Configurer la disponibilité "  style={{ width: 10 }}       /*onPress={() => displayDoctorCalendar(doctor.uid)}>/* onPress={ this.handleLogin } */ onPress={ () =>     this.props.navigation.navigate('Booking') } />
          

        </View>

      </View>
      </ScrollView>
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
  imagebg: {
    width: SCREEN_WIDTH,
    height: HEADER_ICON_HEIGHT,
    justifyContent: 'flex-end',
    //backgroundColor: 'blue'
  },
  logo_container: {
    flex: 0.23,
    /*justifyContent: 'center',
    alignItems: 'center',*/
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
    flex: 0.16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    //backgroundColor: 'green',
  },
  header: {
    fontSize: SCREEN_HEIGHT * 0.025,
    fontWeight: 'bold',
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'black',
    //backgroundColor: 'yellow',
    //marginBottom: SCREEN_HEIGHT * 0.01
  },
  data_container: {
    flex: 0.39,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //backgroundColor: 'brown',
  },
  button_container: {
    flex: 0.22,
    justifyContent: 'center',
    alignItems: 'center',
    width:SCREEN_WIDTH,
    paddingHorizontal:0,
    marginHorizontal:0,
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