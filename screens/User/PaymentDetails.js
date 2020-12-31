
import React from 'react'
import { View, Text, Dimensions, ScrollView, TouchableHighlight, StyleSheet } from 'react-native'

import Button from '../../components/Button';
import Loading from '../../components/Loading';

import moment from 'moment'
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')

import { connect } from 'react-redux'
import { InitializeUserId } from '../../functions/functions'

import * as REFS from '../../DB/CollectionsRefs'
import theme from '../../constants/theme';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.14 * ratioLogo;

class PaymentDetails extends React.Component {
    constructor(props) {
        super(props);
        this.month = this.props.navigation.getParam('month', '')
        this.doctor = this.props.navigation.getParam('doctor', '')
        this.doctor_id_param = this.props.navigation.getParam('doctor_id', '')  //received from admin or doctor navigation params
        this.getFiltersfromParams()
        InitializeUserId(this)

        this.loadAppointments = this.loadAppointments.bind(this);

        this.state = {
            appointments: [],
            month: '',
            doctor: '',
            isLoading: false
        }
    }

    async componentDidMount() {
        this.setState({ isLoading: true })
        await this.loadAppointments()
        await this.loadPaymentIntents()
        this.setState({ isLoading: false })
    }

    //Admin navigates from doctor's payment history with params, used here as filters to see all appointments of that specific doctor for a given period
    getFiltersfromParams() {
        if (this.month !== '')
            this.setState({ month: this.month })

        if (this.doctor !== '')
            this.setState({ doctor: this.doctor })
    }

    // Load appointments
    loadAppointments() {
        var query = REFS.appointments
        query = query.where('doctor_id', "array-contains", this.doctor_id)
        query = query.where('month', '==', this.month)
        query = query.orderBy('date', 'desc')

        return query.get().then((querySnapshot) => {
            let appointments = []
            querySnapshot.forEach(doc => {

                let status = ''
                if (doc.data().finished)
                    status = 'Passée'

                else if (!doc.data().finished)
                    status = 'À venir'

                let app = {
                    id: doc.id,
                    date: doc.data().date,
                    doctorName: doc.data().doctorName,
                    status: status
                }

                appointments.push(app)
            })

            this.setState({ appointments })

        })
    }

    //load payments
    async loadPaymentIntents() {
        let { appointments } = this.state

        let app = null
        let promises = []

        for (let i = 0; i < appointments.length; i++) {
            app = appointments[i]

            let promise = await REFS.paymentintents.where('metadata.appointment_id', '==', app.id).get()
                .then((querySnapshot) => {
                    const doc = querySnapshot.docs[0]

                    app.price = doc.data().amount / 100
                    app.currency = doc.data().currency

                    if (doc.data().status === 'succeeded') // 'succeeded' if payment was made & 'many other statuses' if payment was not made
                        app.paymentStatus = 'Payé'

                    if (doc.data().charges.data[0].refunded) {
                        app.paymentStatus = 'Remboursé' //Annulé et remboursé
                        app.status = 'Annulée' //Annulé mais pas encore remboursé (l'annulation doit être automatiquement suivie par le remboursement)                            
                    }

                    return app
                })

            promises.push(promise)
        }

        return Promise.all(promises)
            .then((appointments) => this.setState({ appointments }))
            .catch((e) => console.error(e))
    }

    //appointment item functions
    displayDetails = (appId) => {
        this.props.navigation.navigate('AppointmentDetails', { appId: appId, noinput: true })
    }

    appointmentStatusStyle(appointment) {
        if (appointment.status === 'Annulée') return 'red'
        if (appointment.status === 'Passée') return 'green'
        if (appointment.status === 'À venir') return '#93eafe'
    }

    render() {
        let dateComponent = <Text style={styles.month}>{this.month}</Text>

        return (
            <View style={styles.container}>

                {this.state.isLoading ?
                    <Loading />
                    :
                    <View style={styles.container}>
                        {dateComponent}

                        {/*Appointments list*/}
                        <ScrollView style={styles.appointments_container_scrollview}>
                            {this.state.appointments.map(appointment => {

                                return (
                                    <View style={itemStyle.main_container}>
                                        <View style={itemStyle.date_container}>
                                            <Text style={itemStyle.date_day}>{moment(appointment.date).format("Do")}</Text>
                                        </View>

                                        <View style={itemStyle.titles_container}>
                                            <Text style={itemStyle.title_text}>Prix</Text>
                                            <Text style={itemStyle.title_text}>Statut du paiement</Text>
                                            <Text style={itemStyle.title_text}>Statut de la consultation</Text>
                                        </View>

                                        <View style={itemStyle.data_container}>
                                            <Text style={itemStyle.data_text}>{appointment.price} {appointment.currency}</Text>
                                            <Text style={itemStyle.data_text}>{appointment.paymentStatus}</Text>
                                            <Text style={[itemStyle.data_text, { color: this.appointmentStatusStyle(appointment) }]}>{appointment.status}</Text>
                                        </View>

                                        <View style={itemStyle.buttons_container}>
                                            <TouchableHighlight
                                                style={itemStyle.button}
                                                onPress={() => this.displayDetails(appointment.id)}>
                                                <View style={itemStyle.button_elements}>
                                                    <Text style={itemStyle.viewDetails}>Détails</Text>
                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                )
                            })}
                        </ScrollView>

                    </View>
                }

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
    }
}

export default connect(mapStateToProps)(PaymentDetails)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    month: {
        fontWeight: 'bold',
        paddingLeft: SCREEN_WIDTH * 0.07,
        marginBottom: SCREEN_HEIGHT * 0.01,
        marginTop: SCREEN_HEIGHT * 0.05,
        color: 'gray'
    },
    appointments_container_scrollview: {
        flex: 1,
    },
})

const itemStyle = StyleSheet.create({
    main_container: {
        borderRadius: 20,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        height: SCREEN_HEIGHT * 0.13,
        width: SCREEN_WIDTH * 0.95,
        alignItems: 'center',
        marginBottom: SCREEN_HEIGHT * 0.025,
        marginLeft: SCREEN_HEIGHT * 0.01,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        //backgroundColor: 'blue'
    },

    date_container: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: SCREEN_WIDTH * 0.016,
        //backgroundColor: 'orange'
    },
    date_day: {
        color: '#93eafe',
        fontSize: SCREEN_HEIGHT * 0.032,
        fontWeight: 'bold'
    },
    titles_container: {
        flex: 0.42,
        justifyContent: 'center',
        //backgroundColor: 'pink'
    },
    title_text: {
        fontStyle: 'italic',
        fontSize: 10,
    },
    data_container: {
        flex: 0.28,
        justifyContent: 'center',
        //backgroundColor: 'yellow'
    },
    data_text: {
        fontWeight: 'bold',
        fontSize: 10,
    },
    buttons_container: {
        flex: 0.2,
        justifyContent: 'center',
        //backgroundColor: 'brown'
    },
    button: {
        height: SCREEN_HEIGHT * 0.035,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: SCREEN_WIDTH * 0.03,
        backgroundColor: '#93eafe',
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
    },
    button_elements: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewDetails: {
        fontSize: theme.FONT_SIZE_SMALL * 0.9,
        color: 'white',
        marginRight: SCREEN_WIDTH * 0.01
    },
})

