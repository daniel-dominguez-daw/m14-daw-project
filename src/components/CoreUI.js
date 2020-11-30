import { makeStyles } from '@material-ui/core/styles';

// material-ui components
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Link from '@material-ui/core/Link';

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
    const { loginHref, title, children } = props;

    // @todo check if you are logged in or not within app state and change UI
    return (
        <Container maxWidth="lg">
            <AppBar position="static">
                <Toolbar>
                    <IconButton 
                            edge="start" 
                            className={classes.menuButton} 
                            color="inherit" 
                            aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>
                    <Button color="inherit">
                        <Link href={loginHref}>LOGIN</Link>
                    </Button>
                </Toolbar>
            </AppBar>
            {children}
        </Container>
    );
}

export default CoreUI;
