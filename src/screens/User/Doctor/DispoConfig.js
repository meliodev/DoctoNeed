
import React from 'react'
import { View, Image, Text, TouchableHighlight, Dimensions, ActivityIndicator, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

import { ScrollView } from 'react-native-gesture-handler';
import { CheckBox, CardItem, Content } from 'native-base';

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import LeftSideMenu from '../../../components/LeftSideMenu'
import Item from '../../../components/DispoItem2'
import Button from '../../../components/Button';

import firebase from '../../../configs/firebase';
import * as REFS from '../../../DB/CollectionsRefs'

//constants
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ratioHeader = 267 / 666; // The actaul icon headet size is 254 * 668
const HEADER_ICON_HEIGHT = Dimensions.get("window").width * ratioHeader; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)
const ratioLogo = 1;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

export default class DispoConfig extends React.Component {
  constructor(props) {
    super(props);
    this.counter = 0

    this.updateDay = this.updateDay.bind(this);
    this.addRow = this.addRow.bind(this);
    this.verifyInputs = this.verifyInputs.bind(this)

    this.state = {
      nom: "",
      prenom: "",
      speciality: "",
      isLeftSideMenuVisible: false,

      doctorSchedule: [],
      isScheduleEmpty: true,
      checked: false,

      Lundi: [{ from: '', to: '' }, { from: '', to: '' }],
      Mardi: [{ from: '', to: '' }, { from: '', to: '' }],
      Mercredi: [{ from: '', to: '' }, { from: '', to: '' }],
      Jeudi: [{ from: '', to: '' }, { from: '', to: '' }],
      Vendredi: [{ from: '', to: '' }, { from: '', to: '' }],
      Samedi: [{ from: '', to: '' }, { from: '', to: '' }],
      Dimanche: [{ from: '', to: '' }, { from: '', to: '' }],

      isDay1_On: false,
      isDay2_On: false,
      isDay3_On: false,
      isDay4_On: false,
      isDay5_On: false,
      isDay6_On: false,
      isDay7_On: false,

      errors: [false, false, false, false, false, false, false],

      rows_1: 0,
      rows_2: 0,
      rows_3: 0,
      rows_4: 0,
      rows_5: 0,
      rows_6: 0,
      rows_7: 0,

      lastday: '',

      isLoading: false,
      isEditing: false,
    }
  }

  async componentDidMount() {
    this.getCurrentSchedule()
    await this.getDoctorMetaData()
    await this.isUrgence()
  }

  async isUrgence() {
    await REFS.doctors.doc(firebase.auth().currentUser.uid).get()
      .then((doc) => this.setState({ checked: doc.data().urgences }))
      .catch((err) => console.error(err))
  }

  //Fetch doctor & schedule data
  async getDoctorMetaData() {
    const { currentUser } = firebase.auth()
    await REFS.doctors.doc(currentUser.uid).get().then(doc => {
      this.setState({ nom: doc.data().nom, prenom: doc.data().prenom, speciality: doc.data().speciality })
    })
  }

  getCurrentSchedule() {
    REFS.doctors.doc(firebase.auth().currentUser.uid).collection('ScheduleSettings').get().then(querySnapshot => {

      querySnapshot.forEach(doc => {
        this.getDaySchedule(doc.id, 'Lundi', doc.data().timerange1.from, doc.data().timerange1.to, doc.data().timerange2.from, doc.data().timerange2.to, 1)
        this.getDaySchedule(doc.id, 'Mardi', doc.data().timerange1.from, doc.data().timerange1.to, doc.data().timerange2.from, doc.data().timerange2.to, 2)
        this.getDaySchedule(doc.id, 'Mercredi', doc.data().timerange1.from, doc.data().timerange1.to, doc.data().timerange2.from, doc.data().timerange2.to, 3)
        this.getDaySchedule(doc.id, 'Jeudi', doc.data().timerange1.from, doc.data().timerange1.to, doc.data().timerange2.from, doc.data().timerange2.to, 4)
        this.getDaySchedule(doc.id, 'Vendredi', doc.data().timerange1.from, doc.data().timerange1.to, doc.data().timerange2.from, doc.data().timerange2.to, 5)
        this.getDaySchedule(doc.id, 'Samedi', doc.data().timerange1.from, doc.data().timerange1.to, doc.data().timerange2.from, doc.data().timerange2.to, 6)
        this.getDaySchedule(doc.id, 'Dimanche', doc.data().timerange1.from, doc.data().timerange1.to, doc.data().timerange2.from, doc.data().timerange2.to, 7)
      })

    }).then(() => this.isScheduleEmpty())
      .catch((err) => console.error(err))
  }

  getDaySchedule(docId, dayName, from1, to1, from2, to2, i) {

    let dayArray = [{ from: '', to: '' }, { from: '', to: '' }]

    if (docId === dayName) {

      dayArray[0].from = from1
      dayArray[0].to = to1
      dayArray[1].from = from2
      dayArray[1].to = to2

      const update0 = {};
      update0[dayName] = dayArray
      this.setState(update0);

      if (dayArray[0].from !== '') {
        const update1 = {};
        update1['isDay' + i + '_On'] = true
        this.setState(update1);

        const update2 = {};
        update2['rows_' + i] = 1
        this.setState(update2);
      }

      if (dayArray[1].from !== '') {
        const update3 = {};
        update3['rows_' + i] = 2
        this.setState(update3);
      }
    }
  }

  isScheduleEmpty() {

    let isScheduleEmpty = true

    isScheduleEmpty = this.state.Lundi[0].from === '' && this.state.Lundi[0].to === ''
      && this.state.Mardi[0].from === '' && this.state.Mardi[0].to === ''
      && this.state.Mercredi[0].from === '' && this.state.Mercredi[0].to === ''
      && this.state.Jeudi[0].from === '' && this.state.Jeudi[0].to === ''
      && this.state.Vendredi[0].from === '' && this.state.Vendredi[0].to === ''
      && this.state.Samedi[0].from === '' && this.state.Samedi[0].to === ''
      && this.state.Dimanche[0].from === '' && this.state.Dimanche[0].to === ''

    this.setState({ isScheduleEmpty })
  }

  /************************   Form functions   *****************************/

  toggleDay = (i, previousState) => {

    let day = []
    switch (i) {
      case 1:
        day = this.state.Lundi
        day[0].from = ''
        day[0].to = ''
        day[1].from = ''
        day[1].to = ''
        this.setState({ Lundi: day })
        break;
      case 2:
        day = this.state.Mardi
        day[0].from = ''
        day[0].to = ''
        day[1].from = ''
        day[1].to = ''
        this.setState({ Mardi: day })
        break;
      case 3:
        day = this.state.Mercredi
        day[0].from = ''
        day[0].to = ''
        day[1].from = ''
        day[1].to = ''
        this.setState({ Mercredi: day })
        break;
      case 4:
        day = this.state.Jeudi
        day[0].from = ''
        day[0].to = ''
        day[1].from = ''
        day[1].to = ''
        this.setState({ Jeudi: day })
        break;
      case 5:
        day = this.state.Vendredi
        day[0].from = ''
        day[0].to = ''
        day[1].from = ''
        day[1].to = ''
        this.setState({ Vendredi: day })
        break;
      case 6:
        day = this.state.Samedi
        day[0].from = ''
        day[0].to = ''
        day[1].from = ''
        day[1].to = ''
        this.setState({ Samedi: day })
        break;
      case 7:
        day = this.state.Dimanche
        day[0].from = ''
        day[0].to = ''
        day[1].from = ''
        day[1].to = ''
        this.setState({ Dimanche: day })
        break;
      default:
        console.log(`Sorry, we are out of.`);
    }

    const update1 = {};
    update1['isDay' + i + '_On'] = !previousState;
    this.setState(update1);

    const update2 = {};
    update2['rows_' + i] = 1;
    this.setState(update2)
  }

  updateDay = (day, value, i, FromTo) => {

    let Day = day
    if (FromTo === 'from') { Day[i].from = value }
    else if (FromTo === 'to') { Day[i].to = value }

    this.setState({ Day })
  }

  addRow = (i, day, rowsDay) => {

    let RowsDay = rowsDay

    if (rowsDay < 3 && day[rowsDay - 1].from !== '' && day[rowsDay - 1].to !== '') {
      RowsDay += 1

      const update = {};
      update['rows_' + i] = RowsDay;
      this.setState(update)
    }

    else console.log('nombre maximum de lignes = 2 ou selectionnez les heures dans la ligne au dessus ')
  }

  removeRow = (rowsDay, i, previousState) => {

    let RowsDay = rowsDay

    if (rowsDay > 0) {

      //remove timerange from state
      let day = []
      switch (i) {
        case 1:
          day = this.state.Lundi
          day[rowsDay - 1].from = ''
          day[rowsDay - 1].to = ''
          this.setState({ Lundi: day })
          break;
        case 2:
          day = this.state.Mardi
          day[rowsDay - 1].from = ''
          day[rowsDay - 1].to = ''
          this.setState({ Mardi: day })
          break;
        case 3:
          day = this.state.Mercredi
          day[rowsDay - 1].from = ''
          day[rowsDay - 1].to = ''
          this.setState({ Mercredi: day })
          break;
        case 4:
          day = this.state.Jeudi
          day[rowsDay - 1].from = ''
          day[rowsDay - 1].to = ''
          this.setState({ Jeudi: day })
          break;
        case 5:
          day = this.state.Vendredi
          day[rowsDay - 1].from = ''
          day[rowsDay - 1].to = ''
          this.setState({ Vendredi: day })
          break;
        case 6:
          day = this.state.Samedi
          day[rowsDay - 1].from = ''
          day[rowsDay - 1].to = ''
          this.setState({ Samedi: day })
          break;
        case 7:
          day = this.state.Dimanche
          day[rowsDay - 1].from = ''
          day[rowsDay - 1].to = ''
          this.setState({ Dimanche: day })
          break;
        default:
          console.log(`Sorry, we are out of.`);
      }

      RowsDay -= 1
      const update1 = {};
      update1['rows_' + i] = RowsDay;

      this.setState(update1, () => {
        if (RowsDay === 0) {
          const update2 = {};
          update2['isDay' + i + '_On'] = !previousState;
          this.setState(update2);
        }
      });
    }

    else console.log('nombre maximum de lignes = 2 ou selectionnez les heures dans la ligne au dessus ')
  }

  /***************************************************************************/


  /*********************   CONFIRMATION   ************************************/

  verifyInputs() {
    const daysSelected = [
      ['lundi', this.state.isDay1_On, this.state.Lundi],
      ['mardi', this.state.isDay2_On, this.state.Mardi],
      ['mercredi', this.state.isDay3_On, this.state.Mercredi],
      ['jeudi', this.state.isDay4_On, this.state.Jeudi],
      ['vendredi', this.state.isDay5_On, this.state.Vendredi],
      ['samedi', this.state.isDay6_On, this.state.Samedi],
      ['dimanche', this.state.isDay7_On, this.state.Dimanche]
    ]

    console.log(daysSelected)

    const { errors } = this.state
    let isValid = true

    for (let i = 0; i < daysSelected.length; i++) {
      let length1
      let length2

      if (daysSelected[i][1]) {
        const from1 = daysSelected[i][2][0].from
        const to1 = daysSelected[i][2][0].to
        const from2 = daysSelected[i][2][1].from
        const to2 = daysSelected[i][2][1].to

        console.log(daysSelected[i][0], daysSelected[i][1])
        length1 = this.calculateIntervals(from1, to1, true)
        length2 = this.calculateIntervals(from2, to2, true)

        console.log(length1, length2)

        if (length1 < 0 || length2 < 0) {
          errors[i] = true
          isValid = false
        }

        else {
          errors[i] = false
        }
      }
    }

    this.setState({ errors })
    return isValid
  }

  handleConfirm = async () => {
    this.setState({ isLoading: true })

    const isValid = this.verifyInputs()
    if (!isValid) {
      this.setState({ isLoading: false })
      console.log('input invalid...')
      return
    }

    const { currentUser } = firebase.auth()
    const { isScheduleEmpty, Lundi, isDay1_On, Mardi, isDay2_On, Mercredi, isDay3_On, Jeudi, isDay4_On, Vendredi, isDay5_On, Samedi, isDay6_On, Dimanche, isDay7_On } = this.state

    const doctorSchedule = this.setDoctorSchedule()

    //if a schedule already exists: delete it (from today to next days...)
    if (!isScheduleEmpty) {
      let promises = []
      await REFS.doctors.doc(currentUser.uid).collection('DoctorSchedule').where('date', '>=', moment().format('LL')).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const promise = doc.ref.delete().then(() => console.log(doc.id + ' deleted'))
          promises.push(promise)
        })
      })

      await Promise.all(promises)
        .then(() => console.log('All documents deleted...'))
        .catch((err) => this.setState({ isLoading: false }))
    }

    await this.setDaySchedule('Lundi', Lundi, isDay1_On)
    await this.setDaySchedule('Mardi', Mardi, isDay2_On)
    await this.setDaySchedule('Mercredi', Mercredi, isDay3_On)
    await this.setDaySchedule('Jeudi', Jeudi, isDay4_On)
    await this.setDaySchedule('Vendredi', Vendredi, isDay5_On)
    await this.setDaySchedule('Samedi', Samedi, isDay6_On)
    await this.setDaySchedule('Dimanche', Dimanche, isDay7_On)

    await this.persistSchedule(doctorSchedule)
  }

  setDoctorSchedule() {
    //set schedule to json format
    const daysSelected = [
      ['lundi', this.state.isDay1_On, this.state.Lundi],
      ['mardi', this.state.isDay2_On, this.state.Mardi],
      ['mercredi', this.state.isDay3_On, this.state.Mercredi],
      ['jeudi', this.state.isDay4_On, this.state.Jeudi],
      ['vendredi', this.state.isDay5_On, this.state.Vendredi],
      ['samedi', this.state.isDay6_On, this.state.Samedi],
      ['dimanche', this.state.isDay7_On, this.state.Dimanche]
    ]

    let doctorSchedule = []

    for (let j = 0; j < 60; j++) {

      let currentDay = moment().add(j, 'days').format()
      let readableCurrentDay = moment().add(j, 'days').format('LL')
      let dayName = moment().add(j, 'days').format('dddd')

      let myElement = daysSelected.find((element) => element[0] === dayName)
      var item = []

      if (myElement[1]) { //available

        item.push(true)
        item.push(readableCurrentDay)

        for (const timerange of myElement[2]) {
          if (timerange.from !== '' && timerange.to !== '') {
            const fromHour = timerange.from.split(':')[0]
            const fromMinute = timerange.from.split(':')[1]

            currentDay = moment(currentDay).set('hour', fromHour).set('minute', Number(fromMinute)).set('second', '00').format()
            const length = this.calculateIntervals(timerange.from, timerange.to, false)

            for (let h = 0; h < length; h++) {
              let currentHour = moment(currentDay).format('HH:mm')
              let currentHour2 = moment(currentHour, 'HH:mm')
              const from = moment(timerange.from, 'HH:mm');
              const to = moment(timerange.to, 'HH:mm');

              if ((currentHour2.isBefore(to) || currentHour2.isSame(to)) && (currentHour2.isAfter(from) || currentHour2.isSame(from))) {
                item.push({ timeslot: currentDay, paid: false })
              }
              currentDay = moment(currentDay).add(30, 'minutes').format()
            }

          }
        }

        doctorSchedule.push(item)
      }

      else { //not available
        item.push(false)
        item.push(readableCurrentDay)
        doctorSchedule.push(item)
      }

      if (j === 59) {
        this.setState({ lastday: moment(currentDay).format('YYYY-MM-DD') })
      }

    }

    return doctorSchedule
  }

  calculateIntervals(from, to, onlyDiff) {
    const startHour = Number(from.split(':')[0])
    const endHour = Number(to.split(':')[0])

    const startMinute = Number(from.split(':')[1])
    const endMinute = Number(to.split(':')[1])

    let x = 0
    const diffHours = endHour - startHour

    //input verification
    if (onlyDiff) {
      if (diffHours === 0) {
        const diffMinutes = endMinute - startMinute
        return diffMinutes
      }

      else if (diffHours < 0) {
        return diffHours
      }
    }

    if (startMinute === endMinute)
      x = 1

    else if (startMinute === 30 && endMinute === 0)
      x = 0

    else if (startMinute === 0 && endMinute === 30)
      x = 2

    const result = diffHours * 2 + x
    return result
  }

  async setDaySchedule(dayName, dayArray, available) {
    const { currentUser } = firebase.auth()
    await REFS.doctors.doc(currentUser.uid).collection('ScheduleSettings').doc(dayName)
      .set({
        timerange1: { from: dayArray[0].from, to: dayArray[0].to },
        timerange2: { from: dayArray[1].from, to: dayArray[1].to },
        available: available,
        timezone: moment().format('ZZ'),
        lastday: this.state.lastday
      }, { merge: true })
      .then(() => console.log(`Schedule set for ${dayName}`))
      .catch((err) => this.setState({ isLoading: false, isEditing: false }))
  }

  async persistSchedule(doctorSchedule) {
    doctorSchedule.forEach(async ts => {

      let date = {
        date: ts[1],
        available: ts[0],
      }

      const docId = ts[1]

      //Set timeslots
      let timeslots = ts
      timeslots.splice(0, 2)
      date.timeslots = timeslots

      await REFS.doctors.doc(firebase.auth().currentUser.uid).collection('DoctorSchedule').doc(docId)
        .set(date)
        .then(() => console.log(`Date ${date.date} persisted...`))
        .catch((e) => console.error(e))

      this.counter = this.counter + 1
      if (this.counter === doctorSchedule.length)
        this.setState({ isLoading: false, isEditing: false }, () => {
          this.counter = 0
          this.isScheduleEmpty()
        })
    })
  }

  /****************************************************************************/


  updateUrgence() {
    //update 'urgences'
    REFS.doctors.doc(firebase.auth().currentUser.uid).update({ urgences: this.state.checked })
      .then(() => console.log('urgences mis à jour'))
      .catch((err) => {
        console.error(err)
      })
  }

  renderForm() {
    let days = [this.state.Lundi, this.state.Mardi, this.state.Mercredi, this.state.Jeudi, this.state.Vendredi, this.state.Samedi, this.state.Dimanche]

    if (!this.state.isEditing)
      return (
        <View style={styles.data_container}>

          <View style={{ flexDirection: 'row', alignSelf: 'flex-start', flexWrap: 'wrap', paddingVertical: SCREEN_HEIGHT * 0.02 }}>
            <CheckBox color="#93eafe" style={{ borderRadius: 10, borderColor: '#93eafe' }}
              title='check box'
              checked={this.state.checked}
              onPress={() => {
                this.setState({ checked: !this.state.checked }, () => this.updateUrgence())
              }} />
            {/* onPress={() => this.setState({ checked: !this.state.checked })} /> */}
            <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}> Accepter les urgences</Text>
          </View>

          <ScrollView style={{ marginTop: 15 }}>
            {days.map((day, key) => {
              let dayName = ''
              let i = key
              switch (i) {
                case 0: dayName = 'Lundi'
                  break;
                case 1: dayName = 'Mardi'
                  break;
                case 2: dayName = 'Mercredi'
                  break;
                case 3: dayName = 'Jeudi'
                  break;
                case 4: dayName = 'Vendredi'
                  break;
                case 5: dayName = 'Samedi'
                  break;
                case 6: dayName = 'Dimanche'
                  break;
              }

              return (
                <View>
                  <View style={{ flex: 1, flexDirection: 'row', width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.05, alignItems: 'center', marginBottom: StyleSheet.hairlineWidth * 3, borderLeftWidth: 5, borderLeftColor: '#93eafe' }}>

                    <View style={{ flex: 0.2, justifyContent: 'center', marginLeft: 20 }}>
                      <Text style={{ fontWeight: 'bold' }}>{dayName}</Text>
                    </View>

                    {day[0].from !== '' && day[0].to !== '' &&
                      <View style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Text>{day[0].from}</Text>
                        <Text> - </Text>
                        <Text>{day[0].to}</Text>
                      </View>
                    }

                    {day[1].from !== '' && day[1].to !== '' &&
                      <View style={{ flex: 0.1, alignItems: 'center' }}>
                        <Text style={{ color: 'gray' }}>|</Text>
                      </View>
                    }

                    {day[1].from !== '' && day[1].to !== '' &&
                      <View style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text>{day[1].from}</Text>
                        <Text> - </Text>
                        <Text>{day[1].to}</Text>
                      </View>
                    }
                  </View>
                </View>
              )
            })
            }

          </ScrollView>
        </View>
      )

    else {
      if (this.state.isLoading)
        return (
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>
        )

      else return (
        <View style={styles.dispos_container}>
          <View style={{ width: SCREEN_WIDTH * 0.42, borderBottomWidth: 3, borderBottomColor: '#83E7FE', marginVertical: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Mes disponibilités</Text>
          </View>

          <View style={{ flex: 10, alignItems: 'center' }} >
            <ScrollView>

              <Content style={{ flex: 1, width: SCREEN_WIDTH }}>

                {/*Monday =========================================================================================================================*/}

                <CardItem body>
                  <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                    checked={this.state.isDay1_On}
                    onPress={() => this.toggleDay(1, this.state.isDay1_On)}
                    checkboxTickColor='green' />
                  <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Lundi</Text>
                </CardItem>

                {this.state.isDay1_On &&
                  <Item
                    fromHour1={this.state.Lundi[0].from}
                    toHour1={this.state.Lundi[0].to}
                    fromHour2={this.state.Lundi[1].from}
                    toHour2={this.state.Lundi[1].to}
                    updateDay={this.updateDay}
                    day={this.state.Lundi}
                    dayName='Lundi'

                    addRow={this.addRow}
                    rowsDay={this.state.rows_1}
                    isDayOn={this.state.isDay1_On}
                    dayIndex={1}
                    removeRow={this.removeRow}

                    error={this.state.errors[0]}
                  />
                }

                {/*Tuesday =========================================================================================================================*/}

                <CardItem body>
                  <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                    checked={this.state.isDay2_On}
                    onPress={() => this.toggleDay(2, this.state.isDay2_On)}
                    checkboxTickColor='green' />
                  <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Mardi</Text>
                </CardItem>

                {this.state.isDay2_On &&
                  <Item
                    fromHour1={this.state.Mardi[0].from}
                    toHour1={this.state.Mardi[0].to}
                    fromHour2={this.state.Mardi[1].from}
                    toHour2={this.state.Mardi[1].to}
                    updateDay={this.updateDay}
                    day={this.state.Mardi}
                    dayName='Mardi'

                    addRow={this.addRow}
                    rowsDay={this.state.rows_2}
                    isDayOn={this.state.isDay2_On}
                    dayIndex={2}
                    removeRow={this.removeRow}

                    error={this.state.errors[1]}
                  />
                }


                {/*Wednesday =========================================================================================================================*/}

                <CardItem body>
                  <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                    checked={this.state.isDay3_On}
                    onPress={() => this.toggleDay(3, this.state.isDay3_On)}
                    checkboxTickColor='green' />
                  <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Mercredi</Text>
                </CardItem>

                {this.state.isDay3_On &&
                  <Item
                    fromHour1={this.state.Mercredi[0].from}
                    toHour1={this.state.Mercredi[0].to}
                    fromHour2={this.state.Mercredi[1].from}
                    toHour2={this.state.Mercredi[1].to}
                    updateDay={this.updateDay}
                    day={this.state.Mercredi}
                    dayName='Mercredi'

                    addRow={this.addRow}
                    rowsDay={this.state.rows_3}
                    isDayOn={this.state.isDay3_On}
                    dayIndex={3}
                    removeRow={this.removeRow}

                    error={this.state.errors[2]}
                  />
                }

                {/*Thursday =========================================================================================================================*/}

                <CardItem body>
                  <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                    checked={this.state.isDay4_On}
                    onPress={() => this.toggleDay(4, this.state.isDay4_On)}
                    checkboxTickColor='green' />
                  <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Jeudi</Text>
                </CardItem>

                {this.state.isDay4_On &&
                  <Item
                    fromHour1={this.state.Jeudi[0].from}
                    toHour1={this.state.Jeudi[0].to}
                    fromHour2={this.state.Jeudi[1].from}
                    toHour2={this.state.Jeudi[1].to}
                    updateDay={this.updateDay}
                    day={this.state.Jeudi}
                    dayName='Jeudi'

                    addRow={this.addRow}
                    rowsDay={this.state.rows_4}
                    isDayOn={this.state.isDay4_On}
                    dayIndex={4}
                    removeRow={this.removeRow}

                    error={this.state.errors[3]}
                  />
                }


                {/*Friday =========================================================================================================================*/}


                <CardItem body>
                  <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                    checked={this.state.isDay5_On}
                    onPress={() => this.toggleDay(5, this.state.isDay5_On)}
                    checkboxTickColor='green' />
                  <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Vendredi</Text>
                </CardItem>

                {this.state.isDay5_On &&
                  <Item
                    fromHour1={this.state.Vendredi[0].from}
                    toHour1={this.state.Vendredi[0].to}
                    fromHour2={this.state.Vendredi[1].from}
                    toHour2={this.state.Vendredi[1].to}
                    updateDay={this.updateDay}
                    day={this.state.Vendredi}
                    dayName='Vendredi'

                    addRow={this.addRow}
                    rowsDay={this.state.rows_5}
                    isDayOn={this.state.isDay5_On}
                    dayIndex={5}
                    removeRow={this.removeRow}

                    error={this.state.errors[4]}
                  />
                }

                {/*Saturday =========================================================================================================================*/}

                <CardItem body>
                  <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                    checked={this.state.isDay6_On}
                    onPress={() => this.toggleDay(6, this.state.isDay6_On)}
                    checkboxTickColor='green' />
                  <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Samedi</Text>
                </CardItem>

                {this.state.isDay6_On &&
                  <Item
                    fromHour1={this.state.Samedi[0].from}
                    toHour1={this.state.Samedi[0].to}
                    fromHour2={this.state.Samedi[1].from}
                    toHour2={this.state.Samedi[1].to}
                    updateDay={this.updateDay}
                    day={this.state.Samedi}
                    dayName='Samedi'

                    addRow={this.addRow}
                    rowsDay={this.state.rows_6}
                    isDayOn={this.state.isDay6_On}
                    dayIndex={6}
                    removeRow={this.removeRow}

                    error={this.state.errors[5]}
                  />
                }

                {/*Sunday =========================================================================================================================*/}

                <CardItem body>
                  <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                    checked={this.state.isDay7_On}
                    onPress={() => this.toggleDay(7, this.state.isDay7_On)}
                    checkboxTickColor='green' />
                  <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Dimanche</Text>
                </CardItem>

                {this.state.isDay7_On &&
                  <Item
                    fromHour1={this.state.Dimanche[0].from}
                    toHour1={this.state.Dimanche[0].to}
                    fromHour2={this.state.Dimanche[1].from}
                    toHour2={this.state.Dimanche[1].to}
                    updateDay={this.updateDay}
                    day={this.state.Dimanche}
                    dayName='Dimanche'

                    addRow={this.addRow}
                    rowsDay={this.state.rows_7}
                    isDayOn={this.state.isDay7_On}
                    dayIndex={7}
                    removeRow={this.removeRow}

                    error={this.state.errors[6]}
                  />
                }

              </Content>

            </ScrollView>

          </View>


        </View>
      )
    }
  }

  render() {

    return (

      <View style={styles.container}>

        <View style={styles.header_container}>
          <Image source={require('../../../assets/header-image.png')} style={styles.headerIcon} />
        </View>

        <View style={{ position: 'absolute', top: SCREEN_HEIGHT * 0.05 }}>
          <LeftSideMenu />
        </View>

        <View style={styles.metadata_container}>
          <View style={styles.Avatar_box}>
            <Icon name="user"
              size={SCREEN_WIDTH * 0.06}
              color="#93eafe" />
          </View>
          <View style={styles.metadata_box}>
            <Text style={styles.metadata_text1}>{this.state.nom} {this.state.prenom}</Text>
            <Text style={styles.metadata_text2}>{this.state.speciality}</Text>
          </View>
        </View>

        {this.renderForm()}

        <View style={styles.confirmButton_container}>
          {!this.state.isLoading && this.state.isEditing &&
            <Button contained={false} width={SCREEN_WIDTH * 0.4} text="Annuler" onPress={() => this.setState({ isEditing: false })} />
          }

          {!this.state.isLoading && this.state.isEditing &&
            <Button width={SCREEN_WIDTH * 0.4} text="Confirmer" onPress={this.handleConfirm} />
          }

          {!this.state.isLoading && !this.state.isEditing &&
            <Button width={SCREEN_WIDTH * 0.8} text="Modifier mes disponibilités" onPress={() => this.setState({ isEditing: true })} />
          }
        </View>


      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  header_container: {
    flex: 0.2,
    //justifyContent: 'flex-end',
    //alignItems: 'stretch',
    //backgroundColor: 'brown',
  },
  metadata_container: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    //backgroundColor: 'pink',
  },
  dispos_container: {
    flex: 0.5,
    //backgroundColor: 'yellow',
    paddingHorizontal: SCREEN_WIDTH * 0.05
  },
  data_container: {
    flex: 0.5,
    //backgroundColor: 'yellow',
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    alignItems: 'center'
  },
  confirmButton_container: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //backgroundColor: 'green'
  },

  headerIcon: {
    width: SCREEN_WIDTH * 1,
    height: HEADER_ICON_HEIGHT * 1,
  },
  Avatar_box: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  metadata_box: {
    height: SCREEN_WIDTH * 0.12,
    marginLeft: SCREEN_WIDTH * 0.04,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  metadata_text1: {
    fontSize: SCREEN_HEIGHT * 0.025,
    color: 'gray',
    fontWeight: 'bold'
  },
  metadata_text2: {
    fontSize: SCREEN_HEIGHT * 0.020,
    color: 'gray'
  },
  dropdown_container: {
  },
  buttonPlus: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_WIDTH * 0.07,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SCREEN_WIDTH * 0.1,
    marginBottom: SCREEN_WIDTH * 0.1,
    marginTop: SCREEN_WIDTH * 0.05
  },
  pickers_container: {
    flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: SCREEN_WIDTH * 0.1, marginBottom: SCREEN_HEIGHT * 0.02
  },

  picker_container: {
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // marginVertical: 0,
    //marginTop: 5,
    height: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.3,
    paddingLeft: 20,
    paddingRight: 10
  },
  loading_container: {
    //position: 'absolute',
    //left: 0,
    //right: 0,
    //top: 0,
    //bottom: 0,
    flex: 0.5,
    //backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  }

});


