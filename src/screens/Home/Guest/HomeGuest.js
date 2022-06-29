import React from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';

import firebase from '../../../configs/firebase';
import {ScreenWidth, ScreenHeight} from '../../../core/constants';
import * as theme from '../../../core/theme';

import Caption from '../../../components/Typography/Caption';
import Logo from '../../../components/Global/Logo';
import SearchBarLink from '../../../components/SearchBarLink';
import Button from '../../../components/Button';

class HomeGuest extends React.Component {
  navigateToAuth(isDoctor) {
    this.props.navigation.navigate('Auth', {isDoctor});
  }

  renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <Logo />
      </View>
    );
  }

  renderSearchBar() {
    return (
      <View style={styles.searchBarContainer}>
        <SearchBarLink onPress={() => this.navigateToAuth(false)} />
      </View>
    );
  }

  renderButtonContainer() {
    return (
      <View style={styles.buttonContainer}>
        <Button
          text="Connexion/Inscription"
          onPress={() => this.props.navigation.navigate('Auth')}
        />
      </View>
    );
  }

  renderTermsContainer() {
    const {gray_dark} = theme.colors;

    return (
      <View style={styles.termsContainer}>
        <Caption style={{color: gray_dark, textAlign: 'center'}}>
          En cliquant sur Inscription, vous acceptez{'\n'}les
          <Caption style={{textDecorationLine: 'underline'}}>
            {' '}
            conditions générales d'utilisation
          </Caption>
        </Caption>
      </View>
    );
  }

  renderFooterContainer() {
    return (
      <View style={styles.footerContainer}>
        <Caption style={{color: theme.colors.gray_dark}}>
          Vous êtes un professionnel ?{' '}
          <Caption
            onPress={() => this.navigateToAuth(true)}
            style={{
              textDecorationLine: 'underline',
              color: theme.colors.primary,
              fontWeight: 'bold',
            }}>
            Par ici
          </Caption>
        </Caption>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderSearchBar()}
        {this.renderButtonContainer()}
        {this.renderTermsContainer()}
        {this.renderFooterContainer()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    // signupData: state.signup,
  };
};

export default withNavigation(connect(mapStateToProps)(HomeGuest));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'pink',
  },
  searchBarContainer: {
    flex: 0.25,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //backgroundColor: 'green',
  },
  buttonContainer: {
    flex: 0.25,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //backgroundColor: 'yellow',
    paddingBottom: ScreenHeight * 0.01,
  },
  termsContainer: {
    flex: 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'brown',
  },
  footerContainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: ScreenHeight * 0.02,
    //backgroundColor: 'red'
  },
});
