/**
 * @format
 */
 import React from 'react'
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {Text} from 'react-native';

const Test = () => <Text>Hello world</Text>;

AppRegistry.registerComponent(appName, () => App);
