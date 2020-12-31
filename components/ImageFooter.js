/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

// type Props = {
//   imageIndex: number;
//   imagesCount: number;
// };

class ImageFooter extends React.Component {

  render() {
    const { doctor } = this.props
    return (
      <View style={styles.root}>
        {/* <Icon
          name="download"
          size={SCREEN_WIDTH * 0.07}
          color="white"
          onPress={this.props.download} /> */}
        <Icon
          name="delete"
          size={SCREEN_WIDTH * 0.07}
          color="white"
          onPress={this.props.delete} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: SCREEN_HEIGHT * 0.08,
    backgroundColor: "#00000077",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  text: {
    fontSize: 17,
    color: "#FFF"
  }
});

export default ImageFooter;