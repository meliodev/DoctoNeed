// Store/Reducers/favoriteReducer.js
// Redux test: Add something (film) to favorite

const initialState = { isDoctor: false, email: '', country: '', nom: '', prenom: '', dateNaissance: '', speciality: '', codeFinesse: '', phone: '' }

function setSignUpData(state = initialState, action) {
    let nextState
    switch (action.type) {

        case 'ISDOCTOR':
            nextState = {
                ...state,
                isDoctor: action.value
            }

            return nextState || state

        case 'EMAIL':
            nextState = {
                ...state,
                email: action.value
            }

            return nextState || state

        case 'COUNTRY':
            nextState = {
                ...state,
                country: action.value
            }

            return nextState || state

        case 'NOM':
            nextState = {
                ...state,
                nom: action.value,
            }

            return nextState || state

        case 'PRENOM':
            nextState = {
                ...state,
                prenom: action.value
            }

            return nextState || state

        case 'DATENAISSANCE':
            nextState = {
                ...state,
                dateNaissance: action.value
            }

            return nextState || state

        case 'SPECIALITY':
            nextState = {
                ...state,
                speciality: action.value
            }

            return nextState || state

        case 'CODEFINESSE':
            nextState = {
                ...state,
                codeFinesse: action.value
            }

            return nextState || state

        case 'PHONE':
            nextState = {
                ...state,
                phone: action.value
            }

            return nextState || state

        default:
            return state
    }
}

export default setSignUpData