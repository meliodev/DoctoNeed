import React, { useState } from 'react';
import { Button, StatusBar, SafeAreaView, Image, Dimensions, TouchableHighlight, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
//import { imagePickerOptions, getFileLocalPath, createStorageReferenceToFile, uploadFileToFireBase } from '../../util';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

export default UploadFile = () => {
  const [imageURI, setImageURI ] = useState(null);
  const [fileSource, setfileSource ] = useState(null);
  const [storageRef, setstorageRef ] = useState(null);
  const [fileName, setfileName ] = useState(null);

  

  return (
    <SafeAreaView style= {{ flex: 1, justifyContent: 'center'}}>
      <StatusBar barStyle="dark-content" />
     {/* <Button title="New Post" onPress={uploadImage} style={} /> */}
      <TouchableHighlight style= {styles.uploadButton} onPress= {this.props.prepareImage}>
                <View style= {{ flex:1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style= {{ color: 'gray' }}> Télécharger un document </Text> 
                    <Icon name="upload" 
                          size={SCREEN_WIDTH*0.04} 
                          color="#BDB7AD"/>
                </View>                
      </TouchableHighlight>
     {/* {imageURI && <Image source={imageURI} style= {{ height: 100, width: 100 }}/>}  */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
uploadButton: {
    textAlignVertical: 'top',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: SCREEN_WIDTH*0.05,
    width: SCREEN_WIDTH * 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    //margin: 15,
    //marginTop: 15,
    marginBottom: SCREEN_HEIGHT*0.12,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
})