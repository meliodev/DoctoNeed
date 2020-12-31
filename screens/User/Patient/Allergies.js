
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, Button, ScrollView, TextInput, Picker, Text, Image, TouchableOpacity, ActivityIndicator, TouchableHighlight, Dimensions, Slider, StyleSheet } from 'react-native'
import Modal from 'react-native-modal';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

import { withNavigation } from 'react-navigation';

import * as REFS from '../../../DB/CollectionsRefs'
import { signOutUser } from '../../../DB/CRUD'

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
const AllergyList = ['Antibiotique', 'Anti-inflammatoires', 'Non-stéroidiens', 'Aspirine', 'Autre']



class Allergies extends React.Component {
    constructor(props) {
        super(props);
        this.toggleAllergy = this.toggleAllergy.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);

        this.user_id_param = this.props.navigation.getParam('user_id', '')  //received from admin or doctor navigation params
        this.user_id = ''

        this.state = {
            isAllergiesIndex: this.props.navigation.getParam('isAllergiesIndex', false),
            isAllergies: this.props.navigation.getParam('isAllergies', 'Non'),
            ListAllergies: this.props.navigation.getParam('ListAllergies', false),

            isLoading: false,
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

    toggleAllergy(allergy) {
        let ListAllergies = this.state.ListAllergies

        if (!ListAllergies.includes(allergy))
            ListAllergies.push(allergy)

        else {
            var index = ListAllergies.indexOf(allergy);
            if (index !== -1)
                ListAllergies.splice(index, 1);
        }

        this.setState({ ListAllergies })
    }

    async handleConfirm() {
        this.setState({ isLoading: true })

        if (this.state.isAllergies !== false)
            await REFS.users.doc(this.user_id).update({ isAllergies: this.state.isAllergies })
                .then(() => console.log('e'))
                .catch((err) => console.error(err))

        if (this.state.ListAllergies !== false)
            await REFS.users.doc(this.user_id).update({ Allergies: this.state.ListAllergies })
                .then(() => console.log('r'))
                .catch((err) => console.error(err))

        this.setState({ isLoading: false })

        this.props.navigation.navigate('MedicalFolder')

    }

    render() {
        let { isAllergies } = this.state
        const showListAllergies = isAllergies === 'Oui'

        var radio_props2 = [
            { label: 'Oui', value: 'Oui' },
            { label: 'Non', value: 'Non' }
        ];

        return (
            <View style={{ flex: 1 }}>
                {this.state.isLoading
                    ? <View style={styles.loading_container}>
                        <ActivityIndicator size='large' />
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={{ flex: 1 }}>
                            <View style={{ flex: 0.5, paddingTop: SCREEN_HEIGHT * 0.1, alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginBottom: SCREEN_HEIGHT * 0.03 }}>Avez-vous déja eu des allergies médicamenteuses ?</Text>
                                <RadioForm formHorizontal={true} style={{ justifyContent: 'center', alignItems: 'center', width: SCREEN_WIDTH * 0.7 }}>
                                    {
                                        radio_props2.map((obj, i) => (
                                            <RadioButton key={i} style={{ marginLeft: i === 0 ? 0 : 20, marginRight: i === 1 ? 0 : 20 }}>
                                                <RadioButtonInput
                                                    obj={obj}
                                                    index={i}
                                                    isSelected={this.state.isAllergiesIndex === i}
                                                    onPress={(value) => { this.setState({ isAllergies: value, isAllergiesIndex: i }) }}
                                                    buttonColor={'#93eafe'}
                                                    selectedButtonColor={'#93eafe'}
                                                />
                                                <RadioButtonLabel
                                                    obj={obj}
                                                    index={i}
                                                    onPress={() => console.log('nothing happens')}
                                                    labelStyle={{ marginLeft: 5 }}
                                                />
                                            </RadioButton>
                                        ))
                                    }
                                </RadioForm>
                            </View>

                            {showListAllergies &&
                                <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 10 }}>
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginBottom: SCREEN_HEIGHT * 0.03 }}>A quels types d'allergies médicamenteuses êtes-vous sujet ?</Text>
                                    <View>
                                        {
                                            AllergyList.map((allergie, key) => {
                                                return (
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <CheckBox center title='check box' color="#93eafe" style={{ borderColor: '#93eafe' }} checked={this.state.ListAllergies.includes(allergie)} onPress={() => this.toggleAllergy(allergie)} />
                                                        <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05, fontSize: 15, marginBottom: SCREEN_HEIGHT * 0.03 }}>{allergie}</Text>
                                                    </View>)
                                            })
                                        }
                                    </View>
                                </View>
                            }


                        </ScrollView>

                        <View style={styles.modalButtons_container}>
                            <TouchableOpacity style={styles.CancelButton} onPress={() => {
                                this.setState({ ListAllergies: [] })
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
            </View>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
    }
}

export default connect(mapStateToProps)(Allergies)



//Buttons confirme/cancel

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
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
