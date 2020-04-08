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
                        <Text style={styles.header_text}>Trier par</Text>
                        <TouchableHighlight style={styles.filter_button}
                            onPress={this.toggleSideMenu}>
                            <Icon name="filter" size={25} color="#93eafe" />
                        </TouchableHighlight>
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

                    <View style={styles.speciality_container}>
                        <Text style={styles.title_text}>Spécialité</Text>
                        <RNPickerSelect
                            onValueChange={(speciality) => this.props.onSelectSpeciality(speciality)}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                            items={[
                                { label: 'Ophtalmologue', value: 'Ophtalmologue' },
                                { label: 'Médecin généraliste', value: 'Médecin généraliste' },
                                { label: 'Psychologue', value: 'Psychologue' },
                                { label: 'Cardiologue', value: 'Cardiologue' },
                                { label: 'Rhumatologue', value: 'Rhumatologue' },
                                { label: 'Neurologue', value: 'Neurologue' },
                                { label: 'Gynécologue', value: 'Gynécologue' }
                            ]}
                            placeholder={{
                                label: 'Choisissez une spécialité',
                                value: 'Choisissez une spécialité'
                            }}
                        />
                    </View>

                    <View style={styles.price_container}>
                        <Text style={styles.title_text}>Tarifs</Text>
                        <Slider
                            value={this.props.price}
                            onValueChange={value => this.props.onSelectPriceMax(value)}
                            minimumValue={0}
                            maximumValue={50}
                            step={5}
                            minimumTrackTintColor='#93eafe'
                            thumbTintColor='#93eafe'
                            style={styles.slider}
                        />
                        <Text style={styles.title_text}>Maximum: {this.props.price} €</Text>
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
    urgence_container1: {
        flex: 0.075,
        paddingLeft: SCREEN_WIDTH * 0.1,
        // backgroundColor: 'yellow'
    },
    urgence_container2: {
        flex: 0.075,
        flexDirection: 'row',
        paddingLeft: SCREEN_WIDTH * 0.1,
        paddingRight: SCREEN_WIDTH * 0.1,
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor: 'blue'
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
        // marginTop: SCREEN_WIDTH*0.05,
        elevation: 9,
        justifyContent: 'center',
        alignItems: 'center'
    },
    urgence_text: {
        fontSize: 10,
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
        marginBottom: SCREEN_HEIGHT*0.02
        //marginRight: SCREEN_HEIGHT*0.07
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