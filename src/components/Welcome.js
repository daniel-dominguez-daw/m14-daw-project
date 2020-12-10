import { useEffect } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import Button from '@material-ui/core/Link';
import { UserInfoContext, userInfoDefault } from '../App.js';

function Welcome(props) {
    const { api, handleUserInfo } = props;
    const { search } = useLocation();
    /*const getParams = search.replace("?", "")
                        .split("&")
                            .map(e=> e.split("="));
                            */

    // on component mount
    useEffect(() => {
        console.log("effect call on Welcome");
        const urlParams = new URLSearchParams(search);
        if(urlParams.has('code')) {
            var authTokenPromise = api.performRequest(
                api.authTokenEndPoint(
                    urlParams.get('code')), 'post');

            authTokenPromise.then((data) => {
                // onSuccess perform a userInfo request and fill 
                let expirationDate = new Date();
                expirationDate.setSeconds(expirationDate.getSeconds() + data.data.expires_in);
                const newUserInfo = Object.assign({...userInfoDefault}, {
                    loggedIn: true,
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
            {/*getParams.length > 1 ? 
            <>
                <p>Your credentials:</p>
                <table>
                    {getParams.map((e,k)=> <tr key={k}><td>{e[0]}</td><td>{e[1]}</td></tr>)}
                </table>
            </> : null*/}

            <UserInfoContext.Consumer>
                {({loggedIn, name, picture}) => (
                <>
                    <p>This is your user profile</p>
                    <p>user status: {loggedIn ? 'Logged in' : 'Not logged in'}</p>
                    <p>@TODO Fill userInfo below</p>
                    <p>user name: {name ? name : 'Unknown'}</p>
                    <p>picture: {picture}</p>
                </>
                )}
            </UserInfoContext.Consumer>
            <Button component={RouterLink} to="/">Go to Homepage</Button>
        </>
    );
}

export default Welcome;
