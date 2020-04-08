// Components/Search.js

import React, { Component } from 'react'
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet  } from 'react-native'
import { theme } from '../constants';
import { LinearGradient } from 'react-native-linear-gradient';




class MyComponant extends Component {

 

    onPress = () => {       
        console.log("Button pressed")       
    }

  render() {

    return (
        <TouchableOpacity
           style={styles.button}
           onPress={this.onPress}
        >
           // <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
            <Text style={styles.buttonText}> Sign in with Facebook </Text>
            </LinearGradient>
        </TouchableOpacity>
    )
  }
}

/*MyComponant.defaultProps = {
  startColor: theme.colors.primary,
  endColor: theme.colors.secondary,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  locations: [0.1, 0.9],
  opacity: 0.8,
  color: theme.colors.white,
}*/

export default MyComponant

const styles = StyleSheet.create({

    button: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      padding: 10
    },

    linearGradient: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 5
    },

    buttonText: {
      fontSize: 18,
      fontFamily: 'Gill Sans',
      textAlign: 'center',
      margin: 10,
      color: '#ffffff',
      backgroundColor: 'transparent',
    },
  })