import { Alert } from "react-native";

export const displayError = error => {
  const showError = error && error.message !== 'ignore';
  if (showError) Alert.alert('', error.message);
};
