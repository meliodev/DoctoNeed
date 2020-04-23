
import firebase from 'react-native-firebase'
import { Platform } from 'react-native';

export const FireBaseStorage = firebase.storage();

export const imagePickerOptions = {
    noData: true,
  };


export const options2 = {
  title: 'Selectionner une video',
  mediaType: 'video',
  path:'video',
  quality: 1
};

  export const getFileLocalPath = response => {
    const { path, uri } = response;
    return Platform.OS === 'android' ? path : uri;
  };

  export const createStorageReferenceToFile = response => {
    const { fileName } = response;
    return FireBaseStorage.ref(fileName);
  }; 

  export const uploadFileToFireBase = imagePickerResponse => {
    const fileSource = getFileLocalPath(imagePickerResponse);
    const storageRef = createStorageReferenceToFile(imagePickerResponse);
    return storageRef.putFile(fileSource);
  };