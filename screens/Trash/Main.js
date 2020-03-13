// Main.js
import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button, SafeAreaView, FlatList } from 'react-native'
import firebase from 'react-native-firebase'


const db = firebase.firestore()


export default class Main extends React.Component {


  
  state = { currentUser: null }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
   /* firebase.auth().onAuthStateChanged(user => {
         if(user) {
           console.log("User logged in")
         } else {
           console.log("User logged out")
         }
    })*/
    //this.updateUser()
}

getUsers = () => {
  db.collection('users').get().then(snapshot => {
    <SafeAreaView style={styles.container}>
    
  </SafeAreaView>  })
}

UserAuthStatus = () => {
  firebase 
  .auth()
  .onAuthStateChanged (user => {
    if (user) {
      this.getUsers();
    } else {
      console.log('cannot get data... user logged out')
    }
  })
};



signOutUser = async () => {
  try {
      await firebase.auth().signOut();
      this.props.navigation.navigate('Auth');
  } catch (e) {
      console.log(e);
  }
}

updateUser = async () => {
const update = {
  displayName: 'Alias',
  photoURL: 'https://my-cdn.com/assets/user/123.png',
  phoneNumber: '0664568974',
};

await firebase.auth().currentUser.updateProfile(update);
}

  render() {
    const { currentUser } = this.state
    //console.log(users)
    const content = '<Text>Username: {currentUser && currentUser.displayName}</Text>'

    return (
     //<Text>   Test    </Text> 
 /* <FlatList
    data={users}
    renderItem={({item}) => <Text>{item.title}</Text>}
  />   */
        <View style={styles.container}>
        <Text>
          Email: {currentUser && currentUser.email}
        </Text>
        <Text>
           Phone: {currentUser && currentUser.phoneNumber}
        </Text>
        <Button title="logout" onPress={() => this.signOutUser()} />
      </View>
      
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})