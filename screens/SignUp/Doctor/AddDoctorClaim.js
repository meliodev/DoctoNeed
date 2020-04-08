
import React from 'react'
import { View, Text, TouchableHighlight, StyleSheet, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

import theme from '../../../constants/theme.js'

import firebase from 'react-native-firebase'
import { signOutUser } from '../../../DB/CRUD'

const functions = firebase.functions()

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.addDoctorRole = this.addDoctorRole.bind(this);
    }

    signOutUser() {
        signOutUser();
    }

    addDoctorRole() {
        const doctorEmail = this.props.navigation.getParam('email', 'nothing sent')
        const addDoctorRole = functions.httpsCallable('addDoctorRole')
        addDoctorRole({ email: doctorEmail }).then(async result => {
            console.log(result)
            await this.signOutUser()
            this.props.navigation.navigate('Home')
        }).catch(err => console.log(err))
    }

    render() {
        const email = this.props.navigation.getParam('email', 'nothing sent')
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignitems: 'center' }}>
                <Text> Add DOCTOR Role to {email} </Text>
                <TouchableHighlight
                    onPress={this.addDoctorRole}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
                        style={styles.linearGradient}>
                        <Text style={styles.buttonText}> Add Doctor Role </Text>
                    </LinearGradient>
                </TouchableHighlight>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    linearGradient: {
        width: SCREEN_WIDTH * 0.68,
        borderRadius: 25,
    },
    buttonText: {
        fontSize: theme.FONT_SIZE_LARGE,
        fontFamily: theme.FONT_FAMILY,
        textAlign: 'center',
        margin: SCREEN_WIDTH * 0.025,
        color: theme.WHITE_COLOR,
        backgroundColor: 'transparent',
    }
});

