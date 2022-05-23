import React from 'react';
import './App.scss';
import GlobalProvider from './context/GlobalState';
import { BrowserRouter as Router } from "react-router-dom";
import Navigation from './components/Navigation/Navigation';
import ModalMessage from './components/ModalMessage';
import Preloader from './components/Preloader';
import AppRoutes from './AppRoutes';

const App = () => {

    return (
      <div className="App">
        <GlobalProvider>
          <ModalMessage />
          <Preloader />
          <Router>
            <Navigation />
            <AppRoutes />
          </Router>
        </GlobalProvider>
      </div>
    );
}

export default App;
