import {Dimensions, Platform} from 'react-native';
//import RNFetchBlob from 'rn-fetch-blob';

export const appVersion = '0.0.1';

export const ScreenWidth = Dimensions.get('window').width;
export const ScreenHeight = Dimensions.get('window').height;

export const roles = [
  {
    id: 'admin',
    label: 'Admin',
    value: 'Admin',
    bool: 'isAdmin',
    level: 3,
  },
  {
    id: 'doctor',
    label: 'Docteur',
    value: 'Docteur',
    bool: 'isDoctor',
    level: 2,
  },
  {
    id: 'patient',
    label: 'Patient',
    value: 'Patient',
    bool: 'isPatient',
    level: 1,
  },
];

// export const downloadDir =
//   Platform.OS === 'ios'
//     ? RNFetchBlob.fs.dirs.DocumentDir
//     : RNFetchBlob.fs.dirs.DownloadDir;

export const errorMessages = {
  appInit:
    "Erreur inattendue lors de l'initialisation de la session. Veuillez redémarrer l'application.",
  auth: {
    emailExist:
      "L'adresse email que vous avez saisi est déjà associé à un compte.",
  },
  firestore: {
    get: 'Erreur lors du chargement des données. Veuillez réessayer.',
    update: 'Erreur lors de la mise à jour des données. Veuillez réessayer.',
    delete: 'Erreur inattendue lors de la suppression.',
  },
  wordpress: {
    posts: 'Erreur lors de la connection avec le serveur du siteweb.',
  },
  profile: {
    emailUpdate:
      "Erreur lors de la modification de l'adresse email. Veuillez réessayer.",
    roleUpdate: 'Erreur lors de la modification du role. Veuillez réessayer.',
    passwordUpdate:
      'Erreur lors de la modification du mot de passe. Veuillez réessayer.',
  },
  documents: {
    upload:
      "Erreur lors de l'importation de la pièce jointe, veuillez réessayer.",
    download:
      'Erreur lors du téléchargement du document, veuillez réessayer plus tard.',
  },
  pdfGen: 'Erreur lors de la génération du document. Veuillez réessayer.',
  invalidFields: 'Erreur de saisie, veuillez verifier les champs.',
  network: {
    newUser:
      "La création d'un nouvel utilisateur nécessite une connection réseau.",
  },
  chat: "Erreur lors de l'envoi du message, veuillez réessayer",
  map:
    'Erreur lors de la communication avec le serveur Google Maps. Veuillez réessayer...',
};

export const issuesSubjects = [
  {label: 'Bug', value: 'Bug'},
  {label: 'Suggestion', value: 'Suggestion'},
  {label: "Problème d'affichage/design", value: "Problème d'affichage/design"},
  {label: 'Plantage (Crash)', value: 'Plantage (Crash)'},
  {label: 'Autre', value: 'Autre'},
];

//##Device Info
// import DeviceInfo from 'react-native-device-info';
// export const isTablet = DeviceInfo.isTablet();
export const isTablet = false
