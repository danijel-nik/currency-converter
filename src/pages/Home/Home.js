import React, { useEffect, useState, useContext } from 'react';
import { Container, Grid, Button, Slide, Zoom, Fade } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalState';

import classes from "./Home.module.scss";

const Home = () => {
    const context = useContext(GlobalContext);
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

    const { title, mapTxt, bottomTxt, btnTxt } = 
    (typeof context.store.pages.home !== "undefined") ? context.store.pages.home : "";

    return (
        <Fade in={fadeBg}>
            <section className={classes.HomeSection}>
                <Container>
                    <Grid container direction="row" spacing={2}>
                        <Grid item md={6} className={classes.Left}>
                            <Zoom in={zoomTitle}>
                                <h1>{title}</h1>
                            </Zoom>
                        </Grid>
                        <Grid item md={6} className={classes.Map}>
                            <Zoom in={zoomMap}>
                                <img src="/assets/img/currency_converter_map.png" />
                            </Zoom>
                            <Fade in={fade}>
                                <div>
                                    <h2>150<sup>+</sup></h2>
                                    <h2>{mapTxt}</h2>
                                </div>
                            </Fade>
                        </Grid>
                    </Grid>
                </Container>
                    <div className={classes.Bottom}>
                        <Slide direction="up" in={slide}>
                            <h3>{bottomTxt}</h3>
                        </Slide>
                        <Slide direction="up" in={slideBtn}>
                            <Link
                                variant="contained" 
                                color="primary"
                                to={context.store.nav.homeLink + "convert"}
                                component={Button}
                            >
                                    {btnTxt}
                            </Link>
                        </Slide>
                    </div>
            </section>
        </Fade>
    )
}

export default Home;