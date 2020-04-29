import React, { Component } from 'react';
import {  Animated, Text, TouchableOpacity, StyleSheet,Image, Dimensions, Platform,  UIManager } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppRegistry, View, LayoutAnimation, Button, TouchableHighlight, FlatList } from 'react-native'
import { Picker, CheckBox } from 'native-base';



const width = Dimensions.get('window').width;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class DispoItem extends Component {

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
          <View style={{flexDirection:'row', flexWrap:'wrap', paddingVertical:2}}>
      <View style={{
            borderRadius: 30,
            borderWidth: 0,
            borderColor: '#bdc3c7',
            overflow: 'hidden', 
            shadowColor: "#000",
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            marginTop:5,height:SCREEN_HEIGHT * 0.06
        }}>

      <Picker  mode="dropdown" selectedValue={this.state.days} onValueChange = {this.updateDays} style={{ flex: 1, color: '#445870' , width:SCREEN_WIDTH * 0.28 ,textAlign:"left"}}>
          <Picker.Item value='Lundi' label='Lundi'  />
          <Picker.Item value='Mardi' label='Mardi' />
          <Picker.Item value='Mercredi' label='Mercredi' />
          <Picker.Item value='Jeudi' label='Jeudi' />
          <Picker.Item value='Vendredi' label='Vendredi' />
          <Picker.Item value='Samedi' label='Samedi' />
          <Picker.Item value='Dimanche' label='Dimanche' />
      </Picker>

      </View>
          <Text style={{textAlignVertical:'center', paddingHorizontal:5}}>De</Text>
          <View  style={{ 
            borderRadius: 30,
            borderWidth: 0,
            borderColor: '#bdc3c7',
            overflow: 'hidden', 
            shadowColor: "#000",
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            marginVertical:0,marginTop:5,height:SCREEN_HEIGHT * 0.06 ,width:SCREEN_WIDTH * 0.20,paddingLeft:20,paddingRight:10}} >
          <Picker  mode="dropdown" selectedValue={this.state.selected} style={{ flex: 1, color: '#445870' ,  width:SCREEN_WIDTH * 0.25 ,textAlign:"center" }}>
          <Picker.Item value='8:00' label='8:00'  />
          <Picker.Item value='9:00' label='9:00' />
          <Picker.Item value='10:00' label='10:00' />
          <Picker.Item value='11:00' label='11:00' />
          <Picker.Item value='12:00' label='12:00' />
          <Picker.Item value='13:00' label='13:00' />
          <Picker.Item value='14:00' label='14:00' />
          <Picker.Item value='15:00' label='15:00'  />
          <Picker.Item value='16:00' label='16:00' />
          <Picker.Item value='17:00' label='17:00' />
          <Picker.Item value='18:00' label='18:00' />
          </Picker>
                      </View>
          <Text style={{textAlignVertical:'center', paddingHorizontal:5}}>à</Text>
          <View  style={{ 
            borderRadius: 30,
            borderWidth: 0,
            borderColor: '#bdc3c7',
            overflow: 'hidden', 
            shadowColor: "#000",
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            marginVertical:0,marginTop:5,height:SCREEN_HEIGHT * 0.06 ,width:SCREEN_WIDTH * 0.20,paddingLeft:20,paddingRight:10}} >
          <Picker  mode="dropdown" selectedValue={this.state.selected} style={{ flex: 1, color: '#445870' ,  width:SCREEN_WIDTH * 0.25 ,textAlign:"center",backgroundColor:"" }}>
          <Picker.Item value='8:00' label='8:00'  />
          <Picker.Item value='9:00' label='9:00' />
          <Picker.Item value='10:00' label='10:00' />
          <Picker.Item value='11:00' label='11:00' />
          <Picker.Item value='12:00' label='12:00' />
          <Picker.Item value='13:00' label='13:00' />
          <Picker.Item value='14:00' label='14:00' />
          <Picker.Item value='15:00' label='15:00'  />
          <Picker.Item value='16:00' label='16:00' />
          <Picker.Item value='17:00' label='17:00' />
          <Picker.Item value='18:00' label='18:00' />
          </Picker>
        </View>


        <TouchableOpacity
          style={{flex: 0,paddingVertical:SCREEN_WIDTH*0.05,marginLeft:15}}
          onPress={this.removeItem}
        >
          
          <Icon name="trash"
              size={SCREEN_WIDTH * 0.07}
              color="#93E7FF" />
        </TouchableOpacity>

</View>

        
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create(
  {
    viewHolder: {
      paddingVertical: 0,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'flex-start',
      margin: 0,
      paddingLeft: 0,
      borderRadius: 10
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