//App presentation (no slides)
import React from 'react'
import { StyleSheet, View, Animated, Easing, Button, ColorPropType, Text } from 'react-native'

const activeColor = '#93eafe'
const passiveColor = '#cdd6d5'

class Test2 extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      //Size: new Animated.Value(50),
      ActiveBullet: 1,
      ColorBullet1: activeColor,
      ColorBullet2: passiveColor,
      ColorBullet3: passiveColor,
      ButtonText: 'Suivant'
    }
  }

  bullet1Style = () => {
    return {
    backgroundColor: this.state.ColorBullet1,
    width: 20,
    height: 20,
    borderRadius: 50,
    marginRight: 10
    }
  }

  bullet2Style = () => {
    return {
    backgroundColor: this.state.ColorBullet2,
    width: 20,
    height: 20,
    borderRadius: 50,
    //marginRight: 10
    }
  }

  bullet3Style = () => {
    return {
    backgroundColor: this.state.ColorBullet3,
    width: 20,
    height: 20,
    borderRadius: 50,
    marginLeft: 10
    }
  }   

  // Makes the next bullet active (blue) after on "Next" Button Press
  nextBullet = () => {
    this.setState({ ActiveBullet: this.state.ActiveBullet + 1 }, () => {
        console.log(this.state.ActiveBullet)
        // code called after the setState is finished. (callback)
        if (this.state.ActiveBullet == 1) {
          this.setState({ ColorBullet1: activeColor, ColorBullet2: passiveColor, ColorBullet3: passiveColor,  })
        }
       if (this.state.ActiveBullet == 2) {
       this.setState({ ColorBullet1: passiveColor, ColorBullet2: activeColor, ColorBullet3: passiveColor,  })
     }
     
     else if (this.state.ActiveBullet == 3) {
       this.setState({ ColorBullet1: passiveColor, ColorBullet2: passiveColor, ColorBullet3: activeColor,  })
       this.setState({ ButtonText: 'Commencer' })
     } 

     else {
      this.props.navigation.navigate('Test1')
     }
  })     
} 


  // Display Presentation of The app on first launch
  displayPresentation = () => {
    if (this.state.ActiveBullet == 1) {
      return   <Text> Partie 1 </Text>
    }
    else if (this.state.ActiveBullet == 2) {
      return   <Text> Partie 2 </Text>
    }
    else if (this.state.ActiveBullet == 3) {
      return   <Text> Partie 3 </Text>
    }
  }

  render() {
    const { ActiveBullet } = this.state
    return (
      <View style={styles.main_container}>
        <View style={styles.textPresentation}>
        {this.displayPresentation()}
        </View>

        <View style={styles.dots_container}>
        <Animated.View style={this.bullet1Style()}>
        </Animated.View>
        <Animated.View style={this.bullet2Style()}>
        </Animated.View>
        <Animated.View style={this.bullet3Style()}>
        </Animated.View>
        </View>

        <View style={styles.button}>
        <Text>{ActiveBullet}</Text> 
        <Button onPress={() => { this.nextBullet() }} title= {this.state.ButtonText} />

        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    //flexDirection: 'row',
   // justifyContent: 'center',
   // alignItems: 'center'
  },
  dots_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  animation_view1: {
    backgroundColor: '#93eafe',
    width: 20,
    height: 20,
    borderRadius: 50,
    marginRight: 10
  },
  animation_view2: {
    backgroundColor: '#cdd6d5',
    width: 20,
    height: 20,
    borderRadius: 50,
    //marginLeft: 5
  },
  animation_view3: {
    backgroundColor: '#cdd6d5',
    width: 20,
    height: 20,
    borderRadius: 50,
    marginLeft: 10
  },
})



export default Test2