// App.js

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Text} from 'react-native'
import {
  Provider as PaperProvider,
  DefaultTheme,
  configureFonts,
} from 'react-native-paper';

import Store from './Store/configureStore';
import {fontsConfig} from './configs/fontConfig';
import NetworkStatus from './containers/NetworkStatus';
import MyStatusBar from './components/Global/MyStatusBar';
import AppToast from './components/Global/AppToast';
import * as theme from './core/theme';
import RootController from './NewNavigation/DrawerNavigator';

const paperTheme = {
  ...DefaultTheme,
  fonts: configureFonts(fontsConfig),
  colors: {
    primary: theme.colors.primary,
    accent: theme.colors.secondary,
    background: theme.colors.background,
    surface: theme.colors.surface,
    text: "#000",
    disabled: theme.colors.gray_medium,
    placeholder: theme.colors.gray_dark,
    backdrop: theme.colors.white,
  },
};

class App extends Component {
  render() {
    return (
      <Provider store={Store}>
        <PaperProvider theme={paperTheme}>
          <MyStatusBar>
            <NetworkStatus>
              <RootController />
              <AppToast />
            </NetworkStatus>
          </MyStatusBar>
        </PaperProvider>
      </Provider>
    );
  }
}

console.disableYellowBox = true;
export default App;
