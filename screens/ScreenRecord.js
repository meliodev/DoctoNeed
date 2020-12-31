var ScreenRecorderManager = require('react-native-screen-recorder')
import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'


export default class ScreenRecord extends React.Component {

    start() {
        ScreenRecorderManager.start()
    }
    stop() {
        ScreenRecorderManager.stop()
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Button
                    onPress={this.start}
                    title="start"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
                <Button
                    onPress={this.stop}
                    title="stop"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
                <Text>
                    Welcome to React Native!
        </Text>
                <Text>
                    To get started, edit App.js
        </Text>
                <Text>
                </Text>
            </View>
        );
    }
}