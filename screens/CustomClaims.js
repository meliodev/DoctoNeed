
import React from 'react'
import { View, Text, TouchableHighlight, TextInput, StyleSheet, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

import theme from '../constants/theme.js'

import firebase from 'react-native-firebase'
import { signOutUser } from '../DB/CRUD'

const functions = firebase.functions()

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class CustomClaims extends React.Component {
    constructor(props) {
        super(props);
        this.addAdminRole = this.addAdminRole.bind(this);
        //this.addDoctorRole = this.addDoctorRole.bind(this);

        this.state = {
            email: '',
            errorMessage: ''
        }
    }

    /* signOutUser() {
         signOutUser();
     }*/

    addAdminRole() {
        const addAdminRole = functions.httpsCallable('addAdminRole')
        addAdminRole({ email: this.state.email }).then(result => {
            console.log(result)
        }).catch(err => this.setState({ errorMessage: err }))
    }

  /*  addDoctorRole() {
        const addDoctorRole = functions.httpsCallable('addDoctorRole')
        addDoctorRole({ email: this.state.email }).then(result => {
            console.log(result)
        }).catch(err => this.setState({ errorMessage: err }))
    }*/

    render() {
        return (
            <View style= {{ flex: 1 }}>
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
                    <Text style= {{color: 'red'}}> {this.state.errorMessage} </Text>
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

