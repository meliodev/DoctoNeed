//Presentation.js
//TEST

import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { AppRegistry,TouchableOpacity, View, Image, LayoutAnimation, Button, Text, TouchableHighlight, Dimensions, FlatList, Animated, StyleSheet } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import DeviceInfo from 'react-native-device-info';
import {timezones} from '../../../util/helpers/timezones'

import { withNavigation } from 'react-navigation';

import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Picker, CheckBox } from 'native-base';

import LeftSideMenu from '../../../components/LeftSideMenu'
import Icon1 from 'react-native-vector-icons/FontAwesome';

import Item from '../../../components/DispoItem'



const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioHeader = 267 / 666; // The actaul icon headet size is 254 * 668
const HEADER_ICON_HEIGHT = Dimensions.get("window").width * ratioHeader; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

export default class DispoConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      nom: "",
      prenom: "",
      speciality: "00-00-0000",
      age: "",
      isLeftSideMenuVisible: false,
      selectedtimezone: null,
    }
    // Dispo Item states
    this.state = { valueArray: [], disabled: false }
    this.addNewEle = false;
    this.index = 0;

        //Menu
        this.navigateToProfile = this.navigateToProfile.bind(this);
        this.navigateToDispoConfig = this.navigateToDispoConfig.bind(this);
        this.navigateToAppointments = this.navigateToAppointments.bind(this);
        this.navigateToMyPatients = this.navigateToMyPatients.bind(this);
        this.signOutUserandToggle = this.signOutUserandToggle.bind(this);
        
  }


  // DispoItem Functions 

  afterAnimationComplete = () => {
    this.index += 1;
    this.setState({ disabled: false });
  }

  addMore = () => {
    this.addNewEle = true;
    const newlyAddedValue = { id: "id_" + this.index, text: this.index + 1 };

    this.setState({
      disabled: true,
      valueArray: [...this.state.valueArray, newlyAddedValue]
    });
  }

  remove(id) {
    this.addNewEle = false;
    const newArray = [...this.state.valueArray];
    newArray.splice(newArray.findIndex(ele => ele.id === id), 1);

    this.setState(() => {
      return {
        valueArray: newArray
      }
    }, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    });
  }
/*
  componentWillMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    firebase.firestore().collection("Doctors").doc(currentUser.uid).get().then(doc => {
      this.setState({ nom: doc.data().nom, prenom: doc.data().prenom })
      this.setState({ speciality: doc.data().speciality })
    })
  }
*/



  //LeftSideMenu functions
  toggleLeftSideMenu = () => {
    this.month = ''
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible, appId: null });
  }

  navigateToProfile() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('Profile'));
  }

  navigateToDispoConfig() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('DispoConfig'));
  }

  navigateToAppointments() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('TabScreenDoctor'));
  }

  navigateToMyPatients() {
    console.log('pressed')
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate('MyPatients'));
  }


  signOutUserandToggle() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      this.signOutUser())
  }


  componentDidMount() {
    this.UserAuthStatus()
  }

  UserAuthStatus = () => {
    firebase
      .auth()
      .onAuthStateChanged(user => {
        if (user) {
          this.setState({ isUser: true })
        } else {
          this.setState({ isUser: false })
        }
      })
  };

  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      this.props.navigation.navigate('LandingScreen');
    } catch (e) {
      console.log(e);
    }
  }
  state = {days: ''}
  updateDays = (days) => {
     this.setState({ days: days })
  }
  render() {
    const placeholder = {
      label: 'Selectionnez votre fuseau horaire',
      value: null,
      color: '#B5B8B9',
    };
    const pickerStyle = {
      borderWidth:1
    }

   /* let timezones = require('../../../util/helpers/timezones.json')
    var date = new Date();
    var offsetInHours = date.toUTCString();*/

    //console.log(DeviceInfo.getTimezone()); 
    console.log(timezones)

    // const currentUser= firebase.auth().currentUser.
    console.log(this.state.nom)
    console.log(this.state.prenom)
    console.log(this.state.speciality)
    return (
      <View style={styles.container}>

        <View style={styles.header_container}>
          <Image source={require('../../../assets/header-image.png')} style={styles.headerIcon} />
        </View>


        <LeftSideMenu
          isSideMenuVisible={this.state.isLeftSideMenuVisible}
          toggleSideMenu={this.toggleLeftSideMenu}
          nom={this.state.nom}
          prenom={this.state.prenom}
          email={this.state.email}
          navigateToProfile={this.navigateToProfile}
          navigateToDispoConfig={this.navigateToDispoConfig}
          navigateToAppointments={this.navigateToAppointments}
          navigateToMyPatients={this.navigateToMyPatients}
          signOutUser={this.signOutUserandToggle}
          navigate={this.props.navigation} />

<View style={{ height: SCREEN_HEIGHT * 0.01, flexDirection: 'row', paddingTop: SCREEN_HEIGHT * 0.00, justifyContent: 'space-between', alignItems: 'flex-start',position:'relative', bottom:80,
         }}>


          <TouchableHighlight 
          style={{ 
                  width: SCREEN_WIDTH * 0.12,
                  height: SCREEN_WIDTH * 0.12,
                  borderRadius: 25,
                  backgroundColor: '#ffffff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  left: SCREEN_WIDTH * 0.05
                }}

            onPress={this.toggleLeftSideMenu}>
            <Icon1 name="bars" size={25} color="#93eafe" />
          </TouchableHighlight>

         
         </View>

        <View style={styles.metadata_container}>
          <View style={styles.Avatar_box}>
            <Icon name="user"
              size={SCREEN_WIDTH * 0.06}
              color="#93eafe" />
          </View>
          <View style={styles.metadata_box}>
            <Text style={styles.metadata_text1}>NOM{this.state.nom} Prénom{this.state.prenom}</Text>
            <Text style={styles.metadata_text2}>Généraliste</Text>
          </View>
        </View>

        <ScrollView style={styles.dispos_container}>
          <View style={{width:SCREEN_WIDTH * 0.42,borderBottomWidth:3,borderBottomColor:'#83E7FE',marginHorizontal: SCREEN_WIDTH*0.02,paddingVertical: SCREEN_HEIGHT*0}}>
            <Text style={{fontSize:SCREEN_WIDTH* 0.05,textAlign:'center'}}>Mes disponibilités</Text>
            </View>
          <Text style={{paddingHorizontal: SCREEN_WIDTH*0.02,paddingVertical: SCREEN_HEIGHT*0.01,fontSize:SCREEN_WIDTH* 0.04}} > Fuseau Horaire </Text>

          <View style={{borderRadius: 30, borderWidth: 0, borderColor: '#bdc3c7', overflow: 'hidden', marginVertical:SCREEN_HEIGHT * 0.015, 
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',marginHorizontal:SCREEN_WIDTH * 0.02}}>

          <Picker  mode="dropdown" selectedValue={this.state.selectedtimezone} onValueChange={ (value) => ( this.setState({selectedtimezone : value}) )} style={{ 
            flex: 1,
            color: '#445870' ,
            marginHorizontal:SCREEN_WIDTH * 0.01,
            width:SCREEN_WIDTH * 0.85
            }}>
            {
                 timezones.map((items)=>{
                   return(
                   <Picker.Item  label={items.label} value={items.value} />
                   );
                 })
               }
          </Picker>
          </View>
          <View style={{flexDirection:'row', flexWrap:'wrap',paddingVertical:SCREEN_HEIGHT*0.02}}>
          <CheckBox center style={{borderRadius:10}} title='check box' checked={this.state.checked} onPress={() => this.setState({checked: !this.state.checked})}/>
          <Text style={{paddingHorizontal:SCREEN_WIDTH * 0.05}}> Accepter les urgences</Text>
          </View>
          <Text style={{paddingHorizontal: SCREEN_WIDTH*0.08,paddingVertical: SCREEN_HEIGHT*0.01,fontSize:SCREEN_WIDTH* 0.04}} > Horaires disponibles </Text>
          
          <View style={styles.container} >
        <ScrollView
          ref={scrollView => this.scrollView = scrollView}
          onContentSizeChange={() => {
            this.addNewEle && this.scrollView.scrollToEnd();
          }}
        >
          <View style={{ flex: 1, padding: 4 }}>
            {this.state.valueArray.map(ele => {
              return (
                <Item
                  key={ele.id}
                  item={ele}
                  removeItem={(id) => this.remove(id)}
                  afterAnimationComplete={this.afterAnimationComplete}
                />
              )
            })}
          </View>
        </ScrollView>

      </View>

{/* 

          <View style={{flexDirection:'row', flexWrap:'wrap'}}>
          <View style={{
            borderRadius: 30,
            borderWidth: 0,
            borderColor: '#bdc3c7',
            overflow: 'hidden', 
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            marginHorizontal:SCREEN_WIDTH * 0.02,marginVertical:0,paddingVertical:0,marginHorizontal:SCREEN_WIDTH * 0.02}}>
          <Picker  mode="dropdown" selectedValue={this.state.selected} style={{ flex: 1, color: '#445870' ,  width:SCREEN_WIDTH * 0.30 ,textAlign:"center" }}>
          <Picker.Item value='Lundi' label='Lundi'  />
          <Picker.Item value='Mardi' label='Mardi' />
          <Picker.Item value='Mercredi' label='Mercredi' />
          <Picker.Item value='Jeudi' label='Jeudi' />
          <Picker.Item value='Vendredi' label='Vendredi' />
          <Picker.Item value='Samedi' label='Samedi' />
          <Picker.Item value='Dimanche' label='Dimanche' />
          </Picker>
          </View>
          <Text style={{textAlignVertical:'center', paddingHorizontal:5}}>De</Text>
         {/* <TextInput  style={{ flex: 1,marginTop:10,height: 40, borderColor: '#000', borderWidth: 0 , width:SCREEN_WIDTH * 0.15 , borderRadius:30,textAlign:'center',            shadowColor: "#000",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.32,
                    shadowRadius: 5.46,
                    elevation: 9,
          backgroundColor:'#fff' }} placeholder={'8:00'}/> */}{/*
          <View  style={{ flex: 1,marginTop:10,height: 40, borderColor: '#000', borderWidth: 0 , width:SCREEN_WIDTH * 0.15 , borderRadius:30,textAlign:'center',            shadowColor: "#000",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.32,
                    shadowRadius: 5.46,
                    elevation: 9,
                    backgroundColor:'#fff' }} >
          <Picker  mode="dropdown" selectedValue={this.state.selected} style={{ flex: 1, color: '#445870' ,  width:SCREEN_WIDTH * 0.33 ,textAlign:"center" }}>
          <Picker.Item value='8:00' label='8:00'  />
          <Picker.Item value='9:00' label='9:00' />
          <Picker.Item value='10:00' label='10:00' />
          <Picker.Item value='11:00' label='11:00' />
          <Picker.Item value='12:00' label='12:00' />
          <Picker.Item value='13:00' label='13:00' />
          <Picker.Item value='14:00' label='14:00' />
          <Picker.Item value='15:00' label='15:00'  />
          <Picker.Item value='16:00' label='16:00' />
          <Picker.Item value='17:00' label='17:00' />
          <Picker.Item value='18:00' label='18:00' />
          </Picker>
                      </View>
          <Text style={{textAlignVertical:'center', paddingHorizontal:5}}>à</Text>
          <View  style={{ flex: 1,marginTop:10,height: 40, borderColor: '#000', borderWidth: 0 , width:SCREEN_WIDTH * 0.15 , borderRadius:30,textAlign:'center',
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.32,
                    shadowRadius: 5.46,
                    elevation: 9,
                    backgroundColor:'#fff' }} >
          <Picker  mode="dropdown" selectedValue={this.state.selected} style={{ flex: 1, color: '#445870' ,  width:SCREEN_WIDTH * 0.33 ,textAlign:"center",backgroundColor:"transparent" }}>
          <Picker.Item value='8:00' label='8:00'  />
          <Picker.Item value='9:00' label='9:00' />
          <Picker.Item value='10:00' label='10:00' />
          <Picker.Item value='11:00' label='11:00' />
          <Picker.Item value='12:00' label='12:00' />
          <Picker.Item value='13:00' label='13:00' />
          <Picker.Item value='14:00' label='14:00' />
          <Picker.Item value='15:00' label='15:00'  />
          <Picker.Item value='16:00' label='16:00' />
          <Picker.Item value='17:00' label='17:00' />
          <Picker.Item value='18:00' label='18:00' />
          </Picker>
                      </View>
          <Icon name="trash" size={SCREEN_WIDTH * 0.07} color="#93E7FF" style={{textAlign:'center',flex: 1,textAlignVertical:'center',paddingTop:15 }} />
      </View>
      <View style={{flexDirection:'row', flexWrap:'wrap', paddingVertical:15}}>
      <View style={{
            borderRadius: 30,
            borderWidth: 0,
            borderColor: '#bdc3c7',
            overflow: 'hidden', 
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            marginHorizontal:SCREEN_WIDTH * 0.02,marginVertical:0,paddingVertical:0
        }}>

      <Picker  mode="dropdown" selectedValue={this.state.days} onValueChange = {this.updateDays} style={{ flex: 1, color: '#445870' , width:SCREEN_WIDTH * 0.30 ,textAlign:"center"}}>
          <Picker.Item value='Lundi' label='Lundi'  />
          <Picker.Item value='Mardi' label='Mardi' />
          <Picker.Item value='Mercredi' label='Mercredi' />
          <Picker.Item value='Jeudi' label='Jeudi' />
          <Picker.Item value='Vendredi' label='Vendredi' />
          <Picker.Item value='Samedi' label='Samedi' />
          <Picker.Item value='Dimanche' label='Dimanche' />
      </Picker>

      </View>
          <Text style={{textAlignVertical:'center', paddingHorizontal:5}}>De</Text>
          <View  style={{ flex: 1,marginTop:10,height: 40, borderColor: '#000', borderWidth: 0 , width:SCREEN_WIDTH * 0.15 , borderRadius:30,textAlign:'center',
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.32,
                    shadowRadius: 5.46,
                    elevation: 9,
                    backgroundColor:'#fff' }} >
          <Picker  mode="dropdown" selectedValue={this.state.selected} style={{ flex: 1, color: '#445870' ,  width:SCREEN_WIDTH * 0.33 ,textAlign:"center" }}>
          <Picker.Item value='8:00' label='8:00'  />
          <Picker.Item value='9:00' label='9:00' />
          <Picker.Item value='10:00' label='10:00' />
          <Picker.Item value='11:00' label='11:00' />
          <Picker.Item value='12:00' label='12:00' />
          <Picker.Item value='13:00' label='13:00' />
          <Picker.Item value='14:00' label='14:00' />
          <Picker.Item value='15:00' label='15:00'  />
          <Picker.Item value='16:00' label='16:00' />
          <Picker.Item value='17:00' label='17:00' />
          <Picker.Item value='18:00' label='18:00' />
          </Picker>
                      </View>
          <Text style={{textAlignVertical:'center', paddingHorizontal:5}}>à</Text>
          <View  style={{ flex: 1,marginTop:10,height: 40, borderColor: '#000', borderWidth: 0 , width:SCREEN_WIDTH * 0.15 , borderRadius:30,textAlign:'center',
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.32,
                    shadowRadius: 5.46,
                    elevation: 9,
                    backgroundColor:'#fff' }} >
          <Picker  mode="dropdown" selectedValue={this.state.selected} style={{ flex: 1, color: '#445870' ,  width:SCREEN_WIDTH * 0.33 ,textAlign:"center",backgroundColor:"transparent" }}>
          <Picker.Item value='8:00' label='8:00'  />
          <Picker.Item value='9:00' label='9:00' />
          <Picker.Item value='10:00' label='10:00' />
          <Picker.Item value='11:00' label='11:00' />
          <Picker.Item value='12:00' label='12:00' />
          <Picker.Item value='13:00' label='13:00' />
          <Picker.Item value='14:00' label='14:00' />
          <Picker.Item value='15:00' label='15:00'  />
          <Picker.Item value='16:00' label='16:00' />
          <Picker.Item value='17:00' label='17:00' />
          <Picker.Item value='18:00' label='18:00' />
          </Picker>
                      </View>
          <Icon name="trash" size={SCREEN_WIDTH * 0.07} color="#93E7FF" style={{textAlign:'center',flex: 1,textAlignVertical:'center',paddingTop:15 }} />
      
      </View>

    */}

      <View style={{flexDirection:'row', flexWrap:'wrap', paddingVertical:15 , marginLeft:15}}>
      <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addBtn}
          disabled={this.state.disabled}
          onPress={this.addMore}
        >
      <View style={{ borderRadius: 30,
            borderWidth: 0,
            borderColor: '#bdc3c7',
            overflow: 'hidden', 
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',padding:15}}>
        
        <Icon name="plus"
              size={SCREEN_WIDTH * 0.03}
              color="#93E7FF" />
              
              </View>
              </TouchableOpacity>

      </View>



      </ScrollView>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  header_container: {
    flex: 0.32,
    //justifyContent: 'flex-end',
    //alignItems: 'stretch',
    //backgroundColor: 'brown',
  },
  headerIcon: {
    width: SCREEN_WIDTH * 1,
    height: HEADER_ICON_HEIGHT * 1,
  },
  metadata_container: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  Avatar_box: {
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
    alignItems: 'center',
    backgroundColor: 'white'
  },
  metadata_box: {
    height: SCREEN_WIDTH * 0.12,
    marginLeft: SCREEN_WIDTH * 0.04,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  metadata_text1: {
    fontSize: SCREEN_HEIGHT * 0.025,
    color: 'gray',
    fontWeight: 'bold'
  },
  metadata_text2: {
    fontSize: SCREEN_HEIGHT * 0.020,
    color: 'gray'
  },
  dispos_container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal:SCREEN_WIDTH * 0.05
  },
  dropdown_container: {
  },

});
/*
<View style={styles.metadata_box}>
<Text style={styles.metadata_text1}>{this.state.nom} {this.state.prenom}</Text>
<Text style={styles.metadata_text2}>{this.state.speciality}</Text>
</View>
 <RNPickerSelect style={{borderWidth:1}}
            onValueChange={(value) => console.log(value)}
            placeholder={placeholder}
            items={timezones}
          />
           onChangeText={text => onChangeText(text)}
*/