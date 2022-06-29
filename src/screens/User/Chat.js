import React from 'react'
import { Platform, View, Text } from 'react-native'
import PropTypes from 'prop-types'
import { GiftedChat, Bubble, InputToolbar, Send, } from 'react-native-gifted-chat'
import emojiUtils from 'emoji-utils'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import firebase from '../../configs/firebase'
import * as REFS from '../../DB/CollectionsRefs'

import SlackMessage from '../../components/Chat/SlackMessage'

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.dateTime = ''
    this.renderInputToolbar = this.renderInputToolbar.bind(this);
    this.noinput = this.props.navigation.getParam('noinput', false)
    this.appId = this.props.navigation.getParam('appId', '')

    this.state = {
      messages: [],
      messageToSend: [],
    }
  }

  // getServerTime() {
  //   return fetch("http://worldtimeapi.org/api/" + moment.tz.guess())
  //     .then(async response => await response.json())
  //     .then((responseJson) => {
  //       return responseJson.datetime
  //     })
  //     .catch(error => console.log(error))
  // }


  getServerTime() {
    return fetch("https://worldtimeapi.org/api/timezone/Australia/Sydney")
      .then((response) => {
        return response.headers.map.date
      })
      .catch((error) => {
        console.error(error);
      })
  }

  componentDidMount() {

    var query = REFS.chats
    query = query.where('appointment_id', '==', this.appId)
    query = query.orderBy('createdAt', 'desc')

    this.unsubscribe = query.onSnapshot((querySnapshot) => {

      let messages = []
      querySnapshot.forEach(doc => {

        let id = doc.id
        let text = doc.data().text
        console.log('created at '+doc.data().createdAt)
        let createdAt = moment(doc.data().createdAt).format()

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

      this.setState(() => ({ messages }))

    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  onSend(messages = []) {
    const appointment_id = this.appId

    let msg = this.state.messages
    msg.push(messages)

    this.setState({ messages: msg })

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), async () => {

      let createdAt = await this.getServerTime()
      createdAt = moment(createdAt).format()

      REFS.chats.add({ ...this.state.messages[0], createdAt, appointment_id })
    })
  }

  renderMessage(props) {
    const {
      currentMessage: { text: currText },
    } = props

    let messageTextStyle

    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      }
    }

    return <SlackMessage {...props} messageTextStyle={messageTextStyle} />
  }

  renderBubble(props) {
    if (!props.currentMessage.sent) {
      // if current Message has not been sent, return other Bubble with backgroundColor red for example
      return (
        <Bubble wrapperStyle={{ right: { backgroundColor: '#93eafe' } }} {...props} />
      )
    }

    return (<Bubble {...props} />)
  }

  renderInputToolbar(props) {
    if (!this.noinput)
      return (<InputToolbar {...props} />)
  }

  renderSend(props) {
    return (
      <Send {...props}>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
          <MaterialCommunityIcons name='send' size={33} color='#93eafe' />
        </View>
      </Send>
    )
  }

  render() {

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        renderInputToolbar={this.renderInputToolbar}
        user={{
          _id: firebase.auth().currentUser.uid,  //Firestore Rules: Allow access to only the user that made appointment and to Admin: allow read, write if: resource.data.user._id == request.auth.uid || request.auth.token.admin == true
        }}
        renderBubble={this.renderBubble}
        placeholder='Tapez un message'
        renderSend={this.renderSend}
      />
    )
  }
}