/**
 * Button component
 * Renders a button and calls a function passed via onPress prop once tapped
 */

import React, {Component} from 'react';
import {
  StyleSheet, // CSS-like styles
  Text, // Renders text
  TouchableOpacity, // Pressable container
  View, // Container component
  Dimensions,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {ScreenHeight, ScreenWidth} from '../core/constants';
import * as theme from '../core/theme';
import Caption from './Typography/Caption';
import Paragraph from './Typography/Paragraph';

export default class Button extends Component {
  render() {
    const {onPress, contained, outlined, style} = this.props;
    const defaultTextStyle = contained
      ? styles.buttonText
      : styles.buttonTextOutlined;
    const textColor = contained ? '#fff' : theme.colors.primary;
    const colors = contained
      ? theme.gradientColors
      : ['#fff', '#fff', '#fff'];

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[{paddingVertical: 10}, style]}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={colors}
          style={[styles.linearGradient]}>
          <Paragraph style={[{color: textColor}]}>{this.props.text}</Paragraph>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

Button.defaultProps = {
  contained: true,
};

const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 30,
    paddingHorizontal: theme.padding * 2,
    paddingVertical: theme.padding / 1.2,
    elevation: 2,
  },
});
