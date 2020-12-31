// At the top where our imports are...
import React, { Component } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video-controls';

export default class VideoPlayer extends Component {
    constructor() {
        super();
    }

    render() {
        this.video = this.props.navigation.getParam('videoLink', '')
        console.log(this.video)
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Video
                    source={{ uri: this.video }}
                    navigator={this.props.navigation}
                    disableVolume={true}
                />
            </View>
        );
    }
}