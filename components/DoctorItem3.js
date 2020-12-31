import React from 'react'
import { StyleSheet, View, Text, Image, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import Button from './Button'
const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class DoctorItem3 extends React.Component {


    render() {
        const { doctor } = this.props
        return (
            <View style={styles.main_container}>
                <View style={styles.data_container}>
                    <View style={styles.content_container}>
                        <View style={styles.header_container}>
                            <Text style={styles.title_text}>Nom et Prénom</Text>
                        </View>
                        <View style={styles.header_container}>
                            <Text style={styles.title_text}>Spécialité</Text>
                        </View>
                        <View style={styles.header_container}>
                            <Text style={styles.title_text}>Pays</Text>
                        </View>
                        <View style={styles.header_container}>
                            <Text style={styles.title_text}>Code finesse</Text>
                        </View>
                        <View style={styles.header_container}>
                            <Text style={styles.title_text}>Email</Text>
                        </View>
                        <View style={styles.header_container}>
                            <Text style={styles.title_text}>Mot de passe</Text>
                        </View>
                        <View style={styles.header_container}>
                            <Text style={styles.title_text}>Téléphone</Text>
                        </View>
                    </View>

                    <View style={styles.content_container}>
                        <View style={styles.description_container}>
                            <Text style={styles.description_text}>{doctor.prenom} {doctor.nom}</Text>
                        </View>
                        <View style={styles.description_container}>
                            <Text style={styles.description_text}>{doctor.speciality}</Text>
                        </View>
                        <View style={styles.description_container}>
                            <Text style={styles.description_text}>{doctor.country}</Text>
                        </View>
                        <View style={styles.description_container}>
                            <Text style={styles.description_text}>{doctor.codeFinesse}</Text>
                        </View>
                        <View style={styles.description_container}>
                            <Text style={styles.description_text}>{doctor.email}</Text>
                        </View>
                        <View style={styles.description_container}>
                            <Text style={styles.description_text}>{doctor.password}</Text>
                        </View>
                        <View style={styles.description_container}>
                            <Text style={styles.description_text}>{doctor.phone}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.button_container}>
                    <Button width={SCREEN_WIDTH * 0.35} contained= {false} text="Refuser" onPress={this.props.handleReject} />
                    <Button width={SCREEN_WIDTH * 0.35} text="Accepter" onPress={this.props.handleAccept} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        //backgroundColor: 'yellow',
        borderRadius: 25,
        width: SCREEN_WIDTH * 0.95,
        height: SCREEN_HEIGHT * 0.4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        margin: 15,
    },
    data_container: {
        flex: 0.75,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    content_container: {
        flex: 0.4,
        //margin: SCREEN_WIDTH * 0.02,
        paddingTop: SCREEN_HEIGHT*0.033,
        padding: SCREEN_WIDTH * 0.025,
        //backgroundColor: 'green'
    },
    header_container: {
        flex: 0.22,
        //backgroundColor: 'purple'
    },
    button_container: {
        flex: 0.25,
        width: SCREEN_WIDTH * 0.95,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        //backgroundColor: 'blue'
    },
    button: {
        height: SCREEN_HEIGHT * 0.05,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: SCREEN_WIDTH * 0.03,
        backgroundColor: '#93eafe',
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,

    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 12,
        flex: 1,
        flexWrap: 'wrap',
        paddingRight: 5
    },
    vote_text: {
        fontWeight: 'bold',
        fontSize: 26,
        color: '#666666'
    },
    description_container: {
        flex: 0.43,
        //backgroundColor: 'yellow'
    },
    description_text: {
        fontStyle: 'italic',
        fontSize: 11,
        color: '#666666'
    },
})

export default DoctorItem3