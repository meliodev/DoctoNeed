import { signOutUser } from '../DB/CRUD'

export const navigateToMedicalFolder = (main, props, user_id) => { 
    let isLeftSideMenuVisible = main.state.isLeftSideMenuVisible
    main.setState({ isLeftSideMenuVisible: false },
        () => props.navigation.navigate('MedicalFolder', { role: props.role, user_id: user_id }))
}

export const navigateToScreen = (main, props, screen) => {
    let isLeftSideMenuVisible = main.state.isLeftSideMenuVisible
    main.setState({ isLeftSideMenuVisible: !isLeftSideMenuVisible },
        () => props.navigation.navigate(screen))
}

export const signOutUserandToggle = async (main) => {
    let isLeftSideMenuVisible = main.state.isLeftSideMenuVisible
    await main.setState({ isLeftSideMenuVisible: !isLeftSideMenuVisible })
    signOutUser()
  }

  export const toggleLeftSideMenu = (main) => {
    let isLeftSideMenuVisible = main.state.isLeftSideMenuVisible
    main.setState({ isLeftSideMenuVisible: !isLeftSideMenuVisible })
  }

