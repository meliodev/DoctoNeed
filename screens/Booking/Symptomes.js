
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Button,
  Picker
} from 'react-native';
//import { Actions } from 'react-native-router-flux';
import Swiper from 'react-native-swiper';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

export default class Symptomes extends React.Component {
  constructor(props) {
    super(props);
    this.doctor = this.props.navigation.getParam('doctor', 'nothing sent')
    this.fullDate = this.props.navigation.getParam('fullDate', 'nothing sent')
    this.daySelected = this.props.navigation.getParam('daySelected', 'nothing sent')
    this.monthSelected = this.props.navigation.getParam('monthSelected', 'nothing sent')
    this.yearSelected = this.props.navigation.getParam('yearSelected', 'nothing sent')
    this.timeSelected = this.props.navigation.getParam('timeSelected', 'nothing sent')

    this.state = {
      comment: '',
      pickers: [],
      symptomes: [],
      //symptomeTest: ''
    }

    this.onConfirmClick = this.onConfirmClick.bind(this);
    this.skip = this.skip.bind(this);

  }

  componentDidMount() {
    this.addPicker(0)
  }

  addPicker = (key) => {

    let pickers = this.state.pickers;
    let symptomes = this.state.symptomes;
    let component = null

    component =
      <RNPickerSelect
        key={key}
        onValueChange={(symp, itemIndex) => {
          symptomes.push(symp)
          this.setState({ symptomes }, this.changePickersForm(key))
        }}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        items={[
          { label: 'Angoisse, stress très important', value: 'Angoisse, stress très important' },
          { label: 'Diarrhée', value: 'Diarrhée' },
          { label: 'Douleur au thorax', value: 'Douleur au thorax' },
          { label: 'Douleur dans le cou', value: 'Douleur dans le cou' },
          { label: 'Fièvre', value: 'Fièvre' },
          { label: 'Frissons', value: 'Frissons' },
          { label: 'Mal au ventre', value: 'Mal au ventre' }
        ]}
        placeholder={{
          label: 'Selectionner un symptôme',
          value: 'Selectionner un symptôme'
        }}
      />

    pickers.push(component)

    this.setState({ pickers })

  }

  changePickersForm(key) {
    let pickers = this.state.pickers
    let symptomes = this.state.symptomes

    let component =
      <View style={styles.symptomView}>
        <Text> {this.state.symptomes[key]} </Text>
        <Icon name="close"
          size={SCREEN_WIDTH * 0.05}
          color="#93eafe"
          onPress={() => {
            pickers.splice(key, 1)
            this.setState({ pickers })
            symptomes.splice(key, 1)
            this.setState({ symptomes })
          }} />
      </View>

    pickers.splice(key, 1, component)
    this.setState({ pickers })
  }

  onConfirmClick() {
    /* Actions.upload({
     symptomes: 'this.state.symptomes',
     comment: 'this.state.comment'
     });*/
    this.props.navigation.navigate('Upload', {
      doctor: this.doctor, fullDate: this.fullDate, daySelected: this.daySelected,
      monthSelected: this.monthSelected, yearSelected: this.yearSelected,
      timeSelected: this.timeSelected, symptomes: this.state.symptomes,
      comment: this.state.comment
    })
  }

  skip() {
    this.props.navigation.navigate('Upload')
  }

  render() {
    //console.log(this.state.pickers)
    return (
      <View style={styles.container}>
        <View style={styles.bar_progression}>
          <View style={[styles.bar, styles.activeBar]} />
          <View style={[styles.bar, styles.activeBar]} />
          <View style={styles.bar} />
        </View>

        <View style={styles.header_container}>
          <Text style={styles.header}> Que ressentez-vous ? </Text>
        </View>

        <View style={styles.symptomes_container}>
          <ScrollView style={styles.symptoms_list}>
            {this.state.pickers.map((value, index) => {
              return value
            })}
            <TouchableHighlight onPress={() => this.addPicker(this.state.pickers.length)} style={styles.buttonPlus}>
              <Text style={{ color: '#93eafe', fontSize: SCREEN_WIDTH * 0.04 }}> + </Text>
            </TouchableHighlight>
          </ScrollView>

          {/* <View style={styles.buttonPlus_container}>
             
            </View> */}

        </View>

        <View style={styles.header_container}>
          <Text style={styles.header}> Ajouter un commentaire utile : </Text>
        </View>

        <View style={styles.comment_container}>
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Commentaire..."
            placeholderTextColor="grey"
            numberOfLines={7}
            multiline={true}
            onChangeText={(comment) => this.setState({ comment })}
            value={this.state.text}
            style={styles.comment} />
        </View>

        <View style={styles.button_container}>
          <TouchableOpacity onPress={this.skip} style={styles.skipButton}>
            <Text style={styles.buttonText1}>Passer cette étape</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.onConfirmClick}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
              style={styles.linearGradient}>
              <Text style={styles.buttonText2}>Confirmer</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: null,
    height: null,
    backgroundColor: 'white'
  },
  bar_progression: {
    flex: 0.05,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    //backgroundColor: 'purple',
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
  header_container: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'green',
  },
  header: {
    fontSize: SCREEN_HEIGHT * 0.025,
    fontWeight: 'bold',
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'black',
    //backgroundColor: 'green',
    marginBottom: SCREEN_HEIGHT * 0.01
  },
  symptomes_container: {
    flex: 0.3,
    //flexDirection: 'row',
    //backgroundColor: 'green',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: SCREEN_WIDTH * 0.65,
    //padding: SCREEN_WIDTH*0.05
  },
  symptoms_list: {
    paddingLeft: SCREEN_WIDTH * 0.02,
    paddingRight: SCREEN_WIDTH * 0.02,
    //backgroundColor: 'blue'
  },
  pickers: {
    //backgroundColor: 'green',
    borderRadius: 25,
    padding: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
  },
  symptomView: {
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
    elevation: 5,
    //margin: 15,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonPlus_container: {
    flex: 0.3,
    justifyContent: 'center'
  },
  buttonPlus: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  comment_container: {
    flex: 0.3,
    //flexDirection: 'row',
    //backgroundColor: 'yellow',
    // justifyContent: 'center',
    width: SCREEN_WIDTH * 0.78,
  },
  comment: {
    //backgroundColor: 'green',
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.78,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  button_container: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'orange',
    width: SCREEN_WIDTH
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
    elevation: 5,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  linearGradient: {
    paddingTop: SCREEN_HEIGHT * 0.005,
    paddingBottom: SCREEN_HEIGHT * 0.005,
    borderRadius: 30,
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.06,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 5,
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
    fontSize: SCREEN_HEIGHT * 0.017,
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
    elevation: 9,
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
    elevation: 9,
    //margin: 15,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
  },
});


