import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useState, useEffect } from 'react';

import Loading from './Loading.js';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        '& > *': {
            margin: theme.spacing(1),
            width: '35ch'
        }
    }
}));

function CreateWorkspaceForm(props) {
    const classes = useStyles();

    const [loading, setLoading] = useState(true);
    const [savedChanges, setSavedChanges] = useState(false);

    useEffect(() => {
        //eslint-disable-next-line
        setTimeout(function() {
            setLoading(false);
        }, 300);
    }, []);

    const createWorkspaceInAWS = () => {
        alert("@todo create Workspace in AWS");
    };

    return (
        <>
        <Loading loading={loading}>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField label="Title" variant="outlined" />
                <TextField label="Subtitle" variant="outlined" />
                <TextField label="Description" multiline rows={4} variant="outlined" />
                <Button variant="contained" color="primary" onClick={()=>{
                    createWorkspaceInAWS();
                    setSavedChanges(true);
                }}>Create</Button>
            </form>
            {savedChanges ? <Typography variant="h5">Changes saved!</Typography> : null }
        </Loading>
        </>
    );
}

export default CreateWorkspaceForm;
