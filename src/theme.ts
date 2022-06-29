import { createTheme } from '@material-ui/core/styles';
import { green, blue, grey } from '@material-ui/core/colors';

const theme = createTheme({
    palette: {
        // type: 'dark',
        // primary: blue,
        primary: {
            main: blue[600]
        },
        // secondary: green
        secondary: {
            main: grey[50],
            dark: grey[200]
        }
    },
});

export default theme;