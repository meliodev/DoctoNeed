/**
 * Button component
 * Renders a button and calls a function passed via onPress prop once tapped
 */

import React, { Component, Children } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, SafeAreaView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Modal from "react-native-modal";

import * as REFS from '../DB/CollectionsRefs'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

import firebase from 'react-native-firebase';
import { signOutUser } from '../DB/CRUD'

import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation';

class LeftSideMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //isAdmin: false,
            isDoctor: false,
            isPatient: false,
            isAdmin: false,
            avatarURL: '',
            nom: '',
            prenom: '',
            email: '',

            isLeftSideMenuVisible: false
        }
    }

    componentDidMount() {
        if (firebase.auth().currentUser) {
            this.userAuthStatus()

        }
    }

    userAuthStatus = () => {
        const { currentUser } = firebase.auth()

        const isPatient = this.props.role === 'isPatient'
        const isDoctor = this.props.role === 'isDoctor'
        const isAdmin = this.props.role === 'isAdmin'
        this.setState({ isDoctor, isPatient, isAdmin })

        let ref = null

        if (isDoctor) ref = REFS.doctors
        else if (isPatient) ref = REFS.users
        else if (isAdmin) ref = REFS.admins

        if (ref)
            ref.doc(currentUser.uid).get().then(doc => {
                this.setState({
                    nom: doc.data().nom,
                    prenom: doc.data().prenom,
                    email: currentUser.email,
                    avatarURL: doc.data().Avatar
                })
            })
    }

    renderAppointmentsLink(screen) {
        return (
            <TouchableOpacity
                style={sideMenuStyle.pageLink_button}
                onPress={() => this.navigateToScreen(screen)}>

                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                    <Icon name="list-alt"
                        size={SCREEN_WIDTH * 0.04}
                        color="#93eafe" />
                    <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                        {this.state.isAdmin ?
                            <Text style={{ color: 'black', fontWeight: 'bold' }}>Consultations</Text>
                            :
                            <Text style={{ color: 'black', fontWeight: 'bold' }}>Mes consultations</Text>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    toggleSideMenu = () => {
        if (!this.state.isLeftSideMenuVisible && this.state.nom === '')
            this.userAuthStatus()
        this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible })
    }

    navigateToScreen = (screen) => {
        let isLeftSideMenuVisible = this.state.isLeftSideMenuVisible
        this.setState({ isLeftSideMenuVisible: false }, () => this.props.navigation.navigate(screen))
    }

    navigateToMedicalFolder = () => {
        let isLeftSideMenuVisible = this.state.isLeftSideMenuVisible
        this.setState({ isLeftSideMenuVisible: false }, () => this.props.navigation.navigate('MedicalFolder', { role: this.props.role }))
    }

    signOutUserandToggle = async () => {
        let isLeftSideMenuVisible = this.state.isLeftSideMenuVisible
        this.setState({ isLeftSideMenuVisible: false }, () => signOutUser())
    }

    render({ onPress } = this.props) {
        const { isPatient, isDoctor, isAdmin, avatarURL } = this.state

        return (
            <View>
                <TouchableOpacity style={sideMenuStyle.menu_button}
                    onPress={() => this.toggleSideMenu()}>
                    <Icon name="bars" size={25} color="#93eafe" />
                </TouchableOpacity>

                <Modal
                    isVisible={this.state.isLeftSideMenuVisible}
                    coverScreen='true'
                    onBackdropPress={() => this.toggleSideMenu()}
                    onSwipeComplete={() => this.toggleSideMenu()}
                    animationIn="slideInLeft"
                    animationOut="slideOutLeft"
                    swipeDirection="left"
                    useNativeDriver
                    hideModalContentWhileAnimating
                    propagateSwipe
                    style={sideMenuStyle.sideMenuStyle}
                >
                    <SafeAreaView style={sideMenuStyle.safeAreaView}>

                        <View style={sideMenuStyle.profileData_container}>
                            <View style={sideMenuStyle.Avatar_box}>
                                {avatarURL !== '' ?
                                    <Image style={{ width: SCREEN_WIDTH * 0.11, height: SCREEN_WIDTH * 0.11, borderRadius: 25 }} source={{ uri: avatarURL }} />
                                    :
                                    <Icon name="user" size={SCREEN_WIDTH * 0.05} color="#93eafe" />
                                }
                            </View>
                            <View style={sideMenuStyle.metadata_box}>
                                <Text style={sideMenuStyle.metadata_text1}>{this.state.prenom} {this.state.nom}</Text>
                                <Text style={sideMenuStyle.metadata_text2}>{this.state.email}</Text>
                            </View>

                        </View>

                        <View style={[sideMenuStyle.hairline, { marginTop: 10 }]} />

                        {isDoctor &&
                            <View style={sideMenuStyle.items_container}>

                                <TouchableOpacity style={sideMenuStyle.pageLink_button} onPress={() => this.navigateToScreen('Profile')}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                                        <Icon name="user-md"
                                            size={SCREEN_WIDTH * 0.04}
                                            color="#93eafe" />
                                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                                            <Text style={{ color: 'black', fontWeight: 'bold' }}>Profil</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={sideMenuStyle.pageLink_button} onPress={() => this.navigateToScreen('DispoConfig')}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                                        <Icon1 name="schedule"
                                            size={SCREEN_WIDTH * 0.04}
                                            color="#93eafe" />
                                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                                            <Text style={{ color: 'black', fontWeight: 'bold' }}>Mes disponibilités</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                {this.renderAppointmentsLink('TabScreenDoctor')}

                                <TouchableOpacity style={sideMenuStyle.pageLink_button} onPress={() => this.navigateToScreen('MyPatients')}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                                        <Icon name="check-square"
                                            size={SCREEN_WIDTH * 0.04}
                                            color="#93eafe" />
                                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                                            <Text style={{ color: 'black', fontWeight: 'bold' }}>Mes patients</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={sideMenuStyle.pageLink_button} onPress={() => this.navigateToScreen('PaymentSummary')}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                                        <Icon name="dollar"
                                            size={SCREEN_WIDTH * 0.04}
                                            color="#93eafe" />
                                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                                            <Text style={{ color: 'black', fontWeight: 'bold' }}>Mes revenus</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }

                        {isPatient &&
                            <View style={sideMenuStyle.items_container}>

                                <TouchableOpacity
                                    style={sideMenuStyle.pageLink_button}
                                    onPress={() => this.navigateToMedicalFolder()}>

                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                                        <Icon name="user-md"
                                            size={SCREEN_WIDTH * 0.04}
                                            color="#93eafe" />
                                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                                            <Text style={{ color: 'black', fontWeight: 'bold' }}>Mon dossier médical</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                {this.renderAppointmentsLink('TabScreenPatient')}

                                <TouchableOpacity style={sideMenuStyle.pageLink_button} onPress={() => this.navigateToScreen('Search')}>

                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                                        <Icon name="check-square"
                                            size={SCREEN_WIDTH * 0.04}
                                            color="#93eafe" />
                                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                                            <Text style={{ color: 'black', fontWeight: 'bold' }}>Rechercher un médecin</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        }

                        {isAdmin &&
                            <View style={sideMenuStyle.items_container}>
                                <TouchableOpacity
                                    style={sideMenuStyle.pageLink_button}
                                    onPress={() => this.navigateToScreen('Search')}>

                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                                        <Icon name="home" size={SCREEN_WIDTH * 0.04} color="#93eafe" />
                                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                                            <Text style={{ color: 'black', fontWeight: 'bold' }}>Médecins</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={sideMenuStyle.pageLink_button}
                                    onPress={() => this.navigateToScreen('MyPatients')}>

                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                                        <Icon name="home"
                                            size={SCREEN_WIDTH * 0.04}
                                            color="#93eafe" />
                                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                                            <Text style={{ color: 'black', fontWeight: 'bold' }}>Patients</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                {this.renderAppointmentsLink('TabScreenAdmin')}

                                <TouchableOpacity style={sideMenuStyle.pageLink_button} onPress={() => this.navigateToScreen('SignUpRequests')}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                                        <Icon name="user-md"
                                            size={SCREEN_WIDTH * 0.04}
                                            color="#93eafe" />
                                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: SCREEN_WIDTH * 0.03 }}>
                                            <Text style={{ color: 'black', fontWeight: 'bold' }}>Demandes d'inscription</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }

                        <View style={sideMenuStyle.footer_container}>
                            <View style={[sideMenuStyle.hairline, { marginBottom: 15 }]} />

                            <TouchableOpacity style={sideMenuStyle.pageLink_button} onPress={() => this.signOutUserandToggle()}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.12 }}>
                                    <Icon name="sign-out" size={SCREEN_WIDTH * 0.04} color="#93eafe" />
                                    <Text style={{ color: 'black', fontWeight: 'bold', marginLeft: SCREEN_WIDTH * 0.03 }}>Se déconnecter</Text>
                                </View>
                            </TouchableOpacity>

                            <Text style={{ position: 'absolute', bottom: 0, margin: SCREEN_WIDTH * 0.02, fontSize: 10 }}>V 1.0.1</Text>
                        </View>

                    </SafeAreaView>
                </Modal >

            </View>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
    }
}

export default withNavigation(connect(mapStateToProps)(LeftSideMenu))

const sideMenuStyle = StyleSheet.create({
    avatar: {
        width: SCREEN_WIDTH * 0.11,
        height: SCREEN_WIDTH * 0.11,
        borderRadius: 25
    },
    menu_button: {
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
        alignItems: 'center',
        position: 'relative',
        left: SCREEN_WIDTH * 0.03,
    },
    pageLink_button: {
        height: SCREEN_HEIGHT * 0.045,
        width: SCREEN_WIDTH * 0.7,
        //alignItems: 'flex-end', 
        //justifyContent: 'center', 
        //paddingRight: SCREEN_WIDTH*0.05, 
        //backgroundColor: 'green',
        // backgroundColor: 'white',
        backgroundColor: '#fff',
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
        backgroundColor: "#fff"
    },
    profileData_container: {
        flex: 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: SCREEN_WIDTH * 0.05,
        paddingTop: 10
        // backgroundColor: 'yellow',
    },
    items_container: {
        flex: 0.7,
        paddingTop: 33,
        // backgroundColor: 'pink'
    },
    footer_container: {
        flex: 0.2,
        justifyContent: 'center',
        // backgroundColor: 'blue'
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
        elevation: 3,
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
    hairline: {
        borderBottomColor: '#d9dbda',
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: SCREEN_WIDTH * 0.7,
        marginLeft: SCREEN_WIDTH * 0.04,
    }
});


