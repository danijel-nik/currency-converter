import React from 'react';

import classes from './Logo.module.scss';

export interface LogoProps {
    drawer?: boolean;
    title: string;
  }

const Logo = ({ drawer, title }: LogoProps) => {
    let classList = (typeof drawer !== "undefined" && drawer === true) ? [classes.Logo, "drawer"].join(" ") : classes.Logo;
    return (
    <span className={classList}>
        {title}
    </span>
)}

export default Logo;