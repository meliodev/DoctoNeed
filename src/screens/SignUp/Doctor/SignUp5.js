import React from 'react'

import { View, Text, TextInput, Image, Dimensions, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

import Button from '../../../components/Button';
import RNPickerSelect from 'react-native-picker-select';

import ValidationComponent from 'react-native-form-validator';

import { connect } from 'react-redux'
import { setReduxState } from '../../../functions/functions'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 1;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo;

class SignUp5 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      speciality: '',
      errorMessage1: null,
    }
  }

  handleNext(type, value) {

    if (this.state.speciality === '') {
      this.setState({ errorMessage1: 'Le champ "spécialité" est obligatoire' })
    }

    else {
      this.setState({ errorMessage1: null })
      setReduxState(type, value, this)
      this.props.navigation.navigate('SignUp6')
    }
  }

  render() {

    return (
      <View style={styles.container}>

        <View style={styles.bar_progression}>
          <View style={[styles.bar_D, styles.activeBar]} />
          <View style={[styles.bar_D, styles.activeBar]} />
          <View style={[styles.bar_D, styles.activeBar]} />
          <View style={[styles.bar_D, styles.activeBar]} />
          <View style={[styles.bar_D, styles.activeBar]} />
          <View style={styles.bar_D} />
          <View style={styles.bar_D} />
          <View style={styles.bar_D} />
        </View>

        <View style={styles.logo_container}>
          <Image source={require('../../../assets/logo-1000-1000.png')} style={styles.logoIcon} />
        </View>

        <View style={styles.header_container}>
          <Text style={styles.header}> Quelle est votre spécialité ? </Text>
        </View>

        <View style={styles.form_container}>
          <RNPickerSelect
            onValueChange={(speciality) => this.setState({ speciality })}
            value={this.state.speciality}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            items={[
              { label: 'Médecin généraliste', value: 'Médecin généraliste' },
              { label: 'Pédiatre', value: 'Pédiatre' },
              { label: 'Ophtalmologue', value: 'Ophtalmologue' },
              { label: 'Psychologue', value: 'Psychologue' },
              { label: 'Rhumatologue', value: 'Rhumatologue' },
            ]}
            placeholder={{
              label: 'Choisissez une spécialité',
              value: ''
            }}
          />
        </View>
        <View style={styles.error_container}>
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage1}
          </Text>
        </View>

        <View style={styles.button_container}>
          <Button text="Suivant" width={SCREEN_WIDTH * 0.65} onPress={() => this.handleNext('SPECIALITY', this.state.speciality)} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    signupData: state.signup
  }
}

export default connect(mapStateToProps)(SignUp5)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  bar_progression: {
    flex: 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    //backgroundColor: 'purple',
  },
  bar_D: {
    height: SCREEN_HEIGHT * 0.007,
    width: SCREEN_WIDTH / 8.4,
    // marginLeft: SCREEN_WIDTH * 0.015,
    borderRadius: 20,
    backgroundColor: '#cdd6d5'
  },
  activeBar: {
    backgroundColor: '#48d8fb',
  },
  logo_container: {
    flex: 0.2,
    //justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'red',
  },
  logoIcon: {
    height: SCREEN_WIDTH * 0.2,
    width: LOGO_WIDTH,
    marginTop: SCREEN_WIDTH * 0.05
  },
  header_container: {
    flex: 0.12,
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
    //backgroundColor: 'yellow',
    marginBottom: SCREEN_HEIGHT * 0.01
  },
  form_container: {
    flex: 0.28,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //backgroundColor: 'brown',
  },
  error_container: {
    flex: 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  search_button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 15,
    paddingLeft: SCREEN_WIDTH * 0.1,
    width: SCREEN_WIDTH * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
  },
  searchText: {
    color: '#b2bbbc',
    marginLeft: SCREEN_WIDTH * 0.03
  },
  button_container: {
    flex: 0.28,
    justifyContent: 'flex-start',
    alignItems: 'center',
    //backgroundColor: 'yellow',
    paddingBottom: SCREEN_HEIGHT * 0.01
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: SCREEN_WIDTH * 0.03,
    width: SCREEN_WIDTH * 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 11,
  },
  inputAndroid: {
    textAlignVertical: 'top',
    paddingLeft: SCREEN_WIDTH * 0.06,
    textAlign: 'left',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    paddingTop: SCREEN_WIDTH * 0.05,
    paddingRight: SCREEN_WIDTH * 0.07,
    width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.065,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    marginTop: SCREEN_WIDTH * 0.03,
    fontSize: 11,
    color: '#333',
  },
});