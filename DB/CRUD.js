
import firebase from 'react-native-firebase'

export const signOutUser = async () => {
    try {
        await firebase.auth().signOut();
        this.props.navigation.navigate('LandingScreen');
    } catch (e) {
        // console.log(e);
    }
}

export const getUser = () => {
  
}

export const func1 = () => {
    console.log('hello world')
}
export const func2 = () => {
    return 'hello world'
}
export const func3 = () => {
    firebase
        .auth()
        .onAuthStateChanged(user => {
            /* if (user) {
               //this.setState({ isUser: true })
               return true
             } else {
               //this.setState({ isUser: false })
               return false*/
            return user
            //}
        })
}



export const func5 = () => {
    // do stuff 
}