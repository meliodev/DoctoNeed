import { View, Text, Button, Dimensions, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Component } from 'react';
import {  Animated, Platform,  UIManager , LayoutAnimation , ActivityIndicator} from 'react-native';

import firebase from 'react-native-firebase'
import { signOutUser } from '../../DB/CRUD'
import * as REFS from '../../DB/CollectionsRefs'
import { ScrollView, TextInput } from 'react-native-gesture-handler'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/FontAwesome';

import Modal from "react-native-modal";
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'

import Item2 from '../../components/DocumentItem'
import ImagePicker from 'react-native-image-picker';

const options = {
    title: 'Select Image',
  
    takePhotoButtonTitle: 'Take photo with your camera',
    chooseFromLibraryButtonTitle: 'Choose photo from library',
  
    // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class AppointmentDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            doctor_id: '',
            doctorName: '',
            doctorSpeciality: '',
            patientName: '',
            text:'Test',

            comment: '',
            symptoms: [],
            day: 0,
            month: '',
            year: 0,

            allergies: [],
            messages: [],
            messageToSend: [],
            noinput: true,
            valueArray: [],
            disabled: false,
            isLoading: false,


                  //Appointment dynamic style: open & close
      itemHeight: SCREEN_HEIGHT * 0.13,
      appId: null,

                  //Appointment details
      symptomes: [],
      documents: [],
      video: '',

      isModalImageVisible: false,
      ImageToShow: ''

        }

         // Doc Item states
    this.addNewEle = false;
    this.index = 0;
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

//


componentDidMount() {


    this.setState({ isLoading: true })



    const appId = this.props.navigation.getParam('appId', 'nothing sent')

        REFS.appointments.doc(appId)
        .get().then((doc) => {
          console.log(doc.data().DocumentsRefs)
          this.setState({ appId: appId, symptomes: doc.data().symptomes, documents: doc.data().DocumentsRefs, video: doc.data().Video })
        });

    const { currentUser } = firebase.auth()

    if (currentUser) {
      this.setState({ currentUser })

      REFS.users.doc(currentUser.uid).get().then(doc => {
        this.setState({ uid: doc.id })
        this.setState({ nom: doc.data().nom })
        this.setState({ prenom: doc.data().prenom })
        this.setState({ email: currentUser.email })
      })
        .then(() => {
          const { navigation } = this.props;
          //navigation.addListener('willFocus', () =>
          this.loadAppointments()
          //);
        })
    }

    
  }


   
    componentWillMount() {
        this.getAppointmentDetails();
        
    
      }

    getAppointmentDetails() {
        const appId = this.props.navigation.getParam('appId', 'nothing sent')
        console.log(appId)
        REFS.appointments.doc(appId)
            .get().then((doc) => {
                this.setState({ doctor_id: doc.data().doctor_id })
                this.setState({ comment: doc.data().comment })
                this.setState({ symptoms: doc.data().symptomes })
                this.setState({ day: doc.data().day })
                this.setState({ month: doc.data().month })
                this.setState({ year: doc.data().year })
                this.setState({ patientName: doc.data().patientName })

                this.setState({ doctorName: doc.data().doctorName })
                this.setState({ doctorSpeciality: doc.data().doctorSpeciality })
            })


    }

    // Load appointments
  loadAppointments() {

    this.appointments = []

    var query = REFS.appointments
    query = query.where('user_id', '==', this.state.uid)
    query = query.where('finished', '==', false)
    query = query.where('cancelBP', '==', false)
    query = query.orderBy('date', 'desc')

    query
      .onSnapshot(function (querySnapshot) {
        //console.log(querySnapshot)
        let appointments = []
        querySnapshot.forEach(doc => {
          let id = doc.id
          let date = doc.data().date
          let doctorName = doc.data().doctorName
          let doctorSpeciality = doc.data().doctorSpeciality
          let state = doc.data().state
          let postponeBP = doc.data().postponeBP
          let postponing = doc.data().postponing

          let app = {
            id: id,
            date: date,
            doctorName: doctorName,
            doctorSpeciality: doctorSpeciality,
            state: state,
            postponeBP: postponeBP,
            postponing: postponing
          }

          appointments.push(app)
        })
        //console.log("Current appointments are", appointments.join(", "))
        this.setState({ appointments: appointments })

      }.bind(this)) //.then(() => this.setState({ appointments: this.appointments }))
      this.setState({ isLoading: false })

  }
  

    renderSymptoms() {
        return this.state.symptoms.map((data) => {
            return (
                <Text>{data}</Text>
            )
        })
    }

    /*  renderAllergies() {
          return this.state.allergies.map((data) => {
              return (
                  <Text>{data}</Text>
              )
          })
      }*/

      onSend(messages = []) {
        const appId = this.props.navigation.getParam('appId', 'nothing sent')
        // REFS.chats.add(messages)
    
    
        this.setState(previousState => ({
          messageToSend: GiftedChat.append(previousState.messageToSend, messages),
        }), () => {
          console.log(this.state.messageToSend[0])
          REFS.chats.add(this.state.messageToSend[0]).then((doc) => {
            doc.update({ appointment_id: appId }).then(() => console.log('appointment_id added to the chat message document'))
              .catch((err) => console.error(err))
          })
        })
    
      }
    
    
    
      renderMessage(props) {
        const {
          currentMessage: { text: currText },
        } = props
    
        let messageTextStyle
    
        // Make "pure emoji" messages much bigger than plain text.
        if (currText && emojiUtils.isPureEmojiString(currText)) {
          messageTextStyle = {
            fontSize: 28,
            // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
            lineHeight: Platform.OS === 'android' ? 34 : 30,
          }
        }
    
        return <SlackMessage {...props} messageTextStyle={messageTextStyle} />
      }
    
      renderBubble(props) {
        if (!props.currentMessage.sent) {
          // if current Message has not been sent, return other Bubble with backgroundColor red for example
          return (
            <Bubble
              wrapperStyle={{
                right: { backgroundColor: '#93eafe' },
              }}
              {...props}
            />
          );
        }
        return (
          // Return your normal Bubble component if message has been sent.
          <Bubble {...props} />
        );
      }
    
      renderInputToolbar(props) {
        if (this.state.noinput == true) {
        } else {
        return(
          <InputToolbar
          {...props}
          />
        ); 
      }
      }




      toggleModalImage(doc) {
        this.setState({ isModalImageVisible: !this.state.isModalImageVisible, ImageToShow: doc })
      }

      myImagefunction=()=>{

        ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);
          if (response.didCancel) {
            console.log('User cancelled image picker');
          }
          else if (response.error) {
            console.log('Image Picker Error: ', response.error);
          }
          else {
            let source = { uri: response.uri };
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
            this.setState({
              avatarSourceProfile: source,
              pic:response.data
            });
          }
        });
        console.log('clicked');
      }



    render() {
        const appId = this.props.navigation.getParam('appId', 'nothing sent')
        const noinput = this.props.navigation.getParam('noinput', 'nothing sent')

        const doctor = {
            name: this.state.doctorName,
            speciality: this.state.doctorSpeciality
        }
        const patient = {
            patientName: this.state.patientName
        }

        return (
            <View style={{ flex: 1 }}>

<Modal isVisible={this.state.isModalImageVisible}
          onBackdropPress={() => this.setState({ isModalImageVisible: false })}
          animationIn="zoomIn"
          animationOut="zoomOut"
          onSwipeComplete={() => this.setState({ isModalImageVisible: false })}
          swipeDirection="left"
          style={{ backgroundColor: 'white' }}>

          <Icon1 name="remove"
            size={SCREEN_WIDTH * 0.1}
            color="#93eafe"
            onPress={() => {
              console.log('icon pressed')
              this.setState({ isModalImageVisible: false })
            }}
            style={{ position: 'absolute', top: 0, right: 0 }} />

          < Image style={{ width: SCREEN_WIDTH * 0.8, height: SCREEN_HEIGHT * 0.8, alignSelf: 'center' }}
            source={{ uri: this.state.ImageToShow }} />

        </Modal>

        {this.state.isLoading
          ? <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>

          :
                <ScrollView style={{ flex: 1 }}>

                    <View style={styles.card}>
                        <Text style={{ fontWeight: '', color: '#000000', marginBottom: SCREEN_HEIGHT*0.02 ,borderBottomWidth: 1,
                            borderBottomColor: '#93eafe',width:SCREEN_WIDTH * 0.55}}>Informations sur la consultation:</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold' }}>Patient:</Text>
                            <Text style={{  color: '#000', marginLeft: SCREEN_WIDTH * 0.06 }} onPress={() => this.props.navigation.navigate('MedicalFolder')}>
                                Andy Moor</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold' }}>Age:</Text>
                            <Text style={{  color: '#000', marginLeft: SCREEN_WIDTH * 0.11 }}
                                onPress={() => this.props.navigation.navigate('DoctorFile', { doctor: doctor })}>36</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold' }}>Médecin:</Text>
                            <Text style={{  color: '#000', marginLeft: SCREEN_WIDTH * 0.03 }}
                                onPress={() => this.props.navigation.navigate('DoctorFile', { doctor: doctor })}>{this.state.doctorName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold' }}>Spécialité:</Text>
                            <Text style={{ marginLeft: SCREEN_WIDTH * 0.012 }}>{this.state.doctorSpeciality}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold' }}>Etat:</Text>
                            <Text style={{ marginLeft: SCREEN_WIDTH * 0.11, color:'green', fontWeight:'bold' }}>Consultation confirmée</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft:SCREEN_WIDTH * 0.1,marginTop:SCREEN_HEIGHT * 0.01 }}>
                        <Button /*onPress={}*/ style={{borderRadius:30,marginHorizontal:5}}
                           title="Reporter"
                           color="red"
                           accessibilityLabel="Reporter"/>
                           <Button /*onPress={}*/
                                title="Annuler"
                                color="#000"
                                accessibilityLabel="Annuler"
                           />

                        
                        </View>


                        <View style={{flexDirection:'row'}}>
                        <Text style={{ fontWeight: '', color: '#000000', marginBottom: SCREEN_HEIGHT*0.02 ,borderBottomWidth: 1,
                    borderBottomColor: '#93eafe',width:SCREEN_WIDTH * 0.45,marginTop:15}}>Donnes de la consultation :</Text>
 
                                    </View>


                     {/*    <View style={{ flexDirection: 'row' }}>
                        <Icon name="video" size={SCREEN_WIDTH * 0.05} color="#93E7FF" /><Text style={{ fontWeight: 'bold' }}> Video</Text>
                        </View>
*/}
                        
                        {this.state.documents.map(function (doc, key) {
                          return (
                            <View>
                              <Text style={{ color: '#333', fontWeight: 'bold', textDecorationLine: 'underline', marginBottom: SCREEN_HEIGHT * 0.01 }}
                                onPress={() => this.toggleModalImage(doc)} >Document {key + 1}</Text>
                            </View>)
                        }.bind(this))}  
                 

                    </View>


                    <View style={{ flexDirection: 'column', marginTop: 15 }}>
                            <Text style={{ fontWeight: 'bold',fontSize:18,marginHorizontal:SCREEN_WIDTH * 0.22,width:SCREEN_WIDTH * 1,flex:1 }}>Rapport de la consultation:</Text>
                            <Text style={{  color:'#93E8FD',fontWeight: 'bold',fontSize:16,marginHorizontal:SCREEN_WIDTH * 0.28,width:SCREEN_WIDTH * 1,flex:1 }}>07 Mars 2020 à 15:30</Text>
                        </View>
                        <View style={{ flexDirection: 'column', marginTop: 15 }}>
                            <Text style={{ fontWeight: 'bold',fontSize:18,marginHorizontal:SCREEN_WIDTH * 0.4,width:SCREEN_WIDTH * 1,flex:1 }}>Durée :</Text>
                            <Text style={{  color:'#93E8FD',fontWeight: 'bold',fontSize:16,marginHorizontal:SCREEN_WIDTH * 0.43,width:SCREEN_WIDTH * 1,flex:1 }}>- min</Text>
                        </View>


                        <View style={styles.card}>
                <Text style={{ fontWeight: 'bold', color: '#000000', marginBottom: SCREEN_HEIGHT*0.02 ,borderBottomWidth: 0,
        borderBottomColor: '#93eafe',width:SCREEN_WIDTH * 0.6}}><Icon name="pen" size={SCREEN_WIDTH * 0.05} color="#93E7FF" /> Remarques générales</Text>

                        <View style={{borderColor:'grey',borderWidth: 0, padding: 5,borderRadius:20,backgroundColor:'#fff',marginBottom:10}} >
                        <TextInput
                        style={{height: 150,justifyContent: "flex-start",borderRadius:20,backgroundColor:'#fff', textAlignVertical: 'top'}}
                        underlineColorAndroid="transparent"
                        placeholder="Taper ici ..."
                        placeholderTextColor="grey"
                        numberOfLines={10}
                        multiline={true}
                        />
                    </View>
                    <Button /*onPress={}*/ 
                                title="Valider"
                                color="#93E8FD"
                                accessibilityLabel="Valider" style={{width:1}}
                           />

                    <Text style={{ fontWeight: 'bold', color: '#000000', marginTop:15,marginBottom: SCREEN_HEIGHT*0.02 ,borderBottomWidth: 0,
                        borderBottomColor: '#93eafe',width:SCREEN_WIDTH * 0.6}}><Icon name="upload" size={SCREEN_WIDTH * 0.05} color="#93E7FF" /> Importer les documents</Text>

<View style={{flexDirection:'row', flexWrap:'wrap', paddingVertical:15 , marginLeft:0}}>
    
    <View style={{flexDirection:'column'}}>
      <TouchableOpacity
          activeOpacity={0.8}
          style={{marginHorizontal:5,width:SCREEN_WIDTH * 0.1,marginLeft:30}}
          disabled={this.state.disabled}
          onPress={this.myImagefunction}
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
            backgroundColor: 'white',padding:5}}>

          {this.avatarSourceProfile != null  ?

        <Icon name="clipboard"
              size={SCREEN_WIDTH * 0.07}
              color="#93E7FF" />
              : 
    
          <Image source={this.state.avatarSourceProfile} style={{width:30,height:30,margin:0}}/>
            }
            </View>
              </TouchableOpacity>
              <Text style={{marginTop:10,fontSize:12,marginRight:15}}>Rapport detaillé</Text>
</View>
<View style={{flexDirection:'column'}}>
      <TouchableOpacity
          activeOpacity={0.8}
          style={{marginHorizontal:5,width:SCREEN_WIDTH * 0.1,marginLeft:15}}
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
            backgroundColor: 'white',padding:5}}>
        
        <Icon name="clipboard"
              size={SCREEN_WIDTH * 0.07}
              color="#93E7FF" />
              </View>
              </TouchableOpacity>
              <Text style={{marginTop:10,fontSize:12}}>Ordonnance</Text>
</View>
<View style={{flexDirection:'column'}}>
      <TouchableOpacity
          activeOpacity={0.8}
          style={{marginHorizontal:5,width:SCREEN_WIDTH * 0.1,marginLeft:30}}
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
            backgroundColor: 'white',padding:5}}>
        
        <Icon name="plus"
              size={SCREEN_WIDTH * 0.07}
              color="#93E7FF" />
              </View>
              </TouchableOpacity>
</View>
      </View>

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

                <Item2
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
      */}

             </View>

             
             <View style={{ flexDirection: 'column', marginTop: 15 }}>
                            <Text style={{ fontWeight: 'bold',fontSize:18,marginHorizontal:SCREEN_WIDTH * 0.35,width:SCREEN_WIDTH * 1,flex:1 }}>Chat en ligne :</Text>
                        </View>


                    <View style={styles.card}>
                    <Text style={{ fontWeight: '', color: '#000000', marginBottom: SCREEN_HEIGHT*0.02 ,width:SCREEN_WIDTH * 0.4}}>CHAT</Text>

                    <GiftedChat
                        messages={this.state.messages}
                        onSend={messages => this.onSend(messages)}
                        renderInputToolbar= {this.renderInputToolbar}
                        user={{
                        _id: firebase.auth().currentUser.uid,  //Firestore Rules: Allow access to only the user that made appointment and to Admin: allow read, write if: resource.data.user._id == request.auth.uid || request.auth.token.admin == true
                        }}
                        //renderMessage={this.renderMessage}
                        renderBubble={this.renderBubble}
                    />

                    </View>


                    <View style={styles.card}>
                    <Text style={{ fontWeight: '', color: '#000000', marginBottom: SCREEN_HEIGHT*0.02 ,borderBottomWidth: 1,
                        borderBottomColor: '#93eafe',width:SCREEN_WIDTH * 0.4}}>Informations sur la visit:</Text>
                        <Text style={{ fontWeight: 'bold' }}>But de la consultation:</Text>
                        <Text>{this.state.comment}</Text>
                        <Text style={{ fontWeight: 'bold' }}>Symptomes:</Text>
                        {this.renderSymptoms()}
                        <Text style={{ fontWeight: 'bold' }}>Pièces jointes (documents/vidéo):</Text>
                        <Text>X</Text>
                    </View>



                    <View style={styles.card}>
                        <Text style={{ fontWeight: 'bold', color: '#93eafe', marginBottom: SCREEN_HEIGHT*0.02 }}>Profile</Text>
                        <Text style={{ fontWeight: 'bold' }}>Allergies</Text>
                        <Text>Allergie 1, Allergie 2, Allergie 3</Text>
                        <Text style={{ fontWeight: 'bold' }}>carte vitale utilisée ? Oui/Non</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={{ fontWeight: 'bold', color: '#93eafe', marginBottom: SCREEN_HEIGHT*0.02 }}>Résumé</Text>
                        <Text style={{ fontWeight: 'bold' }}>Durée de la consultation:</Text>
                        <Text>XXmin YYs</Text>
                        <Text style={{ fontWeight: 'bold' }}>Prix de la consultation:</Text>
                        <Text>X €</Text>
                    </View>


                </ScrollView>

                    }
                <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                    <Icon name="numeric-1-circle"
                        size={SCREEN_WIDTH * 0.05}
                        color="red" />
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Chat', { appId: appId, noinput: noinput }) }>
                    <Image source={require('../../assets/profile.jpg')}
                           style={styles.logoIcon}/>
                    </TouchableOpacity>

                </View>
            </View>

        );
    }
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F7F7F7',
        borderRadius: 20,
        width: SCREEN_WIDTH * 0.9,
        padding: SCREEN_WIDTH * 0.07,
        margin: SCREEN_HEIGHT*0.01,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        marginHorizontal:SCREEN_WIDTH * 0.05,
        marginTop:SCREEN_HEIGHT * 0.02    },
    logoIcon: {
        height: SCREEN_WIDTH * 0.2,
        width: SCREEN_WIDTH * 0.2,
        //marginTop: SCREEN_WIDTH * 0.0,
        //marginHorizontal: 130,
        borderRadius: 100,
        //justifyContent: "center",
        //alignItems: 'center',
        borderColor: '#ffffff',
        borderWidth: 7,
        borderStyle: "solid"
    },
});


