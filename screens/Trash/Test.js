// Test.js
// Adding to db is working
// Retrieving from db is pending
import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button, SafeAreaView, FlatList, TextInput } from 'react-native'
import firebase from 'react-native-firebase'


const ref = firebase.firestore().collection('Films')
const db = firebase.firestore()



export default class Test extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          films: [],
          title: "", // Initialisation de notre donnée searchedText dans le state
          overview: "",
          filmToDelete: ""
        }
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

//---------------------------------------------------------------------------------------------------
   
     addFilms = async (text1, text2) => {
        try {
            await ref.add({
               title: text1,
               overview: text2
            });
            this.setState({
                title: "",
                overview: ""
            })
            console.log(this.state.title)
            console.log(this.state.overview)
        }
        catch (e) {
            console.log(e);
        }
        }

        _setTitleforMovieToAdd(text) {
            this.setState({ title: text })
        }

        _setOverviewforMovieToAdd(text) {
            this.setState({ overview: text })
        }

//---------------------------------------------------------------------------------------------------
            getFilms = () => {
               return ref.onSnapshot(querySnapshot => {
                   const list = [];
                   querySnapshot.forEach(doc  => {
                   const { title, overview } = doc.data();
                   list.push({
                       id: doc.id,
                       title,
                       overview
                   });
                });
                
                  this.setState({ films: list })
               });   

            };
            
  //---------------------------------------------------------------------------------------------------------          
        deleteFilm = (text) => {

        ref.where('title','==',text).get().then((querySnapshot) => {
          var batch = db.batch();

          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });

          return batch.commit();
        }).then(() => {
              console.log("Movie removed successfully !")
        }).catch(() => {
          console.error("Error removing document: ", error);
      });

      this.setState({ filmToDelete: "" })
      }

      _setTitleforMovieToDelete(text) {
        this.setState({ filmToDelete: text })
    }
 
  render() {

     this.getFilms();

      return (

     <View style={styles.container}>
     <FlatList
     data={this.state.films}
     keyExtractor={(item) => item.id}
     renderItem={({item}) => <Text>{item.title}</Text>}
     />

    <TextInput style={styles.textinput} placeholder='Titre du film'  onChangeText={(text) => this._setTitleforMovieToDelete(text)}/>

     <Button
          title="Delete the movie"
          onPress={() => this.deleteFilm(this.state.filmToDelete)}
      />
       <TextInput style={styles.textinput} placeholder='Titre du film'  onChangeText={(text) => this._setTitleforMovieToAdd(text)}/>
       <TextInput style={styles.textinput} placeholder='Overview'  onChangeText={(text) => this._setOverviewforMovieToAdd(text)}/>

       <Button
          title="Add the movie"
          onPress={() => this.addFilms(this.state.title, this.state.overview)}
        />
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