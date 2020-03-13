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
import Icon from 'react-native-vector-icons/FontAwesome';
//import UploadFile from './UploadFile';
import ImagePicker from 'react-native-image-picker';
import { imagePickerOptions, options2, getFileLocalPath, createStorageReferenceToFile, uploadFileToFireBase } from '../util/MediaPickerFunctions';
import firebase from 'react-native-firebase';
import LinearGradient from 'react-native-linear-gradient';

const db= firebase.firestore()
const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT= Dimensions.get("window").height

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.fileSrce= null
    this.stgRef= null
    this.VideoSource= null
    this.VideoStorageRef= null
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
        ImageURI: null,
        ImageObjects: [], // Array to store URLs of selected images
        VideoSource: null,  //  object to store URL of choosen video
        VideoStorageRef: null, //
    }

    //this.uploadImages = this.uploadImages.bind(this); 
    //this.uploadVideo = this.uploadVideo.bind(this); 
    this.uploadFiles = this.uploadFiles.bind(this); 
    this.skip = this.skip.bind(this); 
    this.onConfirm = this.onConfirm.bind(this); 

}


  getVideo = () => {
    ImagePicker.launchCamera(options2, imagePickerResponse  => {
      const { didCancel, error } = imagePickerResponse ;
      if (didCancel)  { console.log('Post canceled') }
      else if (error) { alert('An error occurred: ',   error); }
      else {   this.VideoSource= imagePickerResponse.path
               this.VideoStorageRef= firebase.storage().ref('/Medecin/Patient/VideoExplicative') 
              
               this.setState({ VideoSource: this.VideoSource, 
                               VideoStorageRef: firebase.storage().ref('/Medecin/Patient/VideoExplicative') 
                               }, console.log(this.state.VideoStorageRef))
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
  ImagePicker.showImagePicker(imagePickerOptions, imagePickerResponse  => {
    const { didCancel, error } = imagePickerResponse ;
    if (didCancel)  { console.log('Post canceled'); }
    else if (error) { alert('An error occurred: ',   error); }
    else {   this.fileSrce= getFileLocalPath((imagePickerResponse))
             this.stgRef= createStorageReferenceToFile(imagePickerResponse)
             this.ImageObjects = this.state.ImageObjects
             this.ImageObjects.push({ fileSource: this.fileSrce, storageRef: this.stgRef })
             this.setState({ ImageURI: imagePickerResponse.uri, 
                             ImageObjects: this.ImageObjects
                             }, console.log(this.state.ImageObjects[0].storageRef))
    }}
  );  
};

removeImage(index) {
   console.log('icon pressed')
   const ImageObjects = this.state.ImageObjects
   ImageObjects.splice(index,1)
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

uploadFiles() {
  //Promise.resolve(this.state.storageRef.putFile(this.state.fileSource))
  const ImageObjects = this.state.ImageObjects
 
  console.log('uploading images...')
  for(let i=0 ; i<ImageObjects.length; i++) {
     
    Promise.resolve(ImageObjects[i].storageRef.putFile(ImageObjects[i].fileSource)).then((URLObject) => {db.collection('Images').doc().set({ downloadURL: URLObject.downloadURL })
                                                                                                                             .then( () => { console.log('Image URL persisted to FireStore')})
                                                                                                                             .catch(err => console.log(err))  })
                                                                                   .catch((error) => console.log(error))
  }
  console.log('uploading video...')
  Promise.resolve(this.state.VideoStorageRef.putFile(this.state.VideoSource)).then((URLObject) => {db.collection('Videos').doc().set({ downloadURL: URLObject.downloadURL })
                                                                                                                         .then( () => { console.log('Video URL persisted to FireStore')})
                                                                                                                         .catch(err => console.log(err))  })
                                                                             .catch((error) => console.log(error))
}

skip() {
  console.log('Skip...')
  //this.props.navigation.navigate('Upload')
}

onConfirm() {
 
  firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("appointments").doc().set({
    doctor_id: this.doctor.uid,
    doctorName: this.doctor.name,
    doctorSpeciality: this.doctor.speciality,
    fullDate: this.fullDate,
    day: Number(this.daySelected),
    month: this.monthSelected,
    year: Number(this.yearSelected),
    timeslot: this.timeSelected,
    symptomes: this.symptomes,
    comment: this.comment
  }).then(() => {
    this.props.navigation.navigate('BookingConfirmed',  {doctor: this.doctor, fullDate: this.fullDate, daySelected: this.daySelected, 
      monthSelected: this.monthSelected, yearSelected: this.yearSelected, 
      timeSelected: this.timeSelected, symptomes: this.symptomes,
      comment: this.comment
        })
  }).catch( err => console.log(err) )

 /* this.props.navigation.navigate('BookingConfirmed', {doctor: this.doctor, daySelected: this.daySelected, fullDate: this.fullDate,
    monthSelected: this.monthSelected, yearSelected: this.yearSelected, 
    timeSelected: this.timeSelected, symptomes: this.symptomes,
    comment: this.comment
    })*/
}

  render() {
     console.log(this.doctor)
     console.log(this.daySelected)
     console.log(this.monthSelected)
     console.log(this.yearSelected)
     console.log(this.timeSelected)
     console.log(this.symptomes)
     console.log(this.comment)
    const ImageObjectList = this.state.ImageObjects.map((ImageObject, index) => {
    return (
      <View key= {index} style= {styles.ImageListElement}>
         <Text> Document {index + 1 } </Text>
         <Icon name="remove" 
           size={SCREEN_WIDTH*0.05} 
           color="#93eafe"
           onPress = { () => { console.log('icon pressed')
                             const ImageObjects = this.state.ImageObjects
                             ImageObjects.splice(index,1)
                             this.setState({ ImageObjects: ImageObjects })}}
           style= {{ marginLeft: SCREEN_WIDTH*0.05 }}
         />  
      </View>    )
  })
   
    return (
        <View style={styles.container}>
          <View style={styles.bar_progression}>
            <View style={[styles.bar, styles.activeBar]}/>
            <View style={[styles.bar, styles.activeBar]}/>
            <View style={[styles.bar, styles.activeBar]}/>
          </View>

          <View style={styles.header_container}>
          <Text style={styles.header}> Documents/videos/photos </Text>
          </View>

          <View style={styles.uploadFile_container}>
             <Text style={{fontSize: 15, fontWeight: 'bold', color:"#48494B", paddingBottom: 5 }}> Ajouter des documents<Text style={{fontSize: 10}}> (ordonnance...) </Text ></Text>
             
             <SafeAreaView style= {{ flex: 1, justifyContent: 'flex-start', paddingBottom: SCREEN_HEIGHT*0.02}}>
             <StatusBar barStyle="dark-content" />
             {/* <Button title="New Post" onPress={uploadImage} style={} /> */}
             <TouchableHighlight style= {styles.uploadButton} onPress= {this.getImages}>
                <View style= {{ flex:1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style= {{ color: 'gray' }}> Télécharger un document </Text> 
                    <Icon name="upload" 
                          size={SCREEN_WIDTH*0.04} 
                          color="#BDB7AD"/>
                </View>                
             </TouchableHighlight>
             <ScrollView contentContainerStyle= {{ justifyContent: 'space-around', alignItems: 'flex-end', paddingLeft: SCREEN_WIDTH*0.02, paddingRight: SCREEN_WIDTH*0.02}}>
                {ImageObjectList}    
             </ScrollView>
             </SafeAreaView>

             {/* {imageURI && <Image source={imageURI} style= {{ height: 100, width: 100 }}/>}  */}
      
             
          </View>

          <View style = { styles.headerVideo_container }>   
             <Icon name="lock" 
                   size={SCREEN_WIDTH*0.05} 
                   color="gray"/>      
             <View style={styles.headerVideo_text}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color:"#48494B", }}> Ajouter une video explicative </Text>
                <Text style={{ fontSize: 8.5, fontWeight: 'bold', color:"#48494B",  }}> Vos documents seront protégées et lorem ipsum dolor </Text>
             </View>
          </View>

          <View style={styles.video_container}>
             <TouchableHighlight onPress={this.getVideo} style= {styles.buttonAddVideo}>
                    <Icon name="camera" 
                          size={SCREEN_WIDTH*0.05} 
                          color="#93eafe"/>
             </TouchableHighlight>

             { this.state.VideoSource ? <View style= {styles.VideoElement}>
                                        <Text> Video explicative </Text>
                                        <Icon name="remove" 
                                        size={SCREEN_WIDTH*0.08} 
                                        color="#93eafe"
                                        onPress = { () => { console.log('icon pressed')
                                                            this.setState({ VideoSource: null, VideoStorageRef: null })} }
                                        style= {{ marginLeft: SCREEN_WIDTH*0.05 }}
                                        />  
                                        </View> 
                                      : null }
             
          </View>
         
          <View style= {styles.button_container}>
          <TouchableOpacity onPress={this.skip} style= {styles.skipButton}>
          <Text style={styles.buttonText1}>Passer cette étape</Text> 
          </TouchableOpacity>

          <TouchableOpacity
                onPress={this.onConfirm}>         
                <LinearGradient 
                  start={{x: 0, y: 0}} 
                  end={{x: 1, y: 0}} 
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
    width: SCREEN_WIDTH/3.2,
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
    paddingTop: SCREEN_HEIGHT*0.05
    //padding: SCREEN_WIDTH*0.05
  },
  ImageListElement: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffff',
    borderRadius: 50,
    //borderWidth: 1, 
    //borderColor: '#93eafe',
    paddingLeft: SCREEN_WIDTH*0.02,
    paddingRight: SCREEN_WIDTH*0.02,
    width: SCREEN_WIDTH * 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 5,
    marginTop: SCREEN_HEIGHT*0.01,
    marginBottom: SCREEN_HEIGHT*0.01,
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
    paddingLeft: SCREEN_WIDTH*0.02,
    paddingRight: SCREEN_WIDTH*0.02,
    width: SCREEN_WIDTH * 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 5,
    marginTop: SCREEN_HEIGHT*0.03,
    marginBottom: SCREEN_HEIGHT*0.01,
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
    marginLeft: SCREEN_WIDTH*0.01
  },
  uploadButton: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: SCREEN_WIDTH*0.05,
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
    paddingTop: SCREEN_HEIGHT*0.06,
    width: SCREEN_WIDTH*0.78,
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
    paddingBottom: SCREEN_HEIGHT*0.005,
    paddingTop:SCREEN_HEIGHT*0.005,
    marginRight: SCREEN_WIDTH*0.05,
    width: SCREEN_WIDTH * 0.4,
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
    width: SCREEN_WIDTH * 0.3,
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

