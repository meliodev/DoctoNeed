// Store/configureStore.js

import { createStore, combineReducers } from 'redux';
// import toggleFavorite from './Reducers/favoriteReducer'
// import setSignUpData from './Reducers/signupReducer'
import rolesReducer from './Reducers/rolesReducer'
import signupReducer from './Reducers/signupReducer'
import fcmtokenReducer from './Reducers/fcmtokenReducer'

const rootReducer = combineReducers({roles: rolesReducer, signup: signupReducer, fcmtoken: fcmtokenReducer })

export default createStore(rootReducer)