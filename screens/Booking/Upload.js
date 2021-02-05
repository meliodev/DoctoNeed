//make VideoLinkStorage and VideoLinkLocal
import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView, StatusBar, Dimensions, Button, Image, Alert } from 'react-native';
import Modal from 'react-native-modal';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import { imagePickerOptions, options2, getFileLocalPath } from '../../util/MediaPickerFunctions';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewing from "react-native-image-viewing";
import VideoPlayer from "react-native-video-controls"
import * as Progress from 'react-native-progress';
import UUIDGenerator from 'react-native-uuid-generator';

import moment from 'moment'
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')

import firebase from 'react-native-firebase';
const db = firebase.firestore()
import * as REFS from '../../DB/CollectionsRefs'

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

import { PermissionsAndroid } from 'react-native';


export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.fileSrce = ''
    this.stgRef = ''

    this.ImageObjects = []

    //Appointment details
    this.doctorId = this.props.navigation.getParam('doctorId', '') //empty if URG2
    this.date = this.props.navigation.getParam('date', '')
    this.symptomes = this.props.navigation.getParam('symptomes', '')
    this.otherSymptomes = this.props.navigation.getParam('otherSymptomes', '')
    this.comment = this.props.navigation.getParam('comment', '')

    //Urgence details
    this.isUrgence = this.props.navigation.getParam('isUrgence', false) //if the appointment is urgent
    this.speciality = this.props.navigation.getParam('speciality', '') //not empty if URG2

    //On editing
    this.isEditing = this.props.navigation.getParam('isEditing', false)
    this.appId = this.props.navigation.getParam('appId', '')

    this.state = {
      currentUser: null,
      links: [],
      ImageObjects: [], // Array to store URLs of selected images

      VideoSource: '',  // path of video on the device
      VideoLink: '', //firebase storage link
      VideoUrl: '', //Video player url

      userName: '',
      isUploading: false,
      ImageToShow: '',
      isModalImageVisible: false,

      DocumentsRefs: [], //documents download urls to persist later (after payment) to the relative Appointment document
      progress: -1,

      isLoading1: false,
      isLoading2: false,
      isUploadCanceled: false,

    }

    this.uploadImages = this.uploadImages.bind(this);
    this.uploadVideo = this.uploadVideo.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    //this.cancelUpload = this.cancelUpload.bind(this);
    this.navigateToPayment = this.navigateToPayment.bind(this);
    this.skip = this.skip.bind(this);
    this.deleteImagefromDB = this.deleteImagefromDB.bind(this);
    this.deleteVideofromDB = this.deleteVideofromDB.bind(this);
    this.deleteVideo = this.deleteVideo.bind(this);
  }

  async componentDidMount() {
    if (this.isEditing) {
      this.fetchImages()
      this.fetchVideo()
    }
  }

  fetchImages() {
    console.log('fetching images...')
    if (this.isEditing) {
      this.setState({ ImageObjects: [] })
      return REFS.appointments.doc(this.appId).get().then((doc) => {
        //Fetch Images
        let links = doc.data().DocumentsRefs
        console.log(links)
        this.setState({ links })
        links.forEach((link) => {
          this.setState({ ImageObjects: [...this.state.ImageObjects, { fileSource: '', storageRef: '', link: link.downloadURL, ImageLink: link.downloadURL, ImageUrl: link.downloadURL, progress: -1, isDeleting: false }] })
        })
      })
    }
  }

  async fetchVideo() {
    console.log('Fetching video...')
    if (this.isEditing)
      REFS.appointments.doc(this.appId).get().then((doc) => {
        this.setState({ VideoSource: '' })
        if (doc.data().Video)
          this.setState({ VideoLink: doc.data().Video, VideoUrl: doc.data().Video })
      })
  }

  pickImages = async () => {
    // const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, { title: "Autoriser l'utilisation de la caméra" })

    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {

    ImagePicker.showImagePicker(imagePickerOptions, imagePickerResponse => {
      const { didCancel, error } = imagePickerResponse;
      if (didCancel) { console.log('Post canceled'); }
      //else if (error) { alert(error); }
      else if (error) { alert('Une erreur a été produite, veuillez réessayer.'); }
      else {
        console.log(imagePickerResponse)
        UUIDGenerator.getRandomUUID().then((uuid) => {
          return firebase.storage().ref('/Users/' + firebase.auth().currentUser.uid + '/Documents/' + uuid) //task: get filemname from path
        })
          .then((storageRef) => {
            let fileSource = getFileLocalPath((imagePickerResponse))
            this.setState({ ImageObjects: [...this.state.ImageObjects, { fileSource, storageRef, ImageUrl: imagePickerResponse.uri, ImageLink: '', progress: -1, isDeleting: false }] })
          })
      }
    })

    // }
  }

  pickVideo = () => {
    ImagePicker.launchCamera(options2, imagePickerResponse => {
      const { didCancel, error } = imagePickerResponse;
      if (didCancel) { console.log('Post canceled') }
      else if (error) { alert('An error occurred: ', error) }
      else {
        let VideoSource = getFileLocalPath((imagePickerResponse))
        this.setState({ VideoSource: VideoSource, VideoUrl: VideoSource, VideoLink: '' })
      }
    })
  }

  async uploadImages(ImageObjects) {

    let DocumentsRefs = []
    if (this.isEditing) DocumentsRefs = this.state.links

    if (ImageObjects.length > 0) {

      const promises = []
      ImageObjects.forEach((ImageObject, key) => {
        //Upload only new picked images
        if (ImageObject.ImageLink === '') {
          const reference = ImageObject.storageRef
          const uploadTask = reference.putFile(ImageObject.fileSource)
          promises.push(uploadTask)

          uploadTask.on('state_changed', function (snapshot) {
            var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            console.log('Upload image ' + key + ' is ' + progress + '% done')
            ImageObject.progress = progress
            this.setState({ ImageObjects })
          }.bind(this))
        }
      })

      if (promises.length === 0) return

      return Promise.all(promises)
        .then(async (result) => {
          console.log('ALL IMAGES ARE UPLOADED')

          const newDocumentsRefs = result.map((res) => ({ downloadURL: res.downloadURL }))
          DocumentsRefs = DocumentsRefs.concat(newDocumentsRefs)
          this.setState({ DocumentsRefs })

          if (this.isEditing)
            REFS.appointments.doc(this.appId).update({ DocumentsRefs, updatedBy: firebase.auth().currentUser.uid })
        })
    }
  }

  async uploadVideo(VideoSource) {
    console.log('uploading video...')

    const reference = firebase.storage().ref('/Users/' + firebase.auth().currentUser.uid + '/Videos/' + moment().format())
    const uploadTask = reference.putFile(VideoSource)

    const promise = new Promise((resolve, reject) => {

      console.log('1')
      uploadTask.on('state_changed', function (snapshot) {
        var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        console.log('Upload: ' + progress + '% done')
        this.setState({ VideoLink: '', isUploading: true, progress: progress / 100 })
      }.bind(this))

      uploadTask.then(async (res) => {
        console.log('Video uploaded !')

        console.log('555')
        this.setState({ VideoLink: res.downloadURL, VideoUrl: res.downloadURL })
        // this.setState({ VideoLink: res.downloadURL, VideoUrl: res.downloadURL, progress: progress / 100 })

        if (this.isEditing) {
          await REFS.appointments.doc(this.appId).update({ Video: res.downloadURL, updatedBy: firebase.auth().currentUser.uid })
          console.log('video url added to Firestore ')
        }

        console.log('3')
        resolve('success')
      })
        .catch(err => {
          this.setState({ isUploading: false })
          reject('failure')
        })

    })

    return promise

  }

  async uploadFiles() {
    const { ImageObjects, VideoSource, VideoLink, isLoading1, isLoading2, isUploading, progress } = this.state
    const noImages = ImageObjects.length === 0
    const noVideo = VideoSource === ''
    const noMedia = noImages && noVideo
    console.log('0')
    //Verifications
    if (isLoading1 || isLoading2 || isUploading) return

    if (!this.isEditing) {
      if (noMedia) {
        this.skip()
        return
      }

      //Verify if user navigated back (media are already uploaded)
      let imagesUploaded = true
      let videoUploaded = true

      if (!noImages)
        for (const image of ImageObjects) {
          if (image.progress < 100)
            imagesUploaded = false
        }

      if (!noVideo)
        videoUploaded = progress === 100

      const didGoBack = imagesUploaded && videoUploaded

      if (didGoBack) {
        this.navigateToPayment()
        return
      }
    }


    this.setState({ isUploading: true })
    // console.log('1')

    if (this.isEditing) {
      var newVideo = false
      var newImages = false

      var newVideo = VideoLink === '' && VideoSource !== ''

      for (const image of ImageObjects) {
        if (image.ImageLink === '')
          newImages = true
      }

      if ((!newImages && !newVideo) || noMedia) {
        Alert.alert('', 'Aucune nouvelle image ou vidéo sélectionnée.')
        this.setState({ isUploading: false })
        return
      }
    }

    let promises = []
    // console.log('2')

    //UPLOAD IMAGES
    if (ImageObjects.length > 0) {
      var uploadImagesPromise = this.uploadImages(ImageObjects)
      promises.push(uploadImagesPromise)
    }
    // console.log('3')

    //UPLOAD VIDEO
    if (VideoSource) {
      var uploadVideoPromise = this.uploadVideo(VideoSource)
      promises.push(uploadVideoPromise)
    }
    // console.log('4')

    Promise.all(promises).then(async () => {
      console.log('ALL PROMISES RESOLVED..')
      if (this.isEditing) this.props.navigation.goBack()
      else this.navigateToPayment()
    })
      .catch((e) => Alert.alert('', e))
      .finally(() => this.setState({ isUploading: false }))
  }

  async skip() {
    await setTimeout(() => {
      this.props.navigation.navigate('Payment', {
        doctorId: this.doctorId,
        date: this.date,
        symptomes: this.symptomes,
        otherSymptomes: this.otherSymptomes,
        comment: this.comment,
        isUrgence: this.isUrgence,
        speciality: this.speciality,
        DocumentsRefs: [],
        VideoRef: ''
      })
    }, 200)
  }

  async navigateToPayment() {

    await setTimeout(() => {
      this.props.navigation.navigate('Payment', {
        doctorId: this.doctorId,
        date: this.date,
        symptomes: this.symptomes,
        otherSymptomes: this.otherSymptomes,
        comment: this.comment,
        isUrgence: this.isUrgence,
        speciality: this.speciality,
        DocumentsRefs: this.state.DocumentsRefs,
        VideoRef: this.state.VideoLink,
      })
    }, 200)
  }

  toggleModalImage(link) {
    this.setState({ isModalImageVisible: !this.state.isModalImageVisible, ImageToShow: link })
  }

  //IMAGE DELETE
  deleteImage(link, index) {
    if (this.isEditing) {
      if (link !== '') this.deleteImagefromDB(link, index)  //Document existing in DB
      else if (link === '') this.spliceImage(index)  //Document is still in local
    }

    else this.spliceImage(index)
  }

  spliceImage(index) {
    const ImageObjects = this.state.ImageObjects
    ImageObjects.splice(index, 1)
    this.setState({ ImageObjects })
  }

  //#task: optimize & clean it
  deleteImagefromDB(link, index) {
    let { ImageObjects } = this.state
    ImageObjects[index].isDeleting = true
    this.setState({ ImageObjects })

    let Ref = firebase.storage().refFromURL(link)
    Ref.delete().then(() => {

      REFS.appointments.doc(this.appId).get().then(async (doc) => {

        let DocumentsRefs = doc.data().DocumentsRefs

        for (let i = 0; i < DocumentsRefs.length; i++) {
          if (DocumentsRefs[i].downloadURL === link)
            var key = i
        }
        if (key !== -1) DocumentsRefs.splice(key, 1)

        await REFS.appointments.doc(this.appId).update({ DocumentsRefs, updatedBy: firebase.auth().currentUser.uid })
        this.spliceImage(index)
      })
        .then(() => this.fetchImages())
    })
      .catch((error) => console.error(error))
      .finally(() => {
        ImageObjects[index].isDeleting = false
        this.setState({ ImageObjects })
      })
  }

  renderCrossIconImage(link, index, progress) {
    const { isUploading } = this.state

    if (isUploading)
      return <View style={{ padding: 5 }} />

    else {
      return (
        <TouchableOpacity style={styles.removeIcon} onPress={() => this.deleteImage(link, index)}>
          <Icon name="remove" size={SCREEN_WIDTH * 0.05} color="#93eafe" onPress={() => this.deleteImage(link, index)} />
        </TouchableOpacity>
      )
    }
  }

  //VIDEO DELETE
  deleteVideo() {
    const { VideoLink, progress } = this.state

    if (this.isEditing) {
      if (VideoLink !== '') this.deleteVideofromDB(VideoLink) //Video existing in DB
      else this.setState({ VideoSource: '', VideoLink: '', progress: -1 }) //Video is still in local
    }

    else this.setState({ VideoSource: '', VideoLink: '', progress: -1 })
  }

  deleteVideofromDB() {
    this.setState({ isLoading2: true })
    console.log('0')
    console.log(this.state.VideoLink)
    let Ref = firebase.storage().refFromURL(this.state.VideoLink)
    Ref.delete().then(() => {
      console.log('video deleted from storage')

      REFS.appointments.doc(this.appId).get().then((doc) => {
        doc.ref.update({ Video: '', updatedBy: firebase.auth().currentUser.uid })
        this.setState({ VideoSource: '', VideoLink: '', progress: -1 })
      })

    })
      .catch((e) => console.error(e))
      .finally(() => this.setState({ isLoading2: false }))
  }

  renderCrossIconVideo() {
    const { isUploading } = this.state

    if (isUploading) return <View style={{ padding: 5 }} />

    else return (
      <TouchableOpacity onPress={this.deleteVideo} style={styles.removeIcon}>
        <Icon name="remove" size={SCREEN_WIDTH * 0.05} color="#93eafe" onPress={this.deleteVideo} />
      </TouchableOpacity>
    )
  }

  // cancelUpload() {
  //   this.setState({ isUploadCanceled: true })
  // }

  render() {
    let ImageObjectList = []

    ImageObjectList = this.state.ImageObjects.map((ImageObject, index) => {
      if (!ImageObject.isDeleting)
        return (
          <TouchableOpacity
            key={index}
            style={{ flexDirection: 'row', alignItems: 'center', width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.05, justifyContent: 'space-between', paddingLeft: SCREEN_WIDTH * 0.05, paddingRight: SCREEN_WIDTH * 0.05, marginBottom: StyleSheet.hairlineWidth * 3, borderLeftWidth: 15, borderLeftColor: '#93eafe' }}
            onPress={() => this.toggleModalImage(ImageObject.ImageUrl)}>
            <Text> Document {index + 1} </Text>
            {ImageObject.progress !== -1 && <Progress.Bar progress={ImageObject.progress / 100} width={100} color='#93eafe' />}
            {ImageObject.progress !== -1 && <Text style={{ color: 'gray', fontSize: 10 }}>{ImageObject.progress} %</Text>}
            {this.renderCrossIconImage(ImageObject.ImageLink, index, ImageObject.progress)}
          </TouchableOpacity>
        )

      else return (
        <View style={{ flexDirection: 'row', alignItems: 'center', width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.05, justifyContent: 'space-between', paddingLeft: SCREEN_WIDTH * 0.05, paddingRight: SCREEN_WIDTH * 0.05, marginBottom: StyleSheet.hairlineWidth * 3, borderLeftWidth: 15, borderLeftColor: '#93eafe' }}>
          <View style={[{ flexDirection: 'row' }]}>
            <Text style={{ color: 'gray', marginRight: 10 }}>Supression en cours...</Text>
            <ActivityIndicator size='small' />
          </View>
        </View>
      )
    })


    let VideoObject = null
    if (this.state.VideoLink !== '' || this.state.VideoSource !== '') {
      if (!this.state.isLoading2)
        VideoObject =
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.05, justifyContent: 'space-between', paddingLeft: SCREEN_WIDTH * 0.05, paddingRight: SCREEN_WIDTH * 0.05, marginBottom: StyleSheet.hairlineWidth * 3, borderLeftWidth: 5, borderLeftColor: '#93eafe' }}
            onPress={() => this.props.navigation.navigate('VideoPlayer', { videoLink: this.state.VideoUrl })}>
            <Text>  Vidéo explicative </Text>
            {this.state.progress !== -1 && <Progress.Bar progress={this.state.progress} width={100} style={{ alignSelf: 'center' }} color='#93eafe' />}
            {this.state.progress !== -1 && <Text style={{ color: 'gray', fontSize: 10, marginLeft: SCREEN_WIDTH * 0.025 }}>{this.state.progress * 100} %</Text>}
            {this.renderCrossIconVideo()}
          </TouchableOpacity>

      else
        VideoObject =
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderLeftWidth: 15, borderLeftColor: '#93eafe' }}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: 'gray', marginRight: 10 }}>Supression en cours...</Text>
              <ActivityIndicator size='small' />
            </View>
          </View>
    }

    let images = [{ uri: this.state.ImageToShow }]

    return (
      <View style={{ flex: 1 }} >

        <ImageViewing
          images={images}
          imageIndex={0}
          presentationStyle="overFullScreen"
          visible={this.state.isModalImageVisible}
          onRequestClose={() => this.setState({ isModalImageVisible: false })}
        />

        <View style={styles.container} >

          {!this.isEditing ?
            <View style={styles.bar_progression}>
              <View style={[styles.bar, styles.activeBar]} />
              <View style={[styles.bar, styles.activeBar]} />
              <View style={[styles.bar, styles.activeBar]} />
            </View> :
            <View style={styles.bar_progression}>
            </View>}

          {/* <View style={styles.header_container}>
            <Text style={styles.header}> Documents/videos/photos </Text>
          </View> */}

          <View style={styles.uploadFile_container}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: "#48494B", paddingBottom: 5 }}>Ajouter des documents<Text style={{ fontSize: 10 }}> (ordonnance...) </Text ></Text>

            <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', paddingBottom: SCREEN_HEIGHT * 0.02 }}>
              <TouchableHighlight style={styles.uploadButton} onPress={this.pickImages} underlayColor={'#93eafe'} disabled={this.state.isUploading}>
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
          </View>

          <View style={{ flex: 0.3 }}>
            <View style={styles.headerVideo_container}>
              <Icon name="lock"
                size={SCREEN_WIDTH * 0.05}
                color="gray" />
              <View style={styles.headerVideo_text}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: "#48494B", }}> Ajouter une vidéo explicative </Text>
                <Text style={{ fontSize: 8.5, fontWeight: 'bold', color: "#48494B", }}> Vos documents seront protégées et stockées dans un serveur sécurisé</Text>
              </View>
            </View>

            <View style={styles.video_container}>
              <TouchableOpacity onPress={this.pickVideo} style={styles.buttonAddVideo} disabled={this.state.isUploading}>
                <Icon1 name="video-camera"
                  size={SCREEN_WIDTH * 0.05}
                  color="#93eafe" />
              </TouchableOpacity>
              {VideoObject}
            </View>
          </View>

          <View style={styles.button_container}>
            {!this.isEditing && !this.state.isUploading && !this.state.isLoading1 && !this.state.isLoading2 &&
              <TouchableOpacity onPress={this.skip} style={styles.skipButton} disabled={this.state.isUploading}>
                <Text style={styles.buttonText1}>Passer cette étape</Text>
              </TouchableOpacity>}

            {!this.state.isUploading && !this.state.isLoading1 && !this.state.isLoading2 &&
              <TouchableOpacity onPress={this.uploadFiles}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
                  style={styles.linearGradient}>
                  <Text style={styles.buttonText2}>Confirmer</Text>
                </LinearGradient>
              </TouchableOpacity>
              // <TouchableOpacity onPress={this.cancelUpload}>
              //   <LinearGradient
              //     start={{ x: 0, y: 0 }}
              //     end={{ x: 1, y: 0 }}
              //     colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
              //     style={styles.linearGradient}>
              //     <Text style={styles.buttonText2}>Annuler</Text>
              //   </LinearGradient>
              // </TouchableOpacity>
            }

          </View>

        </View>
        {/* } */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: 'green'
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
    flex: 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'blue',
  },
  header: {
    fontSize: SCREEN_HEIGHT * 0.025,
    fontWeight: 'bold',
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'black',
    //backgroundColor: '#93eafe',
    marginBottom: SCREEN_HEIGHT * 0.01
  },
  uploadFile_container: {
    flex: 0.5,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    paddingTop: 10
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
    elevation: 3,
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
    elevation: 3,
    marginTop: SCREEN_HEIGHT * 0.03,
    marginBottom: SCREEN_HEIGHT * 0.01,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerVideo_container: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    alignSelf: 'center',
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: SCREEN_WIDTH * 0.05,
    width: SCREEN_WIDTH * 0.75,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    //margin: 15,
    marginTop: 15,
    marginBottom: SCREEN_HEIGHT * 0.03,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  video_container: {
    paddingTop: SCREEN_HEIGHT * 0.03,
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
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SCREEN_HEIGHT * 0.03
  },
  button_container: {
    flex: 0.1,
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
    elevation: 3,
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
    fontSize: SCREEN_HEIGHT * 0.017,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  loading_container: {
    marginVertical: SCREEN_HEIGHT * 0.25,
    padding: SCREEN_HEIGHT * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    //borderColor: '#93eafe',
    //borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    margin: 15,
  },
  removeIcon: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
