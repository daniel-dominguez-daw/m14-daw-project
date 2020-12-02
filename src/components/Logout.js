import { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

function Logout(props) {
    const { handleLogout } = props;
    const history = useHistory();

    var [ loggedOut, setLoggedout ] = useState(false);

    // on Component Mount
    useEffect(()=>{
        setTimeout(function(){
            handleLogout(() => {
                setLoggedout(true);
                setTimeout(() => {
                    history.push("/");
                }, 3000);
            });
        }, 3000);
    },[]); // eslint-disable-next-line

    // @todo pull userInfo context, reset userInfo state after succesfully logingout from Cognito Api
    
    return loggedOut ? 
                <>
                    <p>Logged out successfully</p>
                    <p>Redirecting to Home page in 3 seconds...</p>
                </> :

                <p>Performing logout...</p>
}

export default Logout;
