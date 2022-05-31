import React, { useEffect, useState } from 'react';
import firebase from '../services/Firebase';
import reducer from './reducer';
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
        setState({ ...state, loading: isLoading });
    }

    const signUp = async (email, password) => {
        firebase.register(email, password)
        .then((user) => {
            setUser(user);
        });
    }

    const setUser = (user) => {
        setState({ ...state, currentUser: user });
        setUserLS(user);
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
                setState({ ...state, currentUser: undefined });
                setUserLS(undefined);
            });
    }

    const authListener = () => {
        if (userLS) {
            setState({ ...state, currentUser: userLS });
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