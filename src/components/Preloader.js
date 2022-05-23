import React, {useContext} from 'react';
import {GlobalContext} from '../context/GlobalState';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const Preloader = () => {
    const context = useContext(GlobalContext);

    return (
        (context.store.loading) ?
        <Backdrop open={context.store.loading} >
            <CircularProgress color="inherit" />
        </Backdrop> : ""
    )
}

export default Preloader;
