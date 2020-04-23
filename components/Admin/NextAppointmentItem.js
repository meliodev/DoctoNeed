import React from 'react'
import { StyleSheet, View, Text, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class NextAppointmentItem extends React.Component {

    render() {
        const { appointment } = this.props
        return (

            <View style={itemStyle.ItemStyle}>
                <View style={itemStyle.main_container}>
                    <View style={itemStyle.dot_container}>

                    </View>

                    <View style={itemStyle.date_container}>
                        <Text style={itemStyle.date_day}>{appointment.day}</Text>
                    </View>

                    <View style={itemStyle.titles_container}>
                        <Text style={itemStyle.title_text}>Médecin</Text>
                        <Text style={itemStyle.title_text}>Patient</Text>
                        <Text style={itemStyle.title_text}>Durée</Text>
                    </View>

                    <View style={itemStyle.data_container}>
                        <Text style={itemStyle.data_text}>{appointment.doctorName}</Text>
                        <Text style={itemStyle.data_text}>{appointment.doctorSpeciality}</Text>
                        <Text style={itemStyle.data_text}>{this.props.id}</Text>
                    </View>

                    <View style={itemStyle.buttons_container}>
                        <TouchableHighlight
                            style={itemStyle.button}
                            onPress={() => displayDetailForDoctor(doctor.uid)}>
                            <View style={itemStyle.button_elements}>
                                <Text style={{ fontSize: SCREEN_HEIGHT * 0.015, color: 'white', marginRight: SCREEN_WIDTH * 0.01 }}>Voir les détails</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>

                <View style={itemStyle.arrow_container}>
                    <TouchableOpacity
                        onPress={this.props.open}>
                        <Icon name="downcircleo"
                            size={SCREEN_WIDTH * 0.05}
                            color="#93eafe" />
                    </TouchableOpacity>

                </View>
            </View>

        )
    }
}

const itemStyle = StyleSheet.create({
    ItemStyle: {
        flex: 1,

        backgroundColor: '#ffffff',
        borderRadius: 20,
        height: SCREEN_HEIGHT * 0.14, //animate to SCREEN_HEIGHT * 0.3
        width: SCREEN_WIDTH * 0.95,
        alignItems: 'center',
        marginBottom: SCREEN_HEIGHT * 0.025,
        marginLeft: SCREEN_HEIGHT * 0.01,
        //alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 4,
        //backgroundColor: 'green'
    },
    main_container: {
        height: SCREEN_HEIGHT * 0.1,
        //alignItems: 'flex-start',
        justifyContent: 'center',
        //marginTop: SCREEN_HEIGHT*0.02,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        flexDirection: 'row',
        //backgroundColor: 'blue'
    },

    arrow_container: {
        position: 'absolute',
        bottom: SCREEN_HEIGHT * 0.01,
        //backgroundColor: 'yellow'
    },

    dot_container: {
        flex: 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'black'
    },
    dot: {
        width: SCREEN_WIDTH * 0.02,
        height: SCREEN_WIDTH * 0.02,
        borderRadius: 50,
        backgroundColor: '#93eafe'
    },
    date_container: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: SCREEN_WIDTH * 0.016,
        //backgroundColor: 'orange'
    },
    date_day: {
        color: '#93eafe',
        fontSize: SCREEN_HEIGHT * 0.032,
        fontWeight: 'bold'
    },
    date_month: {
        color: '#93eafe',
        fontSize: SCREEN_HEIGHT * 0.015,
        fontWeight: 'bold'
    },
    titles_container: {
        flex: 0.17,
        justifyContent: 'center',
        //backgroundColor: 'pink'
    },
    title_text: {
        fontStyle: 'italic',
        fontSize: SCREEN_HEIGHT * 0.013,
    },
    data_container: {
        flex: 0.33,
        justifyContent: 'center',
        //backgroundColor: 'yellow'
    },
    data_text: {
        fontWeight: 'bold',
        fontSize: SCREEN_HEIGHT * 0.013,
    },
    buttons_container: {
        flex: 0.35,
        justifyContent: 'center',
        //backgroundColor: 'brown'
    },
    button: {
        height: SCREEN_HEIGHT * 0.035,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: SCREEN_WIDTH * 0.03,
        backgroundColor: '#93eafe',
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
    },
    button_elements: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})

export default NextAppointmentItem