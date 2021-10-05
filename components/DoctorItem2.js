import React from 'react'
import { StyleSheet, View, Text, Image, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class DoctorItem2 extends React.Component {


  render() {
    const { doctor } = this.props
    console.log(doctor.avatarURL)
    return (
      <View style={[styles.main_container, { width: SCREEN_WIDTH * 0.92 }]}>

        {/* <View style={{ flex: 0.37, paddingLeft: SCREEN_WIDTH * 0.04, borderBottomLeftRadius: 25, borderTopLeftRadius: 25, }}>
          <TouchableHighlight style={styles.imageFrame}>
            <Image
              style={styles.image}
              source={require('../assets/profile.jpg')} />
          </TouchableHighlight>
        </View> */}

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
            <Text style={styles.title_text}>{doctor.name}</Text>
          </View>
          <View style={styles.description_container}>
            <Text style={styles.description_text}>{doctor.speciality}</Text>
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
    margin: 15,
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
    elevation: 3,
    shadowColor: '#93eafe'
  },
  avatar_container: {
    flex: 0.37,
    paddingLeft: SCREEN_WIDTH * 0.04,
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
    //backgroundColor: 'green'
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
  image: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 50,
    backgroundColor: 'black'
  },
  content_container: {
    flex: 0.43,
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

export default DoctorItem2