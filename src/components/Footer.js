import React, {useContext} from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Container, Grid } from '@material-ui/core';

const Footer = () => {
    const {store} = useContext(GlobalContext);
    const content = store.footer;
    const year = new Date().getFullYear();
    return (
        <>
            <footer className="footer">
                <Container>
                    <Grid container>
                        <Grid item xs={6}>
                            {content.copy} {year}
                            . <a 
                                href={content.website} 
                                target="_blank" 
                                rel="noopener noreferrer">
                                    {content.ownerName}</a>
                        </Grid>
                        <Grid item style={{flexGrow: 1}}></Grid>
                        <Grid item>
                            {content.copyDesc}
                        </Grid>
                    </Grid>
                </Container>
            </footer>
        </>
    )
}

export default Footer;
