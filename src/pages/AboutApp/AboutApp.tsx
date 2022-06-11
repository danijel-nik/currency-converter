import React from 'react';
import { Paper, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import classes from "./AboutApp.module.scss";

const AboutApp = () => {
    const { t } = useTranslation('pageAbout');

    return (
        <Grid container direction="column" spacing={2} xs={12}>
            <Paper className={classes.AboutApp}>
                <div className={classes.InnerText}>
                    <Grid item>
                        <strong>{t('authorLabel')}</strong>: {t('authorName')}
                    </Grid>
                    <Grid item>
                        <strong>{t('websiteLabel')}</strong>: <a href={t('websiteLink')} target="_blank" rel="noopener noreferrer">{t('websiteLink')}</a>
                    </Grid>
                    <Grid item>
                        <strong>{t('contactLabel')}</strong>: <a href={`mailto:${t('contactEmail')}`} rel="noopener noreferrer">{t('contactEmail')}</a>
                    </Grid>
                </div>
            </Paper>
            <Paper className={classes.AboutApp}>
                <Grid item className={classes.InnerText}>
                    {t('appDescription')}
                </Grid>
            </Paper>
        </Grid>
    );
}

export default AboutApp;