import * as React from 'react';
import {Appbar as appbar} from 'react-native-paper';
import {withNavigation} from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Loading from './Loading';
import * as theme from '../core/theme';

const Appbar = ({
  white,
  appBarColor,
  back,
  customBackHandler,
  blackBack,
  close,
  title,
  search,
  dots,
  check,
  send,
  attach,
  menu,
  edit,
  del,
  refresh,
  loading,
  controller,
  titleText,
  controllerIcon,
  iconsColor,
  searchBar,
  handleSearch,
  handleSubmit,
  handleSend,
  handleAttachement,
  handleMore,
  handleEdit,
  handleAction,
  handleDelete,
  handleRefresh,
  navigation,
  goBack,
  style,
  ...props
}) => {
  let navBack = () => navigation.goBack();
  const showMenu = () => navigation.openDrawer();

  const AppBarIcon = ({icon, iconColor, onPress, style}) => {
    const faIcon = <MaterialCommunityIcons name={icon} size={28} color={iconColor} />;
    return <appbar.Action icon={faIcon} onPress={onPress} />;
  };

  //White background
  if (white) {
    return (
      <appbar.Header
        style={[{backgroundColor: '#ffffff', elevation: 0}, style]}>
        <AppBarIcon icon={faArrowLeft} onPress={customBackHandler || navBack} />
        {title && (
          <appbar.Content
            title={titleText}
            titleStyle={theme.customFontMSregular.h3}
          />
        )}
      </appbar.Header>
    );
  } else
    return (
      <appbar.Header
        style={[
          {backgroundColor: appBarColor || theme.colors.appBar, elevation: 0},
          style,
        ]}>
        {back && (
          <AppBarIcon
            icon={"arrow-left"}
            onPress={customBackHandler || navBack}
            iconColor={iconsColor || theme.colors.secondary}
          />
        )}
        {close && (
          <AppBarIcon
            icon={"close"}
            onPress={customBackHandler || navBack}
            iconColor={iconsColor || theme.colors.secondary}
          />
        )}
        {menu && <AppBarIcon icon={"menu"} onPress={showMenu} />}
        {searchBar}
        {title && (
          <appbar.Content
            title={titleText}
            titleStyle={[
              theme.customFontMSregular.header,
              {
                marginLeft: back || close || menu ? 0 : theme.padding,
                letterSpacing: 1,
              },
            ]}
          />
        )}
        {refresh && <AppBarIcon icon={"refresh"} onPress={handleRefresh} />}
        {search && <AppBarIcon icon={"magnify"} onPress={handleSearch} />}
        {attach && (
          <AppBarIcon icon={"attachment"} onPress={handleAttachement} />
        )}
        {dots && <AppBarIcon icon={"dots-vertical"} onPress={handleMore} />}
        {del && <AppBarIcon icon={"delete"} onPress={handleDelete} />}
        {loading && (
          <Loading
            size="small"
            color="#fff"
            style={{position: 'absolute', right: 15}}
          />
        )}
        {check && (
          <AppBarIcon
            icon={"check"}
            onPress={handleSubmit}
            iconColor={iconsColor || theme.colors.primary}
          />
        )}
        {send && <AppBarIcon icon={"send"} onPress={handleSend} />}
        {edit && (
          <AppBarIcon
            icon={"pencil"}
            onPress={handleEdit}
            iconColor={iconsColor || theme.colors.secondary}
          />
        )}
        {controller && (
          <appbar.Action icon={controllerIcon} onPress={handleAction} />
        )}
      </appbar.Header>
    );
};

export default withNavigation(Appbar);
