
import React from 'react'
import { View, Text, TouchableHighlight, ActivityIndicator, StyleSheet, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

import theme from '../../../constants/theme.js'

import firebase from 'react-native-firebase'
import { signOutUser } from '../../../DB/CRUD'

import { connect } from 'react-redux'

const functions = firebase.functions()

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.email = this.props.signupData.email
        console.log('eEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')
        console.log('email: ' + this.email)
        this.addDoctorRole = this.addDoctorRole.bind(this);

        this.state = {
            isLoading: false
        }
    }

    signOutUser() {
        signOutUser();
    }

    addDoctorRole() {
        this.setState({ isLoading: true })
        const addDoctorRole = functions.httpsCallable('addDoctorRole')
        addDoctorRole({ email: this.email }).then(async result => {
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
            console.log(result)
            await this.signOutUser()
            this.setState({ isLoading: false })
            this.props.navigation.navigate('Home')
        }).catch(err => console.log(err))
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.isLoading
                    ? <View style={styles.loading_container}>
                        <ActivityIndicator size='large' />
                      </View>
                    :
                    <View style= {{flex: 1, justifyContent: 'center', alignitems: 'center'}}>
                        <View style={{ flex: 0.45, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 100 }}>Ajouter un médecin</Text>
                            <Text> Etes vous sûr de vouloir attribuer le rôle de médecin au nouvel utilisateur dont l'adresse email est {this.email} ? (Seul l'admin est autorisé à effectuer cette opération.) </Text>
                        </View>

                        <View style={{ flex: 0.55, justifyContent: 'flex-start', alignItems: 'center' }}>
                            <TouchableHighlight
                                onPress={this.addDoctorRole}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
                                    style={styles.linearGradient}>
                                    <Text style={styles.buttonText}>Confirmer</Text>
                                </LinearGradient>
                            </TouchableHighlight>
                        </View>
                    </View>
                }
            </View>
        )
    }

}

const mapStateToProps = (state) => {
    return {
      signupData: state.signup
    }
  }
  
  export default connect(mapStateToProps)(Login)

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
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }
});

