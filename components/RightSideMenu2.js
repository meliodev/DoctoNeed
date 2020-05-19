/**
 * Button component
 * Renders a button and calls a function passed via onPress prop once tapped
 */

import React, { Component, Children } from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Dimensions, SafeAreaView, Slider, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CountryPicker, { getAllCountries, getCallingCode } from 'react-native-country-picker-modal';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker'

import firebase from 'react-native-firebase'
import * as REFS from '../DB/CollectionsRefs'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";

export default class RightSideMenu2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            doctorNames: [],
            doctorSpecialities: []
        }
    } 

    async  componentDidMount() {
        console.log('componentdidMount')
        await REFS.users.doc(firebase.auth().currentUser.uid).get().then(function (docUser) {
            let doctorsId = docUser.data().myDoctors
            //let doctorNames = []

            for (let i = 0; i < doctorsId.length; i++) {
                REFS.doctors.doc(doctorsId[i]).get().then(function (doc) {
                    //  this.doctorNames.push(doc.data().nom)

                    this.setState({
                        ...this.state,
                        doctorNames: this.state.doctorNames.concat(doc.data().nom + ' ' + doc.data().prenom)
                    });
                    this.setState({
                        ...this.state,
                        doctorSpecialities: this.state.doctorSpecialities.concat(doc.data().speciality)
                    });

                    // this.setState({ doctorNames: this.doctorNames}) 
                }.bind(this))

            }
        }.bind(this))

    }

    render({ onPress } = this.props) {
        let TodayDay = new Date().getDate()
        let TodayMonth = new Date().getMonth() + 1
        let TodayYear = new Date().getFullYear()
        let Today = TodayYear + '-' + TodayMonth + '-' + TodayDay


        console.log(this.state.doctorNames)

        //  console.log(this.state.doctorNames)

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
                        <Text style={styles.header_text}>Filter par</Text>
                        <TouchableHighlight style={styles.filter_button}
                            onPress={this.props.toggleSideMenu}>
                            <Icon name="filter" size={25} color="#93eafe" />
                        </TouchableHighlight>
                    </View>

                    <View style={styles.doctor_container}>
                        <Text style={styles.title_text}>Médecin</Text>
                        <View style={{ borderRadius: 30,
                                borderWidth: 0,
                                borderColor: '#bdc3c7',
                                overflow: 'hidden',
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 0.32,
                                shadowRadius: 5.46,
                                elevation: 9,
                                backgroundColor: 'white', 
                                marginHorizontal: SCREEN_WIDTH * 0.02,
                                 marginTop: 10,
                                 paddingVertical: 0,
                                  width: SCREEN_WIDTH * 0.55}}>
                        <Picker selectedValue={this.props.doctor}
                                onValueChange={(doctor) => this.props.onSelectDoctor(doctor)}>
                            <Picker.Item value='' label='Choisissez votre médecin' />
                            {this.state.doctorNames.map((doctorName, key) => {
                                return (<Picker.Item key={key} value={doctorName} label={doctorName} />);
                            })}
                        </Picker>
</View>
                    </View>

                    <View style={styles.speciality_container}>
                        <Text style={styles.title_text}>Spécialité</Text>
                        <View style={{ borderRadius: 30,
                                borderWidth: 0,
                                borderColor: '#bdc3c7',
                                overflow: 'hidden',
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 0.32,
                                shadowRadius: 5.46,
                                elevation: 9,
                                backgroundColor: 'white', 
                                marginHorizontal: SCREEN_WIDTH * 0.02,
                                 marginTop: 10,
                                 paddingVertical: 0,
                                  width: SCREEN_WIDTH * 0.55}}>
                        <Picker selectedValue={this.props.speciality}
                                onValueChange={(speciality) => this.props.onSelectSpeciality(speciality)}>
                            <Picker.Item value='' label='Choisissez une spécialité' />
                            {this.state.doctorSpecialities.map((doctorSpeciality, key) => {
                                return (<Picker.Item key={key} value={doctorSpeciality} label={doctorSpeciality} />);
                            })}
                        </Picker>
                        </View>
                    </View>

                    <View style={styles.date_container}>
                        <Text style={styles.title_text}>Date</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: SCREEN_HEIGHT * 0.02 }}>
                            <Text style={[styles.title_text, { color: 'gray' }]}>Du</Text>
                            <DatePicker
                                style={{ width: SCREEN_WIDTH * 0.5, marginTop: SCREEN_WIDTH * 0.03, marginLeft: SCREEN_WIDTH * 0.03 }}
                                date={this.props.dateFrom}
                                mode="date"
                                placeholder="Jour - Mois - Année"
                                format="YYYY-MM-DD"
                                //minDate="1920-01-01"
                                //maxDate= {Today}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(date) => this.props.onSelectDateFrom(date)}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={[styles.title_text, { color: 'gray' }]}>Au</Text>
                            <DatePicker
                                style={{ width: SCREEN_WIDTH * 0.5, marginTop: SCREEN_WIDTH * 0.03, marginLeft: SCREEN_WIDTH * 0.03 }}
                                date={this.props.dateTo}
                                mode="date"
                                placeholder="Jour - Mois - Année"
                                format="YYYY-MM-DD"
                                //minDate="1920-01-01"
                                //maxDate={Today}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(date) => this.props.onSelectDateTo(date)}
                            />
                        </View>

                    </View>

                    <View style={styles.buttons_container}>
                        <TouchableHighlight onPress={this.props.toggleSideMenu} style={styles.CancelButton}>
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
    pageLink_button: {
        height: SCREEN_HEIGHT * 0.045,
        width: SCREEN_WIDTH * 0.7,
        //alignItems: 'flex-end',
        //justifyContent: 'center',
        //paddingRight: SCREEN_WIDTH*0.05,
        //backgroundColor: 'green',
        // backgroundColor: 'white',
        backgroundColor: '#ffffff',
        //backgroundColor: '#93eafe',
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: SCREEN_WIDTH * 0.08
    },
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
        flex: 0.15,
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
    doctor_container: {
        flex: 0.2,
        paddingLeft: SCREEN_WIDTH * 0.1,
        //backgroundColor: 'blue'
    },
    title_text: {
        marginTop: SCREEN_HEIGHT * 0.02,
        fontSize: 17,
        //fontWeight: "bold"
    },

    speciality_container: {
        flex: 0.2,
        paddingLeft: SCREEN_WIDTH * 0.1,
        //backgroundColor: 'brown'
    },
    date_container: {
        flex: 0.25,
        paddingLeft: SCREEN_WIDTH * 0.1,
        // backgroundColor: 'purple'
    },
    slider: {
        marginTop: SCREEN_HEIGHT * 0.07,
        //marginRight: SCREEN_HEIGHT*0.07
    },
    buttons_container: {
        flex: 0.2,
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
        marginTop: SCREEN_WIDTH * 0.03,
        fontSize: 16,
    },
    inputAndroid: {
        textAlignVertical: 'top',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 50,
        paddingTop: SCREEN_WIDTH * 0.05,
        paddingRight: SCREEN_WIDTH * 0.07,
        width: SCREEN_WIDTH * 0.5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        //margin: 15,
        marginTop: SCREEN_WIDTH * 0.03,
        //marginBottom: 15,
        fontSize: 11,
        color: '#93eafe',
        //justifyContent: 'center',
        // alignItems: 'center'
    },
});