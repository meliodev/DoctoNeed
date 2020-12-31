import React from 'react'
import { StyleSheet, View, Picker, Text, Image, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

const allHours = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30']

class DispoItem2 extends React.Component {


    render() {

        return (
            <View style={styles.container}>
                <View style={styles.pickers_container}>
                    <Text style={{ textAlignVertical: 'center', paddingHorizontal: 5 }}>De</Text>
                    <View style={styles.picker_container} >
                        <Picker selectedValue={this.props.fromHour1} onValueChange={(value) => this.props.updateDay(this.props.day, value, 0, 'from')} style={{ flex: 1, color: '#445870', width: SCREEN_WIDTH * 0.3, textAlign: "center" }}>
                            <Picker.Item value='' label='-' />
                            {allHours.map((hour, key) => {
                                return (<Picker.Item key={key} value={hour} label={hour} />);
                            })}
                        </Picker>
                    </View>

                    <Text style={{ textAlignVertical: 'center', paddingHorizontal: 5 }}>à</Text>
                    <View style={styles.picker_container} >
                        <Picker selectedValue={this.props.toHour1} onValueChange={(value) => this.props.updateDay(this.props.day, value, 0, 'to')} style={{ flex: 1, color: '#445870', width: SCREEN_WIDTH * 0.3, textAlign: "center" }}>
                            <Picker.Item value='' label='-' />
                            {allHours.map((hour, key) => {
                                return (<Picker.Item key={key} value={hour} label={hour} />);
                            })}
                        </Picker>
                    </View>

                    <TouchableOpacity onPress={() => this.props.removeRow(this.props.rowsDay, this.props.dayIndex, this.props.isDayOn)}
                        style={{ marginLeft: SCREEN_WIDTH * 0.03 }}>
                        <Icon name="trash"
                            size={SCREEN_WIDTH * 0.07}
                            color="#93E7FF" />
                    </TouchableOpacity>

                </View>

                {this.props.fromHour1 !== '' && this.props.toHour1 !== '' && this.props.rowsDay === 2 &&
                    <View style={styles.pickers_container}>
                        <Text style={{ textAlignVertical: 'center', paddingHorizontal: 5 }}>De</Text>
                        <View style={styles.picker_container} >
                            <Picker selectedValue={this.props.fromHour2} onValueChange={(value) => this.props.updateDay(this.props.day, value, 1, 'from')} style={{ flex: 1, color: '#445870', width: SCREEN_WIDTH * 0.3, textAlign: "center" }}>
                                <Picker.Item value='' label='-' />
                                {allHours.map((hour, key) => {
                                    return (<Picker.Item key={key} value={hour} label={hour} />);
                                })}
                            </Picker>
                        </View>

                        <Text style={{ textAlignVertical: 'center', paddingHorizontal: 5 }}>à</Text>
                        <View style={styles.picker_container} >
                            <Picker selectedValue={this.props.toHour2} onValueChange={(value) => this.props.updateDay(this.props.day, value, 1, 'to')} style={{ flex: 1, color: '#445870', width: SCREEN_WIDTH * 0.3, textAlign: "center" }}>
                                <Picker.Item value='' label='-' />
                                {allHours.map((hour, key) => {
                                    return (<Picker.Item key={key} value={hour} label={hour} />);
                                })}
                            </Picker>
                        </View>

                        <TouchableOpacity onPress={() => this.props.removeRow(this.props.rowsDay, this.props.dayIndex, this.props.isDayOn)}
                            style={{ marginLeft: SCREEN_WIDTH * 0.03 }}>
                            <Icon name="trash"
                                size={SCREEN_WIDTH * 0.07}
                                color="#93E7FF" />
                        </TouchableOpacity>

                    </View>}

                {this.props.rowsDay > 0 && this.props.rowsDay < 2 &&
                    <TouchableHighlight onPress={() => this.props.addRow(this.props.dayIndex, this.props.day, this.props.rowsDay)} style={styles.buttonPlus}>
                        <Text style={{ color: '#93eafe', fontSize: SCREEN_WIDTH * 0.04 }}> + </Text>
                    </TouchableHighlight>
                }

                {this.props.error &&
                    <Text style={styles.error}>L'heure de fin est inférieur à l'heure du début.</Text>
                }

            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#BDBDBD',
        paddingLeft: SCREEN_WIDTH * 0.075,
        marginBottom: 10,
        paddingBottom: 10
    },
    pickers_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    picker_container: {
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: SCREEN_HEIGHT * 0.05,
        width: SCREEN_WIDTH * 0.3,
        paddingLeft: 20,
        paddingRight: 10
    },
    buttonPlus: {
        width: SCREEN_WIDTH * 0.07,
        height: SCREEN_WIDTH * 0.07,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: SCREEN_WIDTH * 0.02
    },
    error: {
        color: 'red',
        fontSize: 10,
        marginTop: 5
    }
})

export default DispoItem2