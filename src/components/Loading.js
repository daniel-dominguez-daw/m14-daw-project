import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

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

    const { children, loading } = props;

    return (
        <Box className={classes.root}>
            {(loading ? 
                <CircularProgress /> :
                children
            )}
        </Box>
    );
}

export default Loading;
