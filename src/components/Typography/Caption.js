import * as React from 'react';
import {Caption as PaperCaption} from 'react-native-paper';

const Caption = ({children, onPress, style}) => {
  return (
    <PaperCaption style={style} onPress={onPress}>
      {children}
    </PaperCaption>
  );
};

export default Caption;
