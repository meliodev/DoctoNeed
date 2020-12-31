
//add due amount & paid amount
//admin can edit paid amount
//due amount is automatically calculated

import React, { PureComponent } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'

import moment from 'moment'
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')

import Icon from 'react-native-vector-icons/Ionicons';

import Header from '../../components/Header'
import Button from '../../components/Button'
import LeftSideMenu from '../../components/LeftSideMenu'
import Loading from '../../components/Loading'

import stripe from 'tipsi-stripe'
import X from '../../node_modules/tipsi-stripe/src/Stripe'
import firebase from 'react-native-firebase'
import * as REFS from '../../DB/CollectionsRefs'

import theme from '../../constants/theme.js'

import { connect } from 'react-redux'
import { InitializeUserId } from '../../functions/functions'


const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height
const ratioLogo = 420 / 244
const LOGO_WIDTH = SCREEN_WIDTH * 0.14 * ratioLogo

const line = <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth, width: SCREEN_WIDTH * 0.9, alignSelf: 'center' }} />
const lineBold = <View style={{ borderBottomColor: '#d9dbda', borderBottomWidth: StyleSheet.hairlineWidth * 7, width: SCREEN_WIDTH * 0.9, alignSelf: 'center' }} />

class PaymentSummary extends PureComponent {
    constructor(props) {
        super(props);
        this.doctor_id_param = this.props.navigation.getParam('doctor_id', '')  //received from admin or doctor navigation params
        this.doctor = this.props.navigation.getParam('doctor', '')
        InitializeUserId(this)
    }

    state = {
        paymentIntents: [],
        paymentIntents_totals: [],
        currency: '',
        appointments: [],
        showTotals: false
        // isLoading: false,
    }

    async componentDidMount() {
        this.setState({ isLoading: true })
        try {
            await this.loadAppointments()
            await this.loadPaymentIntents()
            this.calucateTotal()
            this.setState({ isLoading: false })
        }

        catch (e) {
            console.error(e)
            this.setState({ isLoading: false })
        }
    }

    // Load previous appointments
    loadAppointments() {
        var query = REFS.appointments
        query = query.where('doctor_id', "array-contains", this.doctor_id)
        query = query.where('finished', '==', true)
        query = query.where('cancelBP', '==', false)
        query = query.orderBy('date', 'desc')

        return query.get().then((querySnapshot) => {
            let appointments = []

            querySnapshot.forEach(doc => {

                let app = {
                    id: doc.id,
                    month: doc.data().month //format date to month
                }

                appointments.push(app)
            })

            this.setState({ appointments })
        })
    }

    //Load payments of previous appointments
    loadPaymentIntents() {
        let query = REFS.paymentintents //add where finished == true
        query = query.where('metadata.doctor_id', '==', this.doctor_id)
        query = query.where('status', '==', 'succeeded')  // TASK: disable write by Security rules
        query = query.orderBy('metadata.date', 'desc')

        return query.get().then((querySnapshot) => {
            let paymentIntents = []
            querySnapshot.forEach(doc => {

                this.state.appointments.forEach((app) => {
                    if (app.id === doc.data().metadata.appointment_id && app.month === moment(doc.data().metadata.date).format("MM/YYYY")) {

                        let pi = {
                            date: moment(doc.data().metadata.date).format("MM/YYYY"), //created is an Integer unix date
                            price: doc.data().amount,
                            currency: doc.data().currency,
                            appointment_id: doc.data().metadata.appointment_id,
                            finished: true
                        }

                        paymentIntents.push(pi)
                    }
                })

            })

            this.setState({ paymentIntents })
        })
    }

    //Calculate totals by month
    calucateTotal() {
        const { paymentIntents } = this.state

        if (paymentIntents.length > 0) {

            let month = paymentIntents[0].date
            let total = 0
            let paymentIntents_totals = []

            paymentIntents.forEach((pi, key) => {
                let piMinusOne = paymentIntents.length - 1

                if (pi.date === month && key < paymentIntents.length - 1) {
                    total = total + pi.price / 100
                }

                else if (pi.date === month && key === paymentIntents.length - 1) {
                    total = total + pi.price / 100

                    let pi_total = {
                        date: month,
                        total: total
                    }

                    paymentIntents_totals = this.state.paymentIntents_totals
                    paymentIntents_totals.push(pi_total)
                    this.setState({ paymentIntents_totals: paymentIntents_totals, showTotals: true })
                }

                else if (pi.date !== month && key < paymentIntents.length - 1) {

                    let pi_total = {
                        date: month,
                        total: total
                    }

                    paymentIntents_totals = this.state.paymentIntents_totals
                    paymentIntents_totals.push(pi_total)
                    this.setState({ paymentIntents_totals })

                    total = pi.price / 100
                    month = pi.date
                }

                else if (pi.date !== month && key === paymentIntents.length - 1) {
                    let pi_total1 = {
                        date: month,
                        total: total
                    }

                    total = pi.price / 100
                    month = pi.date

                    let pi_total2 = {
                        date: month,
                        total: total
                    }

                    paymentIntents_totals = this.state.paymentIntents_totals
                    paymentIntents_totals.push(pi_total1)
                    paymentIntents_totals.push(pi_total2)
                    this.setState({ paymentIntents_totals, showTotals: true })
                }
            })
        }

    }

    //Display table of payments (month - Total - Details)
    renderPaymentIntents() {

        if (this.state.showTotals)
            return this.state.paymentIntents_totals.map((pi) => {
                return (
                    <View>
                        <View style={{ height: 50, marginBottom: 10, justifyContent: 'center', flexDirection: 'row' }}>
                            <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', }}>
                                <Text>{pi.date}</Text>
                            </View>

                            <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', }}>
                                <Text>{pi.total}</Text>
                            </View>

                            <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ color: theme.THEME_COLOR, fontWeight: 'bold' }} onPress={() => this.props.navigation.navigate('PaymentDetails', { month: pi.date, doctor_id: this.doctor_id, doctor: this.doctor })}>Voir les détails</Text>
                            </View>
                        </View>
                        {line}
                    </View>
                )
            })

        else return null
    }

    render() {

        let currency = ''
        let paymentIntents = this.state.paymentIntents
        if (paymentIntents.length > 0)
            currency = paymentIntents[0].currency

        return (
            <View style={styles.container} >

                <Header />

                {this.state.isLoading ?
                    <Loading />
                    :
                    <View>
                        <View style={{ height: 50, marginBottom: 10, justifyContent: 'center', flexDirection: 'row' }}>
                            <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ fontWeight: 'bold' }}>Mois</Text>
                            </View>

                            <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ fontWeight: 'bold' }}>Total ({currency})</Text>
                            </View>

                            <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ fontWeight: 'bold' }}>Détails</Text>
                            </View>
                        </View>

                        {lineBold}
                        {this.renderPaymentIntents()}
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

export default connect(mapStateToProps)(PaymentSummary)

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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: SCREEN_WIDTH * 0.15,
        //backgroundColor: 'purple'
    },
    value_text: {
        fontWeight: 'bold',
        fontSize: theme.FONT_SIZE_MEDIUM * 1.2
    },
    label_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        // paddingRight: SCREEN_WIDTH * 0.15,
        //backgroundColor: 'orange'
    },
    label_text: {
        color: theme.GRAY_COLOR,
        fontWeight: 'bold',
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
    },
    logoIcon: {
        height: SCREEN_WIDTH * 0.14,
        width: LOGO_WIDTH,
    }
})


