//Country Picker

import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput } from 'react-native';
import CountryPicker, { getAllCountries, getCallingCode } from 'react-native-country-picker-modal';
import Icon from 'react-native-vector-icons/Ionicons';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class Test3 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pays: '',
    }
  }

  onSelect (country) {
    this.setState({ pays: country.name }) 
    console.log(country.name)
  }

  placeHolder1 = () => {
   return this.state.pays ? <Text style={styles.pays1}> {this.state.pays} </Text> : <Text style={styles.placeHolder1}> Choisir un pays </Text>
  }

  placeHolder2 = () => {
   return <Text style={styles.placeHolder1}> OOOOOOOOOOOO </Text>
  }

  placeHolder3 = () => {
   return  <Icon style={styles.arrowIcon} name="md-arrow-dropdown" size={30} color="#900" />
  }

  render() {
   
    return (
      <View style={styles.container}>
        <CountryPicker 
          withFilter
          withEmoji
          withCountryNameButton
          placeholder = {this.placeHolder1()}
          onSelect= {country => this.onSelect(country)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  search_button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 15,
    width: SCREEN_WIDTH * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  placeHolder1: {
    color: '#d5d5d5'
  },
  placeHolder2: {
    color: '#ffffff'
  },
  pays1: {
    color: '#000000'
  },
  pays2: {
    color: '#ffffff'
  },
  arrowIcon: {
    color: '#d5d5d5',
    position: 'absolute',
    right: 50 
  }
});