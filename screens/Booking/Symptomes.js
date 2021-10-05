
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, TouchableOpacity, ScrollView, Dimensions, Picker } from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { Container, Header, Content, ListItem, CheckBox, Body } from 'native-base';
import Modal from 'react-native-modal';

import firebase from 'react-native-firebase';
const db = firebase.firestore()
import * as REFS from '../../DB/CollectionsRefs'

import Button from '../../components/Button'
import Loading from '../../components/Loading'

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

const symptomsList = ['Angoisse', 'Diarrhée', 'Douleur au thorax', 'Douleur dans le cou', 'Fièvre', 'Frissons', 'Mal au ventre']

export default class Symptomes extends React.Component {
  constructor(props) {
    super(props)
    this.doctorId = this.props.navigation.getParam('doctorId', '')
    this.date = this.props.navigation.getParam('date', 'nothing sent')
    this.isUrgence = this.props.navigation.getParam('isUrgence', false)
    this.speciality = this.props.navigation.getParam('speciality', '')

    this.isEditing = this.props.navigation.getParam('isEditing', false)
    this.appId = this.props.navigation.getParam('appId', '')

    this.fetchData = this.fetchData.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.addSymptom = this.addSymptom.bind(this)
    this.removeSymptom = this.removeSymptom.bind(this)
    this.onConfirmClick = this.onConfirmClick.bind(this)
    this.skip = this.skip.bind(this)

    this.state = {
      isModalVisible: false,
      symptomes: [],
      otherSymptomes: '',
      comment: '',

      symptomsList: [
        { label: 'Angoisse', value: false },
        { label: 'Diarrhée', value: false },
        { label: 'Douleur au thorax', value: false },
        { label: 'Fièvre', value: false },
        { label: 'Frissons', value: false },
        { label: 'Douleur dans le cou', value: false },
        { label: 'Mal au ventre', value: false }
      ],

      isLoading: false,
    }
  }

  async componentDidMount() {
    if (this.isEditing)
      await this.fetchData()
  }

  async fetchData() {
    await REFS.appointments.doc(this.appId).get().then((doc) => {
      const appointment = doc.data()
      var { symptomes, otherSymptomes, comment } = appointment
      console.log('0', doc.id)

      if (symptomes) {
        const { symptomsList } = this.state

        symptomsList.forEach((symp_state) => {
          symptomes.forEach((symp_db) => {
            if (symp_db === symp_state.label)
              symp_state.value = true
          })
        })

        this.setState({ symptomsList })
      }

      if (otherSymptomes) {
        this.setState({ otherSymptomes })
      }

      if (comment) {
        this.setState({ comment })
      }
    })
  }

  async onConfirmClick() {
    this.setState({ isLoading: true })
    const { symptomsList, otherSymptomes, comment } = this.state

    let symptomes = []

    symptomsList.forEach(symp => {
      if (symp.value)
        symptomes.push(symp.label)
    })

    if (!this.isEditing) {
      this.setState({ isLoading: false })
      this.props.navigation.navigate('Upload', {
        doctorId: this.doctorId,
        date: this.date,
        isUrgence: this.isUrgence,
        speciality: this.speciality, //URGENCE2
        symptomes: symptomes,
        otherSymptomes: otherSymptomes,
        comment: comment,
      })
    }

    else {
      await REFS.appointments.doc(this.appId).update({ symptomes, otherSymptomes, comment, updatedBy: firebase.auth().currentUser.uid })
      this.setState({ isLoading: false })
      this.props.navigation.goBack()
    }
  }

  skip() {
    this.props.navigation.navigate('Upload', {
      doctorId: this.doctorId,
      date: this.date,
      symptomes: [],
      otherSymptomes: '',
      comment: '',
      isUrgence: this.isUrgence,
      speciality: this.speciality
    })
  }

  toggleModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible })
  }

  addSymptom(symp, key) {
    let { symptomsList } = this.state
    symptomsList[key].value = !symptomsList[key].value
    this.setState({ symptomsList })
  }

  removeSymptom(key) {
    let { symptomsList } = this.state
    symptomsList[key].value = false
    this.setState({ symptomsList })
  }

  render() {
    const { symptomsList, otherSymptomes, isLoading } = this.state

    console.log('symptomsList', symptomsList)
    console.log('otherSymptomes', otherSymptomes)

    return (
      <View style={{ flex: 1 }}>
        {isLoading ?
          <Loading />
          :
          <ScrollView contentContainerStyle={styles.container}>
            {this.isEditing ?
              <View style={styles.bar_progression} />
              :
              <View style={styles.bar_progression}>
                <View style={[styles.bar, styles.activeBar]} />
                <View style={[styles.bar, styles.activeBar]} />
                <View style={styles.bar} />
              </View>
            }

            <View style={styles.header_container}>
              <Text style={styles.header}>Que ressentez-vous ?</Text>
            </View>

            <View style={styles.symptomsButton_container}>
              <TouchableHighlight style={styles.symptomsButton} onPress={this.toggleModal}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: 'gray' }}>Sélectionnez vos symptômes</Text>
                  <Icon1 name="diagnoses"
                    size={SCREEN_WIDTH * 0.04}
                    color="#BDB7AD" />
                </View>
              </TouchableHighlight>
            </View>

            <View style={styles.symptomesList_container}>
              <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
                {symptomsList.map((symp, key) => {
                  return (
                    <View>
                      {symp.value &&
                        <View style={styles.symptom}>
                          <Text>{symp.label}</Text>
                          <Icon name="remove" size={SCREEN_WIDTH * 0.04} color="#93eafe" style={{ position: "absolute", right: SCREEN_WIDTH * 0.05, padding: 5 }}
                            onPress={() => this.removeSymptom(key)} />
                        </View>
                      }
                    </View>
                  )
                })}

                {otherSymptomes !== "" &&
                  <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
                    <Text style={{ fontSize: 12 }}>Autres symptômes:</Text>
                    <Text>{otherSymptomes}</Text>
                  </View>
                }
              </ScrollView>
            </View>

            <Modal
              isVisible={this.state.isModalVisible}
              animationIn="slideInLeft"
              animationOut="slideOutLeft"
              style={{ backgroundColor: '#fff' }}>

              <Container>
                <ScrollView >
                  <Content style={{ flex: 0.85, marginHorizontal: SCREEN_WIDTH * 0.03 }}>
                    <View style={{ paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: '#93eafe' }}>
                      <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Liste des symptômes</Text>
                    </View>
                    {symptomsList.map((symp, key) => {
                      return (
                        <ListItem>
                          <CheckBox
                            color="#93eafe"
                            style={{ borderColor: '#93eafe' }}
                            checked={symptomsList[key].value}
                            onPress={() => this.addSymptom(symp, key)}
                            checkboxTickColor='#93eafe' />
                          <Body style={{ marginLeft: SCREEN_WIDTH * 0.03 }}>
                            <Text>{symp.label}</Text>
                          </Body>
                        </ListItem>
                      )
                    })}

                    <View style={[styles.comment_container, { paddingVertical: 10 }]}>
                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder="Autres symptômes..."
                        placeholderTextColor="grey"
                        numberOfLines={7}
                        multiline={true}
                        autoCapitalize
                        onChangeText={(otherSymptomes) => this.setState({ otherSymptomes })}
                        value={otherSymptomes}
                        style={styles.comment} />
                    </View>

                  </Content>

                  <View style={{ flex: 0.15, alignItems: 'center', paddingVertical: 10 }}>
                    <Button width={SCREEN_WIDTH * 0.5} text="confirmer" onPress={this.toggleModal} />
                  </View>

                </ScrollView>
              </Container>
            </Modal>

            <View style={styles.header_container}>
              <Text style={styles.header}>Ajoutez un commentaire utile:</Text>
            </View>

            <View style={styles.comment_container}>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="Commentaire..."
                placeholderTextColor="grey"
                numberOfLines={7}
                multiline={true}
                autoCapitalize
                onChangeText={(comment) => this.setState({ comment })}
                value={this.state.comment}
                style={styles.comment} />
            </View>

            <View style={styles.button_container}>
              {!this.isEditing &&
                <TouchableOpacity onPress={this.skip} style={styles.skipButton}>
                  <Text style={styles.buttonText1}>Passer cette étape</Text>
                </TouchableOpacity>}

              <TouchableOpacity onPress={this.onConfirmClick}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
                  style={styles.linearGradient}>
                  <Text style={styles.buttonText2}>Confirmer</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </ScrollView>
        }
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // alignItems: 'center',
    alignSelf: 'stretch',
    width: null,
    height: null,
    backgroundColor: 'white'
  },
  bar_progression: {
    flex: 0.025,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    //backgroundColor: 'purple',
  },
  header_container: {
    flex: 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'green',
  },
  symptomsButton_container: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'pink'
  },
  symptomesList_container: {
    flex: 0.365,
    //backgroundColor: 'blue',
    paddingTop: SCREEN_HEIGHT * 0.01,
    paddingBottom: SCREEN_HEIGHT * 0.01
  },
  comment_container: {
    flex: 0.25,
    alignSelf: 'center',
    //backgroundColor: 'yellow',
    width: SCREEN_WIDTH * 0.78,
  },
  button_container: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'orange',
    width: SCREEN_WIDTH
  },
  bar: {
    height: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH / 3.2,
    marginLeft: SCREEN_WIDTH * 0.015,
    marginRight: SCREEN_WIDTH * 0.015,
    borderRadius: 20,
    backgroundColor: '#cdd6d5'
  },
  activeBar: {
    backgroundColor: '#48d8fb',
  },
  header: {
    fontSize: SCREEN_HEIGHT * 0.025,
    fontWeight: 'bold',
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'black',
    marginBottom: SCREEN_HEIGHT * 0.01
  },
  symptomsButton: {
    textAlignVertical: 'top',
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: SCREEN_WIDTH * 0.03,
    width: SCREEN_WIDTH * 0.7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  symptom: {
    flexDirection: 'row',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: 'center',
    paddingLeft: SCREEN_WIDTH * 0.05,
    marginBottom: StyleSheet.hairlineWidth * 3,
    borderLeftWidth: 5,
    borderLeftColor: '#93eafe',
    backgroundColor: '#ffffff'
  },
  comment: {
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.78,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
  },
  skipButton: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingBottom: SCREEN_HEIGHT * 0.005,
    paddingTop: SCREEN_HEIGHT * 0.005,
    marginRight: SCREEN_WIDTH * 0.05,
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_HEIGHT * 0.06,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  linearGradient: {
    paddingTop: SCREEN_HEIGHT * 0.005,
    paddingBottom: SCREEN_HEIGHT * 0.005,
    borderRadius: 30,
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_HEIGHT * 0.06,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText1: {
    fontSize: SCREEN_HEIGHT * 0.016,
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    color: 'gray',
    backgroundColor: 'transparent',
  },
  buttonText2: {
    fontSize: SCREEN_HEIGHT * 0.02,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },

})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: SCREEN_WIDTH * 0.03,
    width: SCREEN_WIDTH * 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    //margin: 15,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  inputAndroid: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: SCREEN_WIDTH * 0.03,
    width: SCREEN_WIDTH * 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    //margin: 15,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
  },
});



