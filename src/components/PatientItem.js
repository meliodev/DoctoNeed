import React from 'react'
import { StyleSheet, View, Text, Image, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class PatientItem extends React.Component {


  render() {
    const { patient, displayPatientDetails, avatarURL } = this.props
    return (
      <View>
        <TouchableHighlight
          underlayColor="#93eafe"
          onPress={this.props.navigateToMedicalFolder}>

          <View style={styles.container}>
            <View style={{ flex: 0.37, paddingLeft: SCREEN_WIDTH * 0.04, borderBottomLeftRadius: 25, borderTopLeftRadius: 25 }}>
              <View style={styles.Avatar_box}>
                {patient.Avatar !== '' ?
                  <Image style={{ width: 75, height: 75, borderRadius: 37.5 }} source={{ uri: patient.Avatar }} />
                  :
                  <FontAwesome name="user" size={24} color="#93eafe" />
                }
              </View>
            </View>


            <View style={styles.content_container}>
              <View style={styles.header_container}>
                <Text style={styles.title_text}>{patient.nom} {patient.prenom}</Text>
              </View>
              <View style={styles.description_container}>
                <Text style={styles.description_text}>{patient.country}</Text>
              </View>
              <View style={styles.date_container}>
                <Text style={styles.date_text}>{patient.age} ans</Text>
                <MaterialCommunityIcons name={patient.Sexe === 'femme' ? 'gender-female' : 'gender-male'} color='#93eafe' size={21} style={{ marginLeft: 5 }} />
              </View>
            </View>

            <View style={styles.button_container}>
              <TouchableOpacity
                underlayColor="#93eafe"
                style={styles.button}
                onPress={this.props.navigateToMedicalFolder}>
                <Icon name="rightcircleo"
                  size={SCREEN_WIDTH * 0.055}
                  color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    //borderColor: 'green',
    //borderWidth: 1,
    height: 120,
    width: SCREEN_WIDTH * 0.95,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    flexDirection: 'row',
  },
  avatar_container: {
    flex: 0.3,
    paddingLeft: SCREEN_WIDTH * 0.04,
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
    //backgroundColor: 'green'
  },
  content_container: {
    flex: 0.5,
    margin: 5,
    paddingTop: 5,
    // backgroundColor: 'green'
  },
  header_container: {
    flex: 0.22,
    // backgroundColor: 'purple'
  },
  button_container: {
    flex: 0.2,
    //  backgroundColor: 'blue'
  },
  button: {
    height: SCREEN_HEIGHT * 0.05,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: SCREEN_WIDTH * 0.03,
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
  description_container: {
    flex: 0.43,
    // backgroundColor: 'yellow'
  },
  description_text: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#666666',
  },
  date_container: {
    flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center'
    //backgroundColor: 'brown'
  },
  date_text: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold'
  },
  Avatar_box: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 5,
    shadowColor: '#93eafe'
  },
})

export default PatientItem