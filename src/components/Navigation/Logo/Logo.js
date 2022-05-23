import React from 'react';
// import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import GraphicEqRoundedIcon from '@material-ui/icons/GraphicEqRounded';

import classes from './Logo.module.scss';

const Logo = (props) => {
    let classList = (typeof props.drawer !== "undefined" && props.drawer === true) ? [classes.Logo, "drawer"].join(" ") : classes.Logo;
    return (
    <span className={classList}>
        <GraphicEqRoundedIcon color="primary" />
        {props.title}
    </span>
)}

export default Logo;