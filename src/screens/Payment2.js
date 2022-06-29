import React, { PureComponent } from 'react'
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native'
import Button from '../components/Button'
import stripe from 'tipsi-stripe'
import firebase from '../configs/firebase'
import * as REFS from '../DB/CollectionsRefs'


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ratioLogo = 1;

const functions = firebase.functions()

stripe.setOptions({
    publishableKey: 'pk_test_51GsYCOAXDUbdGVpXS0DYnAFXEEjMZU54kyH3BgDn5yPfnfWEDe0mfOXgNDJESm40XjOCuN4NVIP0mFIgwKzY8fzI00R2ddTNWs',
})

export default class CardFormScreen extends PureComponent {
    static title = 'Card Form'

    constructor(props) {
        super(props);
        this.makePayment = this.makePayment.bind(this);
    }

    state = {
        loading: false,
        token: null,
        success: null,
        response: null,
    }

    // async componentDidMount() { 
    //     console.log('kkkkk')
    //     let x = await stripe.confirmPaymentIntent({
    //      clientSecret: 'pi_1Gu3XSAXDUbdGVpX27bqUpgn_secret_CJFytDIJ37WNFiAIcGKYB93wI',
    //      paymentMethodId:  'pm_1Gu3s1AXDUbdGVpXv38QVsfS'
    //  })
    //  }

    handleCardPayPress = async () => {
        try {
            this.setState({ loading: true, token: null })
            const token = await stripe.paymentRequestWithCardForm({
                // Only iOS support this options
                smsAutofillDisabled: true,
                requiredBillingAddressFields: 'full',
                prefilledInformation: {
                    billingAddress: {
                        name: 'Enappd Store',
                        line1: 'Canary Place',
                        line2: '3',
                        city: 'Macon',
                        state: '',
                        country: 'Estonia',
                        postalCode: '31217',
                        email: 'admin@enappd.com',
                    },
                },
            })

            console.log(token.id); //Payment Method Id
            this.setState({ loading: false, token })

        } catch (error) {
            console.error(error)
            this.setState({ loading: false })
        }
    }

    makePayment() {
        REFS.users.doc(firebase.auth().currentUser.uid).collection('paymentIntents').add({
            amount: 100,  //IMPORTANT: PATIENT SHOULD NOT BE ABLE TO SET WRITE AMOUNT: The amount has to be defined in the server side (cloud function) to be secured.
            currency: "eur"
        })
            .then(async (docRef) => {
                console.log('Payment info added succesfully to Firestore !')
                console.log(docRef.id)

                const createStripePaymentIntent = functions.httpsCallable('createStripePaymentIntent')
                createStripePaymentIntent({ docId: docRef.id }).then(async function (client_secret) {
                    console.log(client_secret.data.client_secret)
                    console.log(this.state.token.id)

                    try {
                        const confirmPaymentIntent = await stripe.confirmPaymentIntent({
                            clientSecret: client_secret.data.client_secret,
                            paymentMethodId: this.state.token.id
                        })

                        //Update status on FIRESTORE: confirmPaymentIntent.status
                        console.log(confirmPaymentIntent)
                        REFS.users.doc(firebase.auth().currentUser.uid).collection('paymentIntents').doc(docRef.id).update({
                            status: confirmPaymentIntent.status
                        })
                    }

                    catch (error) {
                        console.log(confirmPaymentIntent)
                        console.error(error)
                        this.setState({ loading: false })
                    }

                }.bind(this)).catch(err => console.error(err))

            })
    }

    render() {
        const { loading, token, success, response } = this.state

        return (
            <View style={styles.container}>
                <Image source={require('../assets/logo-1000-1000.png')} style={{ width: SCREEN_WIDTH * 0.2 * ratioLogo, height: SCREEN_WIDTH * 0.2 }} />

                <View style={styles.containerTitle}>
                    <Text style={styles.title}>
                        Paiement In-App avec Stripe
                    </Text>

                </View>

                <Button
                    text="Saisir les données de la carte"
                    // text="Enter you card and pay"
                    loading={loading}
                    // onPress={this.addAdminRole}
                    onPress={this.handleCardPayPress}
                />
                <View
                    style={styles.token}
                >
                    {token &&
                        <>
                            <Text style={styles.instruction}>
                                Token: {token.tokenId}
                            </Text>
                            <Button
                                text="Payer"
                                loading={loading}
                                onPress={this.makePayment}
                            />

                        </>
                    }
                    {success &&
                        <>
                            <Text style={styles.instruction}>
                                Status: {response.status}
                            </Text>
                            <Text style={styles.instruction}>
                                ID: {response.id}
                            </Text>
                            <Text style={styles.instruction}>
                                Amount: {response.amount}
                            </Text>
                        </>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerTitle: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 16
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instruction: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    token: {
        height: 20,
    },
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