import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'

import { Dimensions } from 'react-native'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
 
export default class MyDatePicker extends Component {
  constructor(props){
    super(props)
    this.state = {date:""}
  }
 
  render(){
    return (
      <DatePicker
        style={{width: 300}}
        date={this.state.date}
        mode="date"
        placeholder="Jour - Mois - Année"
        format="DD-MM-YYYY"
        //minDate="1920-01-01"
        //maxDate="2000-01-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 90,
            top: 40,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 40,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 15,
            width: SCREEN_WIDTH * 0.8,
            shadowColor: "#000",
            //shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9,
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {this.setState({date: date})}}
      />
    )
  }
}