
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, Button, ScrollView, TextInput, Picker, Text, Image, TouchableOpacity, ActivityIndicator, TouchableHighlight, Dimensions, Slider, StyleSheet } from 'react-native'
import Modal from 'react-native-modal';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

import { withNavigation } from 'react-navigation';

import * as REFS from '../../../DB/CollectionsRefs'
import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';
import { CheckBox, Content, Header, Card, CardItem, ListItem, Radio, Right, Left } from 'native-base';
import DatePicker from 'react-native-datepicker'
import { imagePickerOptions, options2, getFileLocalPath, createStorageReferenceToFile, uploadFileToFireBase } from '../../../util/MediaPickerFunctions'

import ImagePicker from 'react-native-image-picker';

import LeftSideMenu from '../../../components/LeftSideMenu'
import Icon1 from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioHeader = 267 / 666; // The actaul icon headet size is 254 * 668
const HEADER_ICON_HEIGHT = Dimensions.get("window").width * ratioHeader; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

const line = <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth }} />
const GS = ['A', 'B', 'O', 'AB']
const Professions = ['Enseignant', 'Salarié', 'Commercant', 'Etudiant', 'Retraité', 'Sans profession', 'Fonctionnaire', 'Artisan']
const AllergyList = ['Antibiotique', 'Anti-inflammatoires', 'non-stéroidiens', 'Aspirine', 'Autre']



class Antecedants extends React.Component {
    constructor(props) {
        super(props);
        // this.toggleAllergy = this.toggleAllergy.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);

        this.user_id_param = this.props.navigation.getParam('user_id', '')  //received from admin or doctor navigation params
        this.user_id = ''

        this.state = {
            isAllergiesIndex: this.props.navigation.getParam('isAllergiesIndex', false),
            isAllergies: this.props.navigation.getParam('isAllergies', false),

            isCardioDiseaseIndex: this.props.navigation.getParam('isCardioDiseaseIndex', false),
            isCardioDiseaseFamilyIndex: this.props.navigation.getParam('isCardioDiseaseFamilyIndex', false),
            isStressIndex: this.props.navigation.getParam('isStressIndex', false),
            isNoMoralIndex: this.props.navigation.getParam('isNoMoralIndex', false),
            isFollowUpIndex: this.props.navigation.getParam('isFollowUpIndex', false),
            isAsthmeIndex: this.props.navigation.getParam('isAsthmeIndex', false),

            isCardioDisease: this.props.navigation.getParam('isCardioDisease', false),
            isCardioDiseaseFamily: this.props.navigation.getParam('isCardioDiseaseFamily', false),
            isStress: this.props.navigation.getParam('isStress', false),
            isNoMoral: this.props.navigation.getParam('isNoMoral', false),
            isFollowUp: this.props.navigation.getParam('isFollowUp', false),
            isAsthme: this.props.navigation.getParam('isAsthme', false),

            isLoading: false
        }
    }

    componentDidMount() {
        //Initializing current user
        if (this.props.role === 'isPatient')
            this.user_id = firebase.auth().currentUser.uid

        else if (this.props.role === 'isAdmin') {
            this.user_id = this.user_id_param
        }
    }

    async handleConfirm() {
        this.setState({ isLoading: true })
        const { isCardioDisease, isCardioDiseaseFamily, isStress, isNoMoral, isFollowUp, isAsthme } = this.state
        await REFS.users.doc(this.user_id).update({ isCardioDisease, isCardioDiseaseFamily, isStress, isNoMoral, isFollowUp, isAsthme })
        this.setState({ isLoading: false })
        this.props.navigation.navigate('MedicalFolder')
    }

    render() {

        var radio_props2 = [
            { label: 'Oui', value: 'Oui' },
            { label: 'Non', value: 'Non' }
        ]

        let formElements = [
            { question: 'Etes-vous sujet à une ou plusieurs maladies cardiovasculaires (infarctus, AVC) ?', index: this.state.isCardioDiseaseIndex, value: this.state.isCardioDisease, indexLabel: 'isCardioDiseaseIndex', valueLabel: 'isCardioDisease' },
            { question: 'Avez-vous des Antécédents cardiovasculaires familiaux (infarctus, AVC) ?', index: this.state.isCardioDiseaseFamilyIndex, value: this.state.isCardioDiseaseFamily, indexLabel: 'isCardioDiseaseFamilyIndex', valueLabel: 'isCardioDiseaseFamily' },
            { question: 'Vous sentez-vous stressé(e) ?', index: this.state.isStressIndex, value: this.state.isStress, indexLabel: 'isStressIndex', valueLabel: 'isStress' },
            { question: 'Avez-vous une baisse de moral ?', index: this.state.isNoMoralIndex, value: this.state.isNoMoral, indexLabel: 'isNoMoralIndex', valueLabel: 'isNoMoral' },
            { question: 'Avez-vous accès à un suivi dentaire régulier ?', index: this.state.isFollowUpIndex, value: this.state.isFollowUp, indexLabel: 'isFollowUpIndex', valueLabel: 'isFollowUp' },
            { question: 'Etes-vous asthmatique ?', index: this.state.isAsthmeIndex, value: this.state.isAsthme, indexLabel: 'isAsthmeIndex', valueLabel: 'isAsthme' }
        ]

        return (
            <View style={{ flex: 1 }}>
                {this.state.isLoading
                    ? <View style={styles.loading_container}>
                        <ActivityIndicator size='large' />
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 0.9 }}>
                            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SCREEN_WIDTH * 0.05 }}>
                                <View style={{ flex: 1 }}>
                                    {formElements.map((formElement, key) => {
                                        return (
                                            <View style={{ alignItems: 'center', padding: 15, borderBottomColor: '#BDBDBD', borderBottomWidth: StyleSheet.hairlineWidth }}>
                                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginBottom: SCREEN_HEIGHT * 0.03 }}>{formElement.question}</Text>
                                                <RadioForm formHorizontal={true} style={{ justifyContent: 'center', alignItems: 'center', width: SCREEN_WIDTH * 0.7 }}>
                                                    {
                                                        radio_props2.map((obj, i) => (
                                                            <RadioButton key={i} style={{ margin: SCREEN_WIDTH * 0.03 }}>
                                                                <RadioButtonInput
                                                                    obj={obj}
                                                                    index={i}
                                                                    isSelected={formElement.index === i}
                                                                    style={{ marginLeft: i === 0 ? 0 : 20, marginRight: i === 1 ? 0 : 20 }}
                                                                    onPress={(value, key) => {
                                                                        const update1 = {};
                                                                        update1[formElement.indexLabel] = key
                                                                        this.setState(update1);

                                                                        const update2 = {};
                                                                        update2[formElement.valueLabel] = value
                                                                        this.setState(update2);
                                                                    }}
                                                                    buttonColor={'#93eafe'}
                                                                    selectedButtonColor={'#93eafe'} />

                                                                <RadioButtonLabel
                                                                    obj={obj}
                                                                    index={i}
                                                                    labelStyle={{ marginLeft: 5 }}
                                                                    onPress={() => console.log('nothing happens')} />
                                                            </RadioButton>
                                                        ))
                                                    }
                                                </RadioForm>
                                            </View>
                                        )
                                    })}
                                </View>
                            </ScrollView>

                        </View>

                        <View style={styles.modalButtons_container}>
                            <TouchableOpacity style={styles.CancelButton} onPress={() => {
                                this.props.navigation.navigate('MedicalFolder')
                            }}>
                                <Text style={styles.buttonText1}>Annuler</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.handleConfirm}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
                                    style={styles.ConfirmButton}>
                                    <Text style={styles.buttonText2}>Confirmer</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                    </View>
                }
            </View >

        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
    }
}

export default connect(mapStateToProps)(Antecedants)

const styles = StyleSheet.create({

    modalButtons_container: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white'
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
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})