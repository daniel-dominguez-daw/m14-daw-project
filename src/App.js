import './App.css';
import React, { useState, useEffect } from 'react';
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
import Profile from './components/Profile.js';
import Workspaces from './components/Workspaces.js';
import Settings from './components/Settings.js';
import Logout from './components/Logout.js';

import { Oauth2AWSAPI, LambdaAuthorizedApi } from './utils.js';

const userInfoDefault = {
    loggedIn: false,
    email: null,
    name: null,
    picture: null,
    tokens: {
        access: null,
        refresh: null,
        id: null,
        expirationDate: null,
        type: null
    }
};

const UserInfoContext = React.createContext(userInfoDefault);

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

// Lambda backend api
const lambdaApiInstance = new LambdaAuthorizedApi(axios, process.env.REACT_APP_LAMBDA_API_BASE_URL);

const LOGINURL = apiInstance.toURI(
                        apiInstance.authorizationEndPoint(
                          process.env.REACT_APP_COGNITO_AUTH_REDIRECT_URI));

const storage = window.localStorage;
const storageUserInfoKey = 'userInfo';

function App() {
    var storedUser = (storage.getItem(storageUserInfoKey) === null) ? 
                        userInfoDefault : 
                        JSON.parse(storage.getItem(storageUserInfoKey));


    const [userInfo, setUserInfo] = useState(storedUser);

    // when userInfo state changes...
    useEffect(() => {
        storage.setItem('userInfo', JSON.stringify(userInfo));

       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(userInfo), userInfo]);

    const handleUserInfo = (data) => {
        setUserInfo(data);
    };

    // LOGOUT
    const handleLogout = (callback) => {
        storage.clear();
        setUserInfo(userInfoDefault);
        callback();
    };

    var CoreUIprops = {
        loginHref: LOGINURL
    };

    return (
        <UserInfoContext.Provider value={userInfo}>
            <Router>
                <Switch>
                    <Route path="/welcome">
                        <CoreUI {...CoreUIprops} title="Welcome">
                            <Welcome api={apiInstance} 
                                lambdaApi={lambdaApiInstance} 
                                accessToken={userInfo.tokens.access} 
                                handleUserInfo={handleUserInfo}/>
                        </CoreUI>
                    </Route>
                    <Route path="/logout">
                        <CoreUI {...CoreUIprops} title="Logout">
                            <Logout handleLogout={handleLogout} />
                        </CoreUI>
                    </Route>
                    <Route path="/" exact={true}>
                        <CoreUI {...CoreUIprops} title="Home">
                            <Home />
                        </CoreUI>
                    </Route>
                    <Route path="/profile" render={(props) => 
                        <CoreUI {...CoreUIprops} title="Profile">
                            <Profile {...props} />
                        </CoreUI>
                    }>
                    </Route>
                    <Route path="/workspaces">
                        <CoreUI {...CoreUIprops} title="Workspaces">
                            <Workspaces />
                        </CoreUI>
                    </Route>
                    <Route path="/settings">
                        <CoreUI {...CoreUIprops} title="Settings">
                            <Settings />
                        </CoreUI>
                    </Route>
                </Switch>
            </Router>
        </UserInfoContext.Provider>
    );
}

export default App;

export {UserInfoContext, userInfoDefault};




