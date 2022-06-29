// Store/configureStore.js

import {createStore, combineReducers} from 'redux';
// import toggleFavorite from './Reducers/favoriteReducer'
// import setSignUpData from './Reducers/signupReducer'
import rolesReducer from './Reducers/rolesReducer';
import signupReducer from './Reducers/signupReducer';
import fcmtokenReducer from './Reducers/fcmtokenReducer';
import networkReducer from './Reducers/networkReducer';
import statusBarReducer from './Reducers/statusBarReducer';
import toastReducer from './Reducers/toastReducer';
import permissionsReducer from './Reducers/permissionsReducer';
import userReducer from './Reducers/userReducer';

const rootReducer = combineReducers({
  roles: rolesReducer,
  signup: signupReducer,
  fcmtoken: fcmtokenReducer,
  network: networkReducer,
  statusBar: statusBarReducer,
  toast: toastReducer,
  permissions: permissionsReducer,
  currentUser: userReducer,
});

export default createStore(rootReducer);
