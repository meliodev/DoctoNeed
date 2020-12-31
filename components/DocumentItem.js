import React, { Component } from 'react';
import {  Animated, Text, TouchableOpacity, StyleSheet,Image, Dimensions, Platform,  UIManager } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppRegistry, View, LayoutAnimation, Button, TouchableHighlight, FlatList } from 'react-native'
import { Picker, CheckBox } from 'native-base';





const width = Dimensions.get('window').width;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class DocumentItem extends Component {

  constructor() {
    super();
    this.animatedValue = new Animated.Value(0);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.item.id !== this.props.item.id) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    Animated.timing(
      this.animatedValue,
      {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true
      }
    ).start(() => {
      this.props.afterAnimationComplete();
    });
  }

  removeItem = () => {
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }
    ).start(() => {
      this.props.removeItem(this.props.item.id);
    });
  }
  state = {days: ''}
  updateDays = (days) => {
     this.setState({ days: days })
  }
  render() {
    const translateAnimation = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-width, 0, width]
    });

    const opacityAnimation = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0]
    });

    return (

      <Animated.View style={[
        styles.viewHolder, {
          transform: [{ translateX: translateAnimation }],
          opacity: opacityAnimation
        }]}
      >
       {/*} <Text
          style={styles.displayText}>
          Row Now :  {this.props.item.text}
    </Text>*/}
      <TouchableOpacity
          activeOpacity={0.8}
          style={{marginHorizontal:5,width:SCREEN_WIDTH * 0.1,marginLeft:30}}
          disabled={this.state.disabled}
          onPress={this.addMore}
        >
      <View style={{ borderRadius: 30,
            borderWidth: 0,
            borderColor: '#bdc3c7',
            overflow: 'hidden', 
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 3,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',padding:5}}>
        
        <Icon name="clipboard"
              size={SCREEN_WIDTH * 0.07}
              color="#93E7FF" />
              </View>
              <Text style={{marginTop:5,fontSize:13,marginLeft:0, color:'#000',width:SCREEN_WIDTH*0.2,alignContent:'flex-start'}}>Rapport detaillé</Text>

              </TouchableOpacity>
              </Animated.View>
    );
  }
}

const styles = StyleSheet.create(
  {
    viewHolder: {
      paddingVertical: 0,
      backgroundColor: '#fff',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      margin: 0,
      paddingLeft: 0,
      borderRadius: 10,
      width:0
    },
    displayText: {
      color: 'white',
      fontSize: 25,
      paddingRight: 0
    },
    removeBtn: {
      position: 'absolute',
      width: 50,
      height: 50,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent'
    },
    btnImage: {
      resizeMode: 'contain',
      width: '100%',
    },
  });