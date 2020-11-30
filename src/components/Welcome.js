'use strict' 
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Welcome(props) {
    const { api } = props;
    const { search } = useLocation();
    const getParams = search.replace("?", "").
                        split("&").
                            map(e=> e.split("="));

    useEffect(() => {
        const urlParams = new URLSearchParams(search);
        if(urlParams.has('code')) {
            api.performRequest(
                api.authTokenEndPoint(
                    urlParams.get('code')), 'post');
        }
    }, []);

    return (
        <>
            <p>Your credentials:</p>
            <table>
                {getParams.map(e=> <tr><td>{e[0]}</td><td>{e[1]}</td></tr>)}
            </table>
        </>
    );
}

export default Welcome;
