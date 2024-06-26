//Search filter

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
    constructor(props) {
        super(props);

        this.state = {
            isSideMenuVisible: false
        }
    }

    toggleSideMenu = () => {
        this.setState({ isSideMenuVisible: !this.state.isSideMenuVisible });
    }

    render({ onPress } = this.props) {

        const { main } = this.props

        return (
            <View style={{}}>

                <TouchableHighlight style={styles.filter_button}
                    onPress={this.toggleSideMenu}>
                    <Icon name="filter" size={25} color="#93eafe" />
                </TouchableHighlight>

                <Modal
                    isVisible={this.state.isSideMenuVisible}
                    coverScreen='true'
                    onBackdropPress={this.toggleSideMenu} // Android back press
                    onSwipeComplete={this.toggleSideMenu} // Swipe to discard
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
                            <Text style={styles.header_text}>Trier par</Text>
                            <TouchableHighlight style={styles.filter_button}
                                onPress={this.toggleSideMenu}>
                                <Icon name="filter" size={25} color="#93eafe" />
                            </TouchableHighlight>
                        </View>

                        <View style={styles.pays_container}>
                            <Text style={styles.title_text}>Pays</Text>
                            <View style={{
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
                                marginHorizontal: SCREEN_WIDTH * 0.00,
                                marginTop: 10,
                                paddingVertical: 0,
                                width: SCREEN_WIDTH * 0.55
                            }}>
                                <CountryPicker
                                    withFilter
                                    withEmoji
                                    withCountryNameButton
                                    withAlphaFilter
                                    translation="fra"
                                    placeholder={this.props.countryPlaceHolder}
                                    containerButtonStyle={{
                                        width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.065, borderRadius: 30, marginTop: SCREEN_HEIGHT * 0.00, paddingVertical: SCREEN_HEIGHT * 0.02
                                        , paddingHorizontal: SCREEN_WIDTH * 0.05
                                    }}
                                    onSelect={country => main.setState({ country: country.name })}
                                />
                            </View>
                        </View>

                        {/*
                       {this.props.isUrgence ?
                         null :
                        <View style= {styles.urgence_container}>
                            <View style={styles.urgence_container1}>
                                <Text style={styles.title_text}>Urgences</Text>
                            </View>

                            <View style={styles.urgence_container2}>
                                <TouchableHighlight style={styles.urgence_button}
                                    onPress={this.props.toggleUrgence}>
                                    {this.props.urgences === 'true'
                                        ? <View style={{ width: SCREEN_WIDTH * 0.02, height: SCREEN_WIDTH * 0.02, borderRadius: 25, backgroundColor: '#93eafe' }} />
                                        : <View style={{ width: 0.005, height: 0.005, backgroundColor: 'white' }} />}
                                </TouchableHighlight>
                                <Text style={styles.urgence_text}>Afficher uniquement les médecins gérant les urgences</Text>
                            </View>
                        </View>}
                               */}

                        <View style={styles.speciality_container}>
                            <Text style={styles.title_text}>Spécialité</Text>
                            <RNPickerSelect
                                onValueChange={(speciality) => main.setState({ speciality })}
                                value={this.props.speciality}
                                style={pickerSelectStyles}
                                useNativeAndroidPickerStyle={false}
                                items={[
                                    { label: 'Médecin généraliste', value: 'Médecin généraliste' },
                                    { label: 'Pédiatre', value: 'Pédiatre' },
                                    { label: 'Ophtalmologue', value: 'Ophtalmologue' },
                                    { label: 'Psychologue', value: 'Psychologue' },
                                    { label: 'Rhumatologue', value: 'Rhumatologue' },
                                ]}
                                placeholder={{
                                    label: 'Choisissez une spécialité',
                                    value: ''
                                }}
                            />
                        </View>

                        <View style={styles.price_container}>
                            <Text style={styles.title_text}>Tarifs</Text>
                            <Slider
                                value={this.props.price}
                                onValueChange={price => main.setState({ price })}
                                minimumValue={0}
                                maximumValue={100}
                                step={5}
                                minimumTrackTintColor='#93eafe'
                                thumbTintColor='#93eafe'
                                style={styles.slider}
                            />
                            <Text style={styles.title_text}>Maximum: {this.props.price} €</Text>
                        </View>

                        <View style={styles.buttons_container}>
                            <TouchableHighlight onPress={this.toggleSideMenu} style={styles.CancelButton}>
                                <Text style={styles.buttonText1}>Annuler</Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                                onPress={this.toggleSideMenu}>
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

            </View>
        );
    }
}

const styles = StyleSheet.create({
    pageLink_button: {
        height: SCREEN_HEIGHT * 0.045,
        width: SCREEN_WIDTH * 0.7,
        backgroundColor: '#ffffff',
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
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center'
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
    urgence_container: {
        flex: 0.15,
        paddingLeft: SCREEN_WIDTH * 0.1,
        //backgroundColor: 'yellow'
    },
    urgence_container1: {
        flex: 0.3,
        //backgroundColor: 'green'
    },
    urgence_container2: {
        flex: 0.7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //backgroundColor: 'blue'
    },

    urgence_button: {
        width: SCREEN_WIDTH * 0.07,
        height: SCREEN_WIDTH * 0.07,
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
    urgence_text: {
        fontSize: 13,
        fontFamily: 'bold',
        marginLeft: SCREEN_WIDTH * 0.05,
        color: 'gray'
    },
    speciality_container: {
        flex: 0.15,
        paddingLeft: SCREEN_WIDTH * 0.1,
        //backgroundColor: 'brown'
    },
    price_container: {
        flex: 0.2,
        paddingLeft: SCREEN_WIDTH * 0.1,
        // backgroundColor: 'purple'
    },
    slider: {
        marginTop: SCREEN_HEIGHT * 0.05,
        marginBottom: SCREEN_HEIGHT * 0.02,
        marginRight: SCREEN_HEIGHT * 0.03
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
        elevation: 3,
        marginTop: 15,
        marginBottom: 15,
        fontSize: 11,
    },
    inputAndroid: {
        textAlignVertical: 'top',
        paddingLeft: SCREEN_WIDTH * 0.06,
        textAlign: 'left',
        backgroundColor: '#ffffff',
        borderRadius: 50,
        paddingTop: SCREEN_WIDTH * 0.05,
        paddingRight: SCREEN_WIDTH * 0.07,
        width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.065,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        marginTop: SCREEN_WIDTH * 0.03,
        fontSize: 11,
        color: '#333',
    },
});