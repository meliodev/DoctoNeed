import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
// import { faHomeLgAlt, faInbox, faConstruction, faCalendarAlt, faUserFriends, faAddressCard, faTicketAlt, faFileInvoice, faFolder, faNewspaper, faSignOutAlt, faScroll, faVials, faHandHoldingUsd, faCogs } from '@fortawesome/pro-light-svg-icons'
// import { faCommentDots, faCog } from "@fortawesome/free-solid-svg-icons"

import firebase, { db } from '../configs/firebase'
import { connect } from 'react-redux'

import * as theme from '../core/theme';
import { constants, isTablet, ScreenHeight, ScreenWidth } from '../core/constants';
import { setStatusBarColor } from '../core/redux'
import AppVersion from '../components/Global/AppVersion';

const menuPrivilleges = {
    admin: ['home', 'inbox', 'projects', 'planning', 'users', 'logout'],
    doctor: ['home', 'inbox', 'projects', 'planning', 'users', 'logout'],
    patient: ['home', 'inbox', 'projects', 'planning', 'users', 'logout'],
}

const menuItems = [
    { id: 'home', name: 'Accueil', icon: "faHomeLgAlt", color: theme.colors.miHome, navScreen: 'DashboardStack' },
    { id: 'inbox', name: 'Boite de réception', icon: "faInbox", color: '#EF6C00', navScreen: 'InboxStack' },
    { id: 'projects', name: 'Projets', icon: "faConstruction", color: '#3F51B5', navScreen: 'ProjectsStack' },
    { id: 'planning', name: 'Planning', icon: "faCalendarAlt", color: theme.colors.miPlanning, navScreen: 'AgendaStack' },
    { id: 'users', name: 'Utilisateurs', icon: "faUserFriends", color: theme.colors.miUsers, navScreen: 'UsersManagementStack' },
    //{ id: 'settings', name: 'Paramètres', icon: faCogs, color: theme.colors.miSettings, navScreen: 'SettingsStack' },
    { id: 'logout', name: 'Se déconnecter', icon: "faSignOutAlt", color: theme.colors.miLogout, navScreen: 'LoginScreen' },
]

class DrawerMenu extends React.Component {

    constructor(props) {
        super(props)
        this.renderMenuItem = this.renderMenuItem.bind(this)
        this.navigateToScreen = this.navigateToScreen.bind(this)

        this.state = {
            notificationCount: 0
        }
    }

    componentDidMount() {
        const { currentUser } = firebase.auth()
        if (currentUser) this.setNotificationBadge(currentUser.uid)
        setStatusBarColor(this, { backgroundColor: theme.colors.background, barStyle: "dark-content" })
    }

    componentWillUnmount() {
        this.unsubscribenotifications()
    }

    setNotificationBadge(uid) {
        const query = db
            .collection('Users')
            .doc(uid)
            .collection('Notifications')
            .where('deleted', '==', false)
            .where('read', '==', false)

        this.unsubscribenotifications = query.onSnapshot((querysnapshot) => {
            if (querysnapshot.empty) return
            const notificationCount = querysnapshot.docs.length
            this.setState({ notificationCount })
        })
    }

    setMenuItems(role) {
        var arrMenuPrivilleges = menuPrivilleges[role]
        if (arrMenuPrivilleges) {
            const menu = menuItems.filter(menuItem => arrMenuPrivilleges.includes(menuItem.id))
            return menu
        }
    }

    renderHeader() {
        const { currentUser, role } = this.props
        const showChatIcon = !role.isClient && (role.isHighRole || role.isLowRole) //Employees only

        return (
            <TouchableOpacity style={styles.headerContainer} onPress={() => this.navigateToScreen('Profile', { isRoot: false })}>
                <View style={{ flex: 0.22, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>AVATAR</Text>
                    {/* <AvatarText size={isTablet ? 90 : 45} label={currentUser.fullName.charAt(0)} labelStyle={{ color: theme.colors.white }} /> */}
                </View>

                <View style={{ flex: 0.78, flexDirection: 'row', marginBottom: 3 }}>
                    <View style={{ flex: 0.73 }}>
                        <Text numberOfLines={1} style={[theme.customFontMSmedium.title, { color: theme.colors.secondary }]}>
                            {currentUser.fullName}
                        </Text>
                        <Text style={[theme.customFontMSmedium.body, { color: theme.colors.gray_dark }]}>
                            {role.value}
                        </Text>
                    </View>
                    {/* <View style={{ flex: 0.27, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <CustomIcon icon={faCog} color={theme.colors.gray_medium} />
                        {showChatIcon &&
                            <CustomIcon
                                icon={faCommentDots}
                                color={theme.colors.primary}
                                onPress={() => this.navigateToScreen('Chat', { chatId: 'GlobalChat' })}
                            />
                        }
                    </View> */}
                </View>
            </TouchableOpacity>
        )
    }

    renderMenu() {
        const arrMenu = this.setMenuItems(this.props.role.id)

        return (
            <FlatList
                //scrollEnabled={!(constants.ScreenHeight >= 5000)}
                data={arrMenu}
                showsVerticalScrollIndicator
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ paddingVertical: theme.padding/2, paddingLeft: theme.padding }}
                //contentContainerStyle={{paddingVertical}}
                renderItem={({ item }) => this.renderMenuItem(item)} />
        )
    }

    renderMenuItem(item) {
        const { notificationCount } = this.state

        if (item.id === 'logout')
            return (
                <TouchableOpacity onPress={this.handleSignout.bind(this)} style={styles.menuItem}>
                    {/* <CustomIcon icon={item.icon} color={item.color} /> */}
                    <Text style={[styles.menuText, theme.customFontMSmedium.body]}>{item.name}</Text>
                </TouchableOpacity>
            )

        else return (
            <TouchableOpacity onPress={() => this.navigateToScreen(item.navScreen)} style={styles.menuItem}>
                {/* <CustomIcon icon={item.icon} color={item.color} /> */}
                {item.id === 'inbox' ?
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={[styles.menuText, theme.customFontMSmedium.body]}>{item.name}</Text>
                        {notificationCount > 0 &&
                            <View style={styles.notificationBadge}>
                                <Text style={{ fontSize: isTablet ? 14 : 8, color: '#fff', fontWeight:"bold" }}>{notificationCount}</Text>
                            </View>
                        }
                    </View>
                    :
                    <Text style={[styles.menuText, theme.customFontMSmedium.body]}>{item.name}</Text>
                }
            </TouchableOpacity>
        )
    }

    async handleSignout() {
        await firebase.auth().signOut()
    }

    navigateToScreen(screenName, screenParams) {
        this.props.navigation.navigate(screenName, screenParams)
    }

    render() {
        const { currentUser } = firebase.auth()

        return (
            <View style={styles.container}>

                {currentUser && this.renderHeader()}

                <View style={styles.menuContainer}>
                    {currentUser && this.renderMenu()}
                </View>

                <View style={[styles.footerContainer, { bottom: 5 }]}>
                    <AppVersion />
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        role: state.roles.role,
        fcmToken: state.fcmtoken,
        currentUser: state.currentUser,
        statusBar: state.statusBar
    }
}

export default connect(mapStateToProps)(DrawerMenu)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flex: 0.13,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray_light
    },
    menuContainer: {
        flex: 0.87,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    footerContainer: {
        flex: 1,
        justifyContent: 'center',
        height: 30,
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    menuItem: {
        flex: 1,
        height: ScreenHeight * 0.07,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    notificationBadge: {
        backgroundColor: '#00ACC1',
        borderRadius: isTablet ? 20 : 11,
        justifyContent: 'center',
        alignItems: 'center',
        width: isTablet ? 40 : 22,
        height: isTablet ? 40 : 22
    },
    menuText: {
        marginHorizontal: ScreenWidth * 0.05,
    },
})