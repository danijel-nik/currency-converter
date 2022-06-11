import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loader = () => {
    return (
        <Backdrop open={true} style={{ zIndex: 99999 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default Loader;
