import React from 'react'
import { Platform, View, Text } from 'react-native'
import PropTypes from 'prop-types'
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import emojiUtils from 'emoji-utils'

import firebase from 'react-native-firebase'
import { signOutUser } from '../../../DB/CRUD'
import * as REFS from '../../../DB/CollectionsRefs'

import SlackMessage from '../SlackMessage'

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.renderInputToolbar = this.renderInputToolbar.bind(this);
  this.state = {
    messages: [],
    messageToSend: [],
    noinput: true
  }
}

  componentDidMount() {
    const appId = this.props.navigation.getParam('appId', 'nothing sent')
    const noinput = this.props.navigation.getParam('noinput', 'nothing sent')
    this.setState({ noinput: noinput})

    var query = REFS.chats
    query = query.where('appointment_id', '==', appId)
    query = query.orderBy('createdAt', 'desc')

    query
      .onSnapshot(function (querySnapshot) {
        console.log(querySnapshot)
        let messages = []
        querySnapshot.forEach(doc => {

          let id = doc.id
          let text = doc.data().text
          let createdAt = doc.data().createdAt.toDate()

          let user = {
            _id: doc.data().user._id,
            name: doc.data().user.name,
            avatar: doc.data().user.avatar
          }

          let message = {
            _id: id,
            text: text,
            createdAt: createdAt,
            user: user
          }

          messages.push(message)

        })

        //console.log(messages)
        // this.setState({ messages: messages })
        this.setState(() => ({
          messages: GiftedChat.append([], messages),
        }))

      }.bind(this))


    /*   this.setState({
         messages: [
           {
             _id: 1,
             text: 'Bonjour !',
             createdAt: new Date(),
             user: {
               _id: 2,
               name: 'Moi',
               avatar: 'https://placeimg.com/140/140/any',
             },
           },
         ],
       }, () => console.log(this.state.messages[0])
       )*/

  }

  onSend(messages = []) {
    const appId = this.props.navigation.getParam('appId', 'nothing sent')
    // REFS.chats.add(messages)


    this.setState(previousState => ({
      messageToSend: GiftedChat.append(previousState.messageToSend, messages),
    }), () => {
      console.log(this.state.messageToSend[0])
      REFS.chats.add(this.state.messageToSend[0]).then((doc) => {
        doc.update({ appointment_id: appId }).then(() => console.log('appointment_id added to the chat message document'))
          .catch((err) => console.error(err))
      })
    })

  }



  renderMessage(props) {
    const {
      currentMessage: { text: currText },
    } = props

    let messageTextStyle

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      }
    }

    return <SlackMessage {...props} messageTextStyle={messageTextStyle} />
  }

  renderBubble(props) {
    if (!props.currentMessage.sent) {
      // if current Message has not been sent, return other Bubble with backgroundColor red for example
      return (
        <Bubble
          wrapperStyle={{
            right: { backgroundColor: '#93eafe' },
          }}
          {...props}
        />
      );
    }
    return (
      // Return your normal Bubble component if message has been sent.
      <Bubble {...props} />
    );
  }

  renderInputToolbar(props) {
    if (this.state.noinput == true) {
    } else {
    return(
      <InputToolbar
      {...props}
      />
    ); 
  }
  }

  render() {

    return (
         
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            renderInputToolbar= {this.renderInputToolbar}
            user={{
              _id: firebase.auth().currentUser.uid,  //Firestore Rules: Allow access to only the user that made appointment and to Admin: allow read, write if: resource.data.user._id == request.auth.uid || request.auth.token.admin == true
            }}
            //renderMessage={this.renderMessage}
            renderBubble={this.renderBubble}
          />
    )
  }
}