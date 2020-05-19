import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';

import theme from '../../constants/theme.js'

import moment from 'moment'
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')

import Dates from 'react-native-dates';

import firebase from 'react-native-firebase'
import * as REFS from '../../DB/CollectionsRefs'

import { withNavigation } from 'react-navigation';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioFooter = 254 / 668; // The actual icon footer size is 254 * 668
const FOOTER_ICON_HEIGHT = Dimensions.get("window").width * ratioFooter; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

class Booking extends React.Component {
  constructor(props) {
    super(props);
    this.currentDay = moment().format('YYYY-MM-DD')
    this.doctorId = null
    this.date = ''
    this.appId = this.props.navigation.getParam('appId', 'nothing sent')
    this.isUrgence = this.props.navigation.getParam('isUrgence', 'nothing sent')


    this.state = {
      isLoading: false,
      isLoading2: false,
      test: '',
      availableDates: [],
      blockedDates: [],
      timeslots: [],
    }
  }

  async componentDidMount() {
    this.displayLoading() //setTimeout loading 3sec

    if (this.appId !== 'nothing sent') {
      await REFS.appointments.doc(this.appId).get().then((doc) => {
        this.doctorId = doc.data().doctor_id
        this.date = doc.data().date
      })
    }

    else {
      this.doctorId = this.props.navigation.getParam('doctorId', 'nothing sent')
    }

    this.checkDaysAvailability()
  }

  displayLoading() {
    this.setState({ isLoading: true }, () => setTimeout(() => this.setState({ isLoading: false }), 3000))
  }

  //i: A variable to define how many days we want to check its availability (it varies from today to the value of i)
  checkDaysAvailability() {

    for (let i = 0; i < 60; i++) {

      let currentDay = moment().add(i, 'days').format("MMM Do YY")

      REFS.doctors.doc(this.doctorId).collection('DoctorSchedule').get().then(querySnapshot => {

        let timeslots = []
        let timeslot = {
          time: '',
          status: '',
          key: ''
        }

        querySnapshot.forEach(doc => {
          timeslot = {
            time: '',
            status: '',
            key: ''
          }

          if (currentDay === moment(doc.data().ts).format("MMM Do YY")) {

            timeslot.time = moment(doc.data().ts).format('HH:mm')
            timeslot.status = 'open'
            timeslot.key = moment(doc.data().ts).format('HHmm')

            timeslots.push(timeslot)
          }

        })

        //console.log('After forEach')
        if (timeslots.length != 0) {
          //console.log('availbale...')
        }

        else {
          //console.log(currentDay + ' is blocked')
          this.setState(prevState => ({
            blockedDates: [...prevState.blockedDates, currentDay]
          }))
        }

      })
    }

  }

  onAppointmentClick(date) {

    //Logged in user
    if (firebase.auth().currentUser) {

      //Regular case
      if (this.appId === 'nothing sent') {
        this.props.navigation.navigate('Symptomes', {
          doctorId: this.doctorId,
          date: date,
          isUrgence: this.isUrgence
        })
      }

      //Postpone case
      else {
        //Task: Block the new date for the patient (& keep the old date for x hours or until the admin confirms the postpone)
        REFS.doctors.doc(this.doctorId).collection('DoctorSchedule').where('ts', '==', date).get().then(querySnapshot => {

          //update payment status of the timeslot chosen
          querySnapshot.forEach(doc => {
            REFS.doctors.doc(this.doctorId).collection('DoctorSchedule').doc(doc.id).update({ paid: true })
              .then(() => console.log('document has been updated'))
              .catch((err) => console.error(err))
          })

        }).then(() => console.log('document has been retrieved.'))
          .catch((err) => console.error(err))

        // updating the status of the appointment to 'postponed by patient'
        REFS.appointments.doc(appId).update({ postponing: true, postponeBP: true, postponedBPfrom: this.date, postponedBPto: date })
          .then(() => { //task: postponedBPto should be an array for multiple postpones possible
            this.props.navigation.navigate('TabScreenPatient')
          })
      }
    }

    //Guest user
    else
      this.props.navigation.navigate('Login')

  }

  render() {

    const onDateChange = ({ date }) => {

      this.setState({ ...this.state, date })
      this.setState({ isLoading2: true })

      REFS.doctors.doc(this.doctorId).collection('DoctorSchedule').get().then(querySnapshot => {

        let timeslots = []
        let timeslot = {
          time: '',
          status: '',
          key: ''
        }

        querySnapshot.forEach(doc => {
          // console.log(doc.data().ts)
          timeslot = {
            date: '',
            time: '',
            status: '',
            key: ''
          }
          if (moment(this.state.date).format("MMM Do YY") === moment(doc.data().ts).format("MMM Do YY")) {

            //Check if the timeslot is already confirmed (paid) by a patient && the timeslot is after the current time
            if (doc.data().paid === false && moment(doc.data().ts).isAfter(moment())) {

              timeslot.date = moment(doc.data().ts).format()
              timeslot.time = moment(doc.data().ts).format('HH:mm')
              timeslot.status = 'open'
              timeslot.key = moment(doc.data().ts).format('HHmm')

              timeslots.push(timeslot)
            }

          }

        })

        //Sort timeslots
        timeslots.sort(function (a, b) {
          var keyA = new Date(a.key),
            keyB = new Date(b.key);
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });

        this.setState({ timeslots: timeslots })

      }).then(() => this.setState({ isLoading2: false }))
    }

    const isDateBlocked = (date) => {
      let bool = date.format("MMM Do YY") === this.state.blockedDates[0]

      for (let j = 1; j < this.state.blockedDates.length; j++) {
        bool = bool || date.format("MMM Do YY") === this.state.blockedDates[j]
      }

      return date.isBefore(moment(), 'day') || date.isAfter(moment().add(60, 'days'), 'day') || bool
    }

    return (
      <View style={styles.container}>

        {this.state.isLoading === true ?
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>
          :
          <Dates
            date={this.state.date}
            onDatesChange={onDateChange}
            isDateBlocked={isDateBlocked}
          //styles={calendarStyles}
          //startDate={this.state.startDate}
          //endDate={this.state.endDate}
          />}


        <View style={{ height: SCREEN_HEIGHT * 0.1, justifyContent: 'center', paddingLeft: SCREEN_WIDTH * 0.02 }}>
          {this.state.date && <Text style={styles.date}>{this.state.date && this.state.date.format('LL')}</Text>}
        </View>

        {this.state.isLoading2 === true ?
          <View style={styles.loading_container2}>
            <ActivityIndicator size='large' />
          </View>
          :
          <ScrollView>
            {this.state.timeslots.map(ts => {
              return (
                <TouchableOpacity style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.05, alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.05, marginBottom: StyleSheet.hairlineWidth * 3, borderLeftWidth: 5, borderLeftColor: '#93eafe', backgroundColor: '#ffffff' }}
                  onPress={() => this.onAppointmentClick(ts.date)}>
                  <Text>{ts.time}</Text>
                  <Icon name="rightcircleo"
                    size={SCREEN_WIDTH * 0.04}
                    color="#93eafe"
                    style={{ position: "absolute", right: SCREEN_WIDTH * 0.05 }} />
                </TouchableOpacity>
              )
            })}
          </ScrollView>
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
    backgroundColor: theme.BACKGROUND_COLOR,
  },

  date: {
    fontWeight: 'bold',
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
    justifyContent: 'flex-start',
    //backgroundColor: 'green'
  }

});