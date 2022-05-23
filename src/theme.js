import { createMuiTheme } from '@material-ui/core/styles';
import { green, blue, grey } from '@material-ui/core/colors';

// https://www.youtube.com/watch?v=H_PO_GY4xXU
const theme = createMuiTheme({
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
    status: {
        danger: "orange"
    }
});

export default theme;