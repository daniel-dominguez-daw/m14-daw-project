import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

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

import Fade from '@material-ui/core/Fade';
import MenuIcon from '@material-ui/icons/Menu';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';

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
  }
}));

function CoreUI(props) {
    const classes = useStyles();
    const { loginHref,
            isLoggedIn,
            title, displayName, avatar, children } = props;

    const [open, setOpen] = useState(false);

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

    // @todo check if you are logged in or not within app state and change UI
    // @todo pull userinfo context
    return (
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
                            <Avatar className={classes.large} alt={displayName} src={avatar} />
                            <Typography variant="h5">
                                {displayName}
                            </Typography>
                            <Typography variant="h9">
                                { (isLoggedIn === false) ? "Anonymous" : "example@example.com"}
                            </Typography>
                        </Box>
                        { (isLoggedIn === false) ? 
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
                        <List>
                            <ListItem onClick={toggleDrawer(open)} button key={"Home"} component={RouterLink} to="/home">
                                <ListItemIcon><HomeIcon /></ListItemIcon>
                                <ListItemText primary={"Home"} />
                            </ListItem>
                            <ListItem onClick={toggleDrawer(open)} button key={"Profile"} component={RouterLink} to="/profile">
                                <ListItemIcon><ProfileIcon /></ListItemIcon>
                                <ListItemText primary={"Profile"} />
                            </ListItem>
                            <ListItem onClick={toggleDrawer(open)} button key={"Workspaces"} component={RouterLink} to="/workspaces">
                                <ListItemIcon><WorkspacesIcon /></ListItemIcon>
                                <ListItemText primary={"Workspaces"} />
                            </ListItem>
                            <ListItem onClick={toggleDrawer(open)} button key={"Settings"} component={RouterLink} to="/settings">
                                <ListItemIcon><SettingsIcon /></ListItemIcon>
                                <ListItemText primary={"Settings"} />
                            </ListItem>
                        </List>
                        <Divider />
                        <List>
                            <ListItem onClick={toggleDrawer(open)} button key={"Logout"} component={RouterLink} to="/logout">
                                <ListItemIcon><LogoutIcon /></ListItemIcon>
                                <ListItemText primary={"Logout"} />
                            </ListItem>
                        </List>
                        </>
                        }
                        <Divider />
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
                    { (isLoggedIn === false) ? 
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

                <Avatar className={classes.small} alt={displayName} src={avatar} />

                { (isLoggedIn === false) ? 
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
        <Container maxWidth="lg">
            {children}
        </Container>
    </>
    );
}

export default CoreUI;
