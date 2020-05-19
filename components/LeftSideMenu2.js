/**
 * Button component
 * Renders a button and calls a function passed via onPress prop once tapped
 */

import React, { Component, Children } from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Dimensions, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-modal";

import * as REFS from '../DB/CollectionsRefs'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

import firebase from 'react-native-firebase';


export default class LeftSideMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUser: false,
            isAdmin: false,
            nom: '',
            prenom: '',
            email: '',
        }
    }

    UserAuthStatus = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ isUser: true })
                user.getIdTokenResult().then(idTokenResult => {
                    this.setState({ isAdmin: idTokenResult.claims.admin })
                    //Retrieve Admin's MetaData
                    this.setState({ isAdmin: idTokenResult.claims.admin }, () => {
                        REFS.admins.doc(firebase.auth().currentUser.uid).get().then(doc => {
                            this.setState({ nom: doc.data().nom })
                            this.setState({ prenom: doc.data().prenom })
                            this.setState({ email: firebase.auth().currentUser.email })
                        })
                    })
                })

            } else {
                this.setState({ isUser: false })
            }
        })
    };

    componentDidMount() {
        this.UserAuthStatus()
    }


    render({ onPress } = this.props) {
        return (
            <Modal
                isVisible={this.props.isSideMenuVisible}
                coverScreen='true'
                onBackdropPress={this.props.toggleSideMenu} // Android back press
                onSwipeComplete={this.props.toggleSideMenu} // Swipe to discard
                animationIn="slideInLeft" // Has others, we want slide in from the left
                animationOut="slideOutLeft" // When discarding the drawer
                swipeDirection="left" // Discard the drawer with swipe to left
                useNativeDriver // Faster animation 
                hideModalContentWhileAnimating // Better performance, try with/without
                propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
                style={sideMenuStyle.sideMenuStyle} // Needs to contain the width, 75% of screen width in our case
            >
                <SafeAreaView style={sideMenuStyle.safeAreaView}>
                    <View style={sideMenuStyle.profileData_container}>

                        <View style={sideMenuStyle.Avatar_box}>
                            <Icon name="user"
                                size={SCREEN_WIDTH * 0.05}
                                color="#93eafe" />
                        </View>
                        <View style={sideMenuStyle.metadata_box}>
                            <Text style={sideMenuStyle.metadata_text1}>{this.state.nom} {this.state.prenom}</Text>
                            <Text style={sideMenuStyle.metadata_text2}>{this.state.email}</Text>
                        </View>

                    </View>

                    <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth, width: SCREEN_WIDTH * 0.7, marginLeft: SCREEN_WIDTH * 0.04, marginBottom: SCREEN_HEIGHT * 0.07 }} />



                    {this.state.isAdmin ?
                        <TouchableHighlight
                            style={sideMenuStyle.pageLink_button}
                            onPress={this.props.navigateToSearch}>

                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                                <Icon name="home"
                                    size={SCREEN_WIDTH * 0.04}
                                    color="#93eafe" />
                                <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                                    <Text style={{ color: 'black', fontWeight: 'bold' }}>Médecins</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                        :
                        null}

                    {this.state.isAdmin ?
                        <TouchableHighlight
                            style={sideMenuStyle.pageLink_button}
                            onPress={this.props.navigateToPatients}>

                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                                <Icon name="home"
                                    size={SCREEN_WIDTH * 0.04}
                                    color="#93eafe" />
                                <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                                    <Text style={{ color: 'black', fontWeight: 'bold' }}>Patients</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                        :
                        null}

                    {this.state.isAdmin ?
                        <TouchableHighlight
                            style={sideMenuStyle.pageLink_button}
                            onPress={this.props.navigateToAppointments}>

                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                                <Icon name="user-md"
                                    size={SCREEN_WIDTH * 0.04}
                                    color="#93eafe" />
                                <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                                    <Text style={{ color: 'black', fontWeight: 'bold' }}>Consultations</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                        :
                        null}

                    {this.state.isAdmin ?
                        <TouchableHighlight
                            style={sideMenuStyle.pageLink_button}
                            onPress={this.props.navigateToRequests}>

                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                                <Icon name="user-md"
                                    size={SCREEN_WIDTH * 0.04}
                                    color="#93eafe" />
                                <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                                    <Text style={{ color: 'black', fontWeight: 'bold' }}>Demandes d'inscription</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                        :
                        null}

                    <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth, width: SCREEN_WIDTH * 0.7, marginLeft: SCREEN_WIDTH * 0.04, marginBottom: SCREEN_HEIGHT * 0.03, marginTop: SCREEN_HEIGHT * 0.04 }} />

                    <TouchableHighlight
                        style={sideMenuStyle.pageLink_button}
                        onPress={this.props.signOutUser}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                            <Icon name="sign-out"
                                size={SCREEN_WIDTH * 0.04}
                                color="#93eafe" />
                            <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                                <Text style={{ color: 'black', fontWeight: 'bold' }}>Se déconnecter</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                </SafeAreaView>
            </Modal>
        );
    }
}

const sideMenuStyle = StyleSheet.create({
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
        width: SCREEN_WIDTH * 0.8, // SideMenu width
        height: SCREEN_HEIGHT,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderRightColor: '#93eafe',
        borderRightWidth: 15,
        //backgroundColor: 'green'
    },
    safeAreaView: {
        flex: 1,
        height: SCREEN_HEIGHT,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        backgroundColor: "white"
    },
    profileData_container: {
        //flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: SCREEN_WIDTH * 0.11,
        paddingTop: SCREEN_HEIGHT * 0.03,
        marginBottom: SCREEN_HEIGHT * 0.02,
        //backgroundColor: 'green',
    },
    Avatar_box: {
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
        alignItems: 'center',
        //backgroundColor: 'orange'
    },
    metadata_box: {
        height: SCREEN_WIDTH * 0.12,
        marginLeft: SCREEN_WIDTH * 0.04,
        justifyContent: 'center',
        //backgroundColor: 'yellow'
    },
    metadata_text1: {
        fontSize: SCREEN_HEIGHT * 0.015,
        color: 'gray',
        fontWeight: 'bold'
    },
    metadata_text2: {
        fontSize: SCREEN_HEIGHT * 0.015,
        color: 'gray'
    },
});