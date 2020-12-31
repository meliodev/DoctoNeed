import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const ErrorMessage = ({ errorValue }) => (
  <View style={styles.container}>
    <Text style={styles.errorText}>{errorValue}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1, marginLeft: 25, justifyContent: 'center', backgroundColor: 'blue', alignItems: 'center'
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  }
})

export default ErrorMessage
