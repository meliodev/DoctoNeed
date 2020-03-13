import React from "react";
import { SafeAreaView, Text, View, Switch, Slider, StyleSheet, Dimensions, TouchableHighlight, TouchableOpacity, Button } from "react-native";
import Icon1 from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

//import Slider from '@miblanchard/react-native-slider'

import CountryPicker, { getAllCountries, getCallingCode } from 'react-native-country-picker-modal';
import RNPickerSelect from 'react-native-picker-select';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class SideMenu extends React.Component {
  state = {
    toggle_option_one: false,
    country: '',
    urgences: true,
    speciality: '',
    price: 50,
  };

  callParentScreenFunction = () => this.props.callParentScreenFunction();
  filterCountry = () => this.props.filterCountry();


  componentDidMount() {
    //this.buildDoctorSchedule()
   // this._loadDoctors()
  }

  sendData = () => {
    let data = { country: this.state.country.toString(), urgences: this.state.urgences.toString(), speciality: this.state.speciality, price: this.state.price}
    console.log(typeof(data.urgences))
    this.props.parentCallback(data);
  }


  onSelect (country) {
    this.setState({ country: country.name }) 
    //console.log(country.name)
  }

  placeHolder = () => {
    return this.state.country ? <Text style={styles.pays1}> {this.state.country} </Text> : <Text style={styles.placeHolder}> Choisissez un pays </Text>
  }

  toggleUrgence = () => {
    this.setState({ urgences: !this.state.urgences })
  }

  render() {
    /*console.log(this.state.country)
    console.log(this.state.urgence)
    console.log(this.state.speciality)*/
   // console.log(this.state.price)
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.header_container}>
          <Text style={styles.header_text}>Trier par</Text>
          <TouchableHighlight style={styles.filter_button}
                onPress={this.toggleSideMenu}> 
                    <Icon1 name="filter" size={25} color="#93eafe" />
          </TouchableHighlight>   
        </View>

        <View style={styles.pays_container}>
           <Text style={styles.title_text}>Pays</Text>
             <CountryPicker 
                withFilter
                withEmoji
                withCountryNameButton
                withAlphaFilter
                placeholder = {this.placeHolder()}
                onSelect= {country => this.onSelect(country)}
         />   
        </View>

        <View style={styles.urgence_container1}> 
           <Text style={styles.title_text}>Urgences</Text>
        </View>

        <View style={styles.urgence_container2}> 
          <TouchableHighlight style={styles.urgence_button}
                onPress={this.toggleUrgence}> 
                { this.state.urgences ?  <View style= {{width: SCREEN_WIDTH * 0.02, height: SCREEN_WIDTH * 0.02, borderRadius: 25, backgroundColor: '#93eafe'}} /> 
                                     :  <View style= {{width: 0.005, height: 0.005, backgroundColor: 'white'}} /> } 
          </TouchableHighlight>     
          <Text style={styles.urgence_text}>Afficher les médecins gérant les urgences</Text>    
        </View> 

        <View style={styles.speciality_container}>
        <Text style={styles.title_text}>Spécialité</Text>
        <RNPickerSelect
        onValueChange={(speciality, itemIndex) => this.setState({ speciality: speciality }) }
        style={pickerSelectStyles} 
        useNativeAndroidPickerStyle={false}
        items={[
            { label: 'Ophtalmologue', value: 'Ophtalmologue' },
            { label: 'Médecin généraliste', value: 'Médecin généraliste' },
            { label: 'Psychologue', value: 'Psychologue' },
            { label: 'Cardiologue', value: 'Cardiologue' },
            { label: 'Rhumatologue', value: 'Rhumatologue' },
            { label: 'Neurologue', value: 'Neurologue' },
            { label: 'Gynécologue', value: 'Gynécologue' }  
        ]}
        placeholder= {{
          label: 'Choisissez une spécialité',
          value: 'Choisissez une spécialité'
        }}
        />
        </View>

        <View style={styles.price_container}>
        <Text style={styles.title_text}>Tarifs</Text>
            <Slider 
              value={this.state.price}
              onValueChange={value => this.setState({ price: value })}
              minimumValue= {0}
              maximumValue= {50}
              step= {5}
              minimumTrackTintColor= '#93eafe'
              thumbTintColor= '#93eafe'
              style= {styles.slider}
            />
            <Text style={styles.title_text}>Maximum: {this.state.price} €</Text>
        </View>

        <View style={styles.buttons_container}>
        <TouchableOpacity onPress={this.skip} style= {styles.CancelButton}>
          <Text style={styles.buttonText1}>Annuler</Text> 
          </TouchableOpacity>

          <TouchableOpacity
                onPress={this.sendData}>         
                <LinearGradient 
                  start={{x: 0, y: 0}} 
                  end={{x: 1, y: 0}} 
                  colors={['#b3f3fd', '#84e2f4', '#5fe0fe']} 
                  style={styles.linearGradient}>
                  <Text style={styles.buttonText2}>Appliquer</Text>
                </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const Title = ({ title }) => {
  return <Text style={styles.title}>{title}</Text>;
};

const SwitchText = ({ text }) => {
  return <Text style={styles.switchText}>{text}</Text>;
};

const Description = ({ text }) => {
  return <Text style={styles.description}>{text}</Text>;
};

const styles = StyleSheet.create({
    safeAreaView: {
      flex: 1,
      height: SCREEN_HEIGHT,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      backgroundColor: "white"
    },
    header_container: {
     flex: 0.1,
     flexDirection: 'row',
     justifyContent: 'space-between',
     paddingLeft: SCREEN_WIDTH*0.13,
     paddingRight: SCREEN_WIDTH*0.03,
     alignItems: 'center',
     //backgroundColor: 'green'
    },
    header_text: {
     color: '#7c807f',
     fontWeight: 'bold',
     fontSize: 17,
     textDecorationLine: "underline",
    
    },
    filter_button: {
      width: SCREEN_WIDTH * 0.12,
      height: SCREEN_WIDTH * 0.12,
      borderRadius: 25,
      backgroundColor: '#ffffff',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.32,
      shadowRadius: 5.46,
      elevation: 9,    
      justifyContent: 'center',
      alignItems: 'center'
  },
    pays_container: {
      flex: 0.15,
      paddingLeft: SCREEN_WIDTH*0.1,
      //backgroundColor: 'blue'
    },
    title_text: {
      marginTop: SCREEN_HEIGHT*0.02,
      fontSize: 17,
      //fontWeight: "bold"
    },
    urgence_container1: {
      flex: 0.075,
      paddingLeft: SCREEN_WIDTH*0.1,
     // backgroundColor: 'yellow'
    },
    urgence_container2: {
      flex: 0.075,
      flexDirection: 'row',
      paddingLeft: SCREEN_WIDTH*0.1,
      paddingRight: SCREEN_WIDTH*0.1,
      alignItems: 'center',
      justifyContent: 'space-between',
     // backgroundColor: 'blue'
    },
    
    urgence_button: {
      width: SCREEN_WIDTH * 0.07,
      height: SCREEN_WIDTH * 0.07,
      borderRadius: 25,
      backgroundColor: '#ffffff',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.32,
      shadowRadius: 5.46,
     // marginTop: SCREEN_WIDTH*0.05,
      elevation: 9,    
      justifyContent: 'center',
      alignItems: 'center'
  },
  urgence_text: {
      fontSize: 10,
      fontFamily: 'bold',
      marginLeft: SCREEN_WIDTH*0.05,
      color: 'gray'
  },
    speciality_container: {
      flex: 0.15,
      paddingLeft: SCREEN_WIDTH*0.1,
      //backgroundColor: 'brown'
    },
    price_container: {
      flex: 0.2,
      paddingLeft: SCREEN_WIDTH*0.1,
     // backgroundColor: 'purple'
    },
    slider: {
       marginTop: SCREEN_HEIGHT*0.07,
       //marginRight: SCREEN_HEIGHT*0.07
    },
    buttons_container: {
      flex: 0.25,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: 'orange'
    },
    CancelButton: {
      textAlignVertical: 'top',
      textAlign: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 30,
      paddingBottom: SCREEN_HEIGHT*0.005,
      paddingTop:SCREEN_HEIGHT*0.005,
      marginRight: SCREEN_WIDTH*0.05,
      width: SCREEN_WIDTH * 0.25,
      height: SCREEN_HEIGHT*0.06 ,
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
      paddingTop: SCREEN_HEIGHT*0.005,
      paddingBottom: SCREEN_HEIGHT*0.005,
      borderRadius: 30,
      width: SCREEN_WIDTH * 0.25,
      height: SCREEN_HEIGHT*0.06,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.32,
      shadowRadius: 5.46,
      elevation: 5,
    },
    buttonText1: {
      fontSize: SCREEN_HEIGHT * 0.016,
      fontFamily: 'Avenir',
      fontWeight: 'bold',
      textAlign: 'center',
      margin: SCREEN_HEIGHT * 0.012,
      color: 'black',
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

  });

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      textAlignVertical: 'top',
      textAlign: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 50,
      padding: SCREEN_WIDTH*0.03,
      width: SCREEN_WIDTH * 0.5,
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
      paddingTop: SCREEN_WIDTH*0.05,
      paddingRight: SCREEN_WIDTH*0.07,
      width: SCREEN_WIDTH * 0.5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.32,
      shadowRadius: 5.46,
      elevation: 9,
      //margin: 15,
      marginTop: SCREEN_WIDTH*0.03,
      //marginBottom: 15,
      fontSize: 11,
      color: '#93eafe',
      //justifyContent: 'center',
     // alignItems: 'center'
    },
  });