import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {ScreenHeight, ScreenWidth} from '../core/constants';
import * as theme from '../core/theme';
import Caption from './Typography/Caption';
import Paragraph from './Typography/Paragraph';

const ratioLogo = 1;
const LOGO_WIDTH = ScreenWidth * 0.33 * ratioLogo;

const SearchBarLink = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.searchBarLink} onPress={onPress}>
      <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.gray_medium} />
      <Paragraph style={styles.searchBarTitle}>Rechercher un médecin</Paragraph>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchBarLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius,
    paddingVertical: theme.padding,
    paddingHorizontal: theme.padding,
    width: ScreenWidth - theme.padding * 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 4,
  },
  searchBarTitle: {
    color: theme.colors.gray_dark,
    marginLeft: theme.padding,
  },
});

export default SearchBarLink;
