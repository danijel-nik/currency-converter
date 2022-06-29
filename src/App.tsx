import React, { useContext } from 'react';
import './App.scss';
import { BrowserRouter as Router } from "react-router-dom";
import {GlobalContext} from './context/GlobalState';
import Navigation from './components/Navigation/Navigation';
import Loader from './components/Loader';
import AppRoutes from './AppRoutes';

const App = () => {

  const context = useContext(GlobalContext);

  return (
    <div className="App">
      {context.store.loading && <Loader />}
      <Router>
        <Navigation />
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;
