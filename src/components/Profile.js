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

function Profile(props) {
    const classes = useStyles();
    var data;
    if(props.location.state !== undefined) {
        data = props.location.state;
    }else{
        data = undefined;
    }

    const [name, setName] = useState((data !== undefined) ? data.name : '');
    const [email, setEmail] = useState((data !== undefined) ? data.email : '');
    const [bio, setBio] = useState((data !== undefined) ? data.bio : '');
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [bioError, setBioError] = useState(false);

    const [loading, setLoading] = useState(true);
    const [savedChanges, setSavedChanges] = useState(false);

    const fetchProfileFromAWS = (token, params) => {
        return props.lambdaApi.performRequest('GET', '/user', token, params).then(res => {
            if(res.status === 200) {
                console.log(res.data);
                return res.data;
            }
        }).catch((error) => {
            if(error.response) {
                if(error.response.status === 401) {
                    const msg = `Error: ${JSON.stringify(error.response.data)}`;
                    alert(msg);
                }
            }
            console.log(error);
        });
    };

    const saveProfileIntoDB = () => {
        setLoading(true);
        setTimeout(() => {
            setSavedChanges(true);
            setLoading(false);
        }, 3000);
    };

    // handle change inputs
    const nameChange = (e) => {
        setName(e.target.value);
    };
    const emailChange = (e) => {
        setEmail(e.target.value);
    };
    const bioChange = (e) => {
        setBio(e.target.value);
    };

    const validateState = (callback) => {
        let validates = true;

        const isEmail = email.match(/^.*@.*\..*$/);
        if(!isEmail || email.trim().length === 0){
            setEmailError(true);
            validates = false;
        }else{
            setEmailError(false);
        }

        if(name.length === 0 || name.length > 80) {
            setNameError(true);
            validates = false;
        }else{
            setNameError(false);
        }

        if(bio.length > 200) {
            setBioError(true);
            validates = false;
        }else{
            setBioError(false);
        }

        if(validates) {
            setNameError(false);
            setEmailError(false);
            setBioError(false);
            callback();
        }

    };

    const applyChanges = () => {
        validateState(() => {
            console.log('postvalidate');
            saveProfileIntoDB();
        });
    };

    useEffect(() => {
        const fetchProfile = () => {
            if(data === undefined){
                setLoading(true);

                fetchProfileFromAWS(props.accessToken, {}).then((res)=>{
                    if(res.Count === 1) {
                        setName(res.Items[0].screen_name.S);
                        setEmail(res.Items[0].email.S);
                        setBio(res.Items[0].body.S);
                        setLoading(false);
                    } else {
                        alert("Profile does not exist?");
                    }
                });
            }else{
                setLoading(false);
            }
        };
        fetchProfile();
        //eslint-disable-next-line
    }, []);

    return (
        <>
        <Loading loading={loading}>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField label="Screen Name" variant="outlined" onChange={nameChange} value={name}  error={nameError}/>
                <TextField label="Email" variant="outlined" onChange={emailChange} value={email} error={emailError} />
                <TextField label="Bio" multiline rows={4} variant="outlined" onChange={bioChange} value={bio} error={bioError}/>
                <Button variant="contained" color="primary" onClick={applyChanges}>
                Apply Changes
                </Button>
            </form>
            {savedChanges ? <Typography variant="h5">Changes saved!</Typography> : null }
        </Loading>
        </>
    );
}

export default Profile;
