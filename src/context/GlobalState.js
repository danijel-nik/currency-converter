import React, { useEffect, useState } from 'react';
import firebase from '../services/Firebase';
import reducer from './AppReducer';
import useLocalStorage from 'use-local-storage';

export const GlobalContext = React.createContext();

const GlobalProvider = ({ children }) => {

    const [userLS, setUserLS] = useLocalStorage("user", undefined);

    // initial global state
    const [state, setState] = useState({
        loading: false,
        currentUser: userLS,
        dispatch: action => setState(state => reducer(state, action))
    });

    useEffect(() => {
        authListener();
    }, [state.currentUser, userLS]);

    const setLoading = (isLoading) => {
        state.dispatch({
            type: 'LOADING',
            payload: isLoading
        });
    }

    const setUser = (user, setLocalStorage = true) => {
        state.dispatch({
            type: 'CURRENT_USER',
            payload: user
        });
        if (setLocalStorage) {
            setUserLS(user);
        }
    }

    const signUp = async (email, password) => {
        firebase.register(email, password)
        .then((user) => {
            setUser(user);
        });
    }

    const signIn = async (email, password) => {
        firebase.login(email, password)
            .then((user) => {
                setUser(user);
            });
    }

    const signInGoogle = async () => {
        firebase.loginGoogle()
            .then((user) => {
                setUser(user);
            });
    }

    const signOut = async () => {
        firebase.auth.signOut()
            .then(() => {
                setUser(undefined);
            });
    }

    const authListener = () => {
        if (userLS) {
            setUser(userLS, false);
        } else {
            firebase.auth.onAuthStateChanged((user) => {
                if (user) {
                    setUser(user);
                } else {
                    setUser(undefined);
                }
            });
        }
    }

    return (
        <GlobalContext.Provider value={{
            store: state,
            setLoading: setLoading,
            setUser: setUser,
            signUp: signUp,
            signIn: signIn,
            signInGoogle: signInGoogle,
            signOut: signOut
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export default GlobalProvider;