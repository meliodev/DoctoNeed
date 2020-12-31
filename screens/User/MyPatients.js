
import React from 'react'
//import LinearGradient from 'react-native-linear-gradient';
import { View, Text, Image, TouchableOpacity, TouchableHighlight, Dimensions, StyleSheet, TextInput } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import SearchInput, { createFilter } from 'react-native-search-filter';

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import PatientItem from '../../components/PatientItem'
import LeftSideMenu from '../../components/LeftSideMenu'
import RightSideMenu from '../../components/RightSideMenu6'

import firebase from 'react-native-firebase'
import * as REFS from '../../DB/CollectionsRefs'

import { connect } from 'react-redux'

import { toggleLeftSideMenu, navigateToMedicalFolder, navigateToScreen, signOutUserandToggle } from '../../Navigation/Navigation_Functions'

import { withNavigation } from 'react-navigation';

//nom, pays, date
const KEYS_TO_FILTERS_COUNTRY = ['country'];
const KEYS_TO_FILTERS_URGENCES = ['urgences'];
const KEYS_TO_FILTERS_SPECIALITY = ['speciality'];
const KEYS_TO_FILTERS = ['name', 'speciality'];

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioFooter = 254 / 668; // The actaul icon footer size is 254 * 668
const FOOTER_ICON_HEIGHT = Dimensions.get("window").width * ratioFooter; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.15 * ratioLogo;

class MyPatients extends React.Component {
    constructor(props) {
        super(props);
        this.filteredPatients1 = []
        this.toggleUrgence = this.toggleUrgence.bind(this);
        this.countryPlaceHolder = this.countryPlaceHolder.bind(this);

        this.state = {
            patientList: [],
            searchTerm: '',
            isSideMenuVisible: false,
            isLeftSideMenuVisible: false,
            isLoading: false,
            country: "",

        }
    }

    componentDidMount() {
        this._loadPatients()
    }

    _loadPatients() {
        let patientList = []
        const { currentUser } = firebase.auth()

        let patient

        if (this.props.role === 'isAdmin') {
            REFS.users.get().then(querysnapshot => {
                querysnapshot.forEach((patientDoc) => {
                    patient = patientDoc.data()
                    patient.id = patientDoc.id

                    let birthday = moment(patientDoc.data().dateNaissance, 'DD/MM/YYYY').format('YYYY-MM-DD')
                    let now = moment().format('YYYY-MM-DD')
                    let age = moment(now).diff(moment(birthday), 'years')
                    patient.age = age

                    patientList.push(patient)

                    this.setState({ patientList })
                })
            })
        }

        if (this.props.role === 'isDoctor') {

            REFS.doctors.doc(currentUser.uid).get().then(doc => {
                const patientIds = doc.data().myPatients

                for (const patientId of patientIds) {
                    REFS.users.doc(patientId).get().then((patientDoc) => {
                        patient = patientDoc.data()
                        patient.id = patientId

                        let birthday = moment(patientDoc.data().dateNaissance, 'DD/MM/YYYY').format('YYYY-MM-DD')
                        let now = moment().format('YYYY-MM-DD')
                        let age = moment(now).diff(moment(birthday), 'years')
                        patient.age = age

                        patientList.push(patient)

                        this.setState({ patientList })
                    })
                }

            })
        }

    }

    //Handle sidemenu filters
    toggleSideMenu = () => {
        this.setState({ isSideMenuVisible: !this.state.isSideMenuVisible });
    }

    countryPlaceHolder = () => {
        return this.state.country ? <Text style={styles.pays1}> {this.state.country} </Text> : <Text style={styles.placeHolder}> Choisir un pays </Text>
    }

    toggleUrgence = () => {
        if (this.state.urgences === 'true' || this.state.urgences === '')
            this.setState({ urgences: 'false', isUrgencesSelected: false })
        if (this.state.urgences === 'false' || this.state.urgences === '')
            this.setState({ urgences: 'true', isUrgencesSelected: true })
    }

    clearAllFilters = () => {
        this.setState({
            country: '', urgences: '', speciality: '', price: 50,
            isCountrySelected: false, isUrgencesSelected: false, isSpecialitySelected: false, isPriceSelected: false,
            isSideMenuVisible: false
        })
    }

    //Get data from filters
    onSelectCountry = (childData) => {
        this.setState({ country: childData.name, isCountrySelected: true })
    }

    onSelectSpeciality = (speciality) => {
        if (speciality === "")
            this.setState({ speciality: speciality, isSpecialitySelected: false })
        else
            this.setState({ speciality: speciality, isSpecialitySelected: true })
    }


    //handle patient click
    onPatientClick(patient) {
        this.props.navigation.navigate('MedicalFolder', { patient: patient })
    }

    displayPatientDetails(patient) {
        //console.log(patient)
        this.props.navigation.navigate('MedicalFolder', { patient: patient })
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }

    render() {

        this.filteredPatients1 = this.state.patientList

        if (this.state.country) {
            this.filteredPatients1 = this.filteredPatients1.filter(createFilter(this.state.country, KEYS_TO_FILTERS_COUNTRY))
        }

        this.filteredPatients1 = this.filteredPatients1.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

        return (

            <View style={styles.container}>

                <RightSideMenu
                    isSideMenuVisible={this.state.isSideMenuVisible}
                    toggleSideMenu={this.toggleSideMenu}
                    countryPlaceHolder={this.countryPlaceHolder()}
                    toggleUrgence={this.toggleUrgence}
                    urgences={this.state.urgences}
                    price={this.state.price}
                    clearAllFilters={this.clearAllFilters}
                    onSelectCountry={this.onSelectCountry}
                    onSelectSpeciality={this.onSelectSpeciality}
                    onSelectPriceMax={this.onSelectPriceMax} />

                {/* <View style={styles.header_container}>
                    <View style={[styles.headerColumn, { paddingLeft: 15, alignItems: 'flex-start' }]}>
                        <LeftSideMenu />
                    </View>

                    <View style={[styles.headerColumn, { alignItems: 'center' }]}>
                        <Image source={require('../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
                    </View>

                    <View style={{ flex: 1 }}>
                    </View>
                </View> */}

                <View style={styles.search_container}>

                    <View style={styles.search_button}>
                        <FontAwesome name="search" size={20} color="#afbbbc" style={{ flex: 0.1, paddingRight: 5 }} />
                        <TextInput
                            onChangeText={(term) => { this.searchUpdated(term) }}
                            placeholder="Rechercher un patient"
                            style={{ flex: 0.9 }}
                        />
                    </View>

                    <TouchableOpacity style={styles.filter_button}
                        onPress={this.toggleSideMenu}>
                        <FontAwesome name="filter" size={25} color="#93eafe" />
                    </TouchableOpacity>
                </View>

                <View style={styles.filters_selected_container}>
                    {this.state.isCountrySelected ?
                        <View style={styles.filterItem}>
                            <Text style={styles.filterItem_text}>Pays</Text>
                            <FontAwesome name="close"
                                //size= {20}
                                color="#93eafe"
                                onPress={() => this.setState({ country: '', isCountrySelected: false })} />
                        </View>
                        : null
                    }

                    {this.state.isUrgencesSelected ?
                        <View style={styles.filterItem}>
                            <Text style={styles.filterItem_text}>Urgences</Text>
                            <FontAwesome name="close"
                                size={SCREEN_WIDTH * 0.05}
                                color="#93eafe"
                                onPress={() => this.setState({ urgences: '', isUrgencesSelected: false })} />
                        </View>
                        : null}

                    {this.state.isSpecialitySelected ?
                        <View style={styles.filterItem}>
                            <Text style={styles.filterItem_text}>Specialité</Text>
                            <FontAwesome name="close"
                                size={SCREEN_WIDTH * 0.05}
                                color="#93eafe"
                                onPress={() => this.setState({ speciality: '', isSpecialitySelected: false })} />
                        </View>
                        : null}

                    {this.state.isPriceSelected ?
                        <View style={styles.filterItem}>
                            <Text style={styles.filterItem_text}>Tarifs</Text>
                            <FontAwesome name="close"
                                size={SCREEN_WIDTH * 0.05}
                                color="#93eafe"
                                onPress={() => this.setState({ price: 50, isPriceSelected: false })} />
                        </View>
                        : null}
                </View>

                <ScrollView style={styles.patientList_container}>
                    {this.filteredPatients1.map(patient => {
                        return (
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <PatientItem
                                    patient={patient}
                                    navigateToMedicalFolder={() => navigateToMedicalFolder(this, this.props, patient.id)}
                                    displayPatientDetails={() => this.displayPatientDetails(doctor)} />
                            </View>
                        )
                    })}
                </ScrollView>

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
    }
}

export default connect(mapStateToProps)(MyPatients)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    header_container: {
        flex: 0.25,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    headerColumn: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 15,
    },
    menu_button: {
        width: SCREEN_WIDTH * 0.12,
        height: SCREEN_WIDTH * 0.12,
        borderRadius: 25,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo_container: {
        flex: 0.3,
        justifyContent: 'flex-end',
        alignItems: 'center',
        //backgroundColor: 'blue',
    },
    logoIcon: {
        height: SCREEN_WIDTH * 0.15,
        width: LOGO_WIDTH,
    },
    search_container: {
        flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        //backgroundColor: 'green',
    },
    search_button: {
        textAlignVertical: 'top',
        textAlign: 'center',
        backgroundColor: '#ffff',
        borderRadius: 50,
        //borderWidth: 1, 
        //borderColor: '#93eafe',
        paddingLeft: SCREEN_WIDTH * 0.02,
        paddingRight: SCREEN_WIDTH * 0.02,
        width: SCREEN_WIDTH * 0.75,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 10,
        elevation: 3,
        marginTop: SCREEN_HEIGHT * 0.01,
        marginBottom: SCREEN_HEIGHT * 0.01,
        fontSize: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    placeHolder: {
        color: '#d5d5d5',
        fontSize: SCREEN_HEIGHT * 0.015
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
        elevation: 3,
        marginLeft: SCREEN_WIDTH * 0.03,
        //margin: 15,
        //marginTop: 15,
        //marginBottom: 15,
        fontSize: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    filterItem_text: {
        fontSize: SCREEN_HEIGHT * 0.013
    },
    patientList_container: {
        flex: 1,
        //backgroundColor: 'yellow'
    }

});

