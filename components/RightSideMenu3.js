/**
 * Button component
 * Renders a button and calls a function passed via onPress prop once tapped
 */

import React, { Component, Children } from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Dimensions, SafeAreaView, Slider } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CountryPicker, { getAllCountries, getCallingCode } from 'react-native-country-picker-modal';
import RNPickerSelect from 'react-native-picker-select';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";

export default class RightSideMenu extends Component {

    render({ onPress } = this.props) {

        return (
            <Modal
                isVisible={this.props.isSideMenuVisible}
                coverScreen='true'
                onBackdropPress={this.props.toggleSideMenu} // Android back press
                onSwipeComplete={this.props.toggleSideMenu} // Swipe to discard
                animationIn="slideInRight" // Has others, we want slide in from the left
                animationOut="slideOutRight" // When discarding the drawer
                swipeDirection="right" // Discard the drawer with swipe to left
                useNativeDriver // Faster animation 
                hideModalContentWhileAnimating // Better performance, try with/without
                propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
                style={styles.sideMenuStyle} // Needs to contain the width, 75% of screen width in our case
            >
                <SafeAreaView style={styles.safeAreaView}>
                    <View style={styles.header_container}>
                        <Text style={styles.header_text}>Filtrer par</Text>
                        <TouchableHighlight style={styles.filter_button}
                            onPress={this.toggleSideMenu}>
                            <Icon name="filter" size={25} color="#93eafe" />
                        </TouchableHighlight>
                    </View>

                    <View style={styles.patient_container}>
                        <Text style={styles.title_text}>Médecin</Text>
                        <RNPickerSelect
                            onValueChange={(patient) => this.props.onSelectPatient(patient)}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                            items={[
                                { label: 'Tony Chopper', value: 'Tony Chopper' },
                                { label: 'qwer ty', value: 'qwer ty' },
                                { label: 'poi lu', value: 'poi lu' },
                                { label: 'misu kage', value: 'misu kage' },
                                { label: 'naru to', value: 'naru to' },
                                { label: 'kiyuu bi', value: 'kiyuu bi' },
                                { label: 'kiri to', value: 'kiri to' }
                            ]}
                            placeholder={{
                                label: 'Choisissez votre médecin',
                                value: null
                            }}
                        />
                    </View>

                    <View style={styles.pays_container}>
                        <Text style={styles.title_text}>Pays</Text>
                        <CountryPicker
                            withFilter
                            withEmoji
                            withCountryNameButton
                            withAlphaFilter
                            translation="fra"
                            placeholder={this.props.countryPlaceHolder}  
                            containerButtonStyle= {{width: SCREEN_WIDTH *0.6, height: SCREEN_HEIGHT*0.065, borderRadius: 50, marginTop: SCREEN_HEIGHT*0.02 }} 
                            onSelect={country => this.props.onSelectCountry(country)}   
                        />
                    </View>

                    <View style={styles.buttons_container}>
                        <TouchableHighlight onPress={this.props.clearAllFilters} style={styles.CancelButton}>
                            <Text style={styles.buttonText1}>Annuler</Text>
                        </TouchableHighlight>

                        <TouchableHighlight
                            onPress={this.props.toggleSideMenu}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
                                style={styles.linearGradient}>
                                <Text style={styles.buttonText2}>Appliquer</Text>
                            </LinearGradient>
                        </TouchableHighlight>
                    </View>


                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
   
    sideMenuStyle: {
        flex: 1,
        margin: 0,
        marginLeft: SCREEN_WIDTH * 0.25,
        width: SCREEN_WIDTH * 0.75, // SideMenu width
        height: SCREEN_HEIGHT,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderLeftColor: '#93eafe',
        borderLeftWidth: 15,
        //backgroundColor: 'green'
    },
    safeAreaView: {
        flex: 1,
        height: SCREEN_HEIGHT,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        backgroundColor: "white"
    },
    header_container: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: SCREEN_WIDTH * 0.13,
        paddingRight: SCREEN_WIDTH * 0.03,
        alignItems: 'center',
        //backgroundColor: 'green'
    },
    header_text: {
        color: '#7c807f',
        fontWeight: 'bold',
        fontSize: 17,
        textDecorationLine: "underline",
    },
    filter_button: {
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
        alignItems: 'center'
    },
    patient_container: {
        flex: 0.2,
        paddingLeft: SCREEN_WIDTH * 0.1,
        //backgroundColor: 'blue'
    },
    pays_container: {
        flex: 0.15,
        paddingLeft: SCREEN_WIDTH * 0.1,
        //backgroundColor: 'blue'
    },
    title_text: {
        marginTop: SCREEN_HEIGHT * 0.02,
        fontSize: 17,
        //fontWeight: "bold"
    },
    buttons_container: {
        flex: 0.25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'orange'
    },
    CancelButton: {
        textAlignVertical: 'top',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 30,
        paddingBottom: SCREEN_HEIGHT * 0.005,
        paddingTop: SCREEN_HEIGHT * 0.005,
        marginRight: SCREEN_WIDTH * 0.05,
        width: SCREEN_WIDTH * 0.25,
        height: SCREEN_HEIGHT * 0.06,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 5,
        fontSize: 16,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    linearGradient: {
        paddingTop: SCREEN_HEIGHT * 0.005,
        paddingBottom: SCREEN_HEIGHT * 0.005,
        borderRadius: 30,
        width: SCREEN_WIDTH * 0.25,
        height: SCREEN_HEIGHT * 0.06,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 5,
    },
    buttonText1: {
        fontSize: SCREEN_HEIGHT * 0.016,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: SCREEN_HEIGHT * 0.012,
        color: 'black',
        backgroundColor: 'transparent',
    },
    buttonText2: {
        fontSize: SCREEN_HEIGHT * 0.017,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        textAlign: 'center',
        margin: SCREEN_HEIGHT * 0.012,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
    searchText: {
        color: '#b2bbbc',
        fontSize: SCREEN_WIDTH * 0.025,
        marginLeft: SCREEN_WIDTH * 0.03
    },
    filters_selected_container: {
        flex: 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'space-between',
        //backgroundColor: 'brown'
    },
    filterItem: {
        width: SCREEN_WIDTH * 0.21,
        textAlignVertical: 'top',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 50,
        padding: SCREEN_WIDTH * 0.03,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 5,
        marginLeft: SCREEN_WIDTH * 0.03,
        //margin: 15,
        //marginTop: 15,
        //marginBottom: 15,
        fontSize: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        textAlignVertical: 'top',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 50,
        padding: SCREEN_WIDTH * 0.03,
        width: SCREEN_WIDTH * 0.5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        //margin: 15,
        marginTop: 15,
        marginBottom: 15,
        fontSize: 11,
    },
    inputAndroid: {
        textAlignVertical: 'top',
        paddingLeft: SCREEN_WIDTH*0.06,
        textAlign: 'left',
        backgroundColor: '#ffffff',
        borderRadius: 50,
        paddingTop: SCREEN_WIDTH * 0.05,
        paddingRight: SCREEN_WIDTH * 0.07,
        width: SCREEN_WIDTH *0.6, height: SCREEN_HEIGHT*0.065,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        //margin: 15,
        marginTop: SCREEN_WIDTH * 0.03,
        //marginBottom: 15,
        fontSize: 11,
        color: '#333',
        //justifyContent: 'center',
        // alignItems: 'center'
    },
});








//100: change users to admins
//121: remove line
/*
137:       add    let userName = doc.data().userName
147: add   userName: userName,

  handleConfirmAppointment(appId) {
    this.setState({ appId: null })

    //Add state of the appointment: Confirmed By Admin
    const state = ['CBP', 'CBA']
    REFS.appointments.doc(appId).update("state", state)
      .then(() => {

        REFS.appointments.doc(appId).get().then((appDoc) => {

          REFS.users.doc(appDoc.data().user_id).get().then((userdoc) => {
            let myDoctors = []

            //Check if there is at Least one doctor assigned to to patient
            if (userdoc.data().myDoctors) {
              myDoctors = userdoc.data().myDoctors
            }

            //Check if the doctor exists: Add him if not..
            if (!myDoctors.includes(appDoc.data().doctor_id)) {
              myDoctors.push(appDoc.data().doctor_id)
              REFS.users.doc(appDoc.data().user_id).update("myDoctors", myDoctors)
            }

          }).catch((err) => console.error('1'+err))

        }).catch((err) => console.error('2'+err))

      }).catch((err) => console.error('3'+err))
  }

  displayDetails = (appId) => {
    this.props.navigation.navigate('AppointmentDetails', { appId: appId })
    //console.log(appId)
  }





  
                    {this.state.appId === appointment.id && !appointment.state.includes('CBA') ?
                      <View style={itemStyle.confirmButton_container}>
                        <Button
                          width={SCREEN_WIDTH * 0.35}
                          paddingTop={0}
                          paddingBottom={0}
                          text="Confirmer"
                          onPress={() => this.handleConfirmAppointment(appointment.id)} />
                      </View>
                      : null}

*/