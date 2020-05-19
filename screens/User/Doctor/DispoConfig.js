//Presentation.js
//TEST

import React from 'react'
import { View, Image, Text, TouchableHighlight, Dimensions, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import { CheckBox, CardItem, Content } from 'native-base';

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import LeftSideMenu from '../../../components/LeftSideMenu'
import Item from '../../../components/DispoItem2'
import Button from '../../../components/Button';

import firebase from 'react-native-firebase';
import { signOutUser } from '../../../DB/CRUD'
import * as REFS from '../../../DB/CollectionsRefs'

//constants
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ratioHeader = 267 / 666; // The actaul icon headet size is 254 * 668
const HEADER_ICON_HEIGHT = Dimensions.get("window").width * ratioHeader; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)
const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

export default class DispoConfig extends React.Component {
  constructor(props) {
    super(props);

    this.updateDay = this.updateDay.bind(this);
    this.addRow = this.addRow.bind(this);
    this.signOutUser = this.signOutUser.bind(this);

    this.state = {
      nom: "",
      prenom: "",
      speciality: "",
      isLeftSideMenuVisible: false,

      doctorSchedule: [],
      isScheduleEmpty: true,
      paidTimes: [], //array to keep paid (reserved) timeslots to not be shown in the doctor's calendar in case he updates his calendar
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

      rows_1: 0,
      rows_2: 0,
      rows_3: 0,
      rows_4: 0,
      rows_5: 0,
      rows_6: 0,
      rows_7: 0,
    }

    //Menu
    this.navigateToScreen = this.navigateToScreen.bind(this);
    this.signOutUserandToggle = this.signOutUserandToggle.bind(this);
  }

  componentWillMount() {
    this.getDoctorMetaData()
    this.getCurrentSchedule()
  }

  //Get doctor's data from DB
  getDoctorMetaData() {
    const { currentUser } = firebase.auth()
    firebase.firestore().collection("Doctors").doc(currentUser.uid).get().then(doc => {
      this.setState({ nom: doc.data().nom })
      this.setState({ prenom: doc.data().prenom })
      this.setState({ speciality: doc.data().speciality })
    })
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

  isScheduleEmpty() {
    let isScheduleEmpty = true
    isScheduleEmpty = this.state.Lundi[0].from === '' && this.state.Lundi[0].to
      && this.state.Mardi[0].from === '' && this.state.Mardi[0].to
      && this.state.Mercredi[0].from === '' && this.state.Mercredi[0].to
      && this.state.Jeudi[0].from === '' && this.state.Jeudi[0].to
      && this.state.Vendredi[0].from === '' && this.state.Vendredi[0].to
      && this.state.Samedi[0].from === '' && this.state.Samedi[0].to
      && this.state.Dimanche[0].from === '' && this.state.Dimanche[0].to

    this.setState({ isScheduleEmpty })
  }

  updateDaySchedule(dayName, dayArray) {
    REFS.doctors.doc(firebase.auth().currentUser.uid).collection('ScheduleSettings').doc(dayName)
      .update({
        timerange1: { from: dayArray[0].from, to: dayArray[0].to },
        timerange2: { from: dayArray[1].from, to: dayArray[1].to }
      }).then(() => console.log('setted succesfully!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'))
      .catch((err) => console.error(err))
  }

  setDaySchedule(dayName, dayArray) {
    REFS.doctors.doc(firebase.auth().currentUser.uid).collection('ScheduleSettings').doc(dayName)
      .set({
        timerange1: { from: dayArray[0].from, to: dayArray[0].to },
        timerange2: { from: dayArray[1].from, to: dayArray[1].to }
      }).then(() => console.log('setted succesfully!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'))
      .catch((err) => console.error(err))
  }

  //LeftSideMenu functions
  toggleLeftSideMenu = () => {
    this.month = ''
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible, appId: null });
  }

  navigateToScreen(screen) {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      () => this.props.navigation.navigate(screen));
  }

  signOutUser() {
    signOutUser();
  }

  signOutUserandToggle() {
    this.setState({ isLeftSideMenuVisible: !this.state.isLeftSideMenuVisible },
      this.signOutUser())
  }

  //Form functions
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

  handleConfirm = async () => {

    //update 'urgences'
    REFS.doctors.doc(firebase.auth().currentUser.uid).update({ urgences: this.state.checked })
      .then(() => console.log('urgences mis à jour'))
      .catch((err) => console.error(err))


    //set schedule to json format
    const daysSelected = [['lundi', this.state.isDay1_On, this.state.Lundi], ['mardi', this.state.isDay2_On, this.state.Mardi], ['mercredi', this.state.isDay3_On, this.state.Mercredi], ['jeudi', this.state.isDay4_On, this.state.Jeudi], ['vendredi', this.state.isDay5_On, this.state.Vendredi], ['samedi', this.state.isDay6_On, this.state.Samedi], ['dimanche', this.state.isDay7_On, this.state.Dimanche]];
    let doctorSchedule = []

    await daysSelected.forEach((element) => {
      for (let j = 0; j < 60; j++) {

        let currentDay = moment().add(j, 'days').startOf('day').format()
        let day = moment().add(j, 'days').format('dddd')

        if (element[1] === true) {

          if (day === element[0]) {
            element[2].forEach(timerange => {

              currentDay = moment().add(j, 'days').startOf('day').format()
              for (let h = 0; h < 24; h++) {
                let currentHour = moment(currentDay).format('HH:mm')
                let currentHour2 = moment(currentHour, 'HH:mm')

                let from = moment(timerange.from, 'HH:mm');
                let to = moment(timerange.to, 'HH:mm');

                if ((currentHour2.isBefore(to) || currentHour2.isSame(to)) && (currentHour2.isAfter(from) || currentHour2.isSame(from))) {
                  doctorSchedule.push(currentDay)
                  this.setState({ doctorSchedule: doctorSchedule }) // <-- array containing all times available for the doctor
                }
                currentDay = moment(currentDay).add(1, 'hours').format()
              }
            })
          }
        }
      }
    });

    //if not 1st time setting schedule: delete all documents
    if (this.state.isScheduleEmpty === false) {
      await REFS.doctors.doc(firebase.auth().currentUser.uid).collection('DoctorSchedule').get().then((querySnapshot) => {
        let paidTimes = []
        querySnapshot.forEach((doc) => {
          //keep timeslot if already paid/booked
          if (doc.data().paid === true) {
            paidTimes.push(doc.data().ts)
            this.setState({ paidTimes: paidTimes })
          }
          doc.ref.delete();
        })
      })

      //update schedule settings in DB
      this.updateDaySchedule('Lundi', this.state.Lundi)
      this.updateDaySchedule('Mardi', this.state.Mardi)
      this.updateDaySchedule('Mercredi', this.state.Mercredi)
      this.updateDaySchedule('Jeudi', this.state.Jeudi)
      this.updateDaySchedule('Vendredi', this.state.Vendredi)
      this.updateDaySchedule('Samedi', this.state.Samedi)
      this.updateDaySchedule('Dimanche', this.state.Dimanche)
    }

    this.setDaySchedule('Lundi', this.state.Lundi)
    this.setDaySchedule('Mardi', this.state.Mardi)
    this.setDaySchedule('Mercredi', this.state.Mercredi)
    this.setDaySchedule('Jeudi', this.state.Jeudi)
    this.setDaySchedule('Vendredi', this.state.Vendredi)
    this.setDaySchedule('Samedi', this.state.Samedi)
    this.setDaySchedule('Dimanche', this.state.Dimanche)

    //set new Schedule (after the deleting old one) & keeping the state 'paid' = true for timeslots already paid/booked
    this.state.doctorSchedule.forEach(ts => {
      //check if ts is paid
      let isPaid = false
      this.state.paidTimes.forEach(paidTime => {
        if (ts === paidTime)
          isPaid = true
      })

      let counter = 0 //counter to detect end of setting schedule (not working)

      REFS.doctors.doc(firebase.auth().currentUser.uid).collection('DoctorSchedule').doc().set({
        date: moment(ts).format('LL'),
        ts: ts,
        paid: isPaid
      }).then(() => {
        counter++;
        console.log('doctor schedule is building...')
        console.log(counter)
        if (counter === this.state.doctorSchedule) alert('Votre calendrier à été mis à jour.')
      })
        .catch((err) => console.error(err))

    })

  }

  render() {

    // console.log(this.state.paidTimes)
    //console.log('s: '+this.state.isScheduleEmpty)
    //console.log(this.state.doctorSchedule)
    // console.log(this.state.rows_1)
    console.log(this.state.Lundi)
    //console.log(this.state.Mardi)
    /* console.log(this.state.Mercredi)
     console.log(this.state.Jeudi)
     console.log(this.state.Vendredi)
     console.log(this.state.Samedi)
     console.log(this.state.Dimanche)*/
    // console.log(this.state.Lundi)
    //console.log(this.state.Mardi)

    return (
      <View style={styles.container}>

        <View style={styles.header_container}>
          <Image source={require('../../../assets/header-image.png')} style={styles.headerIcon} />
        </View>


        <LeftSideMenu
          isSideMenuVisible={this.state.isLeftSideMenuVisible}
          toggleSideMenu={this.toggleLeftSideMenu}
          nom={this.state.nom}
          prenom={this.state.prenom}
          email={this.state.email}
          navigateToProfile={() => this.navigateToScreen('Profile')}
          navigateToDispoConfig={() => this.navigateToScreen('DispoConfig')}
          navigateToAppointments={() => this.navigateToScreen('TabScreenDoctor')}
          navigateToMyPatients={() => this.navigateToScreen('MyPatients')}
          signOutUser={this.signOutUserandToggle}
          navigate={this.props.navigation} />

        <View style={{ position: 'absolute', top: SCREEN_HEIGHT * 0.05 }}>
          <TouchableHighlight
            style={{
              width: SCREEN_WIDTH * 0.12,
              height: SCREEN_WIDTH * 0.12,
              borderRadius: 25,
              backgroundColor: '#ffffff',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              left: SCREEN_WIDTH * 0.05
            }}

            onPress={this.toggleLeftSideMenu}>
            <Icon1 name="bars" size={25} color="#93eafe" />
          </TouchableHighlight>
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

        <View style={styles.dispos_container}>
          <View style={{ width: SCREEN_WIDTH * 0.42, borderBottomWidth: 3, borderBottomColor: '#83E7FE', marginHorizontal: SCREEN_WIDTH * 0.02, paddingVertical: SCREEN_HEIGHT * 0.003 }}>
            <Text style={{ fontSize: SCREEN_WIDTH * 0.04, fontWeight: 'bold', textAlign: 'center' }}>Mes disponibilités</Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: SCREEN_HEIGHT * 0.02 }}>
            <CheckBox color="#93eafe" style={{ borderRadius: 10, borderColor: '#93eafe' }}
              title='check box'
              checked={this.state.checked}
              onPress={() => this.setState({ checked: !this.state.checked })} />
            <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}> Accepter les urgences</Text>
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

                {this.state.isDay1_On ?
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
                  />
                  : null}

                {/*Tuesday =========================================================================================================================*/}

                <CardItem body>
                  <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                    checked={this.state.isDay2_On}
                    onPress={() => this.toggleDay(2, this.state.isDay2_On)}
                    checkboxTickColor='green' />
                  <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Mardi</Text>
                </CardItem>

                {this.state.isDay2_On ?
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
                  />
                  : null}


                {/*Wednesday =========================================================================================================================*/}

                <CardItem body>
                  <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                    checked={this.state.isDay3_On}
                    onPress={() => this.toggleDay(3, this.state.isDay3_On)}
                    checkboxTickColor='green' />
                  <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Mercredi</Text>
                </CardItem>

                {this.state.isDay3_On ?
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
                  />
                  : null}

                {/*Thursday =========================================================================================================================*/}

                <CardItem body>
                  <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                    checked={this.state.isDay4_On}
                    onPress={() => this.toggleDay(4, this.state.isDay4_On)}
                    checkboxTickColor='green' />
                  <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Jeudi</Text>
                </CardItem>

                {this.state.isDay4_On ?
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
                  />
                  : null}


                {/*Friday =========================================================================================================================*/}


                <CardItem body>
                  <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                    checked={this.state.isDay5_On}
                    onPress={() => this.toggleDay(5, this.state.isDay5_On)}
                    checkboxTickColor='green' />
                  <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Vendredi</Text>
                </CardItem>

                {this.state.isDay5_On ?
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
                  />
                  : null}

                {/*Saturday =========================================================================================================================*/}

                <CardItem body>
                  <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                    checked={this.state.isDay6_On}
                    onPress={() => this.toggleDay(6, this.state.isDay6_On)}
                    checkboxTickColor='green' />
                  <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Samedi</Text>
                </CardItem>

                {this.state.isDay6_On ?
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
                  />
                  : null}

                {/*Sunday =========================================================================================================================*/}

                <CardItem body>
                  <CheckBox color="#93eafe" style={{ borderColor: '#93eafe' }}
                    checked={this.state.isDay7_On}
                    onPress={() => this.toggleDay(7, this.state.isDay7_On)}
                    checkboxTickColor='green' />
                  <Text style={{ paddingHorizontal: SCREEN_WIDTH * 0.05 }}>Dimanche</Text>
                </CardItem>

                {this.state.isDay7_On ?
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
                  />
                  : null}

              </Content>

            </ScrollView>

          </View>


        </View>

        <View style={styles.confirmButton_container}>
          <Button width={SCREEN_WIDTH * 0.8} text="confirmer" onPress={this.handleConfirm} />
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
    //backgroundColor: 'red',
  },
  dispos_container: {
    flex: 0.5,
    //backgroundColor: 'blue',
    paddingHorizontal: SCREEN_WIDTH * 0.05
  },
  confirmButton_container: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
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
    elevation: 5,
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
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // marginVertical: 0, 
    //marginTop: 5, 
    height: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.3,
    paddingLeft: 20,
    paddingRight: 10
  }

});


