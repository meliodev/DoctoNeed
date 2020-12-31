//Bugs: removed loadDoctors because it produces an error

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Appointments from '../../../components/Appointments'

import { connect } from 'react-redux'

//Firebase
import firebase from 'react-native-firebase'
import { signOutUser } from '../../../DB/CRUD'
import * as REFS from '../../../DB/CollectionsRefs'

class PreviousAppointments extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        var query = REFS.appointments
        query = query.where('finished', '==', true)
        query = query.orderBy('date', 'desc')

        return (
            <Appointments appointmentType='previous' query={query} />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.roles.role,
    }
}

export default connect(mapStateToProps)(PreviousAppointments)

