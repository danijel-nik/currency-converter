import React, { useEffect, useContext, useState, useRef } from 'react';
import { Grid, Paper, Tab, Tabs, Box, TextField, Button, Popover, Typography } from '@material-ui/core';
// import SwipeableViews from 'react-swipeable-views';
import { GlobalContext } from '../../context/GlobalState';
import { withRouter, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import classes from './Auth.module.scss';

interface AuthProps {
    history: any
} 

const Auth = ({history}: AuthProps) => {

    const { t } = useTranslation('auth');

    const [tabValue, setTabValue] = useState("sign-in");
    const handleChangeTab = (newValue: any) => {
        setTabValue(newValue);
      };
    const a11yProps = (index: string) => {
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

    const signInBtnRef = useRef();
    const signUpBtnRef = useRef();

    useEffect(() => {
        context.setLoading(false);
    }, []);

    const signInChange = (e: any) => {
        setSignIn({...signIn, [e.target.name]: e.target.value});
    }

    const handleSignIn = (e: any) => {
        context.signIn(signIn.si_email, signIn.si_password)
        .then(() => {
            history.push('/');
        })
        .catch((error: any) => {
            setPopoverText(error.message);
        });
        openPopover(e);
    }

    const handleSignInGoogle = (e: any) => {
        context.signInGoogle()
        .then(() => {
            history.push("/");
        })
        .catch((error: any) => {
            setPopoverText(error.message);
        });
        openPopover(e);
    }

    const signUpChange = (e: any) => {
        setSignUp({...signUp, [e.target.name]: e.target.value});
    }

    const handleSignUp = (e: any) => {
        context.signUp(signUp.email, signUp.password)
        .then(() => { history.push("sign-in") })
        .catch((error: any) => {
            setPopoverText(error.message);
        });
        openPopover(e);
    }

    // Popover
    const [popoverTriggerEl, setPopoverTriggerEl] = useState(null);
    const [popoverText, setPopoverText] = useState("");
    const openPopover = (event: any) => {
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
                                // ref={signInBtnRef} 
                            >
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

                        <Box textAlign="right">
                            <Button 
                                variant="contained"
                                color="primary"
                                className="waves-effect waves-light"
                                onClick={handleSignUp}
                                // ref={signUpBtnRef}
                                >
                                    {t('signUpBtn')}
                            </Button>
                        </Box>
                        
                    </Box> : ""}
            </Paper>
        </Grid>
    );
}

export default withRouter(Auth);