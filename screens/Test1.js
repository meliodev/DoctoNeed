
import React from 'react'
import { View, Text, Button } from 'react-native'

import MiniCalendar from 'react-native-minicalendar';

export default class Test1 extends React.Component {

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{width: 200}}>
          <MiniCalendar
            showDayHeading={true}
            dayHeadings={['Su','Mo','Tu','We','Th','Fr','Sa']}
            onDateSelect={() => console.log('date selected')}
            startDate={moment().format('YYYY-MM-DD')}
            selectedDate={moment((new Date()).toISOString()).format('YYYY-MM-DD')}
            numberOfDaysToShow={7}
            enabledDaysOfTheWeek={['Mo','We','Fr']}
            isoWeek={false}
            disablePreviousDays={true}
            disableToday={false}
            dayStyle={{ textAlign: 'center', lineHeight: 56 }}
            headingStyle={{backgroundColor: 'navy', lineHeight: 26}}
            activeDayStyle={{backgroundColor: 'green', color: 'white'}}
            disabledDayStyle={{backgroundColor: 'grey', color: 'darkgrey'}}
            selectedDayStyle={{backgroundColor: 'orange', color: 'black'}}
          />
        </View>
      </View>
    );
  }
}


