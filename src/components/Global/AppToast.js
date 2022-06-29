import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';

import {ScreenHeight} from '../../core/constants';
import Toast from './Toast';

class AppToast extends Component {
  dismissToast() {
    const action = {
      type: 'TOAST',
      value: {message: '', type: ''},
    };
    this.props.dispatch(action);
  }

  render() {
    return (
      <Toast
        containerStyle={{bottom: ScreenHeight * 0.1}}
        message={this.props.toast.message}
        type={this.props.toast.type}
        onDismiss={() => this.dismissToast()}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    toast: state.toast,
  };
};

export default connect(mapStateToProps)(AppToast);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
