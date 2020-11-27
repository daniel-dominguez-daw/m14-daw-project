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


const DOMAINLOGIN = 'https://danieldm14.auth.us-east-1.amazoncognito.com/';
const APPCLIENT = '7tpgrtnd1r2nsej9nt0gg8cj1a';
const LOGINREDIRECT = 'https://jdam14dual.org:3000/welcome/';
const APPSECRET = '167m23isdch0ovhf0hfo64k491rah95mqtrng0aqud9f19e3gc4t';
//const LOGINURL = `https://${DOMAINLOGIN}/login?response_type=code&client_id=${APPCLIENT}&redirect_uri=${LOGINREDIRECT}`;

class Oauth2AWSAPI {
    constructor(axiosInstance, baseApi, client){
        this.axios = axiosInstance;
        this.baseApi = baseApi;
        this.client = client;
    }

    authorizationEndPoint(redirectUri){
        const params = {
            response_type: 'code',
            client_id: this.client,
            redirect_uri: redirectUri,
            state: 'asdf',
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
            'Authorization': 'Basic '+ btoa(APPCLIENT + ":" + APPSECRET),
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        

        const params = {
            'grant_type': 'authorization_code',
            'code': codeGrant,
            'redirect_uri' : LOGINREDIRECT,
            'client_id': APPCLIENT
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

    toGetUri(arr){
        const params = [];
        let pair;
        for(let x in arr[1]) {
            pair = x + '=' + arr[1][x];
            params.push(pair);
        }

        return arr[0] + '?' + params.join("&");
    }
}

const api = new Oauth2AWSAPI(axios, DOMAINLOGIN, APPCLIENT);
const LOGINURL = api.toGetUri(api.authorizationEndPoint(LOGINREDIRECT));

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
