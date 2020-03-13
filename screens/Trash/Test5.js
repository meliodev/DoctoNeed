//Custom phone input

import React from 'react'
import { StyleSheet, SafeAreaView, View, Keyboard, TouchableWithoutFeedback, Text, Modal, FlatList, TouchableOpacity, TextInput } from 'react-native'
// native base imports
import {
  Container,
  Item,
  Input,
  Icon
} from 'native-base'

import data from './Countries'
// Default render of country flag
const defaultFlag = data.filter(
  obj => obj.name === 'France'
  )[0].flag

export default class Test5 extends React.Component {
    state = {
        flag: defaultFlag,
        modalVisible: false,
        phoneNumber: '',
      }

      showModal() {
        this.setState({ modalVisible: true })
      }
      hideModal() {
        this.setState({ modalVisible: false })
         // Refocus on the Input field after selecting the country code
         this.refs.PhoneInput._root.focus()
      }

      async selectCountry(country) {
        // Get data from Countries.js  
        const countryData = await data
        try {
          // Get the country code
          const countryCode = await countryData.filter(
            obj => obj.name === country
          )[0].dial_code
          // Get the country flag
          const countryFlag = await countryData.filter(
            obj => obj.name === country
          )[0].flag
          // Update the state then hide the Modal
          this.setState({ phoneNumber: countryCode, flag: countryFlag })
          await this.hideModal()
        }
        catch (err) {
          console.log(err)
        }
      }

      onChangeText(key, value) {
        this.setState({
          [key]: value
        })
      }

    render() {
        const countryData = data

      return (
        <SafeAreaView style={styles.container}>
          
        <TouchableWithoutFeedback 
           style={styles.container} 
           onPress={Keyboard.dismiss}>
           <View style={styles.container}>
            <Container style={styles.infoContainer}>
            {/* Phone input with native-base */}          
            <Item rounded style={styles.itemStyle}>
             
               {/* country flag */}
              <View backgroundColor= 'red'><Text onPress={() => this.showModal()}>{this.state.flag}</Text></View>
             
              <Input 
                placeholder='Votre numéro de téléphone'
                placeholderTextColor='#adb4bc'
                keyboardType={'phone-pad'}
                returnKeyType='done'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={false}
                style={styles.inputStyle}
                value={this.state.phoneNumber}
                ref='PhoneInput'
                onChangeText={(val) => this.onChangeText('phoneNumber', val)}
              />
              {/* Modal for country code and flag */}
<Modal
  animationType="slide"
  transparent={false}
  visible={this.state.modalVisible}>
  <View style={{ flex: 1 }}>
    <View style={{ flex: 7, marginTop: 80 }}>
      {/* Render the list of countries */}
      <FlatList
        data={countryData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={
          ({ item }) =>
            <TouchableWithoutFeedback onPress={() => this.selectCountry(item.name)}>
              <View style={styles.countryStyle}>
                <Text style={styles.textStyle}>
                  {item.flag} {item.name} ({item.dial_code})
                </Text>
              </View>
            </TouchableWithoutFeedback>
        }
      />
    </View>
    <TouchableOpacity
      onPress={() => this.hideModal()}
      style={styles.closeButtonStyle}>
      <Text style={styles.textStyle}>
        Cancel
      </Text>
    </TouchableOpacity>
  </View>
</Modal>
              <Input style={styles.inputStyle}/>
            </Item>
          </Container>
          </View>
          </TouchableWithoutFeedback>
       </SafeAreaView>
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    infoContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 200,
      bottom: 250,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
      backgroundColor: 'white',
    },
    iconStyle: {
      color: '#5a52a5',
      fontSize: 28,
      marginLeft: 15
    },
    itemStyle: {
      marginBottom: 10,
      //backgroundColor: 'blue'
    },
    inputStyle: {
      flex: 1,
      fontSize: 17,
      fontWeight: 'bold',
      color: '#5a52a5',
      backgroundColor: 'yellow'
    },
  })