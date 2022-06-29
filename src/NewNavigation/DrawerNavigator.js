import React, {Component} from 'react';
import {Text, View} from 'react-native';

import {
  createAppContainer,
  createSwitchNavigator,
  NavigationActions,
} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';

import {GuestStack, AppStack} from './StackNavigator';
import AuthLoadingScreen from '../screens/Authentication/AuthLoadingScreen';

import {ScreenWidth} from '../core/constants';
import DrawerMenu from './Drawer';
import RootComponent from '../screens/Root/RootComponent';

const AppDrawer = createDrawerNavigator(
  {
    App: {
      screen: AppStack,
      path: '',
    },
  },
  {
    contentComponent: props => <DrawerMenu role={props} {...props} />,
    drawerLockMode: 'locked-closed',
    drawerWidth: ScreenWidth * 0.83,
    contentOptions: {
      activeTintColor: 'green',
    },
    layout: {
      orientation: ['portrait'],
    },
  },
);

const MyApp = createSwitchNavigator({
  Starter: RootComponent,
  Rooter: AuthLoadingScreen,
  Guest: GuestStack,
  App: AppDrawer,
});

const previousGetActionForPathAndParams =
  MyApp.router.getActionForPathAndParams;

Object.assign(MyApp.router, {
  getActionForPathAndParams(path, params) {
    // const isAuthLink = path.startsWith('auth-link');

    // if (isAuthLink) {
    return NavigationActions.navigate({
      routeName: 'Starter',
      params: {...params, path},
    });
    //  }

    //  return previousGetActionForPathAndParams(path, params);
  },
});

const App = createAppContainer(MyApp);

const prefix = /https:\/\/dabadoc.page.link\/|synergys:\/\//;

const MainApp = () => <App uriPrefix={prefix} />;

export default App;
