
import React from 'react'
import { View, Text, TouchableHighlight, TextInput, StyleSheet, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

import theme from '../constants/theme.js'

import firebase from '../configs/firebase'


// const config = {
//     apiKey: "AIzaSyCccbplW_PFhXvl3HB4uCnCHBnTdC85v8g",
//     authDomain: "175838696437-2vafi8sg7h9mvmgjmius5jgi9tgrpss5.apps.googleusercontent.com",
//     databaseURL: "https://urgencepharma-b8196.firebaseio.com",
//     storageBucket: "urgencepharma-b8196.appspot.com",
// };

// const app = firebase.initializeApp(config)
const functions = firebase.functions()
// // functions.useFunctionsEmulator("http://127.0.0.1:5000")


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class CustomClaims extends React.Component {
    constructor(props) {
        super(props);
        this.addAdminRole = this.addAdminRole.bind(this);
        this.addDoctorRole = this.addDoctorRole.bind(this);

        this.state = {
            email: '',
            errorMessage: ''
        }
    }


    addAdminRole() {
        //console.log('test')
        const addAdminRole = functions.httpsCallable('addAdminRole')
        addAdminRole({ email: 'admin@test.fr' }).then(result => {
            console.log(result)
        }).catch(err => console.error(err))
    }

    addDoctorRole() {
        const addDoctorRole = functions.httpsCallable('addDoctorRole')
        addDoctorRole({ email: 'doctor@test.fr' }).then(result => {
            console.log(result)
        }).catch(err => console.error(err))
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignitems: 'center' }}>
                    <Text> Add Admin Role to {this.state.email} </Text>
                    <TextInput style={styles.search_button} onChangeText={(text) => this.setState({ email: text })} placeholder={'Votre email'} value={this.state.email} />
                    <TouchableHighlight
                        onPress={this.addAdminRole}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
                            style={styles.linearGradient}>
                            <Text style={styles.buttonText}> Add Admin Role </Text>
                        </LinearGradient>
                    </TouchableHighlight>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignitems: 'center' }}>
                    <Text> Add DOCTOR Role to {this.state.email} </Text>
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
                <View style={{ flex: 1, justifyContent: 'center', alignitems: 'center' }}>
                    <Text style={{ color: 'red' }}> {this.state.errorMessage} </Text>
                </View>
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

