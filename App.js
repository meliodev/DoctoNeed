// App.js

import React, { Component } from 'react'
import Navigation from './Navigation/Navigation'
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
//import { View, Text } from 'react-native'

class App extends Component {
  render() {
    return (
      <Provider store={Store}>
         <Navigation/>
      </Provider>
    )
  }
}

console.disableYellowBox = true;
export default App;
