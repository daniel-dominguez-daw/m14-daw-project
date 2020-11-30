import logo from './logo.svg';
import './App.css';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Link from '@material-ui/core/Link';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link as RLink,
    useLocation,
    useParams
} from 'react-router-dom';

import {useState, useEffect } from 'react';
import axios from 'axios';

import AWS from 'aws-sdk';

class Oauth2AWSAPI {
    constructor(axiosInstance, baseApi, client, secret){
        this.axios = axiosInstance;
        this.baseApi = baseApi;
        this.client = client;
        this.secret = secret;
    }

    authorizationEndPoint(redirectUri){
        const params = {
            response_type: 'code',
            client_id: this.client,
            redirect_uri: redirectUri,
            state: 'asdf', // security
            identity_provider: 'Google'
        };

        const uri = this.baseApi + 'oauth2/authorize';
        return [uri, params];
    }

    authTokenEndPoint(codeGrant){
        /*
        Content-Type
        Must always be 'application/x-www-form-urlencoded'.
        */
        const headers = {
            'Authorization': 'Basic '+ btoa(this.client + ":" + this.secret),
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        

        const params = {
            'grant_type': 'authorization_code',
            'code': codeGrant,
            'redirect_uri' : process.env.REACT_APP_COGNITO_AUTH_REDIRECT_URI,
            'client_id': this.client
        };
        const uri = this.baseApi + 'oauth2/token';
        return [uri, params, headers];
    }

    performRequest(data, method) {
        console.log("BLARG");
        console.log(data[1]);

        let obj = {
            method: method,
            url: data[0],
            data: data[1],
            transformRequest: (data, headers) => {
                let str = [];
                for( let x in data) {
                    str.push(x + '=' + encodeURIComponent(data[x]));
                }
                return str.join("&");
            }

        };

        if(data[2] !== undefined) {
            obj.headers = data[2];
        }

        console.log(obj.headers);

        this.axios(
            obj
        );
    }

    toURI(arr){
        const params = [];
        let pair;
        for(let x in arr[1]) {
            pair = x + '=' + arr[1][x];
            params.push(pair);
        }

        return arr[0] + '?' + params.join("&");
    }
}

const api = new Oauth2AWSAPI(axios, 
                    process.env.REACT_APP_COGNITO_AUTH_API_BASE_URI, 
                    process.env.REACT_APP_COGNITO_CLIENT_ID,
                    process.env.REACT_APP_COGNITO_CLIENT_SECRET);

const LOGINURL = api.toURI(api.authorizationEndPoint(process.env.REACT_APP_COGNITO_AUTH_REDIRECT_URI));

// Initialize the Amazon Cognito credentials provider

AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:fce607c9-d20b-4996-8ae7-4f059054cfdd',
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Welcome(props) {
    const { search } = useLocation();
    const getParams = search.replace("?", "").
                        split("&").
                            map(e=> e.split("="));
    //const hashParams = hash.replace("#", "").split("&").map(e => e.split("="));
    // On component mount check if we have code GET param in url and set is as an authCode state
    useEffect(() => {
        const urlParams = new URLSearchParams(search);
        if(urlParams.has('code')) {
            console.log('CODE: ' + urlParams.get('code'));

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

function Logout() {
    return (
        <p>You have been logged out</p>
    );
}

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/welcome/">
                    <Welcome />
                </Route>
                <Route path="/logout/">
                    <Logout />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
}

function Home() {
  const classes = useStyles();
  return (
      <Container maxWidth="sm">
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                News
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
        
        <Link href={LOGINURL}>LOGIN</Link>
      </Container>
  );
}

export default App;
