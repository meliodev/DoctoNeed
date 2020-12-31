/**
 * Button component
 * Renders a button and calls a function passed via onPress prop once tapped
 */

import React, { Component } from 'react';
import {
  StyleSheet,       // CSS-like styles
  Text,             // Renders text
  TouchableOpacity, // Pressable container
  View,              // Container component
  Dimensions,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

import LinearGradient from 'react-native-linear-gradient';

export default class Button extends Component {
  render() {
    const { onPress, contained, outlined } = this.props
    return (
      <TouchableOpacity onPress={onPress} style={{ marginBottom: this.props.marginBottom, marginTop: this.props.marginTop }}>
        {contained ?
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#b3f3fd', '#84e2f4', '#5fe0fe']} style={[styles.linearGradient, { paddingBottom: this.props.paddingBottom, paddingTop: this.props.paddingTop, width: this.props.width, elevation: 2 }]}>
            <Text style={[styles.buttonText, { fontSize: this.props.fontSize }]}> {this.props.text} </Text>
          </LinearGradient>
          :
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#fff', '#fff', '#fff']} style={[styles.linearGradient, { paddingBottom: this.props.paddingBottom, paddingTop: this.props.paddingTop, width: this.props.width, elevation: 2 }]}>
            <Text style={[styles.buttonTextOutlined, { fontSize: this.props.fontSize }]}> {this.props.text} </Text>
          </LinearGradient>
        }
      </TouchableOpacity>
    )
  }

}

Button.defaultProps = {
  contained: true,
}

const styles = StyleSheet.create({

  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 30,
    marginTop: 16,
    width: SCREEN_WIDTH * 0.87,
  },
  buttonText: {
    fontSize: SCREEN_HEIGHT * 0.021,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  buttonTextOutlined: {
    fontSize: SCREEN_HEIGHT * 0.021,
    //fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    color: '#000',
    backgroundColor: 'transparent',
  },
});