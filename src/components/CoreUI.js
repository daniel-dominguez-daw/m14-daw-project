import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

// material-ui components
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
}));

function CoreUI(props) {
    const classes = useStyles();
    const { loginHref,
            isLoggedIn,
            title, displayName, avatar, children } = props;

    const [ menuEl, setMenuEl ] = useState(null);
    const open = Boolean(menuEl);

    const handleClick = (e) => {
        setMenuEl(e.currentTarget);
    };

    const handleClose = () => {
        setMenuEl(null);
    };

    // @todo check if you are logged in or not within app state and change UI
    // @todo pull userinfo context
    return (
        <Container maxWidth="lg">
            <AppBar position="static">
                <Toolbar>
                    <IconButton  onClick={handleClick}
                            edge="start" 
                            className={classes.menuButton} 
                            color="inherit" 
                            aria-label="menu">
                        <MenuIcon />
                    </IconButton>
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
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>

                    <Avatar alt={displayName} src={avatar} />

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
            {children}
        </Container>
    );
}

export default CoreUI;
