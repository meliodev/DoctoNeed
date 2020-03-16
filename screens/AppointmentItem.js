import React from 'react'
import { StyleSheet, View, Text, TouchableHighlight, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT= Dimensions.get("window").height

class AppointmentItem extends React.Component {


  render() {
    const { appointment } = this.props
    return (

          <View style = {styles.main_container}>

            <View style={styles.dot_container}>
              <View style={styles.dot}>
              </View>
            </View>

            <View style={styles.date_container}>
              <Text style={styles.date_day}>07</Text>
              <Text style={styles.date_month}>Avril</Text>
            </View>

            <View style={styles.titles_container}>
              <Text style={styles.title_text}>Médecin</Text>
              <Text style={styles.title_text}>Spécialité</Text>
              <Text style={styles.title_text}>Durée</Text>
            </View>

            <View style={styles.data_container}>
              <Text style={styles.data_text}>Nom Prénom</Text>
              <Text style={styles.data_text}>Généraliste</Text>
              <Text style={styles.data_text}>30 minutes</Text>
            </View>

            <View style={styles.buttons_container}>
              <TouchableHighlight
                style={styles.button}
                onPress={() => displayDetailForDoctor(doctor.uid)}>
                  <View style= {styles.button_elements}>
                     <Text style={{fontSize: SCREEN_HEIGHT*0.014, color: 'white', marginRight: SCREEN_WIDTH*0.01}}>Voir les détails</Text>
                     <Icon name="rightcircleo" 
                           size={SCREEN_WIDTH*0.03} 
                           color="white"/>
                  </View>
                  
                </TouchableHighlight>
            </View>

          </View> 

    )
  }
}

const styles = StyleSheet.create({
  main_container: {
   // flex: 1,
   // backgroundColor: '#ffffff',
    /*borderRadius: 25,
    height: SCREEN_HEIGHT*0.12,
    width: SCREEN_WIDTH*0.95,
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 10,
    marginBottom: SCREEN_HEIGHT*0.03,*/
    //backgroundColor: 'green'
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    //borderColor: 'green',
    //borderWidth: 1,
    height: 120,
    width: SCREEN_WIDTH*0.95,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT*0.02,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 7,
    flexDirection: 'row',
    margin: 15,
    },
    
  dot_container: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'black'
  },
  dot: {
    width: SCREEN_WIDTH*0.02,
    height: SCREEN_WIDTH*0.02,
    borderRadius: 50,
    backgroundColor: '#93eafe'
  },
  date_container: {
    flex: 0.17,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'orange'
  },
  date_day: {
    color: '#93eafe',
    fontSize: SCREEN_HEIGHT*0.03,
    fontWeight: 'bold'
  },
  date_month: {
    color: '#93eafe',
    fontSize: SCREEN_HEIGHT*0.017,
    fontWeight: 'bold'
  },
  titles_container: {
    flex: 0.15,
    justifyContent: 'center',
    //backgroundColor: 'pink'
  },
  title_text: {
    fontStyle: 'italic',
    fontSize: SCREEN_HEIGHT*0.013,
  },
  data_container: {
    flex: 0.28,
    justifyContent: 'center',
    //backgroundColor: 'yellow'
  },
  data_text: {
    fontWeight: 'bold',
    fontSize: SCREEN_HEIGHT*0.013,
  },
  buttons_container: {
    flex: 0.3,
    justifyContent: 'center',
    //backgroundColor: 'brown'
  },
  button:{
    height: SCREEN_HEIGHT*0.04, 
    alignItems: 'flex-start', 
    justifyContent: 'center', 
    paddingLeft: SCREEN_WIDTH*0.03, 
    backgroundColor: '#93eafe',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  button_elements: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default AppointmentItem