//Bugs: removed loadDoctors because it produces an error

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Appointments from '../../../components/Appointments'

import { connect } from 'react-redux'

//Firebase
import firebase from '../../../configs/firebase'
import { signOutUser } from '../../../DB/CRUD'
import * as REFS from '../../../DB/CollectionsRefs'

class PreviousAppointments extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        if (firebase.auth().currentUser !== null) {
            var query = REFS.appointments
            query = query.where('user_id', '==', firebase.auth().currentUser.uid)
            query = query.where('finished', '==', false)
            query = query.where('cancelBP', '==', false)
            query = query.orderBy('date', 'desc')

            return (
                <Appointments appointmentType='next' query={query} />
            )
        }

        else return null

    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
    }
}

export default connect(mapStateToProps)(PreviousAppointments)

