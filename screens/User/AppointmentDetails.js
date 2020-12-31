import { View, Text, Button, Dimensions, Image, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, TouchableHighlight, StyleSheet } from 'react-native'
import React from 'react';
import { imagePickerOptions, getFileLocalPath } from '../../util/MediaPickerFunctions';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewing from "react-native-image-viewing";
import VideoPlayer from "react-native-video-controls"


import firebase from 'react-native-firebase'
import * as REFS from '../../DB/CollectionsRefs'
import { connect } from 'react-redux'

import { toggleLeftSideMenu, navigateToMedicalFolder, navigateToScreen, signOutUserandToggle } from '../../Navigation/Navigation_Functions'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';

import Modal from "react-native-modal";

import Header from '../../components/Header'
import LeftSideMenu from '../../components/LeftSideMenu'
import Loading from '../../components/Loading'
import ImageFooter from "../../components/ImageFooter";

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import ImagePicker from 'react-native-image-picker';
import { Alert } from 'react-native';

const options = {
  title: 'Selectionnez une image',

  takePhotoButtonTitle: 'Prendre une photo avec la caméra',
  chooseFromLibraryButtonTitle: 'Choisir une photo dans la gallerie',

  // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.14 * ratioLogo;

class AppointmentDetails extends React.Component {
  constructor(props) {
    super(props);
    this.appId = this.props.navigation.getParam('appId', 'nothing sent')

    this.mainContainerFlex = 0.85
    if (this.props.role === 'isDoctor')
      this.mainContainerFlex = 1

    this.handleNotes = this.handleNotes.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.renderPatientDocuments = this.renderPatientDocuments.bind(this);
    this.renderDoctorDocuments = this.renderDoctorDocuments.bind(this);
    this.renderSymptoms = this.renderSymptoms.bind(this);
    this.renderVideo = this.renderVideo.bind(this);

    this.state = {
      isLoading: false,
      doctor_id: '',
      doctorName: '',
      doctorSpeciality: '',

      patient_id: '',
      patientName: '',
      patientCountry: '',

      date: '',
      nature: '',
      state: '',

      comment: '',
      symptoms: [],

      //allergies: [],
      noinput: true,
      isLoading: false,

      //Appointment details
      documents: [],
      video: '',

      //Rapport 
      notes: '',
      isEditingNotes: false,

      isModalImageVisible: false,
      ImageToShow: '',
      isDoctorImage: false,

      //Handle doctor documents (Rapport)
      DocumentSource: '',
      DocumentStorageRef: '',
      ismodalVisible: false,
      DocumentTitle: '',
      doctorDocuments: [],

      //Navigation
      isLeftSideMenuVisible: false,

      //Uploading
      isUploading: false,

      marginLeftKey: 0,

      //Payment info
      paymentStatus: ''
    }
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    await this.getAppointmentDetails();
    await this.doctorDocumentsListener()
    this.setState({ isLoading: false })

    // const { navigation } = this.props;
    // navigation.addListener('willFocus', async () => {
    //   this.getAppointmentDetails()
    // });
  }

  componentWillUnmount() {
    this.unsubscribeFromAppointments()
    this.unsubscribeFromDoctorDocuments()
  }

  //Fetch data from DB
  getAppointmentDetails() {
    this.unsubscribeFromAppointments = REFS.appointments.doc(this.appId).onSnapshot((doc) => {
      //Infos de la consultation
      this.setState({
        patient_id: doc.data().user_id,
        doctor_id: doc.data().doctor_id,
        doctorName: doc.data().doctorName,
        doctorSpeciality: doc.data().doctorSpeciality,
        patientName: doc.data().userName,
        patientCountry: doc.data().userCountry,
      })

      let date = moment(doc.data().date).format('LL')

      let time = ''
      if (!doc.data().urgence2)
        time = ' à ' + moment(doc.data().date).format('HH:mm')

      let timeslot = date + time
      this.setState({ date: timeslot })
      this.setState({ nature: doc.data().nature })

      //Etat
      if (doc.data().cancelBP)
        this.setState({ state: 'Annulée' })

      else if (doc.data().finished)
        this.setState({ state: 'Terminée' })

      else if (doc.data().state.CBP && !doc.data().cancelBP && !doc.data().finished)
        this.setState({ state: 'Confirmée' })

      //Données de la consultation
      if (doc.data().symptomes)
        this.setState({ symptoms: doc.data().symptomes })

      if (doc.data().comment)
        this.setState({ comment: doc.data().comment })

      if (doc.data().notes)
        this.setState({ notes: doc.data().notes })

      else this.setState({ isEditingNotes: true })

      if (doc.data().DocumentsRefs)
        this.setState({ documents: doc.data().DocumentsRefs })

      if (doc.data().Video)
        this.setState({ video: doc.data().Video })

      //Rapport
      this.setState({ doctorDocuments: doc.data().doctorDocuments })

      //Facturation
      return REFS.paymentintents.where('id', '==', doc.data().pi_id).get().then((querysnapshot) => {
        const piDoc = querysnapshot.docs[0]
        if (piDoc.data().status === 'succeeded') {

          this.setState({ price: piDoc.data().amount / 100 + ' ' + piDoc.data().currency, paymentStatus: 'Payé' }) //if euro & dollar
        }

        else if (piDoc.data().charges.data[0].refunded)
          this.setState({ price: piDoc.data().amount / 100 + ' ' + piDoc.data().currency, paymentStatus: 'Remboursé' }) //if euro & dollar
      })
    })
  }

  doctorDocumentsListener() {
    this.unsubscribeFromDoctorDocuments = REFS.appointments.doc(this.appId).onSnapshot((doc) => {
      this.setState({ doctorDocuments: doc.data().doctorDocuments })
    })
  }

  //Toggle Modals
  toggleModalImage(doc, isDoctorImage) {
    if (isDoctorImage)
      this.setState({ isModalImageVisible: !this.state.isModalImageVisible, ImageToShow: doc, isDoctorImage: true })

    else
      this.setState({ isModalImageVisible: !this.state.isModalImageVisible, ImageToShow: doc.downloadURL })
  }

  toggleModal = async (param) => {
    if (param === 'confirm') {
      if (this.state.DocumentTitle === '') return
      else this.uploadFile()
    }

    else if (param === 'cancel') {
      this.setState({ DocumentTitle: '', ismodalVisible: false, DocumentSource: '' })
    }
  }

  //Components
  //Remarques générales accés par rôle (Doc, Admin, Patient)
  renderData() {
    const { patientName, doctorName, doctorSpeciality, date, nature, state } = this.state
    const { price, paymentStatus, isLoading } = this.state
    const { role } = this.props

    const infosPatient = [{ label: 'Médecin', value: doctorName }, { label: 'Spécialité', value: doctorSpeciality }, { label: 'Date', value: date }, { label: 'Nature', value: nature }, { label: 'Etat', value: state }]
    const infosDoctor = [{ label: 'Patient', value: patientName }, { label: 'Date', value: date }, { label: 'Nature', value: nature }, { label: 'Etat', value: state }]
    const infosAdmin = [{ label: 'Médecin', value: doctorName }, { label: 'Spécialité', value: doctorSpeciality }, { label: 'Patient', value: patientName }, { label: 'Date', value: date }, { label: 'Nature', value: nature }, { label: 'Etat', value: state }]
    const infoPayment = [{ label: 'Tarif', value: price }, { label: 'Statut du paiement', value: paymentStatus }]

    let data = []

    if (role === 'isPatient') data = infosPatient
    else if (role === 'isAdmin') data = infosAdmin
    else if (role === 'isDoctor') data = infosDoctor

    let pen = this.renderPen()
    let remarques = this.renderTextArea()
    let valider = this.renderValider()

    if (!isLoading)
      return (
        <ScrollView style={{ flex: 1 }}>

          {/* Détails */}
          <Text style={styles.mainHeader}>Détails de la consultation</Text>

          {/* Card 1 */}
          <View style={styles.card}>

            <View style={{ flexDirection: 'row' }}>
              <Icon name="information" size={SCREEN_WIDTH * 0.05} color="#93E7FF" style={{ marginRight: SCREEN_WIDTH * 0.015 }} />
              <Text style={styles.headerText}>
                Informations sur la consultation
            </Text>
            </View>

            {/* Infos consultation */}
            {data.map(function (element, key) {
              let fontStyle = 'none'
              let textColor = '#000'

              if (element.label === "Médecin" || element.label === "Patient")
                fontStyle = 'underline'

              if (element.label === 'Etat') {
                if (element.value === 'Confirmée')
                  textColor = 'green'
                else if (element.value === 'Annulée')
                  textColor = 'red'
                else if (element.value === 'Terminée')
                  textColor = '#93E7FF'
              }

              return (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={{ flex: 0.35, color: '#333', fontStyle: 'italic', marginBottom: SCREEN_HEIGHT * 0.015 }}>{element.label}:</Text>
                  <Text style={{ flex: 0.65, textAlign: 'left', color: textColor, textDecorationLine: fontStyle }} onPress={() => {
                    if (element.label === 'Médecin') {
                      let doctor = null
                      REFS.doctors.doc(this.state.doctor_id[0]).get().then((doc) => {
                        const id = doc.id
                        doctor = doc.data()
                        doctor.id = id
                        doctor.isSelected = false
                      })
                        .then(() => this.props.navigation.navigate('DoctorFile', { doctor: doctor, isUrgence: false, role: this.props.role }))
                        .catch((err) => console.error(err))
                    }

                    else if (element.label === 'Patient') {
                      this.props.navigation.navigate('MedicalFolder', { role: this.props.role, user_id: this.state.patient_id })
                    }
                  }}>
                    {element.value}
                  </Text>
                </View>)
            }.bind(this))}



            {/* Données de la consultation */}
            <View style={{ flexDirection: 'row', marginTop: SCREEN_HEIGHT * 0.02 }}>
              <Icon name="database-lock" size={SCREEN_WIDTH * 0.05} color="#93E7FF" style={{ marginRight: SCREEN_WIDTH * 0.015 }} />
              <Text style={styles.headerText}>
                Données de la consultation
            </Text>
            </View>

            {/* Symptoms */}
            <View style={{ flex: 1, flexDirection: 'row', marginBottom: SCREEN_HEIGHT * 0.019 }}>

              <View style={{ flex: 0.88, flexDirection: 'row' }}>
                <Text style={{ flex: 0.35, color: '#333', fontStyle: 'italic', marginBottom: SCREEN_HEIGHT * 0.015 }}>Symptômes:</Text>
                <View style={{ flex: 0.65, alignItems: 'flex-start', flexWrap: 'wrap', flexDirection: 'row' }}>
                  {this.renderSymptoms()}
                </View>
              </View>

              <View style={{ flex: 0.12, justifyContent: 'flex-start', alignItems: 'center' }}>
                {this.props.role === 'isAdmin' || this.props.role === 'isPatient' ?
                  <Icon name="pen"
                    size={SCREEN_WIDTH * 0.05}
                    color="#93E7FF"
                    onPress={() => this.props.navigation.navigate('Symptomes', { appId: this.appId, isEditing: true })} />
                  : null}
              </View>

            </View>

            {/* Documents */}
            <View style={{ flex: 1, flexDirection: 'row', marginBottom: SCREEN_HEIGHT * 0.019 }}>

              <View style={{ flex: 0.88, flexDirection: 'row' }}>
                <Text style={{ flex: 0.35, color: '#333', fontStyle: 'italic', marginBottom: SCREEN_HEIGHT * 0.015 }}>Documents:</Text>
                <View style={{ flex: 0.65, flexDirection: 'row', flexWrap: 'wrap' }}>
                  {this.renderPatientDocuments()}
                </View>
              </View>

              <View style={{ flex: 0.12, justifyContent: 'flex-start', alignItems: 'center' }}>
                {this.props.role === 'isAdmin' || this.props.role === 'isPatient' ?
                  <Icon name="pen"
                    size={SCREEN_WIDTH * 0.05}
                    color="#93E7FF"
                    onPress={() => this.props.navigation.navigate('Upload', { appId: this.appId, isEditing: true })} />
                  : null}
              </View>

            </View>

            {/* Video */}
            <View style={{ flex: 1, flexDirection: 'row' }}>

              <View style={{ flex: 0.88, flexDirection: 'row' }}>
                <Text style={{ flex: 0.35, color: '#333', fontStyle: 'italic', marginBottom: SCREEN_HEIGHT * 0.015 }}>Vidéo:</Text>
                <View style={{ flex: 0.65, flexDirection: 'row', flexWrap: 'wrap' }}>
                  {this.renderVideo()}
                </View>
              </View>

              <View style={{ flex: 0.12, justifyContent: 'flex-start', alignItems: 'center' }}>
                {this.props.role === 'isAdmin' || this.props.role === 'isPatient' ?
                  <Icon name="pen"
                    size={SCREEN_WIDTH * 0.05}
                    color="#93E7FF"
                    onPress={() => this.props.navigation.navigate('Upload', { appId: this.appId, isEditing: true })} />
                  : null}
              </View>

            </View>

          </View>

          {/* Rapport */}
          <Text style={styles.mainHeader}>Rapport de la consultation</Text>

          {/* Card 2 */}
          <View style={[styles.card, { padding: SCREEN_WIDTH * 0.02, paddingBottom: SCREEN_WIDTH * 0.03, }]}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <Icon2 name="notes-medical"
                  size={SCREEN_WIDTH * 0.05}
                  color="#93E7FF"
                  style={{ marginRight: SCREEN_WIDTH * 0.015 }} />
                <Text style={styles.headerText}>
                  Remarques générales
              </Text>
              </View>

              {pen}

            </View>

            {remarques}
            {valider}

            <Text style={[styles.headerText, { marginTop: SCREEN_HEIGHT * 0.03 }]}>
              <Icon name="upload" size={SCREEN_WIDTH * 0.05} color="#93E7FF" /> Importer des documents
          </Text>

            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
              {this.renderDoctorDocuments()}
              {this.renderPlusButton()}
            </View>

          </View>

          {/* Détails */}
          <Text style={styles.mainHeader}>Facturation</Text>

          {/* Card 1 */}
          <View style={styles.card}>
            <View style={{ flexDirection: 'row' }}>
              <Icon name="information" size={SCREEN_WIDTH * 0.05} color="#93E7FF" style={{ marginRight: SCREEN_WIDTH * 0.015 }} />
              <Text style={styles.headerText}>
                Informations sur le paiement
          </Text>
            </View>

            {/* Infos consultation */}
            {infoPayment.map(function (element, key) {
              let fontStyle = 'none'
              let textColor = '#000'

              return (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={{ flex: 0.35, color: '#333', fontStyle: 'italic', marginBottom: SCREEN_HEIGHT * 0.015 }}>{element.label}:</Text>
                  <Text style={{ flex: 0.65, textAlign: 'left', color: textColor, textDecorationLine: fontStyle }}>{element.value}</Text>
                </View>
              )
            }.bind(this))}

          </View>

        </ScrollView>
      )

    else return <Loading />
  }

  renderPen() {
    const { isEditingNotes } = this.state
    const { role } = this.props

    if (!isEditingNotes && (role === 'isDoctor' || role === 'isAdmin'))
      return <Icon name="pen" size={SCREEN_WIDTH * 0.05} color="#93E7FF" onPress={() => this.setState({ isEditingNotes: true })} />

    else return null
  }

  renderTextArea() {
    const { isEditingNotes, notes } = this.state
    const { role } = this.props

    if (isEditingNotes && (role === 'isDoctor' || role === 'isAdmin'))
      return (
        <TextInput
          onChangeText={(notes) => this.setState({ notes })}
          value={notes}
          style={{ height: 150, justifyContent: "flex-start", borderLeftRadius: 25, borderRightRadius: 25, backgroundColor: '#fff', padding: 15, textAlignVertical: 'top' }}
          underlineColorAndroid="transparent"
          placeholder="Tapez ici ..."
          placeholderTextColor="gray"
          numberOfLines={10}
          multiline={true}
        />
      )

    else return (
      <View style={{ justifyContent: "flex-start", borderLeftRadius: 25, borderRightRadius: 25, backgroundColor: '#fff', padding: 15, textAlignVertical: 'top' }}>
        <Text>{notes}</Text>
      </View>
    )
  }

  renderValider() {
    const { isEditingNotes } = this.state
    const { role } = this.props

    if (isEditingNotes && (role === 'isDoctor' || role === 'isAdmin'))
      return (
        <Button
          onPress={this.handleNotes}
          title="Valider"
          color="#93E8FD"
          accessibilityLabel="Valider" style={{ width: 1 }} />
      )

    else return null
  }

  renderHeader() {
    return <Header />
  }

  renderImage() {
    let images = [{ uri: this.state.ImageToShow }]
    const { isDoctorImage } = this.state
    const { role } = this.props

    return (
      <ImageViewing
        images={images}
        imageIndex={0}
        presentationStyle="overFullScreen"
        visible={this.state.isModalImageVisible}
        onRequestClose={() => this.setState({ isModalImageVisible: false })}
        FooterComponent={() => {
          if (isDoctorImage && (role === 'isDoctor' || role === 'isAdmin'))
            return <ImageFooter delete={() => this.deleteImage(images)} />
          else return null
        }}
      />)
  }

  renderSymptoms() {
    if (this.state.symptoms.length > 0)
      return this.state.symptoms.map((data, key) => {
        const isLastElement = key === this.state.symptoms.length - 1
        return <Text style={styles.symptoms}>{data}{isLastElement ? '.' : ', '}</Text>
      })

    else return <Text style={styles.symptoms}>Aucun symptôme</Text>
  }

  renderPatientDocuments() {
    if (this.state.documents.length > 0)
      return this.state.documents.map((doc, key) => {
        const isLastElement = key === this.state.documents.length - 1
        return (
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.toggleModalImage(doc, false)}>
            <Text style={{ textDecorationLine: 'underline' }}>Document {key + 1}</Text>
            <Text style={{ textDecorationColor: 'none' }}>{isLastElement ? '.' : ', '}</Text>
          </TouchableOpacity>
        )
      })

    else return <Text style={styles.documents2}>Aucun document</Text>
  }

  renderVideo() {

    if (this.state.video !== '')
      return (
        <Text
          style={{ textDecorationLine: 'underline' }}
          onPress={() => this.props.navigation.navigate('VideoPlayer', { videoLink: this.state.video })}>Vidéo explicative</Text>
      )

    else
      return (
        <Text style={styles.documents2}>Aucune vidéo</Text>
      )
  }

  renderDoctorDocuments() {
    if (this.state.doctorDocuments.length > 0 && typeof (this.state.doctorDocuments) !== 'undefined')
      return this.state.doctorDocuments.map((doc, key) => {
        let marginLeft = 0
        if (key % 3 !== 0) {
          marginLeft = SCREEN_WIDTH * 0.02
        }

        return (
          <View style={{ flexBasis: '30%', justifyContent: 'center', alignItems: 'center', padding: 5, marginLeft: marginLeft, marginBottom: SCREEN_HEIGHT * 0.02 }}>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.doctorDocuments}
              onPress={() => this.toggleModalImage(doc.image, true)}
              //onLongPress={() => console.log('Hey man ! wassup ?')}
              >
              <Icon name="clipboard"
                size={SCREEN_WIDTH * 0.07}
                color="#93E7FF" />

            </TouchableOpacity>

            <Text numberOfLines={1}
              style={{ marginTop: 10, fontSize: 12 }}
              onPress={() => this.toggleModalImage(doc.image, true)}>{doc.title}</Text>

          </View>
        )
      })

    else return null

  }

  renderPlusButton() {
    if (this.props.role === 'isAdmin' || this.props.role === 'isDoctor') {
      if (this.state.isUploading)
        return (
          <View style={{ flexBasis: '30%', justifyContent: 'center', alignItems: 'center', padding: 5, marginLeft: SCREEN_WIDTH * 0.02, marginBottom: SCREEN_HEIGHT * 0.02 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.doctorDocuments}
              onPress={this.pickImage}>
              <ActivityIndicator size='small' />
            </TouchableOpacity>
            <Text></Text>
          </View>
        )

      else return (
        < View style={{ flexBasis: '30%', justifyContent: 'center', alignItems: 'center', padding: 5, marginLeft: SCREEN_WIDTH * 0.02, marginBottom: SCREEN_HEIGHT * 0.02 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.doctorDocuments}
            onPress={this.pickImage}>
            <Icon name="plus"
              size={SCREEN_WIDTH * 0.07}
              color="#93E7FF" />
          </TouchableOpacity>
          <Text></Text>
        </View >
      )
    }
  }

  //Data handling
  uploadFile() {
    this.setState({ isUploading: true, ismodalVisible: !this.state.ismodalVisible })

    const DocumentStorageRef = firebase.storage().ref('/Appointments/' + this.appId + '/Documents/' + this.state.DocumentTitle)
    Promise.resolve(DocumentStorageRef.putFile(this.state.DocumentSource))
      .then(async (URLObject) => {
        let { doctorDocuments } = this.state
        doctorDocuments.push({ image: URLObject.downloadURL, title: this.state.DocumentTitle })
        await REFS.appointments.doc(this.appId).update({ doctorDocuments })
      })
      .catch(err => Alert.alert('', "Erreur lors de l'exportation de l'image, veuillez réessayer."))
      .finally(() => this.setState({ isUploading: false }))
  }

  async handleNotes() {
    this.setState({ isEditingNotes: false })
    await REFS.appointments.doc(this.appId).update({ notes: this.state.notes })
    Alert.alert('', 'Vos notes ont bien été enregistrées.')
  }

  deleteImage(images) {
    this.setState({ isModalImageVisible: false, isUploading: true })

    //Deleting image from Firebase storage
    firebase.storage().refFromURL(images[0].uri).delete()
      .then(() => {
        console.log('image deleted from firebase storage')
        //Delete image from Firestore
        let doctorDocuments = this.state.doctorDocuments
        let index = doctorDocuments.indexOf(images[0].uri)
        doctorDocuments.splice(index, 1)

        REFS.appointments.doc(this.appId).update({ doctorDocuments })
          .then(() => {
            console.log('image deleted from firestore')
            this.setState({ isUploading: false })
          })
      })
  }

  pickImage = () => {
    ImagePicker.showImagePicker(imagePickerOptions, imagePickerResponse => {
      const { didCancel, error } = imagePickerResponse;
      if (didCancel) { console.log('Post canceled'); }
      else if (error) { Alert.alert('', 'Erreur inattendue, veuillez réessayer'); }
      else this.setState({ DocumentSource: getFileLocalPath((imagePickerResponse)), ismodalVisible: true })
    })
  }

  render() {
    const noinput = this.props.navigation.getParam('noinput', true)

    return (
      <View style={{ flex: 1 }}>

        {/* Modal upload document */}
        <Modal
          isVisible={this.state.ismodalVisible}
          animationIn="fadeIn"
          animationOut="fadeOut"
          style={{ flex: 1, backgroundColor: '#fff' }}>

          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.1 }}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: SCREEN_HEIGHT * 0.04 }}>Titre du document</Text>
              <View style={modalStyles.picker_container} >
                <TextInput
                  onChangeText={(DocumentTitle) => this.setState({ DocumentTitle })}
                  placeholder={'Exp: Ordonnance'}
                  style={{ width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.1 }}
                  value={this.state.DocumentTitle} />
              </View>
            </View>

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
          </View>

        </Modal>

        {/* Modal display document */}
        {this.renderImage()}

        <View style={[styles.main_container, { flex: this.mainContainerFlex }]}>
          {this.renderHeader()}
          {this.renderData()}
        </View>

        {/* Chat */}
        {this.props.role === 'isAdmin' || this.props.role === 'isPatient' ?
          <View style={{ flex: 0.03, justifyContent: 'center', borderTopRightRadius: 50, borderTopLeftRadius: 50, backgroundColor: '#93eafe' }}>
            <Text style={{ fontWeight: 'bold', alignSelf: 'center', color: '#fff' }}>Chat en ligne</Text>
          </View>
          : null}

        {this.props.role === 'isAdmin' || this.props.role === 'isPatient' ?
          <View style={{ flex: 0.12, flexDirection: 'row' }}>

            <View style={{ flex: 0.7, flexDirection: 'row' }}>
              <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
                <Icon1
                  name="lock"
                  size={SCREEN_WIDTH * 0.045}
                  color="gray" />
              </View>

              <View style={{ flex: 0.9, justifyContent: 'center' }}>
                <Text style={{ fontSize: SCREEN_HEIGHT * 0.01, fontWeight: 'bold', color: "gray", flexWrap: 'wrap', }}>Cette conversation est strictement confidentielle entre l'admin est le patient. Si vous avez des questions à propos de cette consultation, n'hésitez pas à les poser ici.</Text>
              </View>
            </View>

            <View style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              {/* <Icon name="numeric-1-circle"
                size={SCREEN_WIDTH * 0.05}
                color="red" /> */}
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Chat', { appId: this.appId, noinput: noinput })}>
                <Image source={require('../../assets/profile.jpg')}
                  style={styles.avatarIcon} />
              </TouchableOpacity>
            </View>
          </View>
          : null}

      </View >

    );
  }
}

const mapStateToProps = (state) => {
  return {
    role: state.roles.role,
  }
}

export default connect(mapStateToProps)(AppointmentDetails)

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#ffffff',
  },
  header_container: {
    flex: 0.25,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  headerColumn: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 15,
  },
  menu_button: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: 25,
    backgroundColor: '#ffffff',

    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    height: SCREEN_WIDTH * 0.14,
    width: LOGO_WIDTH,
  },
  mainHeader: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: '#93E7FF',
    textAlign: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: SCREEN_WIDTH * 0.9,
    color: '#ffffff'
  },
  card: {
    backgroundColor: '#F7F7F7',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: SCREEN_WIDTH * 0.9,
    paddingLeft: SCREEN_WIDTH * 0.07,
    margin: SCREEN_HEIGHT * 0.01,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    marginHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.04
  },
  headerText: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: SCREEN_HEIGHT * 0.02,
    borderBottomWidth: 0,
    borderBottomColor: '#93eafe',
    width: SCREEN_WIDTH * 0.6
  },
  avatarIcon: {
    height: SCREEN_WIDTH * 0.18,
    width: SCREEN_WIDTH * 0.18,
    //marginTop: SCREEN_WIDTH * 0.0,
    //marginHorizontal: 130,
    borderRadius: 100,
    //justifyContent: "center",
    //alignItems: 'center',
    borderColor: '#ffffff',
    borderWidth: 7,
    borderStyle: "solid"
  },
  doctorDocuments: {
    width: SCREEN_WIDTH * 0.13,
    height: SCREEN_WIDTH * 0.13,
    // backgroundColor: 'green',
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5
  }
});

const modalStyles = StyleSheet.create({
  item_inactive: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.07,
    //borderWidth: 1,
    //borderColor: 'blue',
    marginLeft: SCREEN_WIDTH * 0.015,
    marginRight: SCREEN_WIDTH * 0.015,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    //borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
  },
  item_active: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.07,
    borderWidth: 1,
    borderColor: '#93eafe',
    marginLeft: SCREEN_WIDTH * 0.015,
    marginRight: SCREEN_WIDTH * 0.015,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_text: {
    //fontWeight: 'bold',
    fontSize: SCREEN_HEIGHT * 0.016,
    textAlign: 'center'
  },
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
    height: SCREEN_HEIGHT * 0.07,
    width: SCREEN_WIDTH * 0.6,
    paddingLeft: 20,
    paddingRight: 10
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 15,
    paddingLeft: SCREEN_WIDTH * 0.1,
    width: SCREEN_WIDTH * 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
  },
  bio: {
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
    elevation: 3,
  },
  //Buttons confirme/cancel
  modalButtons_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  symptoms: {
    textAlign: 'left',
    flexWrap: 'wrap',
    color: '#000',
    marginRight: SCREEN_WIDTH * 0.015,
    marginBottom: SCREEN_WIDTH * 0.02
  },
  documents2: {
    textAlign: 'left',
    flexWrap: 'wrap',
    color: '#000',
    marginRight: SCREEN_WIDTH * 0.015,
    marginBottom: SCREEN_WIDTH * 0.02
  }
})

