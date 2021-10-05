
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Button, Image } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import { imagePickerOptions, getFileLocalPath } from '../../../util/MediaPickerFunctions';
import { InitializeDoctorId } from '../../../functions/functions'
import firebase from 'react-native-firebase';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux'

import ImageViewing from "react-native-image-viewing";

const db = firebase.firestore()
import * as REFS from '../../../DB/CollectionsRefs'
import { Alert } from 'react-native';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class Diplomes extends React.Component {
  constructor(props) {
    super(props);
    this.fileSrce = null
    this.stgRef = null
    this.ImageObjects = []

    this.doctor_id_param = this.props.navigation.getParam('doctor_id', '')  //received from admin or doctor navigation params

    this.state = {
      ImageURI: null,
      ImageObjects: [], // task: Initialize it

      diplomes: [],
      DiplomeStorageRef: '',
      DiplomeSource: '',
      DiplomeTitle: '',
      ismodalVisible: false,

      isUploading: false,
      isModalImageVisible: false,
      ImageToShow: '',
    }

    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount() {
    InitializeDoctorId(this)

    this.unsubscribe = REFS.doctors.doc(this.doctor_id).onSnapshot((doc) => {
      this.setState({ diplomes: doc.data().diplomes })
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  pickImage = () => {
    ImagePicker.showImagePicker(imagePickerOptions, imagePickerResponse => {
      const { didCancel, error } = imagePickerResponse;
      if (didCancel) { console.log('Post canceled'); }
      else if (error) { alert('An error occurred: ', error); }

      else {
        this.setState({ DiplomeSource: getFileLocalPath((imagePickerResponse)), ismodalVisible: true })
      }
    })
  }

  toggleModal = async (param) => {
    if (param === 'confirm') {
      if (this.state.DiplomeTitle === '')
        Alert.alert('', 'Veuillez saisir le titre du diplôme.')

      else this.uploadFile()
    }


    else if (param === 'cancel') {
      const { ImageObjects } = this.state
      ImageObjects.pop()
      this.setState({ ImageObjects, DiplomeTitle: '', DiplomeSource: '', ismodalVisible: !this.state.ismodalVisible })
    }

    else this.setState({ ismodalVisible: !this.state.ismodalVisible, DiplomeTitle: '' })
  }

  uploadFile() {
    this.setState({ isUploading: true })
    let { DiplomeSource, DiplomeTitle, diplomes } = this.state
    this.toggleModal()

    const DiplomeStorageRef = firebase.storage().ref('/Doctors/' + this.doctor_id + '/Diplomes/' + DiplomeTitle)

    Promise.resolve(DiplomeStorageRef.putFile(DiplomeSource)).then((URLObject) => {
      diplomes.push({ image: URLObject.downloadURL, titre: DiplomeTitle })
      REFS.doctors.doc(this.doctor_id).update({ diplomes })
        .then(() => console.log('Diplome URL persisted to FireStore'))
        .catch(err => console.log(err))
        .finally(() => this.setState({ isUploading: false }))
    })
  }

  async deleteDiplome(title, index) {
    let { diplomes } = this.state
    diplomes[index].isDeleting = true
    this.setState({ diplomes })

    try {
      let storageRef = firebase.storage().ref('/Doctors/' + this.doctor_id + '/Diplomes/' + title);
      await storageRef.delete()
      diplomes.splice(index, 1)
      await REFS.doctors.doc(this.doctor_id).update({ diplomes })
    }

    catch (e) {
      console.error(e)
      diplomes[index].isDeleting = false
      this.setState({ diplomes })
      Alert.alert('Erreur lors de la suppression du document, veuillez réessayer plutard')
    }
  }

  removeImage(index) {
    const ImageObjects = this.state.ImageObjects
    ImageObjects.splice(index, 1)
    this.setState({ ImageObjects: ImageObjects })
  }

  toggleModalImage(link) {
    this.setState({ isModalImageVisible: !this.state.isModalImageVisible, ImageToShow: link })
  }

  renderButtonText() {
    if (this.props.role === 'isAdmin')
      return <Text style={styles.buttonText2}>Retour au profil du médecin</Text>
    else if (this.props.role === 'isDoctor')
      return <Text style={styles.buttonText2}>Retour à mon profil</Text>
  }

  renderForm() {
    const component = (
      <View style={{ flex: 1, alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.1 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: SCREEN_HEIGHT * 0.04 }}>Titre du diplôme</Text>

        <View style={[modalStyles.picker_container, { marginBottom: SCREEN_HEIGHT * 0.03 }]}>
          <TextInput
            onChangeText={(DiplomeTitle) => this.setState({ DiplomeTitle })}
            placeholder={'Exp: Diplôme en médecine générale'}
            value={this.state.DiplomeTitle}
            autoCapitalize
            style={{ width: SCREEN_WIDTH * 0.8, height: SCREEN_HEIGHT * 0.1 }} />
        </View>
      </View>
    )

    const buttonsComponent = (
      <View style={modalStyles.modalButtons_container}>
        <TouchableOpacity style={modalStyles.CancelButton} onPress={() => this.toggleModal('cancel')}>
          <Text style={modalStyles.buttonText1}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.toggleModal('confirm')}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
            style={modalStyles.ConfirmButton}>
            <Text style={modalStyles.buttonText2}>Confirmer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )

    return (
      <View style={{ flex: 1 }}>
        {component}
        {buttonsComponent}
      </View>
    )
  }

  render() {
    let images = [{ uri: this.state.ImageToShow }]

    const ImageObjectList = this.state.diplomes.map((diplome, index) => {
      return (
        <TouchableOpacity style={styles.diplome} key={index} onPress={() => this.toggleModalImage(diplome.image)}>
          <Text style={{ flex: 0.9 }}>{diplome.titre}</Text>
          {diplome.isDeleting ?
            <ActivityIndicator size='small' style={{ flex: 0.1, marginRight: 5 }} />
            :
            <Icon name="remove" size={19} color="#93eafe" onPress={() => this.deleteDiplome(diplome.titre, index)} style={{ flex: 0.1 }} />
          }
        </TouchableOpacity>
      )
    })

    return (
      <View style={styles.container} >

        <View style={styles.header_container}>
          <Text style={styles.header}> Mes diplômes/certifications </Text>
        </View>

        <View style={styles.uploadFile_container}>
          {this.state.isUploading
            ?
            <View style={[styles.uploadButton, { width: SCREEN_WIDTH * 0.7, justifyContent: 'space-evenly', alignItems: 'center' }]}>
              <Text style={{ color: 'gray', fontSize: SCREEN_HEIGHT * 0.015 }}>Document en cours d'importation</Text>
              <ActivityIndicator size='small' />
            </View>
            :
            <TouchableOpacity style={styles.uploadButton} onPress={this.pickImage}>
              <Text style={{ color: 'gray' }}> Ajouter un diplôme </Text>
              <Icon name="upload" size={SCREEN_WIDTH * 0.04} color="#BDB7AD" />
            </TouchableOpacity>
          }
        </View>


        <View style={styles.listDiplomes_container}>
          <ScrollView>
            {ImageObjectList}
          </ScrollView>
        </View>


        <View style={styles.button_container}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
              style={[styles.linearGradient, { width: SCREEN_WIDTH * 0.5 }]}>
              {this.renderButtonText()}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Modal
          isVisible={this.state.ismodalVisible}
          animationIn="fadeIn"
          animationOut="fadeOut"
          style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
          {this.renderForm()}
        </Modal>

        {/*Display diplome on press*/}
        <ImageViewing
          images={images}
          imageIndex={0}
          presentationStyle="overFullScreen"
          visible={this.state.isModalImageVisible}
          onRequestClose={() => this.setState({ isModalImageVisible: false })}
        />

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    role: state.roles.role,
  }
}

export default connect(mapStateToProps)(Diplomes)

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
  h2_container: {
    height: SCREEN_HEIGHT * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: SCREEN_WIDTH * 0.02
  },
  h2: {
    fontSize: 15,
    fontWeight: 'bold',
    color: "#48494B",
    paddingBottom: 5
  },
  header_container: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'pink',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: '#000',
    //backgroundColor: 'green',
    marginBottom: SCREEN_HEIGHT * 0.01
  },
  uploadFile_container: {
    flex: 0.15,
    width: SCREEN_WIDTH,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
    //backgroundColor: 'yellow'
  },
  listDiplomes_container: {
    flex: 0.55,
    //backgroundColor: 'green',
  },
  diplome: {
    flexDirection: 'row',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 1,
    paddingLeft: SCREEN_WIDTH * 0.05,
    marginBottom: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#93eafe',
    backgroundColor: '#ffffff'
  },
  ImageListElement: {
    flex: 1,
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffff',
    borderRadius: 50,
    //borderWidth: 1, 
    //borderColor: '#93eafe',
    padding: SCREEN_WIDTH * 0.03,
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
  uploadButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 15,
    width: SCREEN_WIDTH * 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
  },
  button_container: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'orange'
  },
  linearGradient: {
    justifyContent: 'center',
    borderRadius: 30,
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.33,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
  },
  buttonText1: {
    fontSize: 12,
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    color: 'gray',
    backgroundColor: 'transparent',
  },
  buttonText2: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
})

const modalStyles = StyleSheet.create({

  picker_container: {
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // marginVertical: 0, 
    //marginTop: 5, 
    height: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.8,
    paddingLeft: 20,
    paddingRight: 10
  },
  //Buttons confirme/cancel
  modalButtons_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 15
  },
  ConfirmButton: {
    paddingTop: SCREEN_HEIGHT * 0.005,
    paddingBottom: SCREEN_HEIGHT * 0.005,
    borderRadius: 30,
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.06,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
  },
  CancelButton: {
    paddingTop: SCREEN_HEIGHT * 0.005,
    paddingBottom: SCREEN_HEIGHT * 0.005,
    borderRadius: 30,
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT * 0.06,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    backgroundColor: '#fff'
  },
  buttonText2: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  buttonText1: {
    fontSize: 12,
    fontFamily: 'Avenir',
    textAlign: 'center',
    margin: SCREEN_HEIGHT * 0.012,
    color: 'gray',
    backgroundColor: 'transparent',
  },
})

