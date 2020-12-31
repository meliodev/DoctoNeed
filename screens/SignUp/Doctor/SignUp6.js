import React from 'react'

import { View, Text, TextInput, Image, Dimensions, StyleSheet } from 'react-native'

import Button from '../../../components/Button';

import ValidationComponent from 'react-native-form-validator';

import { connect } from 'react-redux'
import { setReduxState } from '../../../functions/functions'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo;

class SignUp6 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      codeFinesse: '',
      errorMessage1: null,
    }
  }

  handleNext(type, value) {

    if (this.state.codeFinesse === '') {
      this.setState({ errorMessage1: 'Le champ "code finesse" est obligatoire' })
    }

    else {
      this.setState({ errorMessage1: null })
      setReduxState(type, value, this)
      this.props.navigation.navigate('PhoneAuth')
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
          <Image source={require('../../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
        </View>

        <View style={styles.header_container}>
          <Text style={styles.header}> Quel est votre code finesse ? </Text>
        </View>

        <View style={styles.form_container}>
          <TextInput style={styles.search_button} onChangeText={(text) => this.setState({ codeFinesse: text })} placeholder={'Votre code finesse'} value={this.state.codeFinesse} />
        </View>
        <View style={styles.error_container}>
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage1}
          </Text>
        </View>

        <View style={styles.button_container}>
          <Button text="Suivant" width={SCREEN_WIDTH * 0.65} onPress={() => this.handleNext('CODEFINESSE', this.state.codeFinesse)} />
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

export default connect(mapStateToProps)(SignUp6)

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