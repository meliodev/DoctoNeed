// App.js

import React, { Component } from 'react'
import Navigation from './Navigation/Navigation'
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
// import ScheduleTask from './screens/ScheduleTask'

class App extends Component {
  render() {

    return (
      <Provider store={Store}>
        <Navigation />
        {/* <ScheduleTask/> */}
      </Provider>
    )
  }
}

console.disableYellowBox = true;
export default App;



