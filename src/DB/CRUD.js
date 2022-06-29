
import firebase from '../configs/firebase'

export const signOutUser = async () => {
    try {
        await firebase.auth().signOut();
    } catch (e) {
        console.log(e);
    }
}
