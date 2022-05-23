import React, {useContext, useState} from 'react';
import {
    Container, Grid, Hidden, BottomNavigation, BottomNavigationAction, Menu, MenuItem, Button, Tooltip, Drawer,
    ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails
} from '@material-ui/core';
import Logo from './Logo/Logo';
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TranslateIcon from '@material-ui/icons/Translate';

import { NavLink, Link } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalState';

import classes from './Navigation.module.scss';

const Navigation = () => {

    const {store, changeLang, signOut} = useContext(GlobalContext);
    const {activeLang} = store;
    const { appName, homeLink, links, signOutTxt, chLangTxt } = store.nav;
    
    // Home link
    let home = "";
    
    if (typeof homeLink === "undefined") {
        home = (activeLang === "EN") ? "/" : "/sr/";
    } else {
        home = homeLink;
    }

    // Languages menu
    const [languagesMenuTriggerEl, setLanguagesMenuTriggerEl] = useState(null);

    const openLanguagesMenu = (event) => {
        setLanguagesMenuTriggerEl(event.currentTarget);
    };

    const closeLanguagesMenu = () => {
        setLanguagesMenuTriggerEl(null);
    };

    // User menu
    const [userMenuTriggerEl, setUserMenuTriggerEl] = useState(null);

    const openUserMenu = (event) => {
        setUserMenuTriggerEl(event.currentTarget);
    };

    const closeUserMenu = () => {
        setUserMenuTriggerEl(null);
    };

    // Drawer (sidebar menu)
    const [drawerState, setDrawerState] = useState(false);

    const triggerDrawer = () => {
        if (drawerState) {
            setDrawerState(false);
        } else {
            setDrawerState(true);
        }
    }

    const navigationLinks = () => (
        (typeof links !== "undefined") ?
            (links.map((item, index) => {
                if ((item.href === 'sign-in' && store.currentUser) || (item.protected && !store.currentUser)) {
                    return ""
                } else {
                return (
                    <BottomNavigationAction
                        component={NavLink} 
                        to={homeLink + item.href}
                        exact={true}
                        label={item.name}
                        showLabel={true}
                        key={index} />
                )}
            })
        ) : ""
    )

    const sidebarLinks = () => (
        <>
        {
            (typeof links !== "undefined") ?
                (links.map((item, index) => {
                    if ((item.href === 'sign-in' && store.currentUser) || (item.protected && !store.currentUser)) {
                        return ""
                    } else {
                    return (
                        <NavLink 
                            to={homeLink + item.href}
                            exact={true}
                            key={index}
                            onClick={() => triggerDrawer()}>
                                {item.name}
                        </NavLink>
                    )}
                })
            ) : ""
        }
        </>
    )

    const getUser = (type = "") => (
        (store.currentUser && store.currentUser.email) ? 
        <>
        {
        (type === "mobile") ? 
            <>
            <ExpansionPanel>
                <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                className={classes.ExpansionTitle}
                >
                    { store.currentUser.email.split("@")[0] }
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.ExpansionDetails}>
                    <MenuItem onClick={(e) => { e.preventDefault(); signOut() }}>{signOutTxt}</MenuItem>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            </> :
            <>
                <BottomNavigationAction
                    component={Button}
                    label={<>{store.currentUser.email.split("@")[0]} <ExpandMoreIcon /></>}
                    showLabel={true}
                    aria-controls="user-menu" 
                    aria-haspopup="true" 
                    onClick={openUserMenu}
                    className={classes.UserTrigger}
                />
                <Menu
                    id="user-menu"
                    className={classes.DropdownMenu}
                    anchorEl={userMenuTriggerEl}
                    open={Boolean(userMenuTriggerEl)}
                    onClose={() => closeUserMenu()}
                    onBlur={() => closeUserMenu()} >

                    <MenuItem onClick={(e) => { e.preventDefault(); signOut() }}>{signOutTxt}</MenuItem>
                </Menu>
            </>
        }
        </> : ""
    )

    return (
        <>
            <BottomNavigation showLabels={true} className={classes.Navigation}>
                <Container>
                    <Grid container>
                        <Hidden only={['md', 'lg', 'xl']}>
                            <Grid><ListRoundedIcon className={classes.MenuTrigger} onClick={() => triggerDrawer()} /></Grid>
                            <Grid item className={[classes.middle, classes.middleLeft].join(" ")}></Grid>
                        </Hidden>
                        <Grid item md={3}>
                            <BottomNavigationAction 
                                component={NavLink} 
                                to={home} 
                                label={<Logo title={appName} />} 
                                activeClassName=""
                                showLabel={true} />
                        </Grid>
                        <Grid item className={classes.middle}></Grid>
                        <Grid item className={classes.navItems}>
                            <Hidden smDown>
                            {navigationLinks()}
                            {getUser()}
                            </Hidden>
                            <Tooltip title={chLangTxt}>
                                <BottomNavigationAction
                                    component={Button}
                                    label={<><TranslateIcon /> {activeLang} <ExpandMoreIcon /></>}
                                    showLabel={true}
                                    aria-controls="languages-menu" 
                                    aria-haspopup="true" 
                                    onClick={openLanguagesMenu}
                                />
                            </Tooltip>
                                <Menu
                                    id="languages-menu"
                                    className={classes.DropdownMenu}
                                    anchorEl={languagesMenuTriggerEl}
                                    open={Boolean(languagesMenuTriggerEl)}
                                    onClose={() => closeLanguagesMenu()}
                                    onBlur={() => closeLanguagesMenu()} >

                                    <MenuItem component={Link} to="/" onClick={() => { changeLang("EN"); closeLanguagesMenu() }}>EN</MenuItem>
                                    <MenuItem component={Link} to="/sr/" onClick={() => {changeLang("SR"); closeLanguagesMenu()}}>СРП</MenuItem>
                                </Menu>
                        </Grid>
                    </Grid>
                </Container>
            </BottomNavigation>
            <Drawer 
                open={drawerState}
                onClose={() => triggerDrawer()}>
                
                <Grid container direction="column" className={classes.SideNav}>
                    <NavLink to={homeLink} exact={true} onClick={() => triggerDrawer()}>
                        <Logo title={appName} drawer={true} />
                    </NavLink>
                    {sidebarLinks()}
                    {getUser("mobile")}
                </Grid>
            </Drawer>
        </>
    )
}

export default Navigation;