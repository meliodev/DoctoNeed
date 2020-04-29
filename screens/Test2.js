
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Picker,
  Dimensions,
} from 'react-native';
import Dates from 'react-native-dates';
import moment from 'moment';
import 'moment/src/locale/fr'

import firebase, { database } from 'react-native-firebase'
import { signOutUser } from '../DB/CRUD'
import * as REFS from '../DB/CollectionsRefs'
//import DeviceInfo from 'react-native-device-info'
import * as RNLocalize from "react-native-localize";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

/*moment.locale('fr', {
  months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  monthsParseExact: true,
  weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
  weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
  weekdaysParseExact: true,
});*/

export default class Test1 extends Component {
  state = {
    date: null,
    focus: 'startDate',
    timeslots: []
    //blockedDates: [],
    /*ts0800: { time: '', status: '' },
    ts0900: { time: '', status: '' },
    ts1000: { time: '', status: '' },
    ts1100: { time: '', status: '' },
    ts1200: { time: '', status: '' },
    ts1300: { time: '', status: '' },
    ts1400: { time: '', status: '' },
    ts1500: { time: '', status: '' },
    ts1600: { time: '', status: '' },
    ts1700: { time: '', status: '' },
    ts1800: { time: '', status: '' },
    ts1900: { time: '', status: '' },*/
  }



  componentDidMount() {

    let o = {
        a : 1,
        b : 2
    }
    let x = 2

    let timeslots = []
    timeslots.push(o)

    this.setState({ timeslots : timeslots}, () => console.log(this.state.timeslots))
    
    /*REFS.doctors.doc('USy7lx18dvf3zJhDfRXVvEg76T03').collection('DoctorSchedule').where('status', '==', 'blocked')
      .get().then(querySnapshot => {
        let blockedDates = []

        querySnapshot.forEach(doc => {
          blockedDates.push(doc.data().date.toDate())
          this.setState({ blockedDates: blockedDates })
        })

      }) */


    /*  REFS.doctors.doc('USy7lx18dvf3zJhDfRXVvEg76T03').collection('DoctorSchedule').doc('0LYOUZmOdsuC7KFy3mmu').get().then(function (doc) {
        //  console.log( this.setState({ DateDB: doc.data().date.toDate() }) )
        //  console.log(moment(doc.data().date.toDate()).format('MMMM Do YYYY, h:mm:ss a'))
        // console.log(DeviceInfo.get)
        //  console.log(RNLocalize.getTimeZone())
       // console.log(doc.data().date.toDate())
  
        let ts0800 = {
          time: moment(doc.data().date.toDate()).format('HH:mm'),
          status: doc.data().timeslots.ts0900.status
        }
  
        let ts0900 = {
          time: moment(doc.data().timeslots.ts0900.time.toDate()).tz(RNLocalize.getTimeZone()).format('HH:mm'),
          status: doc.data().timeslots.ts0900.status
        }
  
        let ts1000 = {
          time: moment(doc.data().timeslots.ts1000.time.toDate()).tz(RNLocalize.getTimeZone()).format('HH:mm'),
          status: doc.data().timeslots.ts0900.status
        }
  
        let ts1100 = {
          time: moment(doc.data().timeslots.ts1100.time.toDate()).tz(RNLocalize.getTimeZone()).format('HH:mm'),
          status: doc.data().timeslots.ts0900.status
        }
  
        let ts1200 = {
          time: moment(doc.data().timeslots.ts1200.time.toDate()).tz(RNLocalize.getTimeZone()).format('HH:mm'),
          status: doc.data().timeslots.ts0900.status
        }
  
        let ts1300 = {
          time: moment(doc.data().timeslots.ts1300.time.toDate()).tz(RNLocalize.getTimeZone()).format('HH:mm'),
          status: doc.data().timeslots.ts0900.status
        }
  
        let ts1400 = {
          time: moment(doc.data().timeslots.ts1400.time.toDate()).tz(RNLocalize.getTimeZone()).format('HH:mm'),
          status: doc.data().timeslots.ts0900.status
        }
  
        let ts1500 = {
          time: moment(doc.data().timeslots.ts1500.time.toDate()).tz(RNLocalize.getTimeZone()).format('HH:mm'),
          status: doc.data().timeslots.ts0900.status
        }
  
        let ts1600 = {
          time: moment(doc.data().timeslots.ts1600.time.toDate()).tz(RNLocalize.getTimeZone()).format('HH:mm'),
          status: doc.data().timeslots.ts0900.status
        }
  
        let ts1700 = {
          time: moment(doc.data().timeslots.ts1700.time.toDate()).tz(RNLocalize.getTimeZone()).format('HH:mm'),
          status: doc.data().timeslots.ts0900.status
        }
  
        let ts1800 = {
          time: moment(doc.data().timeslots.ts1800.time.toDate()).tz(RNLocalize.getTimeZone()).format('HH:mm'),
          status: doc.data().timeslots.ts0900.status
        }
  
        let ts1900 = {
          time: moment(doc.data().timeslots.ts1900.time.toDate()).tz(RNLocalize.getTimeZone()).format('HH:mm'),
          status: doc.data().timeslots.ts0900.status
        }
  
        this.setState({ ts0800: ts0800 })
        this.setState({ ts0900: ts0800 })
        this.setState({ ts1000: ts0800 })
        this.setState({ ts1100: ts0800 })
        this.setState({ ts1200: ts0800 })
        this.setState({ ts1300: ts0800 })
        this.setState({ ts1400: ts0800 })
        this.setState({ ts1500: ts0800 })
        this.setState({ ts1600: ts0800 })
        this.setState({ ts1700: ts0800 })
        this.setState({ ts1800: ts0800 })
        this.setState({ ts1900: ts0800 })*/

    //     console.log(doc.data().timeslots)
    // console.log(ts1900.status)

    /*  console.log(moment( doc.data().timeslots.ts0800.time.toDate() ).tz(RNLocalize.getTimeZone()).format('HH:mm')) 
      console.log(moment( doc.data().timeslots.ts0900.time.toDate() ).tz(RNLocalize.getTimeZone()).format('HH:mm')) 
      console.log(moment( doc.data().timeslots.ts1000.time.toDate() ).tz(RNLocalize.getTimeZone()).format('HH:mm')) 
      console.log(moment( doc.data().timeslots.ts1100.time.toDate() ).tz(RNLocalize.getTimeZone()).format('HH:mm')) 
      console.log(moment( doc.data().timeslots.ts1200.time.toDate() ).tz(RNLocalize.getTimeZone()).format('HH:mm')) 
      console.log(moment( doc.data().timeslots.ts1300.time.toDate() ).tz(RNLocalize.getTimeZone()).format('HH:mm')) 
      console.log(moment( doc.data().timeslots.ts1400.time.toDate() ).tz(RNLocalize.getTimeZone()).format('HH:mm')) 
      console.log(moment( doc.data().timeslots.ts1500.time.toDate() ).tz(RNLocalize.getTimeZone()).format('HH:mm')) 
      console.log(moment( doc.data().timeslots.ts1600.time.toDate() ).tz(RNLocalize.getTimeZone()).format('HH:mm')) 
      console.log(moment( doc.data().timeslots.ts1700.time.toDate() ).tz(RNLocalize.getTimeZone()).format('HH:mm')) 
      console.log(moment( doc.data().timeslots.ts1800.time.toDate() ).tz(RNLocalize.getTimeZone()).format('HH:mm')) 
      console.log(moment( doc.data().timeslots.ts1900.time.toDate() ).tz(RNLocalize.getTimeZone()).format('HH:mm')) */

    //  }.bind(this))

  }

    keysrt(key,desc) {
    return function(a,b){
     return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
    }
  }

  render() {
    //console.log('hey')
    //  console.log(this.state.date)
    //console.log(this.state.date)
   /* let formatedDate = moment(this.state.date).format('YYYY-MM-DD')
      let formatedDatePlus = moment(this.state.date).add(1,'days').format('YYYY-MM-DD')
      let formatedDateMinus = moment(this.state.date).subtract(1,'days').format('YYYY-MM-DD')

     if (this.state.date) {
      console.log(moment(formatedDate).isBefore(formatedDateMinus))
     }*/

    const isDateBlocked = (date) => {

      return date.isBefore(moment(), 'day') || date.isAfter(moment().add(60, 'days'), 'day') || date.format('dddd') === 'dimanche'
    }

    const onDateChange = ({ date }) => {
      this.setState({ ...this.state, date });

    /*  let formatedDate = moment(this.state.date).format('LL')
      let formatedDatePlus = moment(this.state.date).add(1,'days').format('LL')
      let formatedDateMinus = moment(this.state.date).subtract(1,'days').format('LL')*/

      REFS.doctors.doc('USy7lx18dvf3zJhDfRXVvEg76T03').collection('DoctorSchedule') //.where('date' > formatedDateMinus) //.where('date' < formatedDatePlus)
        .get().then(querySnapshot => {

          let timeslots = []
          querySnapshot.forEach(doc => {

          //  if (moment(this.state.date).format("MMM Do YY") === moment(doc.data().ts.toDate()).format("MMM Do YY")) {
             // let timeslot = {
               // time: '',
               // status: '',
                //key: ''
             // }
             let timeslot = {
               a: 5,
               b: 6
            }

            timeslots.push(timeslot)
            console.log(timeslots)

            this.setState({ timeslots: timeslots })

             // timeslot.time = moment(doc.data().ts.toDate()).format('HH:mm')
              //timeslot.status = 'open'
              //timeslot.key = moment(doc.data().ts.toDate()).format('HHmm')

          //  }

          })

         /* timeslots.sort(function(a, b) {
            var keyA = new Date(a.key),
              keyB = new Date(b.key);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });*/

          //console.log(timeslots);
         // console.log(timeslots.sort(this.keysrt('key')))
        })
    }

    //  console.log('date selected: '+ moment(this.state.date).format('MMM Do YY'))
    //console.log('timeslot: '+ moment(doc.data().ts.toDate()).format('MMM Do YY'))

    //  console.log(moment1(doc.data().ts.toDate()).format())
    //console.log(moment1(new Date()).format())
    

    return (
      <View style={styles.container}>

        <Dates
          date={this.state.date}
          onDatesChange={onDateChange}
          isDateBlocked={isDateBlocked}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
        />

        {this.state.date && <Text style={styles.date}>{this.state.date && this.state.date.format('LL')}</Text>}

        {this.state.timeslots.map(ts => {
         return (<Text>{ts}</Text>)
          
        })}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: 20
  },
  date: {
    marginTop: 50
  },
  focused: {
    color: '#93eafe'
  }
});
