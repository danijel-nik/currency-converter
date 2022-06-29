import React, {useContext} from 'react';
import { Container } from '@material-ui/core';
import {BrowserRouter as Router, Route, Redirect, useLocation } from 'react-router-dom';
import {GlobalContext} from './context/GlobalState';
import Home from './pages/Home/Home';
import Converter from './pages/Converter/Converter';
import SavedResults from './pages/SavedResults/SavedResults';
import Auth from './pages/Auth/Auth';
import AboutApp from './pages/AboutApp/AboutApp';

const AppRoutes = () => {

    const {store} = useContext(GlobalContext);
    let location = useLocation();

    return(
        <>
            <Route exact path="/">
                    <Home />
            </Route>
            <Container className={(location.pathname === "/") ? "" : "page"}>
                <Route exact path={'/convert'}>
                    <Converter />
                </Route>
                <Route path={'/saved-results'}>
                    {
                        (store.currentUser) ? <SavedResults /> : <Redirect to={{ pathname: '/sign-in'}} />
                    }
                </Route>
                <Route path={'/sign-in'}>
                    <Auth />
                </Route>
                <Route path={'/about'}>
                    <AboutApp />
                </Route>
            </Container>
        </>
    );
}

export default AppRoutes;