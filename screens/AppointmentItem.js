import React from 'react'
import { StyleSheet, View, Text, Image, TouchableHighlight, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT= Dimensions.get("window").height

class AppointmentItem extends React.Component {


  render() {
    const { appointment } = this.props
    return (

          <View style = {styles.main_container}>

          <View style={styles.content_container}>
            <View style={styles.header_container}>
              <Text style={styles.title_text}>Dr. {appointment.doctorName} </Text>
            </View>
            <View style={styles.description_container}>
              <Text style={styles.description_text}>Prévu le {appointment.day} {appointment.month} {appointment.year}</Text>
            </View>
            <View style={styles.date_container}>
              <Text style={styles.date_text}>à  {appointment.timeslot}</Text>
            </View>
          </View>

          </View>

    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    //borderColor: 'green',
    //borderWidth: 1,
    height: 120,
    width: SCREEN_WIDTH*0.9,
    flexDirection: 'row',
    alignItems: 'center',
    //marginBottom: SCREEN_HEIGHT*0.02,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 7,
    flexDirection: 'row',
    marginBottom: SCREEN_HEIGHT*0.04,
    marginLeft: SCREEN_WIDTH*0.01,
    paddingLeft: SCREEN_WIDTH*0.05
    },
    imageFrame: {
      width: 95, 
      height: 95, 
      margin: 5, 
      borderRadius: 50,  
      alignItems: 'center', 
      justifyContent: 'center', 
      textAlignVertical: 'top',
      textAlign: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 50,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.32,
      shadowRadius: 5.46,
      elevation: 10,
      shadowColor: '#93eafe'
    },
  image: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 50,
    backgroundColor: 'black'
  },
  content_container: {
    margin: 5,
    paddingTop: 5
    //backgroundColor: 'green'
  },
  header_container: {
    flex: 0.22,
    //backgroundColor: 'purple'
  },
  button_container: {
    flex: 0.2,
   // backgroundColor: 'blue'
  },
  button:{
    height: SCREEN_HEIGHT*0.05, 
    alignItems: 'flex-start', 
    justifyContent: 'center', 
    paddingLeft: SCREEN_WIDTH*0.03, 
    backgroundColor: '#93eafe',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,

  },
  title_text: {
    fontWeight: 'bold',
    fontSize: 12,
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 5
  },
  vote_text: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#666666'
  },
  description_container: {
    flex: 0.43,
    //backgroundColor: 'yellow'
  },
  description_text: {
    fontStyle: 'italic',
    fontSize: 11,
    color: '#666666'
  },
  date_container: {
    flex: 0.3,
    //backgroundColor: 'brown'
  },
  date_text: {
    fontSize: 11,
    fontWeight: 'bold'
  },
  favorite_image: {
    width: 25,
    height: 25,
    marginRight: 5
  }
})

export default AppointmentItem