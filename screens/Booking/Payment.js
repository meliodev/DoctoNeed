//add ssl 


import React, { PureComponent } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native'

import moment from 'moment'
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')

import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../../components/Button'
import stripe from 'tipsi-stripe'
import X from '../../node_modules/tipsi-stripe/src/Stripe'
import firebase from 'react-native-firebase'
import * as REFS from '../../DB/CollectionsRefs'

import theme from '../../constants/theme.js'

import DoctorItem from '../../components/DoctorItem2'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ratioLogo = 420 / 244;
const line = <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth, width: SCREEN_WIDTH * 0.9, alignSelf: 'center' }} />

const functions = firebase.functions()

stripe.setOptions({
    publishableKey: 'pk_test_51GsYCOAXDUbdGVpXS0DYnAFXEEjMZU54kyH3BgDn5yPfnfWEDe0mfOXgNDJESm40XjOCuN4NVIP0mFIgwKzY8fzI00R2ddTNWs',
})


export default class Payment extends PureComponent {
    static title = 'Card Form'

    constructor(props) {
        super(props);
        this.doctorId = this.props.navigation.getParam('doctorId', '')
        this.date = this.props.navigation.getParam('date', 'nothing sent')
        this.symptomes = this.props.navigation.getParam('symptomes', 'nothing sent')
        this.comment = this.props.navigation.getParam('comment', 'nothing sent')
        this.DocumentsRefs = this.props.navigation.getParam('DocumentsRefs', '')
        this.VideoRef = this.props.navigation.getParam('VideoRef', '')

        this.isUrgence = this.props.navigation.getParam('isUrgence', false) //if is urgence set price to urgence price
        this.speciality = this.props.navigation.getParam('speciality', '') //urgence2

        this.makePayment = this.makePayment.bind(this);
        this.setRegularCase = this.setRegularCase.bind(this);
        this.setUrgence2Case = this.setUrgence2Case.bind(this);
    }

    state = {
        isLoading: false,
        token: null,
        success: null,
        response: null,

        //doctor data including price
        doctorName: '',
        speciality: '',
        Avatar: '',
        price: '',
        currency: '',

        //patient data
        userName: '',
        userCountry: '',

        //appointment data including date
        date: '',
        symptomes: '',
        comment: '',
        isUrgence: '',

        stripeCustomer: ''
    }

    componentDidMount() {
        this.getCustomerId()

        //Regular appointment or Urgence1
        if (this.doctorId !== '')
            this.setRegularCase()

        //Urgence2
        else if (this.doctorId === '')
            this.setUrgence2Case()
    }

    //FETCH DATA
    async getCustomerId() {
        //Get stripe customer
        const { currentUser } = firebase.auth()
        await REFS.users.doc(currentUser.uid).collection('stripeData').get().then((querySnapshot) => {
            const doc = querySnapshot.docs[0]
            this.setState({ stripeCustomer: doc.data().customer_id })
        })
    }

    async setRegularCase() {
        await REFS.doctors.doc(this.doctorId).get().then((doc) => {
            this.setState({
                doctorName: doc.data().prenom + ' ' + doc.data().nom,
                speciality: doc.data().speciality,
                Avatar: doc.data().Avatar,
                currency: '€',            //doc.data().currency_symb,
            })

            let price
            //Regular
            if (!this.isUrgence)
                price = doc.data().regularPrice

            //Urgence
            else if (this.isUrgence)
                price = doc.data().urgencePrice

            this.setState({ price })
        })
    }

    setUrgence2Case() {
        this.setState({
            speciality: this.speciality,
            currency: '€',
        })
        this.getSpecialityPrice()
    }

    getSpecialityPrice() {
        REFS.specialities.doc(this.speciality).get().then((doc) => {
            this.setState({ price: doc.data().urgencePrice })
        })
    }

    //PAYMENT FLOW
    handleCardPayPress = async () => {
        console.log('Handling press...')
        this.setState({ isLoading: true })
        let token = null

        try {
            this.setState({ loading: true, token: null })
            token = await stripe.paymentRequestWithCardForm({
                // Only iOS support this options
                smsAutofillDisabled: true,
                prefilledInformation: {
                    email: firebase.auth().currentUser.email,
                },
            })
            this.makePayment(token.id)
        }

        catch (error) {
            this.setState({ isLoading: false })
        }

    }

    makePayment(tokenId) {
        console.log('making payment...')

        const createStripePaymentIntent = functions.httpsCallable('createStripePaymentIntent')
        createStripePaymentIntent({
            customer: this.state.stripeCustomer,
            tokenId: tokenId,
            doctorId: this.doctorId,
            isUrgence: this.isUrgence,
            date: this.date,
            month: moment(this.date).format("MM/YYYY"),
            speciality: this.speciality,
            symptomes: this.symptomes,
            comment: this.comment,
            DocumentsRefs: this.DocumentsRefs,
            VideoRef: this.VideoRef
        })
            .then(function (response) {
                this.handleServerResponse(response, tokenId)
            }.bind(this))
    }

    handleServerResponse = (response, tokenId) => {
        console.log('Handle Server Response...')
        console.log(response)

        if (response.data.error) {
            //Show error from server on payment form
            console.error("error handleServerResponse")
            console.log(response.data.error)
            this.setState({ isLoading: false })
            Alert.alert('', "Erreur lors de l'initiation du paiement, veuillez réessayer plus tard.")
        }

        else if (response.data.requires_action) {
            //Use Tipsi Stripe to handle 3D secure
            console.log('response: requires action')
            this.handleAction(response, tokenId)
        }

        else {
            //Show success message
            console.log('response: success (no 3D required..)')
            //updatePaymentIntent webhook: Updating status on FIRESTORE to succeeded
            this.setState({ isLoading: false }, () => {
                this.props.navigation.navigate('BookingConfirmed', {
                    doctor: this.state.doctorName,
                    date: this.date,
                    speciality: this.speciality
                })
            })
        }
    }

    handleAction = async (response, tokenId) => {
        console.log('Handle action...')

        const confirmPaymentIntent = await stripe.confirmPaymentIntent({
            clientSecret: response.data.payment_intent_client_secret,
            paymentMethodId: tokenId
        })
            .then((result) => {
                console.log('confirmPaymentIntent result')
                console.log(result)

                if (result.error) {
                    // Show error in payment form
                    console.error("error confirmPaymentIntent")
                    console.log(result.error)
                    this.setState({ isLoading: false })
                    Alert.alert('', 'Erreur lors de la double autentification. Le paiement a échoué, veuillez réessayer plus tard.')
                }

                else {
                    // The card action has been handled
                    // The PaymentIntent can be confirmed again on the server
                    console.log('response: success 3D auth')
                    this.setState({ isLoading: false })

                    this.props.navigation.navigate('BookingConfirmed', {
                        doctor: this.state.doctorName,
                        date: this.date,
                        speciality: this.speciality
                    })
                }
            })
    }

    render() {
        const date = moment(this.date).format("DD/MM/YYYY")

        const { loading, token, success, response } = this.state
        const doctor = {
            name: this.state.doctorName,
            speciality: this.state.speciality,
            Avatar: this.state.Avatar
        }

        let urgence = ''

        if (this.isUrgence)
            urgence = 'urgente'

        return (
            <View style={styles.container}>
                {this.state.isLoading === true ?
                    <View style={styles.loading_container}>
                        <ActivityIndicator size='large' />
                    </View>
                    :
                    <View style={styles.container}>
                        <View style={styles.doctorCard_container}>
                            <DoctorItem doctor={doctor} />
                        </View>

                        <View style={styles.paymentType_container}>
                            <View style={{ flex: 1, justifyContent: 'center', paddingLeft: SCREEN_WIDTH * 0.08 }}>
                                <Text style={[styles.label_text, { color: '#000' }]}>
                                    Type de paiement
                                </Text>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', paddingRight: SCREEN_WIDTH * 0.08, alignItems: 'flex-end' }}>
                                <Text style={[styles.label_text, { fontWeight: 'normal' }]}>
                                    Carte bancaire
                                </Text>
                            </View>
                        </View>

                        {line}

                        <View style={styles.price_container}>

                            <View style={styles.price_container_row}>
                                <View style={styles.label_container}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.label_text}>
                                            {`Consultation `}{urgence}{`\n`}{`du `}{date}
                                        </Text>
                                        {this.speciality === '' &&
                                            <Text style={styles.label_text}>
                                                à {moment(this.date).format('HH:mm').replace(':', 'h')}
                                            </Text>
                                        }

                                    </View>
                                </View>

                                <View style={styles.value_container}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={styles.value_text}>
                                        <Text style={{ fontSize: 16 }}>{this.state.currency}</Text> {this.state.price} 
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.price_container_row}>
                                <View style={styles.label_container}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={styles.label_text}>
                                            Total
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.value_container}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={styles.value_text}>
                                        <Text style={{ fontSize: 16 }}>{this.state.currency}</Text> {this.state.price}
                                        </Text>
                                    </View>
                                </View>

                            </View>

                        </View>

                        <View style={styles.paymentButton_container}>
                            <Button
                                text="Paiement"
                                width={SCREEN_WIDTH * 0.6}
                                // text="Enter you card and pay"
                                loading={loading}
                                // onPress={this.addAdminRole}
                                onPress={this.handleCardPayPress}
                            />
                        </View>

                        <View style={styles.terms_container}>
                            <View style={{ flex: 0.5, padding: SCREEN_WIDTH * 0.05 }}>
                                {/* <Text style={[styles.terms, { marginBottom: SCREEN_HEIGHT * 0.02 }]}>
                                    Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
                        Lorem ipsum dolor sit amet <Text style={styles.termsLink} onPress={() => console.log('Conditions générales')}>Conditions générales.</Text>
                                </Text> */}
                                {line}
                            </View>


                            <View style={styles.securityInfo_container}>
                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={styles.sercurityCard_container}>
                                        <Image source={require('../../assets/payment-secure.png')} style={{ width: SCREEN_WIDTH * 0.08, height: SCREEN_WIDTH * 0.08 }} />
                                    </View>

                                    <View style={styles.securityText_container}>
                                        <Text style={styles.terms}>
                                            Votre paiement est sécurisé, vous pouvez effectuer votre transaction en toute confiance.
                            </Text>
                                    </View>
                                </View>
                            </View>

                        </View>

                    </View>

                }

            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    doctorCard_container: {
        flex: 0.3,
        justifyContent: 'center'
        //backgroundColor: 'green'
    },
    viewDetails_container: {
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_HEIGHT * 0.05,
        justifyContent: 'center',
        alignSelf: 'center',
        textAlignVertical: 'top',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        //borderColor: 'green',
        //borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: SCREEN_HEIGHT * 0.02,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        flexDirection: 'row',
    },
    paymentType_container: {
        flex: 0.1,
        flexDirection: 'row',
        //backgroundColor: 'blue'
    },

    price_container: {
        flex: 0.3,
        //backgroundColor: 'yellow'
    },
    price_container_row: {
        flex: 1,
        flexDirection: 'row',
        //backgroundColor: 'brown'
    },
    value_container: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: SCREEN_WIDTH * 0.08,
        //backgroundColor: 'purple'
    },
    value_text: {
        fontSize: 20
    },
    label_container: {
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'flex-end',
        paddingLeft: SCREEN_WIDTH * 0.08,
        //backgroundColor: 'orange'
    },
    label_text: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14
    },

    paymentButton_container: {
        flex: 0.1,
        alignItems: 'center',
        //backgroundColor: 'pink'
    },
    terms_container: {
        flex: 0.2,
        //backgroundColor: 'brown',
        padding: 10
    },
    securityInfo_container: {
        flex: 0.5,
        justifyContent: 'center',
        paddingLeft: SCREEN_WIDTH * 0.085,
        paddingRight: SCREEN_WIDTH * 0.085,
        //backgroundColor: 'blue'
    },
    sercurityCard_container: {
        flex: 0.2,
        alignItems: 'center',
        //backgroundColor: 'green'
    },
    securityText_container: {
        flex: 0.8,
        //backgroundColor: 'yellow'
    },
    terms: {
        color: theme.GRAY_COLOR,
        fontSize: theme.FONT_SIZE_SMALL * 0.9

    },
    termsLink: {
        color: theme.THEME_COLOR,
        textDecorationLine: 'underline',
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












    // doPayment = async () => {
    //     // Use firebase serve for local testing if you don't have a paid firebase account
    //     console.log('doing payment...')
    //     fetch('https://us-central1-urgencepharma-b8196.cloudfunctions.net/payWithStripe', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             amount: 100,
    //             currency: "usd",
    //             token: this.state.token.tokenId
    //         }),
    //     })
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //             console.log(responseJson);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });;
    // }






    //CHARGE methods
    // addPaymentSource() {
    //     REFS.users.doc(firebase.auth().currentUser.uid).collection('tokens').doc().set(this.state.token, { merge: true })
    //         .then(() => {
    //             console.log('Payment card added succesfully to Firestore !')
    //         })
    // }

    // makePayment() {

    //     REFS.users.doc(firebase.auth().currentUser.uid).collection('charges').doc().set({
    //         amount: 100,  //IMPORTANT: The amount has to be defined in the server side (cloud function) to be secured
    //         // source: 'card_1GtgQ4AXDUbdGVpXAMQAFK0H',
    //         // source: 'tok_mastercard',
    //         source: this.state.token.tokenId,
    //         currency: "eur"
    //     })
    //         .then(() => {
    //             console.log('Payment info added succesfully to Firestore !')
    //         })
    // }