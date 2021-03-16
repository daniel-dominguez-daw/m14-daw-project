import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {UserInfoContext} from '../App.js';

// material-ui components
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// icons
import ForwardIcon from '@material-ui/icons/Forward';
import HomeIcon from '@material-ui/icons/Home';
import ProfileIcon from '@material-ui/icons/AccountBox';
import WorkspacesIcon from '@material-ui/icons/AccountTree';
import SettingsIcon from '@material-ui/icons/Settings';
import LogoutIcon from '@material-ui/icons/ExitToApp';

/*
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
*/

import MenuIcon from '@material-ui/icons/Menu';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, useLocation } from 'react-router-dom';

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
  list: {
      width: 280
  },
  small: {
      width: theme.spacing(6),
      height: theme.spacing(6)
  },
  large: {
      width: theme.spacing(14),
      height: theme.spacing(14)
  },
  textSmall: {
      fontSize: '80%'
  }
}));

function CoreUI(props) {
    const classes = useStyles();
    const { loginHref,
            title, children } = props;

    const [open, setOpen] = useState(false);
    const loc = useLocation();
    /*
    const [ menuEl, setMenuEl ] = useState(null);
    const open = Boolean(menuEl);

    const handleClick = (e) => {
        setMenuEl(e.currentTarget);
    };

    const handleClose = () => {
        setMenuEl(null);
    };
    */

    const toggleDrawer = (open) => (e) => { console.log('toggleDrawer');
        if(e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
            return;
        }

        setOpen(!open);
    };

    const renderListItems = (pathname, itemList) => {
        const items = itemList.map(item => {
            const {to, icon, text} = item;

            return (
                <ListItem onClick={toggleDrawer(open)}
                        button 
                        key={to} 
                        component={RouterLink} 
                        to={to}
                        selected={(to === pathname)}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                </ListItem>
            );
        });

        return (
            <List>
                {items}
            </List>
        );

    };

    // @todo check if you are logged in or not within app state and change UI
    // @todo pull userinfo context
    return (
        <UserInfoContext.Consumer>
            {({loggedIn, email, name, picture}) => (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton onClick={toggleDrawer(open)}
                            edge="start" 
                            className={classes.menuButton} 
                            color="inherit" 
                            aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Drawer anchor="left" open={open} onClose={toggleDrawer(open)} >
                        <div className={classes.list}
                             role="presentation"
                        >
                            <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" m={2} p={2}>
                                <Avatar className={classes.large} alt={name} src={picture} />
                                <Typography variant="h5">
                                    {name}
                                </Typography>
                                <Typography className={classes.textSmall} variant="h6">
                                    { (loggedIn === false) ? "Anonymous" : email }
                                </Typography>
                            </Box>
                            { (loggedIn === false) ? 
                                <List>
                                    <Link href={loginHref}>
                                        <ListItem button key={"LOGIN"}>
                                            <ListItemIcon><ForwardIcon /></ListItemIcon>
                                            <ListItemText primary={"LOGIN"} />
                                        </ListItem>
                                    </Link>
                                </List>
                            :
                            <>
                            <Divider />
                            {renderListItems(loc.pathname, [
                                {
                                    to: '/',
                                    text: 'Home',
                                    icon: <HomeIcon />
                                },
                                {
                                    to: '/profile',
                                    text: 'Profile',
                                    icon: <ProfileIcon />
                                },
                                {
                                    to: '/workspaces',
                                    text: 'Workspaces',
                                    icon: <WorkspacesIcon />
                                },
                                {
                                    to: '/settings',
                                    text: 'Settings',
                                    icon: <SettingsIcon />
                                }
                            ])}
                            <Divider />
                            {renderListItems(loc.pathname, [
                                {
                                    to: '/logout',
                                    text: 'Logout',
                                    icon: <LogoutIcon />
                                }
                            ])}
                            </>
                            }
                        </div>
                    </Drawer>
                    {/*
                    <Menu
                        id="fade-menu"
                        anchorEl={menuEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={handleClose} component={RouterLink} to="/">Home page</MenuItem>
                        <MenuItem onClick={handleClose} component={RouterLink} to="/welcome">Profile</MenuItem>
                        { (loggedIn === false) ? 
                        <MenuItem color="inherit">
                            <Link href={loginHref} color="inherit">Login</Link>
                        </MenuItem>
                            :
                        <MenuItem onClick={handleClose} component={RouterLink} to="/logout">Logout</MenuItem>
                        }
                        <MenuItem onClick={handleClose}>CLOSE</MenuItem>
                    </Menu>
                    */}
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>

                    <Avatar className={classes.small} alt={name} src={picture} />

                    { (loggedIn === false) ? 
                    <Button color="inherit">
                        <Link href={loginHref} color="inherit">LOGIN</Link>
                    </Button>
                    :
                    <Button component={RouterLink} to="/logout" color="inherit">
                        LOGOUT
                    </Button>
                    }
                </Toolbar>
            </AppBar>
            <Container component="main" maxWidth="lg">
                {children}
            </Container>
        </>
            )}
        </UserInfoContext.Consumer>
    );
}

export default CoreUI;
