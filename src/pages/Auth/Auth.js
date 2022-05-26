import React, { useEffect, useContext, useState, useRef, createRef } from 'react';
import { Grid, Paper, Tab, Tabs, Box, TextField, Button, Popover, Typography } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { GlobalContext } from '../../context/GlobalState';
import { withRouter, Redirect } from 'react-router-dom';
import firebase from '../../services/Firebase';
import { useTranslation } from 'react-i18next';

import classes from './Auth.module.scss';

const Auth = ({history}) => {

    const { t } = useTranslation('auth');

    const [tabValue, setTabValue] = useState("sign-in");
    const handleChangeTab = (newValue) => {
        setTabValue(newValue);
      };
    const a11yProps = (index) => {
        return {
          id: `wrapped-tab-${index}`,
          'aria-controls': `wrapped-tabpanel-${index}`,
        };
      }
    
    const [signIn, setSignIn] = useState({
        si_email: "",
        si_password: ""
    });

    const [signUp, setSignUp] = useState({
        name: "",
        email: "",
        password: ""
    });

    const context = useContext(GlobalContext);

    const signInBtnRef = React.useRef();
    const signUpBtnRef = React.useRef();

    useEffect(() => {
        context.loadingComplete(true);
    }, []);

    const signInChange = (e) => {
        setSignIn({...signIn, [e.target.name]: e.target.value});
    }

    const handleSignIn = (e) => {
        firebase.login(signIn.si_email, signIn.si_password)
        .then((user) => {
            context.setUser(user);
            history.push('/');
            console.log(context.store.currentUser);
        })
        .catch((error) => {
            setPopoverText(error.message);
        });
        openPopover(e);
    }

    const handleSignInGoogle = (e) => {
        firebase.loginGoogle()
        .then((user) => {
            context.setUser(user);
            history.push("/");
            console.log(context.store.currentUser);
        })
        .catch((error) => {
            setPopoverText(error.message);
        });
        openPopover(e);
    }

    const signUpChange = (e) => {
        setSignUp({...signUp, [e.target.name]: e.target.value});
    }

    const handleSignUp = (e) => {
        firebase.register(signUp.email, signUp.password)
        .then(() => { history.push("sign-in") })
        .catch((error) => {
            setPopoverText(error.message);
        });
        openPopover(e);
    }

    // Popover
    const [popoverTriggerEl, setPopoverTriggerEl] = useState(null);
    const [popoverText, setPopoverText] = useState("");
    const openPopover = (event) => {
        setPopoverTriggerEl(event.currentTarget);
    };
    const closePopover = () => {
        setPopoverTriggerEl(null);
    };

    if (context.store.currentUser) {
        return <Redirect to="/" />;
    }

    return (
        <Grid container spacing={3} xs={12} sm={8} md={5} className={classes.Wrapper}>
            <Paper className={classes.Paper}>
                <Tabs 
                    value={tabValue} 
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth" 
                    aria-label="wrapped label tabs example">
                    
                    <Tab label={t('signInHeader')} onClick={() => handleChangeTab("sign-in")} value="sign-in" { ...a11yProps("sign-in") } />
                    <Tab label={t('signUpHeader')} onClick={() => handleChangeTab("register")} value="register" { ...a11yProps("register") } />
                </Tabs>
                    {(tabValue==="sign-in") ? 
                    <Box>
                        <h3>{t('signInBtn')}</h3>
                        <TextField 
                            variant="outlined"
                            fullWidth
                            type="email"
                            name="si_email"
                            className={classes.input}
                            label={t('signInEmail')} 
                            onChange={signInChange}
                        />

                        <TextField 
                            variant="outlined"
                            fullWidth
                            type="password"
                            name="si_password"
                            className={classes.input}
                            label={t('signInPassword')}
                            onChange={signInChange}
                        />

                        <Grid container>
                            <Button 
                                variant="contained"
                                color="primary"
                                className="waves-effect waves-light"
                                onClick={handleSignIn}
                                ref={signInBtnRef} >
                                    {t('signInBtn')}
                            </Button>
                            <Popover
                                open={Boolean(popoverTriggerEl)}
                                anchorEl={popoverTriggerEl}
                                onClose={closePopover}
                                anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center'
                                }}
                            >
                                <Typography className={classes.typography}>{popoverText}</Typography>
                            </Popover>
                            <Button 
                                style={{marginLeft: "auto"}}
                                variant="contained"
                                color="secondary"
                                className="waves-effect waves-light"
                                onClick={handleSignInGoogle} >
                                    {t('googleSignIn')}
                            </Button>
                        </Grid>
                    </Box> : ""}

                    {(tabValue==="register") ?
                    <Box>
                        <h3>{t('signUpBtn')}</h3>
                        <TextField 
                            variant="outlined"
                            fullWidth
                            type="text"
                            name="name"
                            className={classes.input}
                            label={t('signUpName')} 
                            onChange={signUpChange}
                        />
                        <TextField 
                            variant="outlined"
                            fullWidth
                            type="email"
                            name="email"
                            className={classes.input}
                            label={t('signUpEmail')}
                            onChange={signUpChange}
                        />
                        <TextField 
                            variant="outlined"
                            fullWidth
                            type="password"
                            name="password"
                            className={classes.input}
                            label={t('signUpPassword')}
                            onChange={signUpChange}
                        />

                        <div align="right">
                            <Button 
                                variant="contained"
                                color="primary"
                                className="waves-effect waves-light"
                                onClick={handleSignUp}
                                ref={signUpBtnRef}
                                >
                                    {t('signUpBtn')}
                            </Button>
                        </div>
                        
                    </Box> : ""}
            </Paper>
        </Grid>
    );
}

export default withRouter(Auth);