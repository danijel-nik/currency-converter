import React, { useEffect, useState } from 'react';
import { Container, Grid, Button, Slide, Zoom, Fade } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import classes from "./Home.module.scss";

interface HomeProps {
    history: any
} 

const Home = ({ history }: HomeProps) => {
    const { t } = useTranslation('home');
    const [fadeBg, setFadeBg] = useState(false);
    const [zoomTitle, setZoomTitle] = useState(false);
    const [zoomMap, setZoomMap] = useState(false);
    const [fade, setFade] = useState(false);
    const [slide, setSlide] = useState(false);
    const [slideBtn, setSlideBtn] = useState(false);

    useEffect(() => {
        setTimeout(() => setFadeBg((fadeBg) => (!fadeBg)), 300);
        setTimeout(() => setZoomTitle((zoomTitle) => (!zoomTitle)), 700);
        setTimeout(() => setZoomMap((zoomMap) => (!zoomMap)), 1000);
        setTimeout(() => setFade((fade) => (!fade)), 1300);
        setTimeout(() => setSlide((slide) => (!slide)), 1500);
        setTimeout(() => setSlideBtn((slideBtn) => (!slideBtn)), 1800);
    }, []);

    return (
        <Fade in={fadeBg}>
            <section className={classes.HomeSection}>
                <Container>
                    <Grid container direction="row" spacing={2}>
                        <Grid item md={6} className={classes.Left}>
                            <Zoom in={zoomTitle}>
                                <h1>{t('title')}</h1>
                            </Zoom>
                        </Grid>
                        <Grid item md={6} className={classes.Map}>
                            <Zoom in={zoomMap}>
                                <img src="/assets/img/currency_converter_map.png" />
                            </Zoom>
                            <Fade in={fade}>
                                <div>
                                    <h2>150<sup>+</sup></h2>
                                    <h2>{t('mapTxt')}</h2>
                                </div>
                            </Fade>
                        </Grid>
                    </Grid>
                </Container>
                    <div className={classes.Bottom}>
                        <Slide direction="up" in={slide}>
                            <h3>{t('bottomTxt')}</h3>
                        </Slide>
                        <Slide direction="up" in={slideBtn}>
                            <Button 
                                color="primary"
                                variant="contained"
                                onClick={() => history.push("/convert")}
                            >
                                    {t('btnTxt')}
                            </Button>
                        </Slide>
                    </div>
            </section>
        </Fade>
    )
}

export default withRouter(Home);