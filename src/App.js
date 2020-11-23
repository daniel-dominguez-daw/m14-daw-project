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
    useLocation
} from 'react-router-dom';

import AWS from 'aws-sdk';


const DOMAINLOGIN = 'danieldm14.auth.us-east-1.amazoncognito.com';
const LOGINCLIENT = '7tpgrtnd1r2nsej9nt0gg8cj1a';
const LOGINREDIRECT = 'https://jdam14dual.org:3000/welcome/';
const LOGINURL = `https://${DOMAINLOGIN}/login?response_type=token&client_id=${LOGINCLIENT}&redirect_uri=${LOGINREDIRECT}`;

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
    const { hash } = useLocation();
    const hashParams = hash.replace("#", "").split("&").map(e => e.split("="));

    return (
        <>
            <p>Welcome User!</p>
            <p>Your credentials:</p>
            <table>
                {hashParams.map(e=> <tr><td>{e[0]}</td><td>{e[1]}</td></tr>)}
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
