import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button, SafeAreaView, FlatList } from 'react-native'
import firebase from 'react-native-firebase'

export default class SignUpRequests extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>
                    Demandes d'inscription de médecins
                </Text>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})