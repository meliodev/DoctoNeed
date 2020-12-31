import React, { PureComponent } from 'react'
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native'
import Button from '../components/Button'
import firebase from 'react-native-firebase'
import * as REFS from '../DB/CollectionsRefs'

import moment from 'moment-timezone'
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ratioLogo = 420 / 244;

const functions = firebase.functions()

export default class ScheduleTask extends PureComponent {

    RunTask() {
        REFS.doctors.get().then(function (querySnapshot) {
            querySnapshot.forEach(document => {

                //I. Get the last day scheduled
                REFS.doctors.doc(document.id).collection('ScheduleSettings').doc('Lundi').get()
                    .then((doc1) => {
                        if (doc1.exists) {
                            const dayName = moment(doc1.data().lastday).add(1, 'days').format('dddd')
                            const dayNameCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1) //Lundi
                            return dayNameCapitalized
                        }
                        else return null
                    })
                    //II. Add timeslots to doctor's schedule
                    .then(async (dayNameCapitalized) => {

                        if (dayNameCapitalized)
                            await REFS.doctors.doc(document.id).collection('ScheduleSettings').doc(dayNameCapitalized).get() //exp: 
                                .then(async (doc) => {

                                    let date = []

                                    const from1Exist = doc.data().timerange1.from !== ""
                                    const to1Exist = doc.data().timerange1.to !== ""
                                    const from2Exist = doc.data().timerange2.from !== ""
                                    const to2Exist = doc.data().timerange2.to !== ""

                                    if (!from1Exist && !to1Exist && !from2Exist && !to2Exist) {
                                        date.push(false)
                                        date.push(moment().format('LL'))
                                    }

                                    else {
                                        date.push(true)
                                        date.push(moment().format('LL'))

                                        //TIMERANGE1
                                        if (from1Exist && to1Exist) {

                                            let currentHour1 = moment(doc.data().timerange1.from, 'HH:mm');
                                            let currentHour2 = moment(doc.data().timerange1.to, 'HH:mm');

                                            let ts = ''
                                            let hour = ''

                                            while (currentHour1.isBefore(currentHour2) || currentHour1.isSame(currentHour2)) {

                                                hour = moment(currentHour1).format('HH:mm') //useless
                                                ts = moment(doc.data().lastday).format('YYYY-MM-DD') + 'T' + hour + ':00:00' + doc.data().timezone

                                                let timeslot = {
                                                    paid: false,
                                                    ts: ts
                                                }

                                                date.push(timeslot)

                                                currentHour1 = moment(currentHour1, 'HH:mm').add('30', 'minutes')
                                                currentHour1 = moment(currentHour1, 'HH:mm');
                                            }
                                        }

                                        //TIMERANGE2
                                        if (from2Exist && to2Exist) {

                                            let currentHour3 = moment(doc.data().timerange2.from, 'HH:mm');
                                            let currentHour4 = moment(doc.data().timerange2.to, 'HH:mm');

                                            let ts2 = ''
                                            let hour2 = ''

                                            while (currentHour3.isBefore(currentHour4) || currentHour3.isSame(currentHour4)) {

                                                hour2 = moment(currentHour3).format('HH:mm')
                                                ts2 = moment(doc.data().lastday).format('YYYY-MM-DD') + 'T' + hour2 + ':00' + doc.data().timezone

                                                let timeslot2 = {
                                                    paid: false,
                                                    ts: ts2
                                                }

                                                date.push(timeslot2)

                                                currentHour3 = moment(currentHour3, 'HH:mm').add('30', 'minutes')
                                                currentHour3 = moment(currentHour3, 'HH:mm');
                                            }
                                        }
                                    }

                                    await REFS.doctors.doc(document.id).collection('DoctorSchedule').add(date)
                                        .then(() => console.log(`Créneaux horaire du médecin ${document.id} pour le jour ${moment().format('LL')} ajouté avec succès !`))
                                        .catch((err) => console.error(err))

                                    let nextday = moment(doc.data().lastday).add(1, 'days').format('YYYY-MM-DD')
                                    return nextday
                                })
                                //III. Update lastday
                                .then(async (nextday) => {
                                    await REFS.doctors.doc(document.id).collection('ScheduleSettings').get().then((querySnapshot) => {
                                        querySnapshot.forEach(scheduleDoc => {
                                            scheduleDoc.ref.update({ lastday: nextday })
                                        })
                                    })
                                })
                    })
            })
        })
    }

    updateSchedule() {
        REFS.doctors.get().then(function (querySnapshot) {
            querySnapshot.forEach(document => {
                console.log(document.id)
                //I. Get the last day scheduled
                REFS.doctors.doc(document.id).collection('ScheduleSettings').doc('Lundi').get()
                    .then((doc1) => {
                        if (doc1.exists) {
                            const followingDay = moment(doc1.data().lastday, 'YYYY-MM-DD').add(1, 'days').format('LL')
                            const dayName = moment(doc1.data().lastday, 'YYYY-MM-DD').add(1, 'days').format('dddd')
                            const dayNameCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1) //Lundi
                            return { dayNameCapitalized: dayNameCapitalized, followingDay: followingDay }
                        }
                        else return null
                    })
                    //II. Add timeslots to doctor's schedule
                    .then(async (object) => {
                        console.log(object)
                        if (object.dayNameCapitalized)
                            await REFS.doctors.doc(document.id).collection('ScheduleSettings').doc(object.dayNameCapitalized).get() //exp: 
                                .then(async (doc) => {

                                    let date = []

                                    const from1Exist = doc.data().timerange1.from !== ""
                                    const to1Exist = doc.data().timerange1.to !== ""
                                    const from2Exist = doc.data().timerange2.from !== ""
                                    const to2Exist = doc.data().timerange2.to !== ""

                                    const tz = doc.data().timezone
                                    const tzLeft = tz.slice(0, 3)
                                    const tzRight = tz.charAt(3) + tz.charAt(4)
                                    const timezone = tzLeft + ':' + tzRight

                                    if (!from1Exist && !to1Exist && !from2Exist && !to2Exist) {
                                        date.push(false)
                                        date.push(object.followingDay)
                                    }

                                    else {
                                        date.push(true)
                                        date.push(object.followingDay)

                                        //TIMERANGE1
                                        if (from1Exist && to1Exist) {

                                            let currentHour1 = moment(doc.data().timerange1.from, 'HH:mm');
                                            let currentHour2 = moment(doc.data().timerange1.to, 'HH:mm');

                                            let ts = ''
                                            let hour = ''

                                            while (currentHour1.isBefore(currentHour2) || currentHour1.isSame(currentHour2)) {

                                                hour = moment(currentHour1).format('HH:mm') //useless
                                                ts = moment(object.followingDay, 'LL').format('YYYY-MM-DD') + 'T' + hour + ':00' + timezone

                                                let timeslot = {
                                                    paid: false,
                                                    ts: ts
                                                }

                                                date.push(timeslot)

                                                currentHour1 = moment(currentHour1, 'HH:mm').add('30', 'minutes')
                                                currentHour1 = moment(currentHour1, 'HH:mm');
                                            }
                                        }

                                        //TIMERANGE2
                                        if (from2Exist && to2Exist) {

                                            let currentHour3 = moment(doc.data().timerange2.from, 'HH:mm');
                                            let currentHour4 = moment(doc.data().timerange2.to, 'HH:mm');

                                            let ts2 = ''
                                            let hour2 = ''

                                            while (currentHour3.isBefore(currentHour4) || currentHour3.isSame(currentHour4)) {

                                                hour2 = moment(currentHour3).format('HH:mm')
                                                ts = moment(object.followingDay, 'LL').format('YYYY-MM-DD') + 'T' + hour + ':00' + timezone

                                                let timeslot2 = {
                                                    paid: false,
                                                    ts: ts2
                                                }

                                                date.push(timeslot2)

                                                currentHour3 = moment(currentHour3, 'HH:mm').add('30', 'minutes')
                                                currentHour3 = moment(currentHour3, 'HH:mm');
                                            }
                                        }
                                    }

                                    const item = {
                                        date: date[1],
                                        available: date[0],
                                    }

                                    //Set timeslots
                                    let timeslots = date
                                    timeslots.splice(0, 2)
                                    item.timeslots = timeslots

                                    console.log(item)
                                    await REFS.doctors.doc(document.id).collection('DoctorSchedule').add(item)
                                        .then(() => console.log(`Créneaux horaire du médecin ${document.id} pour le jour ${moment().format('LL')} ajouté avec succès !`))
                                        .catch((err) => console.error(err))

                                    let nextday = moment(doc.data().lastday).add(1, 'days').format('YYYY-MM-DD')
                                    console.log(nextday)
                                    return nextday

                                })
                                //III. Update lastday
                                .then(async (nextday) => {
                                    await REFS.doctors.doc(document.id).collection('ScheduleSettings').get().then((querySnapshot) => {
                                        querySnapshot.forEach(scheduleDoc => {
                                            console.log(nextday)
                                            scheduleDoc.ref.update({ lastday: nextday })
                                        })
                                    })
                                })
                    })
            })
        })
    }

    RunCloudTask() {
        const updateDoctorSchedule = functions.httpsCallable('updateDoctorSchedule')
        updateDoctorSchedule()
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <Button
                    width={SCREEN_WIDTH * 0.85}
                    text="Run task"
                    onPress={this.updateSchedule} />
            </View >
        )
    }
}


















