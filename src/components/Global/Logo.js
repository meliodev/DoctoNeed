import React from 'react';
import {StyleSheet, Image} from 'react-native';

import {ScreenHeight, ScreenWidth} from '../../core/constants';
import * as theme from '../../core/theme';

const ratioLogo = 1;
const LOGO_WIDTH = ScreenWidth * 0.33 * ratioLogo;

const Logo = ({}) => {
  return (
    <Image
      source={require('../../assets/logo-1000-1000.png')}
      style={styles.logo}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    height: ScreenWidth * 0.25,
    width: LOGO_WIDTH,
    marginTop: ScreenHeight * 0.025,
  },
});

export default Logo;
