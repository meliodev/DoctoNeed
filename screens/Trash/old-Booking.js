import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Button from '../../components/Button';
//import { Actions } from 'react-native-router-flux';
import Swiper from 'react-native-swiper';
import firebase from 'react-native-firebase';
const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class Booking extends React.Component {
  constructor(props) {
    super(props);
    this.searchedText = ""
    this.doctorList = []
    this.timeslotsDAY = []
    this.doctor = this.props.navigation.getParam('doctor', 'nothing sent')
    this.dayMonth = this.props.navigation.getParam('dayMonth', 'nothing sent')
    this.doctorSchedule = this.props.navigation.getParam('doctorSchedule', 'nothing sent')


    this.state = {
      fullDate: this.dayMonth[0].fullDate,
      daySelected: this.dayMonth[0].day,
      monthSelected: this.dayMonth[0].month,
      yearSelected: this.dayMonth[0].year,
      timeSelected: this.doctorSchedule[0][0].time,  //08:00
      backgroundColor: '#93eafe',
      day: 0,
      time: 0
    }
    this.onAppointmentClick = this.onAppointmentClick.bind(this);
  }

  onAppointmentClick() {
    if (firebase.auth().currentUser) {
      this.props.navigation.navigate('Symptomes', {
        doctor: this.doctor, fullDate: this.state.fullDate,
        daySelected: this.state.daySelected, monthSelected: this.state.monthSelected,
        yearSelected: this.state.yearSelected, timeSelected: this.state.timeSelected
      })
    }

    else
    this.props.navigation.navigate('SignUp1')

  }

  displayDays() {
    let dayMonth = this.props.navigation.getParam('dayMonth', 'nothing sent');

    return (
      (dayMonth.map((Journee, index) => {
        let dayStyle;
        let dayText;

        if (Journee.status === "blocked") {
          dayStyle = styles.blocked;
          dayText = styles.TextBlocked;
        }
        else if (Journee.status === 'open') {
          dayStyle = styles.open;
          dayText = styles.TextOpen;
        }

        if (Journee.status === 'open')
          return (
            <TouchableOpacity key={index} style={dayStyle}
              onPress={() => this.setState({
                daySelected: dayMonth[index].day,
                monthSelected: dayMonth[index].month,
                yearSelected: dayMonth[index].year,
                fullDate: dayMonth[index].fullDate,
                day: index,
              })}
              style={index === this.state.day ? {
                backgroundColor: this.state.backgroundColor,
                paddingTop: 10,
                paddingBottom: 12,
                borderRadius: 5,
                height: SCREEN_WIDTH * 0.095,
                width: SCREEN_WIDTH * 0.095
              } : dayStyle}>

              <Text style={index === this.state.day ? { color: 'white', alignSelf: 'center', fontFamily: 'Arial' } : dayText}>
                {Journee.day}
              </Text>
            </TouchableOpacity>
          );

        else return (
          <View key={index} style={dayStyle}>
            <Text style={dayText}>
              {Journee.day}
            </Text>
          </View>
        )
      }))
    );
  }

  swiperView() {

    let days = this.displayDays();
    let dayMonth = this.props.navigation.getParam('dayMonth', 'nothing sent')

    let swiperView = [];
    let i = 0

    while (i < 3) {
      swiperView.push(
        <View key={i} style={styles[`slide${i + 1}`], styles.slide}>
          <View style={styles.grid}>
            <Text style={{ textAlign: 'center', color: '#898989', flex: 0.1 }}> {this.state.monthSelected} </Text>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View style={styles.row1}>
                <View style={styles.day}>
                  {days[i * 28]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 1]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 2]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 3]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 4]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 5]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 6]}
                </View>
              </View>

              <View style={styles.row2}>
                <View style={styles.day}>
                  {days[i * 28 + 7]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 8]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 9]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 10]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 11]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 12]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 13]}
                </View>
              </View>

              <View style={styles.row3}>
                <View style={styles.day}>
                  {days[i * 28 + 14]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 15]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 16]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 17]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 18]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 19]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 20]}
                </View>
              </View>

              <View style={styles.row4}>
                <View style={styles.day}>
                  {days[i * 28 + 21]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 22]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 23]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 24]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 25]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 26]}
                </View>
                <View style={styles.day}>
                  {days[i * 28 + 27]}
                </View>
              </View>
            </View>
          </View>
        </View>
      );
      i++;
    }

    return swiperView;
  }

  formatTimeslots(index) {
    let doctorSchedule = this.props.navigation.getParam('doctorSchedule', 'nothing sent')
    let day = this.state.day
    return (
      (doctorSchedule[index].map((timeslot, index) => {
        let timeStyle;
        let timeText;

        if (timeslot.status === "blocked") {
          timeStyle = styles.blockedTime;
          timeText = styles.TextBlocked
        } else if (timeslot.status === "open") {
          timeStyle = styles.openTime;
          timeText = styles.TextOpen
        }

        if (timeslot.status === 'open')
          return (
            <TouchableOpacity key={index} style={timeStyle}
              onPress={() => this.setState({
                timeSelected: doctorSchedule[day][index].time,
                time: index
              })}

              style={index === this.state.time ? {
                backgroundColor: this.state.backgroundColor,
                margin: 5, paddingTop: 12,
                paddingBottom: 12,
                borderRadius: 5,
                height: SCREEN_WIDTH * 0.095,
                width: SCREEN_WIDTH * 0.19
              } : timeStyle}>

              <Text style={index === this.state.time ? { color: 'white', alignSelf: 'center', fontFamily: 'Arial' } : timeText}>
                {timeslot.time}
              </Text>
            </TouchableOpacity>
          );

        else return (
          <View key={timeslot.id} style={timeStyle}
            onPress={() => console.log('timeslot N/A')}>
            <Text style={timeText}>
              {timeslot.time}
            </Text>
          </View>
        )
      }))
    );
  }

  showTimeslots(index) {
    let timeslots = this.formatTimeslots(index);

    return (
      <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.2, justifyContent: 'center' }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          {timeslots[1]}
          {timeslots[0]}
          {timeslots[2]}
          {timeslots[3]}
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          {timeslots[4]}
          {timeslots[5]}
          {timeslots[6]}
          {timeslots[7]}
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          {timeslots[8]}
          {timeslots[9]}
          {timeslots[10]}
          {timeslots[11]}
        </View>
      </View>
    )
  }

  render() {
    console.log(this.props.navigation)
    let doctor = this.props.navigation.getParam('doctor', 'nothing sent');
    let dayMonth = this.props.navigation.getParam('dayMonth', 'nothing sent')
    //console.log('Doctor:  '+this.props.doctor.name)
    // console.log(this.state.monthSelected)
    //console.log(this.state.daySelected)
    //console.log(this.state.timeSelected)
    return (
      <View style={styles.container}>
        <View style={styles.bar_progression}>
          <View style={[styles.bar, styles.activeBar]} />
          <View style={styles.bar} />
          <View style={styles.bar} />
        </View>

        <View style={styles.header_container}>
          <Text style={styles.header}> Quelle date vous convient ? </Text>
        </View>

        <View style={styles.days}>
          <Swiper style={styles.wrapper}
            showsPagination={false}
            loop={false}
            nextButton={<Text style={{ marginTop: 200 }}>›</Text>}
            prevButton={<Text style={{ marginTop: 200 }}>‹</Text>}
            buttonWrapperStyle={{
              backgroundColor: 'transparent', flexDirection: 'row', position: 'absolute',
              top: 0, left: 0, flex: 1, paddingHorizontal: 10, paddingVertical: 0,
              justifyContent: 'space-between', alignItems: 'center'
            }} index={global.pos}>
            {this.swiperView()}
          </Swiper>
        </View>

        <View style={styles.header_container}>
          <Text style={styles.header}> Quelle heure vous convient ? </Text>
        </View>

        <View style={styles.timeslots}>
          {this.showTimeslots(this.state.day)}
        </View>

        <View style={styles.button_container}>
          <Button width={SCREEN_WIDTH * 0.65} text="Confirmer" onPress={this.onAppointmentClick} />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //flexDirection: 'column',
    //justifyContent: 'flex-start',
    //alignItems: 'center',
    //alignSelf: 'stretch',
    // width: null,
    //height: null,
    backgroundColor: 'white'
  },
  bar_progression: {
    flex: 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    //backgroundColor: 'purple',
  },
  bar: {
    height: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH / 3.2,
    marginLeft: SCREEN_WIDTH * 0.015,
    marginRight: SCREEN_WIDTH * 0.015,
    borderRadius: 20,
    backgroundColor: '#cdd6d5'
  },
  activeBar: {
    backgroundColor: '#48d8fb',
  },
  header_container: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'green',
  },
  header: {
    fontSize: SCREEN_HEIGHT * 0.025,
    fontWeight: 'bold',
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'black',
    //backgroundColor: 'yellow',
    marginBottom: SCREEN_HEIGHT * 0.01
  },
  days: {
    flex: 0.35,
    flexDirection: 'row',
    //backgroundColor: 'blue',
    justifyContent: 'center'
  },
  timeslots: {
    flex: 0.25,
    flexDirection: 'row',
    //backgroundColor: 'yellow',
    justifyContent: 'center',
    width: SCREEN_WIDTH
  },
  button_container: {
    flex: 0.15,
    alignItems: 'center',
    //justifyContent: 'center',
    //backgroundColor: 'orange'
  },
  wrapper: {
  },
  slide: {
    justifyContent: 'center',
    //alignItems: 'center',
    flexDirection: 'row',
    //marginTop: 30,
    //backgroundColor: 'blue',
    flex: 1
  },
  day: {
    flex: 1 / 7,
    alignItems: 'center'
  },
  row1: {
    flex: 0.2,
    paddingBottom: SCREEN_HEIGHT * 0.02,
    paddingTop: SCREEN_HEIGHT * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'yellow',
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.9
  },
  row2: {
    flex: 0.2,
    flexDirection: 'row',
    paddingBottom: SCREEN_HEIGHT * 0.02,
    paddingTop: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.9
    //backgroundColor: 'brown'
  },
  row3: {
    flex: 0.2,
    flexDirection: 'row',
    paddingBottom: SCREEN_HEIGHT * 0.02,
    paddingTop: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.9
    //backgroundColor: 'orange'
  },
  row4: {
    flex: 0.2,
    flexDirection: 'row',
    paddingBottom: SCREEN_HEIGHT * 0.02,
    paddingTop: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.9
    //backgroundColor: 'black'
  },
  grid: {
    flex: 1,
  },
  date: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: 14,
    paddingTop: 15,
    paddingBottom: 15,
  },
  TextBlocked: {
    alignSelf: 'center',
    fontFamily: 'Arial',
    color: 'gray',
    fontWeight: 'bold',
  },
  TextOpen: {
    alignSelf: 'center',
    fontFamily: 'Arial',
    color: '#93eafe',
  },
  TextActive: {
    alignSelf: 'center',
    fontFamily: 'Arial',
    color: 'white',
  },
  blocked: {
    //marginLeft: 20,
    //marginRight: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#dddddd',
    borderRadius: 5,
    height: SCREEN_WIDTH * 0.095,
    width: SCREEN_WIDTH * 0.095,
    height: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 7,
  },
  blockedTime: {
    //marginLeft: 20,
    //marginRight: 20,
    margin: 5,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#dddddd',
    borderRadius: 5,
    height: SCREEN_WIDTH * 0.095,
    width: SCREEN_WIDTH * 0.19,
    height: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 7,
  },
  open: {
    //marginLeft: 20,
    //marginRight: 20,

    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderRadius: 5,
    height: SCREEN_WIDTH * 0.095,
    width: SCREEN_WIDTH * 0.095,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 7,
  },
  openTime: {
    //marginLeft: 20,
    //marginRight: 20,
    margin: 5,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderRadius: 5,
    height: SCREEN_WIDTH * 0.095,
    width: SCREEN_WIDTH * 0.19,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 7,
  },
  timeslotText: {
    alignSelf: 'center',
    fontFamily: 'Arial',
    color: '#93eafe',
  },
})

export default Booking;
