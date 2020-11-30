import './App.css';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

// Libs
import axios from 'axios'; // ajax library

// Components
import CoreUI from './components/CoreUI.js';
import Welcome from './components/Welcome.js';
import Home from './components/Home.js';
import Logout from './components/Logout.js';

import { Oauth2AWSAPI } from './utils.js';

// import AWS from 'aws-sdk';
/* 
    // Not required at the moment because we implemented our own sdk for auth but keep it here
    // Initialize the Amazon Cognito credentials provider
    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:fce607c9-d20b-4996-8ae7-4f059054cfdd',
    });
*/

// Initialize cognito auth api instance
const apiInstance = new Oauth2AWSAPI(axios, 
                    process.env.REACT_APP_COGNITO_AUTH_API_BASE_URI, 
                    process.env.REACT_APP_COGNITO_CLIENT_ID,
                    process.env.REACT_APP_COGNITO_CLIENT_SECRET);

const LOGINURL = apiInstance.toURI(
                        apiInstance.authorizationEndPoint(
                          process.env.REACT_APP_COGNITO_AUTH_REDIRECT_URI));

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/welcome/">
                    <CoreUI loginHref={LOGINURL} title="Welcome">
                        <Welcome api={apiInstance} />
                    </CoreUI>
                </Route>
                <Route path="/logout/">
                    <CoreUI loginHref={LOGINURL} title="Logout">
                        <Logout />
                    </CoreUI>
                </Route>
                <Route path="/">
                    <CoreUI loginHref={LOGINURL} title="Home">
                        <Home loginHref={LOGINURL}/>
                    </CoreUI>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
