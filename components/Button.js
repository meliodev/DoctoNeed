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
  render({ onPress } = this.props) {
    return (
              <TouchableOpacity
                onPress={onPress}>         
                <LinearGradient 
                  start={{x: 0, y: 0}} 
                  end={{x: 1, y: 0}} 
                  colors={['#b3f3fd', '#84e2f4', '#5fe0fe']} 
                  style={styles.linearGradient}>
                  <Text style={styles.buttonText}> {this.props.text} </Text>
                </LinearGradient>
              </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  // Button container
  button: {
    borderRadius: 50,         // Rounded border
    borderWidth: 2,           // 2 point border widht
    borderColor: '#FFFFFF',   // White colored border
    paddingHorizontal: 50,    // Horizontal padding
    paddingVertical: 10,      // Vertical padding
  },
  // Button text
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Avenir',
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
    paddingTop:5,
    borderRadius: 30,
    marginTop:16,
    width: SCREEN_WIDTH * 0.87,
  },
  buttonText: {
    fontSize: SCREEN_HEIGHT * 0.023,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});