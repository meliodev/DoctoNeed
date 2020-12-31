// Home.js
// Customize Home page for: Patient, Doctor, Admin
// A patient can not read/write any other patient's data (users)
import React from 'react'
import { StyleSheet, Platform, Image, Text, View, SafeAreaView, FlatList, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../../components/Button'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class SignUpRequestFinished extends React.Component {

    render() {

        return (

            <View style={styles.container}>
                <View style={styles.header_container}>
                    <Text style={styles.header}>
                        Demande d'inscription envoyée !
                    </Text>
                </View>
                <View style={styles.text_container}>
                    <Text style={styles.paragraph}>
                        Votre demande d'inscription sera bientôt traitée par un administrateur. Un email vous sera envoyé
                        afin de vous informer sur le statut final de votre inscription.
                    </Text>
                </View>
                <View style={styles.button_container}>
                    <Button
                        width={SCREEN_WIDTH * 0.65}
                        text="Retour à la page d'accueil"
                        onPress={() => this.props.navigation.navigate('Home')} />
                </View>

            </View>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header_container: {
        flex: 0.3,
        justifyContent: 'flex-end',
        alignItems: 'center',
        //backgroundColor: 'green',
        paddingBottom: SCREEN_HEIGHT * 0.01
    },
    text_container: {
        flex: 0.2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        //backgroundColor: 'orange',
        padding: SCREEN_HEIGHT * 0.05
    },

    header: {
        fontSize: SCREEN_HEIGHT * 0.03,
        fontWeight: 'bold',
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        color: 'black',
        //backgroundColor: 'yellow',
        marginBottom: SCREEN_HEIGHT * 0.01
    },
    paragraph: {
        fontSize: SCREEN_HEIGHT * 0.022,
        //fontWeight: 'bold',
        textAlign: 'center'
    },
    button_container: {
        flex: 0.5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        //backgroundColor: 'blue',
        paddingBottom: SCREEN_HEIGHT * 0.01
    },
    linearGradient: {
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        marginTop: 16,
        width: SCREEN_WIDTH * 0.68,
        borderRadius: 20
    },
    buttonText: {
        fontSize: 15,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },


})