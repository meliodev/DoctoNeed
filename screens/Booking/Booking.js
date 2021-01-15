import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import theme from '../../constants/theme.js'

import moment from 'moment'
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')

import DateTime from 'react-native-customize-selected-date'
import _ from 'lodash'

import firebase from 'react-native-firebase'
import * as REFS from '../../DB/CollectionsRefs'

import { withNavigation } from 'react-navigation';
import { Alert } from 'react-native';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioFooter = 254 / 668; // The actual icon footer size is 254 * 668
const FOOTER_ICON_HEIGHT = Dimensions.get("window").width * ratioFooter; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;
const gray400 = '#BDBDBD'

class Booking extends React.Component {
  constructor(props) {
    super(props);
    this.currentDay = moment().format('YYYY-MM-DD')
    this.doctorId = this.props.navigation.getParam('doctorId', '')
    this.date = ''
    this.appId = this.props.navigation.getParam('appId', '')
    this.isUrgence = this.props.navigation.getParam('isUrgence', false)

    this.state = {
      isLoading1: false,
      isLoading2: false,
      availableDates: [],
      blockedDates: [],
      timeslots: [],
      date: moment()
    }
  }

  async componentDidMount() {
    this.setState({ isLoading1: true })

    //Postponing
    if (this.appId !== '') {
      await REFS.appointments.doc(this.appId).get().then((doc) => {
        this.doctorId = doc.data().doctor_id[0]
        this.date = doc.data().date
      })
    }

    await this.checkDaysAvailability()

    const today = moment().format('YYYY-MM-DD')
    this.onChangeDate(today)

    this.setState({ isLoading1: false })
  }

  componentWillUnmount() {
    if (this.unsubscribe)
      this.unsubscribe()
  }

  async checkDaysAvailability() {

    await REFS.doctors.doc(this.doctorId).collection('DoctorSchedule')
      .where('available', '==', false)
      .where('date', '>=', moment().format('LL'))
      .get().then(querySnapshot => {

        let blockedDates = []

        querySnapshot.forEach((doc) => {
          let date = doc.data().date
          date = moment(date, 'LLL').format('YYYY-MM-DD')
          blockedDates.push(date)
        })

        this.setState({ blockedDates })

      })

  }

  onChangeDate(date) {
    this.setState({ date, isLoading2: true })

    this.unsubscribe = REFS.doctors.doc(this.doctorId).collection('DoctorSchedule').where('date', '==', moment(date).format('Do MMMM YYYY')).onSnapshot(querySnapshot => {

      let timeslots = []

      let timeslot = {
        date: '',
        time: '',
        key: '',
        originalTime: ''
      }

      querySnapshot.forEach(doc => {
        const ts = doc.data().timeslots

        for (const item of ts)
          if (!item.paid && moment(item.timeslot).isAfter(moment())) {
            timeslot.time = moment(item.timeslot).format('HH:mm')
            timeslot.key = moment(item.timeslot).format('HHmm')
            timeslot.originalTime = item.timeslot
            timeslots.push(timeslot)
            timeslot = { date: '', time: '', key: '', originalTime: '' }
          }
      })

      //SORT TIMESLOTS
      timeslots.sort(function (a, b) {
        var keyA = new Date(a.key)
        var keyB = new Date(b.key)
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      })

      this.setState({ timeslots, isLoading2: false })

    })

  }

  renderChildDay(day) {
    if (_.includes(this.state.blockedDates, day)) {
      return { color: gray400 }
    }

    if (moment(day, 'YYYY-MM-DD').isAfter(moment().add(59, 'days'), 'day')) {
      return { color: gray400 }
    }

    if (moment(day, 'YYYY-MM-DD').isBefore(moment(), 'day')) {
      return { color: gray400 }
    }
  }

  onAppointmentClick(date) {
    //Logged in user
    if (firebase.auth().currentUser) {

      //Regular case
      if (this.appId === '') {
        this.props.navigation.navigate('Symptomes', {
          doctorId: this.doctorId,
          date: date,
          isUrgence: this.isUrgence
        })
      }

      //POSTPONE CASE: task: DO IT through cloud function
      else {
        Alert.alert(
          'Report du rendez-vous',
          `Êtes-vous sûr de vouloir reporter votre rendez-vous au ${moment(date).format('LL')} à ${moment(date).format('HH:mm')}`,
          [
            { text: 'Annuler', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'Confirmer', onPress: () => this.postponeAppointment(date) }
          ],
          { cancelable: false }

        )
      }
    }

    //Guest user: task: Create a Redux state and put Booking data to restore booking data after user log in
    else this.props.navigation.navigate('Login')

  }

  postponeAppointment(date) {
    REFS.appointments.doc(this.appId).update({ postponedBPfrom: this.date, postponedBPto: date, updatedBy: firebase.auth().currentUser.uid })
      .then(() => this.props.navigation.navigate('TabScreenPatient'))
  }

  render() {
    const { isLoading1, isLoading2 } = this.state

    return (
      <View style={styles.container}>

        {isLoading1 ?
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>
          :
          <DateTime
            blockedDates={this.state.blockedDates}
            date={this.state.time}
            changeDate={(date) => this.onChangeDate(date)}
            format='YYYY-MM-DD'
            renderChildDay={(day) => this.renderChildDay(day)}
            renderPrevYearButton={() => null}
            renderNextMonthButton={() => null}
            customWeekDays={['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']}
            containerStyle={{ backgroundColor: '#fff', marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, elevation: 3 }}
            warpRowControlMonthYear={{ backgroundColor: '#fff' }}
            monthyearStyle={{ color: 'black', fontWeight: 'bold' }}
            warpRowWeekdays={{ backgroundColor: '#fff' }}
            weekdayStyle={{ color: '#757575' }}
            warpDayStyle={{ backgroundColor: '#fff', borderColor: gray400, borderWidth: StyleSheet.hairlineWidth }}
            dateSelectedWarpDayStyle={{ backgroundColor: '#93eafe' }}
            textDayStyle={{ color: '#000' }}
            currentDayStyle={{ color: '#000' }}
          />
        }

        {isLoading2 ?
          <View style={styles.loading_container2}>
            <ActivityIndicator size='large' />
          </View>
          :
          <View style={{ flex: 1 }}>
            {!isLoading1 &&
              <View style={{ backgroundColor: 'gray', paddingVertical: 5, paddingLeft: 15 }}>
                <Text style={styles.date}>{this.state.date && moment(this.state.date).format('LL')}</Text>
              </View>
            }
            <ScrollView>
              {this.state.timeslots.map(ts => {
                return (
                  <TouchableOpacity style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.05, alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.05, marginBottom: StyleSheet.hairlineWidth * 3, borderLeftWidth: 5, borderLeftColor: '#93eafe', backgroundColor: '#ffffff' }}
                    onPress={() => this.onAppointmentClick(ts.originalTime)}>
                    <Text>{ts.time.replace(':', 'h')}</Text>
                    <Icon name="rightcircleo"
                      size={SCREEN_WIDTH * 0.04}
                      color="#93eafe"
                      style={{ position: "absolute", right: SCREEN_WIDTH * 0.05 }} />
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </View>
        }

      </View>
    );
  }
}

export default withNavigation(Booking);

const calendarStyles = StyleSheet.create({
  calendar: {
    backgroundColor: 'red'
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  date: {
    fontWeight: 'bold',
    color: '#fff'
  },

  loading_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'green'
  },

  loading_container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'green'
  }

})










// checkDaysAvailability() {

//   for (let i = 0; i < 60; i++) {

//     let currentDay = moment().add(i, 'days').format("MMM Do YY")

//     REFS.doctors.doc(this.doctorId).collection('DoctorSchedule').orderBy('ts', 'ASC').get().then(querySnapshot => {

//       let isDayBlocked = true

//       querySnapshot.forEach(doc => {
//         if (currentDay === moment(doc.data().ts).format("MMM Do YY"))
//           isDayBlocked = false
//       })

//       if (isDayBlocked) {
//         let { blockedDates } = this.state
//         blockedDates.push(moment(currentDay).format('YYYY-MM-DD'))
//         this.setState({ blockedDates }, () => isDayBlocked = true)
//       }

//     })
//   }

// }