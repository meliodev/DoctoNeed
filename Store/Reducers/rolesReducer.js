// Store/Reducers/favoriteReducer.js
// Redux test: Add something (film) to favorite

const initialState = { role: '', signupData: { email: '' } }

function setRole(state = initialState, action) {
  let nextState
  switch (action.type) {
    case 'ROLE':
      nextState = {
        role: action.value
      }

      return nextState || state

    case 'SIGNUP':
      nextState = {
        signupEmail: action.value
      }

      return nextState || state

    default:
      return state
  }
}

export default setRole