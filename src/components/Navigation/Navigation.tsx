import React, { useContext, useState } from 'react';
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
import { useTranslation } from 'react-i18next';

import classes from './Navigation.module.scss';

const Navigation = () => {

    const { store, signOut } = useContext(GlobalContext);
    const { t, i18n } = useTranslation('navigation');

    const links = [
        {
            label: t('convertLink'),
            href: "convert",
            active: false,
            protected: false
        },
        {
            label: t('mySavedResultsLink'),
            href: "saved-results",
            active: false,
            protected: true
        },
        {
            label: t('signInRegisterLink'),
            href: "sign-in",
            active: false,
            protected: false
        },
        {
            label: t('aboutLink'),
            href: "about",
            active: false,
            protected: false
        }
    ];

    // Languages menu
    const [languagesMenuTriggerEl, setLanguagesMenuTriggerEl] = useState<null | Element>(null);

    const openLanguagesMenu = (event: React.MouseEvent) => {
        setLanguagesMenuTriggerEl(event.currentTarget);
    };

    const closeLanguagesMenu = () => {
        setLanguagesMenuTriggerEl(null);
    };

    // User menu
    const [userMenuTriggerEl, setUserMenuTriggerEl] = useState<null | Element>(null);

    const openUserMenu = (event: React.MouseEvent) => {
        setUserMenuTriggerEl(event.currentTarget);
    };

    const closeUserMenu = () => {
        setUserMenuTriggerEl(null);
    };

    // Drawer (sidebar menu)
    const [drawerState, setDrawerState] = useState<boolean>(false);

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
                            to={item.href}
                            exact={true}
                            label={item.label}
                            showLabel={true}
                            key={index} />
                    )
                }
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
                                    to={item.href}
                                    exact={true}
                                    key={index}
                                    onClick={() => triggerDrawer()}>
                                    {item.label}
                                </NavLink>
                            )
                        }
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
                                    {store.currentUser.email.split("@")[0]}
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails className={classes.ExpansionDetails}>
                                    <MenuItem onClick={(e) => { e.preventDefault(); signOut() }}>{t('signOutTxt')}</MenuItem>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </> :
                        <>
                            <BottomNavigationAction
                                component={Button}
                                label={
                                    <>
                                        <span className={classes.UserLabel}>{store.currentUser.email.split("@")[0]}</span> 
                                        <ExpandMoreIcon />
                                    </>
                                }
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

                                <MenuItem onClick={(e) => { e.preventDefault(); signOut() }}>{t('signOutTxt')}</MenuItem>
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
                        <Grid item md={3} className={classes.LogoWrapper}>
                            <BottomNavigationAction
                                component={NavLink}
                                to="/"
                                label={<Logo title={t("appName")} />}
                                activeClassName=""
                                showLabel={true} />
                        </Grid>
                        <Grid item className={classes.middle}></Grid>
                        <Grid item className={classes.navItems}>
                            <Hidden smDown>
                                {navigationLinks()}
                                {getUser()}
                            </Hidden>
                            <Tooltip title={t('chLangTxt')}>
                                <BottomNavigationAction
                                    component={Button}
                                    label={<><TranslateIcon /> {i18n.resolvedLanguage === "sr" ? "СРП" : "ENG"} <ExpandMoreIcon /></>}
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
                                onBlur={() => closeLanguagesMenu()}
                            >

                                <MenuItem onClick={() => { i18n.changeLanguage("en"); closeLanguagesMenu() }}>ENG</MenuItem>
                                <MenuItem onClick={() => { i18n.changeLanguage("sr"); closeLanguagesMenu() }}>СРП</MenuItem>
                            </Menu>
                        </Grid>
                    </Grid>
                </Container>
            </BottomNavigation>
            <Drawer
                open={drawerState}
                onClose={() => triggerDrawer()}>

                <Grid container direction="column" className={classes.SideNav}>
                    <NavLink to="/" exact={true} onClick={() => triggerDrawer()}>
                        <Logo title={t('appName')} drawer={true} />
                    </NavLink>
                    {sidebarLinks()}
                    {getUser("mobile")}
                </Grid>
            </Drawer>
        </>
    )
}

export default Navigation;