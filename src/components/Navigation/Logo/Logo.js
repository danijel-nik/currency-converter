import React from 'react';

import classes from './Logo.module.scss';

const Logo = (props) => {
    let classList = (typeof props.drawer !== "undefined" && props.drawer === true) ? [classes.Logo, "drawer"].join(" ") : classes.Logo;
    return (
    <span className={classList}>
        {props.title}
    </span>
)}

export default Logo;