import React, {Component} from 'react';
import data from '../services/Data';
import firebase from '../services/Firebase';
import reducer from './reducer';

export const GlobalContext = React.createContext();

class GlobalProvider extends Component {
    state = {
        activeLang: "EN",
        loading: false,
        nav: {},
        pages: {},
        footer: {},
        modalOpened: false,
        modalHeader: "",
        modalContent: "",
        modalCloseTxt: "",
        dispatch: action => this.setState(state => reducer(state, action))
    }

    constructor() {
        super();
        this.changeLang = this.changeLang.bind(this);
        this.loadingComplete = this.loadingComplete.bind(this);
        this.setUser = this.setUser.bind(this);
        this.signOut = this.signOut.bind(this);
        this.authListener = this.authListener.bind(this);
    }

    componentDidMount() {

        let url = document.URL;

        if (url.indexOf("/sr/") > -1) {
            this.setState({activeLang: "СРП"});
            this.changeLang("SR");
            return;
        }

        let lang = this.state.activeLang.toLowerCase();

        data.getData(lang)
        .then(resp => {
            this.setState({
                nav: resp.data.nav,
                pages: resp.data.pages,
                footer: resp.data.footer
            })
            // console.log(this.state);
        })
        .catch((err) => { console.log(err) });

        this.authListener();
    }

    changeLang(lang) {
        this.loadingComplete(false);

        data.getData(lang.toLowerCase())
        .then(resp => {
            this.setState({
                nav: resp.data.nav,
                pages: resp.data.pages,
                footer: resp.data.footer
            })
        })
        .then(() => this.loadingComplete(true))
        .catch((err) => { console.log(err) });

        if (lang === "SR") lang = "СРП";

        this.setState({ activeLang: lang });
    }

    loadingComplete(completed) {
        this.setState({ loading: !completed });
      }

    setUser(user) {
        this.setState({currentUser: user});
        
    }

    signOut() {
        firebase.auth.signOut();
        this.setState({ currentUser: undefined });
    }

    authListener() {
        firebase.auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({currentUser: user});
             }
        });
    }

    render() {
        return (
            <GlobalContext.Provider value={{
                store: this.state,
                changeLang: this.changeLang,
                loadingComplete: this.loadingComplete,
                openModal: this.openModal,
                closeModal: this.closeModal,
                setUser: this.setUser,
                signOut: this.signOut
            }}>
                {this.props.children}
            </GlobalContext.Provider>
        );
    }
}

export default GlobalProvider;