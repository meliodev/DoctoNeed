
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput, StyleSheet, ImageBackground } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';

import theme from '../constants/theme.js'

import moment from 'moment'
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')

import Dates from 'react-native-dates';

import * as REFS from '../DB/CollectionsRefs'

import { withNavigation } from 'react-navigation';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioFooter = 254 / 668; // The actual icon footer size is 254 * 668
const FOOTER_ICON_HEIGHT = Dimensions.get("window").width * ratioFooter; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

class Test1 extends React.Component {
  constructor(props) {
    super(props);
    this.currentDay = moment().format('YYYY-MM-DD')

    this.state = {
      availableDates: [],
      blockedDates: [],
      timeslots: []
    }
  }

  componentWillMount() {

    //i: A variable to define how many days we want to check its availability (it varies from today to the value of i)
    for (let i = 0; i < 10; i++) {
      let currentDay = moment().add(i, 'days').format("MMM Do YY")

      REFS.doctors.doc('USy7lx18dvf3zJhDfRXVvEg76T03').collection('DoctorSchedule')
        .get().then(querySnapshot => {

          let timeslots = []
          let timeslot = {
            time: '',
            status: '',
            key: ''
          }

          querySnapshot.forEach(doc => {
            //console.log(currentDay)
            timeslot = {
              time: '',
              status: '',
              key: ''
            }
            //console.log(currentDay + '===' + moment(doc.data().ts.toDate()).format("MMM Do YY") )
            if (currentDay === moment(doc.data().ts.toDate()).format("MMM Do YY")) {
              //  console.log(('hey'))
              //console.log(doc.data().ts.toDate())
              // console.log(moment(doc.data().ts.toDate()).format('HH:mm'))
              timeslot.time = moment(doc.data().ts.toDate()).format('HH:mm')
              timeslot.status = 'open'
              timeslot.key = moment(doc.data().ts.toDate()).format('HHmm')

              timeslots.push(timeslot)

            }



          })

          // console.log('date '+currentDay)


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

    /*REFS.doctors.doc('USy7lx18dvf3zJhDfRXVvEg76T03').collection('DoctorSchedule') 
    .get().then(querySnapshot => {
        let availableDates = []
      querySnapshot.forEach(doc => {
          if (!availableDates.includes(moment(doc.data().ts.toDate()).format("MMM Do YY"))) {
             //console.log('not included...')
             availableDates.push(moment(doc.data().ts.toDate()).format("MMM Do YY"))
          }



      })

      this.setState({ availableDates: availableDates }, () => console.log(this.state.availableDates))

     // let today = moment()
     // let blockedDates = []
      for (let i =0; i<60; i++) {
      console.log(moment().add(i,'days').format('YYYY-MM-DD'))
        
      }

    /*  timeslots.sort(function (a, b) {
        var keyA = new Date(a.key),
          keyB = new Date(b.key);
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });*/

    //this.setState({ timeslots: timeslots })

    // })
  }

  render() {
    //console.log(this.state.blockedDates)

    const onDateChange = ({ date }) => {
      this.setState({ ...this.state, date });

      REFS.doctors.doc('USy7lx18dvf3zJhDfRXVvEg76T03').collection('DoctorSchedule') //.where('date' > formatedDateMinus) //.where('date' < formatedDatePlus)
        .get().then(querySnapshot => {

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
            if (moment(this.state.date).format("MMM Do YY") === moment(doc.data().ts.toDate()).format("MMM Do YY")) {

              //console.log(doc.data().ts.toDate())
              // console.log(moment(doc.data().ts.toDate()).format('HH:mm'))
              timeslot.time = moment(doc.data().ts.toDate()).format('HH:mm')
              timeslot.status = 'open'
              timeslot.key = moment(doc.data().ts.toDate()).format('HHmm')

              timeslots.push(timeslot)

              //console.log(timeslots)
            }

          })

          timeslots.sort(function (a, b) {
            var keyA = new Date(a.key),
              keyB = new Date(b.key);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });

          this.setState({ timeslots: timeslots })

        })
    }

    const isDateBlocked = (date) => {
      let bool = date.format("MMM Do YY") === this.state.blockedDates[0]
      for (let j = 1; j < this.state.blockedDates.length; j++) {

        bool = bool || date.format("MMM Do YY") === this.state.blockedDates[j]

      }

      return date.isBefore(moment(), 'day') || date.isAfter(moment().add(60, 'days'), 'day') || date.format('dddd') === 'dimanche' || bool
    }
    return (
      <View style={styles.container}>

        <Dates
          date={this.state.date}
          onDatesChange={onDateChange}
          isDateBlocked={isDateBlocked}
        //styles={calendarStyles}
        //startDate={this.state.startDate}
        //endDate={this.state.endDate}
        />

        <View style= {{height: SCREEN_HEIGHT*0.1, justifyContent: 'center', paddingLeft: SCREEN_WIDTH*0.02 }}>
          {this.state.date && <Text style={styles.date}>{this.state.date && this.state.date.format('LL')}</Text>}
        </View>

        <ScrollView>
          {this.state.timeslots.map(ts => {
            return (
              <TouchableOpacity style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.05, alignItems: 'center', paddingLeft: SCREEN_WIDTH*0.05, marginBottom: StyleSheet.hairlineWidth*3 , borderLeftWidth: 5, borderLeftColor: '#93eafe', backgroundColor: '#ffffff' }}>
                <Text>{ts.time}</Text>
                <Icon name="rightcircleo"
                      size={SCREEN_WIDTH * 0.04}
                      color="#93eafe" 
                      style= {{ position: "absolute", right: SCREEN_WIDTH*0.05 }}/>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

      </View>

    );
  }
}

export default withNavigation(Test1);

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
  }

});












// Booking screen version :

/*
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput, StyleSheet, ImageBackground } from 'react-native'
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

    this.state = {
      availableDates: [],
      blockedDates: [],
      timeslots: []
    }
  }

  async componentWillMount() {
    let appId = this.props.navigation.getParam('appId', 'nothing sent')

    if (appId !== 'nothing sent') {
      await REFS.appointments.doc(appId).get().then((doc) => {
        this.doctorId = doc.data().doctor_id
        this.date = doc.data().date
        //console.log('inside: '+this.doctorId)
      })
    }

    else {
      this.doctorId = this.props.navigation.getParam('doctorId', 'nothing sent')
    }

    //i: A variable to define how many days we want to check its availability (it varies from today to the value of i)
    for (let i = 0; i < 10; i++) {
      let currentDay = moment().add(i, 'days').format("MMM Do YY")

      REFS.doctors.doc(this.doctorId).collection('DoctorSchedule')
        .get().then(querySnapshot => {

          let timeslots = []
          let timeslot = {
            time: '',
            status: '',
            key: ''
          }

          querySnapshot.forEach(doc => {
            //console.log(currentDay)
            timeslot = {
              time: '',
              status: '',
              key: ''
            }
            //console.log(currentDay + '===' + moment(doc.data().ts).format("MMM Do YY") )
            if (currentDay === moment(doc.data().ts).format("MMM Do YY")) {
              //  console.log(('hey'))
              //console.log(doc.data().ts)
              // console.log(moment(doc.data().ts).format('HH:mm'))
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
    let appId = this.props.navigation.getParam('appId', 'nothing sent')

    if (firebase.auth().currentUser) {

      if (appId === 'nothing sent') {
        this.props.navigation.navigate('Symptomes', {
          doctorId: this.doctorId,
          date: date
        })
      }

      else {
        REFS.appointments.doc(appId).update({ postponing: true, postponeBP: true, postponedBPto: date, postponedBPfrom: this.date }).then(() => { //postponedBPto should be an array later on
          this.props.navigation.navigate('TabScreenPatient')
          //alert('Votre de demande de changement de date du rendez-vous est en cours de traitement.')
        })
      }
    }

    else
      this.props.navigation.navigate('Login')

  }

  render() {
    //console.log(this.state.blockedDates)

    const onDateChange = ({ date }) => {
      this.setState({ ...this.state, date });

      REFS.doctors.doc('USy7lx18dvf3zJhDfRXVvEg76T03').collection('DoctorSchedule') //.where('date' > formatedDateMinus) //.where('date' < formatedDatePlus)
        .get().then(querySnapshot => {

          let timeslots = []
          let timeslot = {
            time: '',
            status: '',
            key: ''
          }

          querySnapshot.forEach(doc => {
            console.log(doc.data().ts)
            timeslot = {
              date: '',
              time: '',
              status: '',
              key: ''
            }
            if (moment(this.state.date).format("MMM Do YY") === moment(doc.data().ts).format("MMM Do YY")) {

              timeslot.date = moment(doc.data().ts).format()
              timeslot.time = moment(doc.data().ts).format('HH:mm')
              timeslot.status = 'open'
              timeslot.key = moment(doc.data().ts).format('HHmm')

              timeslots.push(timeslot)

            }

          })

          timeslots.sort(function (a, b) {
            var keyA = new Date(a.key),
              keyB = new Date(b.key);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });

          this.setState({ timeslots: timeslots })

        })
    }

    const isDateBlocked = (date) => {
      let bool = date.format("MMM Do YY") === this.state.blockedDates[0]
      for (let j = 1; j < this.state.blockedDates.length; j++) {

        bool = bool || date.format("MMM Do YY") === this.state.blockedDates[j]

      }

      return date.isBefore(moment(), 'day') || date.isAfter(moment().add(60, 'days'), 'day') || date.format('dddd') === 'dimanche' || bool
    }
    return (
      <View style={styles.container}>

        <Dates
          date={this.state.date}
          onDatesChange={onDateChange}
          isDateBlocked={isDateBlocked}
        //styles={calendarStyles}
        //startDate={this.state.startDate}
        //endDate={this.state.endDate}
        />

        <View style={{ height: SCREEN_HEIGHT * 0.1, justifyContent: 'center', paddingLeft: SCREEN_WIDTH * 0.02 }}>
          {this.state.date && <Text style={styles.date}>{this.state.date && this.state.date.format('LL')}</Text>}
        </View>

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
  }

});*/