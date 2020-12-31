/**
 * Button component
 * Renders a button and calls a function passed via onPress prop once tapped
 */

import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image } from 'react-native';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ratioLogo = 420 / 244
const LOGO_WIDTH = SCREEN_WIDTH * 0.14 * ratioLogo

import LeftSideMenu from './LeftSideMenu'

export default class Header extends Component {
    render() {
        return (
            <View style={styles.headerContainer}>
                <View style={{ flex: 0.33, justifyContent: 'center' }}>
                    <LeftSideMenu />
                </View>

                <View style={{ flex: 0.34, alignItems: 'center' }}>
                    <Image source={require('../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
                </View>

                <View style={{ flex: 0.33, justifyContent: 'center', alignItems: 'flex-end' }}>
                    {this.props.filter}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SCREEN_HEIGHT * 0.03,
    },
    logoIcon: {
        height: SCREEN_WIDTH * 0.14,
        width: LOGO_WIDTH,
    }
})