import * as React from 'react';
import {Paragraph as PaperParagraph} from 'react-native-paper';

const Paragraph = ({children, onPress, style}) => (
  <PaperParagraph style={style} onPress={onPress}>
    {children}
  </PaperParagraph>
);

export default Paragraph;
