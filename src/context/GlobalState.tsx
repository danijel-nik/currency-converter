import React, { useEffect, useState } from 'react';
import firebase from '../services/Firebase';
import reducer from './AppReducer';
import useLocalStorage from 'use-local-storage';
import { IGlobalState, IReducer } from "./types";

export const GlobalContext: React.Context<any> = React.createContext({});

export interface GlobalProviderProps {
    children: React.ReactNode;
};

const GlobalProvider = ({ children }: GlobalProviderProps) => {

    const [userLS, setUserLS] = useLocalStorage<object | undefined>("user", undefined);

    // initial global state
    const [state, setState] = useState<any>({
        loading: false,
        currentUser: userLS,
        dispatch: (action: IReducer) => setState((state: IGlobalState) => reducer(state, action))
    });

    useEffect(() => {
        authListener();
    }, [state.currentUser, userLS]);

    const setLoading = (isLoading: boolean) => {
        state.dispatch({
            type: 'LOADING',
            payload: isLoading
        });
    }

    const setUser = (user: object | undefined, setLocalStorage = true) => {
        state.dispatch({
            type: 'CURRENT_USER',
            payload: user
        });
        if (setLocalStorage) {
            setUserLS(user);
        }
    }

    const signUp = async (email: string, password: string) => {
        firebase.register(email, password)
        .then((user: any) => {
            setUser(user);
        });
    }

    const signIn = async (email: string, password: string) => {
        firebase.login(email, password)
            .then((user: any) => {
                setUser(user);
            });
    }

    const signInGoogle = async () => {
        firebase.loginGoogle()
            .then((user: any) => {
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
            firebase.auth.onAuthStateChanged((user: any) => {
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