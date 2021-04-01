import { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { UserInfoContext, userInfoDefault } from '../App.js';

import Loading from './Loading.js';

const useStyles = makeStyles((theme) => (
    {
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        },
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3)
        },
        large: {
            width: theme.spacing(14),
            height: theme.spacing(14)
        }
    }
));
function Welcome(props) {
    const classes = useStyles();

    const { api, lambdaApi, handleUserInfo, accessToken } = props;
    const { search } = useLocation();
    var [loading, setLoading] = useState(true);

    // on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(search);
        if(urlParams.has('code')) {
            var authTokenPromise = api.performRequest(
                api.authTokenEndPoint(
                    urlParams.get('code')), 'post');

            authTokenPromise.then((data) => {

                // onSuccess perform a userInfo request and fill 
                api.performRequest(
                    api.userInfoEndPoint(data.data.access_token), 'get')
                    .then((userdata) => {
                        const dataName = userdata.data.name;
                        let expirationDate = new Date();
                        expirationDate.setSeconds(expirationDate.getSeconds() + data.data.expires_in);
                        const newUserInfo = Object.assign({...userInfoDefault}, {
                            loggedIn: true,
                            name: dataName,
                            email: userdata.data.email,
                            picture: userdata.data.picture,
                            tokens: {
                                access: data.data.access_token,
                                refresh: data.data.refresh_token,
                                id: data.data.id_token,
                                expirationDate: Math.round(expirationDate.getTime() / 1000),
                                type: data.data.token_type
                            }
                        });

                        handleUserInfo(newUserInfo);
                        setTimeout(() => setLoading(false), 3000);
                    }, (er) => {
                        console.log('ERROR');
                        // handle userInfo api errors
                        // invalid token or wrong request
                    });
            }, (er) => {
                // Probably code token not valid anymore or service unavalable
                /*alert("Error Logging Out");

                const newUserInfo = Object.assign({}, userInfoDefault);

                handleUserInfo(newUserInfo);
                */
            });
        }
// eslint-disable-next-line
    }, []);

    /**
     *
     * This function tests our AWS Api Gateway Moodly REST
     * by calling the /helloWorld end point
     *
     * all requests using lambdaApi require to be Authorized (logged in and tokens unexpired)
     * An Authorization header must be send:
     * Authorization: Bearer tokenhere
     *
     * this is handled by lambdaApi itself
     */
    const helloWorldApiCall = () => {
        lambdaApi.performRequest('GET', '/helloWorld', accessToken).then(res => {
            if(res.status === 200) {
                alert(res.data);
            }
        }).catch((error) => {
            if(error.response) {
                if(error.response.status === 401) {
                    const msg = `Error: ${JSON.stringify(error.response.data)}
                    You are not loggedIn or your tokens are not valid anymore
                    @todo: call to refresh token oauth api and retry Request
                    @todo: force logout and go to login page again if you can't refresh the token anymore
                    `;

                    alert(msg);
                }
            }
            console.log(error);
        });
    };

    return (
        <div className={classes.root}>
            <UserInfoContext.Consumer>
                {({loggedIn, email, name, picture}) => (
                    loggedIn ? 
                    <>
                        <Avatar src={picture} alt={name} className={classes.large}/>
                        <p>Welcome {name}!</p>
                    </>
                    :
                    <>
                        <p>user status: Not logged in</p>
                    </>
                )}
            </UserInfoContext.Consumer>

            <Loading loading={loading} customText="Checking Moodly account...">
        {/*
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center">

                    <Button variant="contained" color="primary" onClick={helloWorldApiCall}>TEST LAMBDA AUTHORIZED API</Button>
                    <Button variant="contained" component={RouterLink} to="/">Go to Homepage</Button>
                </Grid>
                */}
                <Redirect to={{ 
                    pathname: '/profile', 
                    state: {name: 'FromWelcomePage',
                            email: 'from@welcome.pg',
                            bio: 'This data is coming from the Welcome Component'
                    }}
                } />
            </Loading>
        </div>
    );
}

export default Welcome;
