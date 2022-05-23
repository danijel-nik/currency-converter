import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { Paper, Grid } from '@material-ui/core';

import classes from "./AboutApp.module.scss";

const AboutApp = () => {
    let context = useContext(GlobalContext);

    if (context.store.pages.aboutApp) {
        const { author, website, contact, version, appDescription } = context.store.pages.aboutApp;
        
        return (
            <Grid container direction="column" spacing={2} xs={12}>
                <Paper className={classes.AboutApp}>
                    <div className={classes.InnerText}>
                        <Grid item>
                            <strong>{author.label}</strong>: {author.value}
                        </Grid>
                        <Grid item>
                            <strong>{website.label}</strong>: <a href={website.value} target="_blank" rel="noopener noreferrer">{website.value}</a>
                        </Grid>
                        <Grid item>
                            <strong>{contact.label}</strong>: <a href={`mailto:${contact.value}`} rel="noopener noreferrer">{contact.value}</a>
                        </Grid>
                        <Grid item>
                            <strong>{version.label}</strong>: {version.value}
                        </Grid>
                    </div>
                </Paper>
                <Paper className={classes.AboutApp}>
                    <Grid item className={classes.InnerText}>
                        {appDescription}
                    </Grid>
                </Paper>
            </Grid>
        );
    } else {
        return "";
    }
}

export default AboutApp;