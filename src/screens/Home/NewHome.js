import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';

export default class NewHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            a: ''
        }
    } 

    render() {
        return (
            <View style={styles.container}>
                <Text>New home for all users.</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

