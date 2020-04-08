
import React from 'react'
import { View, Text, Button } from 'react-native'

export default class Test1 extends React.Component {

  render() {

    return (

      <View style={{ flex: 1 }}>
        <Text onPress={() => this.props.navigation.navigate('SignUp1')} style={{ textDecorationLine: 'underline', color: '#70e2f9', fontFamily: 'Avenir', }}>
          Postulez ici</Text>
      </View>
    );
  }
}


