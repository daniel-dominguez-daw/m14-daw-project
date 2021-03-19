import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        '& > *': {
            margin: theme.spacing(1),
            width: '35ch'
        }
    }
}));

function Profile(props) {
    const classes = useStyles();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');

    return (
        <>
        <form className={classes.root} noValidate autoComplete="off">
            <TextField label="Screen Name" variant="outlined"/>
            <TextField label="Email" variant="outlined"/>
            <TextField label="Bio" multiline rows={4} variant="outlined"/>
            <Button variant="contained" color="primary">
            Apply Changes
            </Button>
        </form>
        </>
    );
}

export default Profile;
