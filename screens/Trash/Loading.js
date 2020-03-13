//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)

import React from 'react'
import { View, TextInput, Button, Text, Image, TouchableOpacity, Dimensions, FlatList, Animated, StyleSheet  } from 'react-native'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratio = 381/668; // The actaul icon footer size is 254 * 668
const FOOTER_ICON_HEIGHT = Dimensions.get("window").width * ratio ; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

export default class Loading extends React.Component {

  render() {

    return (
        <View style={styles.container}>

          <View style={styles.logo_container}>
              <Image source={require('../assets/logoIcon.png')} style={styles.logoIcon} />
          </View>

          <View style={styles.footer_container}>
              <Image source={require('../assets/footerIcon.png')} style={styles.footerIcon} />
          </View>     

        </View>
  );
}
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  //justifyContent: 'center',
  //alignItems: 'center',
  backgroundColor: '#ffffff',
},
logo_container: {
  flex: 2,
  justifyContent: 'center',
  alignItems: 'center',
  //backgroundColor: 'green',
},
logoIcon: {
    height: SCREEN_WIDTH * 0.3,
    width: SCREEN_WIDTH * 0.3,
   // marginTop: SCREEN_WIDTH * 0.05
},
footer_container: {
  flex: 1,
  justifyContent: 'flex-end',
  //alignItems: 'stretch',
 // backgroundColor: 'blue',
},
footerIcon: {
    width: SCREEN_WIDTH,
    height: FOOTER_ICON_HEIGHT ,
},
});