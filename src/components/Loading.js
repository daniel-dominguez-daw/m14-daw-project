import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '& > *': {
            margin: theme.spacing(1)
        }
    }
}));

function Loading(props) {
    const classes = useStyles();

    const { children, loading, customText } = props;

    const message = (customText !== undefined) ? <Typography variant="h6">{customText}</Typography> : null;

    return (
        <Box className={classes.root}>
            {(loading ? 
                <><CircularProgress />{message}</> :
                children
            )}
        </Box>
    );
}

export default Loading;
