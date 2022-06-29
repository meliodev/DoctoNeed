import React from 'react'
import { StyleSheet, View, Text, Image, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class DoctorItem extends React.Component {

  formatTime(time) {
    const hours = time.split(':')[0]
    const minutes = time.split(':')[1]

    let formatedHour

    if (hours === '00') {
      return { formatedHour: minutes, unit: 'min' }
    }

    else {
      return { formatedHour: time.replace(':', 'h'), unit: '' }
    }
  }

  render() {
    const { doctor, displayDoctorDetails } = this.props
    const timeLeft = this.formatTime(doctor.timeLeft)

    console.log(doctor.timeLeft)

    return (
      <View>
        <TouchableHighlight
          underlayColor="#93eafe"
          onPress={() => displayDoctorDetails(doctor.uid)}>

          <View style={[styles.container, { width: this.props.itemWidth }]}>
            <View style={styles.avatar_container}>
              <View style={styles.Avatar_box}>
                {doctor.Avatar !== '' ?
                  <Image style={{ width: 75, height: 75, borderRadius: 37.5 }} source={{ uri: doctor.Avatar }} />
                  :
                  <FontAwesome name="user" size={24} color="#93eafe" />
                }
              </View>
            </View>

            <View style={styles.content_container}>
              <View style={styles.header_container}>
                <Text style={styles.title_text}>{doctor.prenom} {doctor.nom}</Text>
              </View>
              <View style={styles.description_container}>
                <Text style={styles.description_text}>{doctor.speciality}</Text>
                <Text style={[styles.description_text, {color: '#000'}]}>Prix: {doctor.regularPrice}€</Text>
              </View>


              <View style={styles.date_container}>
                {doctor.timeLeft !== 'Invalid date' && doctor.timeLeft !== '' ?
                  <Text style={[styles.date_text, { color: 'green' }]}>Disponible dans: {timeLeft.formatedHour} {timeLeft.unit}</Text>
                  :
                  <Text style={styles.date_text}>{doctor.status}</Text>
                }
              </View>
            </View>

            <View style={styles.button_container}>
              <TouchableOpacity
                underlayColor="#93eafe"
                style={styles.button}
                onPress={() => displayDoctorDetails(doctor.uid)}>
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
    height: 130,
    width: SCREEN_WIDTH * 0.75,
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
    paddingVertical: 10,
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
    //backgroundColor: 'yellow'
  },
  description_text: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#666666'
  },
  date_container: {
    flex: 0.3,
    justifyContent: 'center',
    //backgroundColor: 'brown'
  },
  date_text: {
    fontSize: 11,
    color: 'gray',
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

export default DoctorItem