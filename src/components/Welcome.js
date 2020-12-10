import { useEffect } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import { UserInfoContext, userInfoDefault } from '../App.js';

const useStyles = makeStyles((theme) => (
    {
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3)
        },
        large: {
            width: theme.spacing(7),
            height: theme.spacing(7)
        }
    }
));
function Welcome(props) {
    const classes = useStyles();

    const { api, handleUserInfo } = props;
    const { search } = useLocation();

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
                        const dataName = JSON.parse(userdata.data.name);
                        let expirationDate = new Date();
                        expirationDate.setSeconds(expirationDate.getSeconds() + data.data.expires_in);
                        const newUserInfo = Object.assign({...userInfoDefault}, {
                            loggedIn: true,
                            name: dataName[0].displayName,
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
                    }, (er) => {
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

    }, []);

    return (
        <>
            <UserInfoContext.Consumer>
                {({loggedIn, email, name, picture}) => (
                    loggedIn ? 
                    <>
                        <Avatar src={picture} alt={name} className={classes.large}/>
                        <p>Welcome {name}!</p>
                        <p>Email: {email}</p>
                    </>
                    :
                    <>
                        <p>user status: Not logged in</p>
                    </>
                )}
            </UserInfoContext.Consumer>
            <Button component={RouterLink} to="/">Go to Homepage</Button>
        </>
    );
}

export default Welcome;
