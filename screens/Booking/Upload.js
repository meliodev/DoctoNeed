//tasks: 
/*
remove image on cross press
upload multiple images (array)
bar progression during upload

take or choose a video
*/
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Button,
  Image,
} from 'react-native';
//import { Actions } from 'react-native-router-flux';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/FontAwesome';
//import UploadFile from './UploadFile';
import ImagePicker from 'react-native-image-picker';
import { imagePickerOptions, options2, getFileLocalPath, createStorageReferenceToFile, uploadFileToFireBase } from '../../util/MediaPickerFunctions';
import firebase from 'react-native-firebase';
import LinearGradient from 'react-native-linear-gradient';

const db = firebase.firestore()
import * as REFS from '../../DB/CollectionsRefs'

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.fileSrce = null
    this.stgRef = null
    this.VideoSource = null
    this.VideoStorageRef = null
    this.ImageObjects = []
    this.doctor = this.props.navigation.getParam('doctor', 'nothing sent')
    this.fullDate = this.props.navigation.getParam('fullDate', 'nothing sent')
    this.daySelected = this.props.navigation.getParam('daySelected', 'nothing sent')
    this.monthSelected = this.props.navigation.getParam('monthSelected', 'nothing sent')
    this.yearSelected = this.props.navigation.getParam('yearSelected', 'nothing sent')
    this.timeSelected = this.props.navigation.getParam('timeSelected', 'nothing sent')
    this.symptomes = this.props.navigation.getParam('symptomes', 'nothing sent')
    this.comment = this.props.navigation.getParam('comment', 'nothing sent')

    this.state = {
      currentUser: null,
      ImageURI: null,
      ImageObjects: [], // Array to store URLs of selected images
      VideoSource: null,  //  object to store URL of choosen video
      VideoStorageRef: null, //
      userName: ''
    }

    //this.uploadImages = this.uploadImages.bind(this); 
    //this.uploadVideo = this.uploadVideo.bind(this); 
    this.uploadFiles = this.uploadFiles.bind(this);
    this.skip = this.skip.bind(this);
    this.onConfirm = this.onConfirm.bind(this);

  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    REFS.users.doc(currentUser.uid).get().then(doc => {
      this.setState({ userName: doc.data().nom + ' ' + doc.data().prenom, userCountry: doc.data().country })
    })
  }

  getVideo = () => {
    ImagePicker.launchCamera(options2, imagePickerResponse => {
      const { didCancel, error } = imagePickerResponse;
      if (didCancel) { console.log('Post canceled') }
      else if (error) { alert('An error occurred: ', error); }
      else {
        console.log(imagePickerResponse)
        this.VideoSource = getFileLocalPath((imagePickerResponse))
        this.VideoStorageRef = firebase.storage().ref('/' + this.state.currentUser.uid + '/Videos/' + this.doctor.nom + this.doctor.prenom + this.fullDate + this.timeSelected)

        this.setState({
          VideoSource: this.VideoSource,
          VideoStorageRef: this.VideoStorageRef
        })
      }
    }
    );
  }

  /*uploadVideo = () => {
     console.log('uploading video')
     Promise.resolve(this.state.VideoStorageRef.putFile(this.state.VideoSource)).then((URLObject) => console.log('Video added to Storage!'))
                                                                                .catch((error) => console.log(error))
   } */

  getImages = () => {
    ImagePicker.showImagePicker(imagePickerOptions, imagePickerResponse => {
      const { didCancel, error } = imagePickerResponse;
      if (didCancel) { console.log('Post canceled'); }
      else if (error) { alert('An error occurred: ', error); }
      else {
        this.fileSrce = getFileLocalPath((imagePickerResponse))
        this.stgRef = firebase.storage().ref('/' + this.state.currentUser.uid + '/Documents/' + this.doctor.nom + this.doctor.prenom + this.fullDate + this.timeSelected + imagePickerResponse.fileName)
        this.ImageObjects = this.state.ImageObjects
        this.ImageObjects.push({ fileSource: this.fileSrce, storageRef: this.stgRef })
        this.setState({
          ImageURI: imagePickerResponse.uri,
          ImageObjects: this.ImageObjects
        })
      }
    }
    );

  };

  removeImage(index) {
    console.log('icon pressed')
    const ImageObjects = this.state.ImageObjects
    ImageObjects.splice(index, 1)
    this.setState({ ImageObjects: ImageObjects })
  }

  /*uploadImages() {
  //Promise.resolve(this.state.storageRef.putFile(this.state.fileSource))
  const ImageObjects = this.state.ImageObjects
 
  for(let i=0 ; i<ImageObjects.length; i++) {
     
    Promise.resolve(ImageObjects[i].storageRef.putFile(ImageObjects[i].fileSource)).then((URLObject) => {db.collection('Images').doc().set({ downloadURL: URLObject.downloadURL })
                                                                                                                             .then( () => { console.log('Image URL persisted to the database')})
                                                                                                                             .catch(err => console.log(err))  })
                                                                                   .catch((error) => console.log(error))
  }
}*/

  uploadFiles(docId) {
    //Promise.resolve(this.state.storageRef.putFile(this.state.fileSource))
    let ImageObjects = this.state.ImageObjects
    let DocumentsRefs = []

    console.log('Appointment id: ' + docId)

    //Initialize DocumentsRefs Array: []
    REFS.appointments.doc(docId).update({ DocumentsRefs: [] }).then(() => console.log('DocumentsRefs added'))
      .catch((err) => console.error(err))

    //Uploading Documents
    console.log('uploading images...')
    for (let i = 0; i < ImageObjects.length; i++) {

      Promise.resolve(ImageObjects[i].storageRef.putFile(ImageObjects[i].fileSource)).then((URLObject) => {
        REFS.appointments.doc(docId).get().then((doc) => {
          DocumentsRefs = doc.data().DocumentsRefs
          return URLObject
          //console.log(DocumentsRefs)
        })
          .catch((err) => console.error(err))
          .then((URLObject) => {
            console.log(URLObject.downloadURL)
            DocumentsRefs.push(URLObject.downloadURL)
            console.log('image ' + i)
            console.log(DocumentsRefs)
            REFS.appointments.doc(docId).update({ DocumentsRefs: DocumentsRefs })
              .then(() => { console.log('Image URL ' + i + ' persisted to FireStore') })
              .catch(err => console.log(err))
          })

      })
        .catch((error) => console.log(error))
    }

    //Upload Video
    console.log('uploading video...')
    Promise.resolve(this.state.VideoStorageRef.putFile(this.state.VideoSource)).then((URLObject) => {
      REFS.appointments.doc(docId).update({ Video: URLObject.downloadURL })
        //db.collection('Videos').doc().set({ downloadURL: URLObject.downloadURL })
        .then(() => { console.log('Video URL persisted to FireStore') })
        .catch(err => console.log(err))
    })
      .catch((error) => console.log(error))
      .then(() => {
        
        this.props.navigation.navigate('BookingConfirmed', {
        doctor: this.doctor, fullDate: this.fullDate, daySelected: this.daySelected,
        monthSelected: this.monthSelected, yearSelected: this.yearSelected,
        timeSelected: this.timeSelected, symptomes: this.symptomes,
        comment: this.comment
      })
      })
  }

  skip() {
    console.log('Skip...')
    //this.props.navigation.navigate('Upload')
  }

  onConfirm() {

    //  let ImageRefs = []

    /*for (let i=0; i<this.state.ImageObjects; i++) {
      ImageRefs.push(this.state.ImageObjects[i].storageRef)
    }*/

    // REFS.users.doc(firebase.auth().currentUser.uid).collection("appointments").doc().set({
    REFS.appointments.add({
      //doctor ref
      doctor_id: this.doctor.uid,
      doctorName: this.doctor.nom + ' ' + this.doctor.prenom,
      doctorSpeciality: this.doctor.speciality,
      //patient ref
      user_id: firebase.auth().currentUser.uid,
      userName: this.state.userName,
      userCountry: this.state.userCountry,
      //date & hour
      fullDate: this.fullDate,
      day: Number(this.daySelected),
      month: this.monthSelected,
      year: Number(this.yearSelected),
      timeslot: this.timeSelected,
      //appointment data
      symptomes: this.symptomes,
      comment: this.comment,
      //Documents & Video -- storage references
      //Documents: ImageRefs,
      //Video: this.state.VideoStorageRef,
      //appointment state  ; CBP: Confirmed By Patient
      state: ['CBP'],
      finished: false
    })
      .then((doc) => {
        this.uploadFiles(doc.id)
        console.log(doc.id)
      }).catch(err => console.log(err))

    /* this.props.navigation.navigate('BookingConfirmed', {doctor: this.doctor, daySelected: this.daySelected, fullDate: this.fullDate,
       monthSelected: this.monthSelected, yearSelected: this.yearSelected, 
       timeSelected: this.timeSelected, symptomes: this.symptomes,
       comment: this.comment
       })*/
  }

  render() {
    /* console.log(this.doctor)
     console.log(this.daySelected)
     console.log(this.monthSelected)
     console.log(this.yearSelected)
     console.log(this.timeSelected)
     console.log(this.symptomes)
     console.log(this.comment)*/
    console.log(this.state.ImageObjects)
    console.log(this.state.VideoSource)
    console.log(this.state.VideoStorageRef)

    const ImageObjectList = this.state.ImageObjects.map((ImageObject, index) => {
      return (
        <View key={index} style={styles.ImageListElement}>
          <Text> Document {index + 1} </Text>
          <Icon name="remove"
            size={SCREEN_WIDTH * 0.05}
            color="#93eafe"
            onPress={() => {
              console.log('icon pressed')
              const ImageObjects = this.state.ImageObjects
              ImageObjects.splice(index, 1)
              this.setState({ ImageObjects: ImageObjects })
            }}
            style={{ marginLeft: SCREEN_WIDTH * 0.05 }}
          />
        </View>)
    })

    return (
      <View style={styles.container} >
        <View style={styles.bar_progression}>
          <View style={[styles.bar, styles.activeBar]} />
          <View style={[styles.bar, styles.activeBar]} />
          <View style={[styles.bar, styles.activeBar]} />
        </View>

        <View style={styles.header_container}>
          <Text style={styles.header}> Documents/videos/photos </Text>
        </View>

        <View style={styles.uploadFile_container}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: "#48494B", paddingBottom: 5 }}> Ajouter des documents<Text style={{ fontSize: 10 }}> (ordonnance...) </Text ></Text>

          <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', paddingBottom: SCREEN_HEIGHT * 0.02 }}>
            <StatusBar barStyle="dark-content" />
            {/* <Button title="New Post" onPress={uploadImage} style={} /> */}
            <TouchableHighlight style={styles.uploadButton} onPress={this.getImages}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'gray' }}> Télécharger un document </Text>
                <Icon name="upload"
                  size={SCREEN_WIDTH * 0.04}
                  color="#BDB7AD" />
              </View>
            </TouchableHighlight>
            <ScrollView contentContainerStyle={{ justifyContent: 'space-around', alignItems: 'flex-end', paddingLeft: SCREEN_WIDTH * 0.02, paddingRight: SCREEN_WIDTH * 0.02 }}>
              {ImageObjectList}
            </ScrollView>
          </SafeAreaView>

          {/* {imageURI && <Image source={imageURI} style= {{ height: 100, width: 100 }}/>}  */}


        </View>

        <View style={styles.headerVideo_container}>
          <Icon name="lock"
            size={SCREEN_WIDTH * 0.05}
            color="gray" />
          <View style={styles.headerVideo_text}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: "#48494B", }}> Ajouter une video explicative </Text>
            <Text style={{ fontSize: 8.5, fontWeight: 'bold', color: "#48494B", }}> Vos documents seront protégées et lorem ipsum dolor </Text>
          </View>
        </View>

        <View style={styles.video_container}>
          <TouchableHighlight onPress={this.getVideo} style={styles.buttonAddVideo}>
            <Icon1 name="video-camera"
              size={SCREEN_WIDTH * 0.05}
              color="#93eafe" /> 
          </TouchableHighlight>

          {this.state.VideoSource ? <View style={styles.VideoElement}>
            <Text> Video explicative </Text>
            <Icon name="remove"
              size={SCREEN_WIDTH * 0.08}
              color="#93eafe"
              onPress={() => {
                console.log('icon pressed')
                this.setState({ VideoSource: null, VideoStorageRef: null })
              }}
              style={{ marginLeft: SCREEN_WIDTH * 0.05 }}
            />
          </View>
            : null}

        </View>

        <View style={styles.button_container}>
          <TouchableOpacity onPress={this.skip} style={styles.skipButton}>
            <Text style={styles.buttonText1}>Passer cette étape</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.onConfirm}>
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
    // backgroundColor: 'blue',
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
  uploadFile_container: {
    flex: 0.4,
    //flexDirection: 'row',
    //backgroundColor: 'pink',
    width: SCREEN_WIDTH,
    alignItems: 'center',
    paddingTop: SCREEN_HEIGHT * 0.05
    //padding: SCREEN_WIDTH*0.05
  },
  ImageListElement: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffff',
    borderRadius: 50,
    //borderWidth: 1, 
    //borderColor: '#93eafe',
    paddingLeft: SCREEN_WIDTH * 0.02,
    paddingRight: SCREEN_WIDTH * 0.02,
    width: SCREEN_WIDTH * 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 5,
    marginTop: SCREEN_HEIGHT * 0.01,
    marginBottom: SCREEN_HEIGHT * 0.01,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  VideoElement: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffff',
    borderRadius: 50,
    //borderWidth: 1, 
    //borderColor: '#93eafe',
    paddingLeft: SCREEN_WIDTH * 0.02,
    paddingRight: SCREEN_WIDTH * 0.02,
    width: SCREEN_WIDTH * 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 5,
    marginTop: SCREEN_HEIGHT * 0.03,
    marginBottom: SCREEN_HEIGHT * 0.01,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerVideo_container: {
    flex: 0.05,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    //backgroundColor: 'black',
    width: SCREEN_WIDTH
  },
  headerVideo_text: {
    // flex: 0.1,
    //flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    //backgroundColor: 'purple',
    marginLeft: SCREEN_WIDTH * 0.01
  },
  uploadButton: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: SCREEN_WIDTH * 0.05,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  video_container: {
    flex: 0.25,
    //flexDirection: 'row',
    //backgroundColor: 'gray',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.78,
  },
  buttonAddVideo: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressBar: {
    backgroundColor: 'rgb(3, 154, 229)',
    height: 3,
    shadowColor: '#000',
  },
  button_container: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'orange'
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

