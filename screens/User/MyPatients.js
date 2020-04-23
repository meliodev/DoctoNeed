
import React from 'react'
//import LinearGradient from 'react-native-linear-gradient';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import SearchInput, { createFilter } from 'react-native-search-filter';

import PatientItem from '../../components/PatientItem'
import RightSideMenu from '../../components/RightSideMenu3'

import firebase from 'react-native-firebase'
import * as REFS from '../../DB/CollectionsRefs'

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
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

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
            isLoading: false,
            country: "",
            // urgences: "",
            //speciality: "",
            //price: 50,
            //isCountrySelected: false,
            //isUrgencesSelected: false,
            //isSpecialitySelected: false,
            //isPriceSelected: false,
        }
    }

    componentDidMount() {
        this._loadPatients()
    }

    _loadPatients() {
        const patientList = []
        let patient = {
            uid: '',
            name: '',
            country: '',
        }
       
        var query = REFS.users
        query = query.where("myDoctors", "array-contains", firebase.auth().currentUser.uid) //the doctor id is added to this array By Admin right after Admin confirms the 1st appointment between the User & Doctor

        query.get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {

                    const id = doc.id
                    patient = doc.data()
                    patient.uid = id
                    patient.nom = doc.data().nom
                    patient.prenom = doc.data().prenom
                    patientList.push(patient)
                })

                this.setState({
                    patientList: patientList
                })

            })
            .catch(error => console.log('Error getting documents:' + error))
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
            isCountrySelected: false, isUrgencesSelected: false, isSpecialitySelected: false, isPriceSelected: false
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
        console.log('99999999')

        this.filteredPatients1 = this.state.patientList
        console.log(this.filteredPatients1)

        if (this.state.country) {
            this.filteredPatients1 = this.filteredPatients1.filter(createFilter(this.state.country, KEYS_TO_FILTERS_COUNTRY))
        }

        this.filteredPatients1 = this.filteredPatients1.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

        console.log('=========')
        console.log(this.filteredPatients1)
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

                <View style={styles.logo_container}>
                    <Image source={require('../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
                </View>

                <View style={styles.search_container}>

                    <View style={styles.search_button}>
                        <Icon1 name="search" size={20} color="#afbbbc" style={{ flex: 0.1, paddingRight: 5 }} />
                        <TextInput
                            onChangeText={(term) => { this.searchUpdated(term) }}
                            placeholder="Rechercher un patient"
                            style={{ flex: 0.9 }}
                        />
                    </View>


                    <TouchableOpacity style={styles.filter_button}
                        onPress={this.toggleSideMenu}>
                        <Icon1 name="filter" size={25} color="#93eafe" />
                    </TouchableOpacity>
                </View>

                <View style={styles.filters_selected_container}>
                    {this.state.isCountrySelected ?
                        <View style={styles.filterItem}>
                            <Text style={styles.filterItem_text}>Pays</Text>
                            <Icon name="close"
                                //size= {20}
                                color="#93eafe"
                                onPress={() => this.setState({ country: '', isCountrySelected: false })} />
                        </View>
                        : null
                    }

                    {this.state.isUrgencesSelected ?
                        <View style={styles.filterItem}>
                            <Text style={styles.filterItem_text}>Urgences</Text>
                            <Icon name="close"
                                size={SCREEN_WIDTH * 0.05}
                                color="#93eafe"
                                onPress={() => this.setState({ urgences: '', isUrgencesSelected: false })} />
                        </View>
                        : null}

                    {this.state.isSpecialitySelected ?
                        <View style={styles.filterItem}>
                            <Text style={styles.filterItem_text}>Specialité</Text>
                            <Icon name="close"
                                size={SCREEN_WIDTH * 0.05}
                                color="#93eafe"
                                onPress={() => this.setState({ speciality: '', isSpecialitySelected: false })} />
                        </View>
                        : null}

                    {this.state.isPriceSelected ?
                        <View style={styles.filterItem}>
                            <Text style={styles.filterItem_text}>Tarifs</Text>
                            <Icon name="close"
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
                                    displayPatientCalendar={() => this.onPatientClick(doctor)}
                                    displayPatientDetails={() => this.displayPatientDetails(doctor)}
                                />              
                            </View>
                        )
                    })}
                </ScrollView>

            </View>
        );
    }
}

export default withNavigation(MyPatients);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    logo_container: {
        flex: 0.3,
        justifyContent: 'flex-end',
        alignItems: 'center',
        //backgroundColor: 'blue',
    },
    logoIcon: {
        height: SCREEN_WIDTH * 0.25,
        width: LOGO_WIDTH,
        marginTop: SCREEN_WIDTH * 0.05
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
        elevation: 5,
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
        elevation: 9,
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
    filterItem_text: {
        fontSize: SCREEN_HEIGHT * 0.013
    },
    patientList_container: {
        flex: 1,
        //backgroundColor: 'yellow'
    }

});

