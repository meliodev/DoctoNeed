
import React, { Component, Children } from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Dimensions, SafeAreaView, Slider, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '../constants/theme'
import DatePicker from 'react-native-datepicker'

import firebase from '../configs/firebase'
import * as REFS from '../DB/CollectionsRefs'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";

export default class RightSideMenu5 extends Component {
    constructor(props) {
        super(props);
        this.patientNames = []

        this.state = {
            doctorNames: [],
            doctorSpecialities: [],
            patientNames: [],
            patientsCountries: [],
        }
    }

    componentDidMount() {
        this._loadPatients()
        this._loadDoctors()
    }

    _loadPatients() {
        const patientNames = []
        const patientsCountries = []
        let patientName = ''
        let patientCountry = ''

        var query = REFS.users

        query.get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    patientName = doc.data().nom + ' ' + doc.data().prenom
                    patientCountry = doc.data().country

                    patientNames.push(patientName)
                    patientsCountries.push(patientCountry)

                })

                this.setState({
                    patientNames: patientNames,
                    patientsCountries: patientsCountries
                })

            })
            .catch(error => console.log('Error getting documents:' + error))
    }

    _loadDoctors() {
        const doctorNames = []
        const doctorSpecialities = []
        let doctorName = ''
        let doctorSpeciality = ''

        var query = REFS.doctors

        query.get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {

                    doctorName = doc.data().nom + ' ' + doc.data().prenom
                    doctorSpeciality = doc.data().speciality

                    doctorNames.push(doctorName)

                    if (!doctorSpecialities.includes(doc.data().speciality)) {
                        doctorSpecialities.push(doctorSpeciality)
                    }

                })

                this.setState({
                    doctorNames: doctorNames,
                    doctorSpecialities: doctorSpecialities
                })

            })
            .catch(error => console.log('Error getting documents:' + error))
    }




    render({ onPress } = this.props) {

        const { main, isSideMenuVisible, toggleSideMenu, clearAllFilters, isNextAppointments } = this.props
        const { doctor, doctorNames, patient, country, appointmentState } = this.props
        const { speciality, doctorSpecialities } = this.props
        const { dateFrom, dateTo } = this.props

        return (
            <Modal
                isVisible={isSideMenuVisible}
                coverScreen='true'
                onBackdropPress={toggleSideMenu} // Android back press
                onSwipeComplete={toggleSideMenu} // Swipe to discard
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
                            onPress={toggleSideMenu}>
                            <Icon name="filter" size={25} color="#93eafe" />
                        </TouchableHighlight>
                    </View>

                    <View style={styles.doctor_container}>
                        <Text style={styles.title_text}>Médecin</Text>
                        <View style={styles.picker}>
                            <Picker selectedValue={doctor}

                                onValueChange={(doctor) => main.setState({ doctor })}>
                                <Picker.Item value='' label='Choisissez un médecin' />
                                {this.state.doctorNames.map((doctorName, key) => {
                                    return (<Picker.Item key={key} value={doctorName} label={doctorName} />);
                                })}
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.speciality_container}>
                        <Text style={styles.title_text}>Spécialité</Text>
                        <View style={styles.picker}>
                            <Picker selectedValue={speciality}
                                onValueChange={(speciality) => main.setState({ speciality })}>
                                <Picker.Item value='' label='Choisissez une spécialité' />
                                {this.state.doctorSpecialities.map((doctorSpeciality, key) => {
                                    return (<Picker.Item key={key} value={doctorSpeciality} label={doctorSpeciality} />);
                                })}
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.patient_container}>
                        <Text style={styles.title_text}>Patient</Text>
                        <View style={styles.picker}>
                            <Picker selectedValue={patient}
                                onValueChange={(patient) => main.setState({ patient })}>
                                <Picker.Item value='' label='Choisissez un patient' />
                                {this.state.patientNames.map((patientName, key) => {
                                    return (<Picker.Item key={key} value={patientName} label={patientName} />);
                                })}
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.country_container}>
                        <Text style={styles.title_text}>Pays</Text>
                        <View style={styles.picker}>
                            <Picker selectedValue={country}
                                onValueChange={(country) => main.setState({ country })}>
                                <Picker.Item value='' label='Pays des patients' />
                                {this.state.patientsCountries.map((patientsCountry, key) => {
                                    return (<Picker.Item key={key} value={patientsCountry} label={patientsCountry} />);
                                })}
                            </Picker>

                        </View>
                    </View>


                    {isNextAppointments &&
                        <View style={styles.state_container}>
                            <Text style={styles.title_text}>Etat</Text>
                            <View style={styles.picker}>
                                <Picker selectedValue={appointmentState}
                                    onValueChange={(appointmentState) => main.setState({ appointmentState })}>
                                    <Picker.Item value='' label='Choisissez un état' />
                                    <Picker.Item value='pending' label='En attente' />
                                    <Picker.Item value='CBA' label='Confirmé' />
                                </Picker>
                            </View>
                        </View>
                    }

                    <View style={styles.date_container}>
                        <Text style={styles.title_text}>Date</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: SCREEN_HEIGHT * 0.02 }}>
                            <Text style={[styles.title_text, { color: 'gray' }]}>Du</Text>
                            <DatePicker
                                style={{ width: SCREEN_WIDTH * 0.5, marginTop: SCREEN_WIDTH * 0.03, marginLeft: SCREEN_WIDTH * 0.03 }}
                                date={dateFrom}
                                mode="date"
                                placeholder="Jour - Mois - Année"
                                format="YYYY-MM-DD"
                                //minDate="1920-01-01"
                                //maxDate= {Today}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(dateFrom) => main.setState({ dateFrom })}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={[styles.title_text, { color: 'gray' }]}>Au</Text>
                            <DatePicker
                                style={{ width: SCREEN_WIDTH * 0.5, marginTop: SCREEN_WIDTH * 0.03, marginLeft: SCREEN_WIDTH * 0.03 }}
                                date={dateTo}
                                mode="date"
                                placeholder="Jour - Mois - Année"
                                format="YYYY-MM-DD"
                                //minDate="1920-01-01"
                                //maxDate={Today}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(dateTo) => main.setState({ dateTo })}
                            />
                        </View>

                    </View>

                    <View style={styles.buttons_container}>
                        <TouchableHighlight onPress={clearAllFilters} style={styles.CancelButton}>
                            <Text style={styles.buttonText1}>Réinitialiser</Text>
                        </TouchableHighlight>

                        <TouchableHighlight
                            onPress={toggleSideMenu}>
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
    picker: {
        borderRadius: 30,
        borderWidth: 0,
        borderColor: '#bdc3c7',
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        backgroundColor: 'white',
        marginHorizontal: SCREEN_WIDTH * 0.01,
        //marginTop: 10,
        paddingVertical: 0,
        width: SCREEN_WIDTH * 0.55
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
        flex: 0.75,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: SCREEN_WIDTH * 0.13,
        paddingRight: SCREEN_WIDTH * 0.03,
        alignItems: 'center',
        //backgroundColor: 'green'
    },
    //Filtrer par
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
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },

    //Filters labels
    title_text: {
        // marginTop: SCREEN_HEIGHT * 0.06,
        fontSize: theme.FONT_SIZE_SMALL * 1.2,
    },
    //Filter pickers containers
    doctor_container: {
        flex: 1.25,
        // justifyContent: 'flex-start',
        //alignItems: 'center',
        paddingLeft: SCREEN_WIDTH * 0.1,
        //backgroundColor: 'brown'
    },
    speciality_container: {
        flex: 1.25,
        paddingLeft: SCREEN_WIDTH * 0.1,
        //backgroundColor: 'blue'
    },
    patient_container: {
        flex: 1.25,
        paddingLeft: SCREEN_WIDTH * 0.1,
        //backgroundColor: 'orange'
    },
    country_container: {
        flex: 1.25,
        paddingLeft: SCREEN_WIDTH * 0.1,
        //backgroundColor: 'yellow'
    },
    state_container: {
        flex: 1.25,
        paddingLeft: SCREEN_WIDTH * 0.1,
        //backgroundColor: 'pink'
    },
    date_container: {
        flex: 2.25,
        paddingLeft: SCREEN_WIDTH * 0.1,
        //backgroundColor: 'purple'
    },
    buttons_container: {
        flex: 0.75,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'green'
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
        elevation: 3,
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
        elevation: 3,
    },
    //Annuler
    buttonText1: {
        fontSize: SCREEN_HEIGHT * 0.016,
        fontFamily: 'Avenir',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: SCREEN_HEIGHT * 0.012,
        color: 'black',
        backgroundColor: 'transparent',
    },
    //Appliquer
    buttonText2: {
        fontSize: SCREEN_HEIGHT * 0.017,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        textAlign: 'center',
        margin: SCREEN_HEIGHT * 0.012,
        color: '#ffffff',
        backgroundColor: 'transparent',
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
        elevation: 3,
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
        elevation: 3,
        //margin: 15,
        marginTop: SCREEN_WIDTH * 0.03,
        //marginBottom: 15,
        fontSize: 11,
        color: '#93eafe',
        //justifyContent: 'center',
        // alignItems: 'center'
    },
});