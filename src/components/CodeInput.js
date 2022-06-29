import React, {useState} from 'react';
import {SafeAreaView, Text, StyleSheet, View} from 'react-native';
 
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
 
const codeInputStyle = StyleSheet.create({
  root: {flex: 1, },
  title: {textAlign: 'center', fontSize: 30},
  codeFiledRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#48d8fb',
  },
});
 
const CELL_COUNT = 6;
 
/*const CodeInput = () => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });*/
 
  class CodeInput extends React.Component {
  render() {
  return (
    <View style={codeInputStyle.root}>
    {/*  <Text style={codeInputStyle.title}>Verification</Text> */}
      <CodeField
        ref={ref}
        {...props}
        value={this.props.value}
        onChangeText={this.props.setValue}
        cellCount={6}
        rootStyle={codeInputStyle.codeFiledRoot}
        keyboardType="number-pad"
        /*renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[codeInputStyle.cell, isFocused && codeInputStyle.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}*/
      />
    </View>
  );
 }
};
 
export default CodeInput;