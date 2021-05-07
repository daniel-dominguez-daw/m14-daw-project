import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';

// MaterialUI
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

import Loading from './Loading.js';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: '35ch'
    },
    padded: {
        margin: '2em 0'
    },
    buttons: {
        margin: '1em 0'
    },
    m1h: {
        margin: '0 0.5em'
    },
    flex: {
        display: 'flex'
    }
}));

function Workspaces(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [joinWorkspace, setJoinWorkspace] = useState(false);
    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState(false);
    const [workspaces, setWorkspaces] = useState([]);

    useEffect(() => {
        getWorkspacesFromAWS();
        //eslint-disable-next-line
    }, []);

    const getWorkspacesFromAWS = () => {

        // Mock function, this should be an array of workspaces 
        setTimeout(() => {
            setWorkspaces([1, 2, 3]);
            setLoading(false);
        }, 3000); // 3 seconds delay for loading
    };

    const renderWorkspaces = (workspacesJSON) => {
        if (workspacesJSON.length === 0) {
            return (
                <Typography className={classes.padded} variant="body2" color="textSecondary" component="p">
                    You don't have workspaces assigned to your account.
                </Typography>
            );
        }

        // grids contains each Card Item wrapped with a Grid MUI Component
        const grids = workspacesJSON.map(e => (
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="workspace">
                                    W
                                    </Avatar>
                                }
                                title="Workspace Title"
                                subheader="Workspace subheader"
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam bibendum tempus. Ut ac quam leo. Pellentesque eleifend fermentum dolor, vel commodo ipsum pulvinar et. Suspendisse molestie posuere erat, dapibus euismod odio fringilla nec. Vivamus vel turpis a eros malesuada fringilla. Nunc semper neque purus, et finibus massa sollicitudin at.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" color="primary">Open Workspace</Button>
                            </CardActions>
                        </Card>
                    </Grid>
        ));

        return (
            <Grid container spacing={4}>
                {grids}
            </Grid>
        );
    };

    /**
     * Handle state code change (input bound)
     */
    const workSpaceCodeOnChange = (e) => {
        setCode(e.target.value);
        setCodeError(! validateCode(e.target.value));
    };

    /**
     * Validates the code
     * @param code String
     * @returns Boolean
     */
    const validateCode = (code) => {
        return (code.length) !== 32 ? false : true;
    };

    return (
        <>
        <Loading loading={loading}>
            <Box className={classes.root} spacing={3}>
                <RouterLink
                  className={classes.buttons}
                  component={Button}
                  color="secondary"
                  variant="contained"
                    startIcon={<AddCircleIcon />}
                  to="/workspaces/create"
                  onClick={() => {
                    console.info("I'm a button.");
                  }}
                >
                  CREATE
                </RouterLink>
                <Button
                  className={classes.buttons}
                  color="primary"
                  variant="contained"
                  startIcon={<ArrowForwardIcon />}
                  onClick={() => {
                      setJoinWorkspace(true);
                  }}
                >JOIN WORKSPACE</Button>
                {joinWorkspace ? 
                <form className={classes.flex} noValidate autoComplete="off">
                    <TextField 
                      label="Workspace Code" 
                      value={code} 
                      onChange={workSpaceCodeOnChange} 
                      variant="outlined" 
                      error={codeError}
                      helperText={codeError ? 'Not a valid code' : ''}
                    />
                    <Button
                      className={classes.m1h}
                      variant="contained"
                      onClick={() => {
                          if (codeError) return;
                          alert("@todo add workspace into your user");
                      }}
                    >Go</Button>
                </form> : null}
                {renderWorkspaces(workspaces)}
            </Box>
        </Loading>
        </>
    );
}

export default Workspaces;
