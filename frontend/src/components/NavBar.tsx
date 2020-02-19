import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { Auth } from "aws-amplify";

const useStyles = makeStyles({
  navContainer: {
    // flexGrow: 1
  },
  menuButton: {},
  title: {
    flexGrow: 1
  }
});

export default function NavBar({
  handleToggleModal,
  modalVisible,
  handleToggleAuthModal
}: any) {
  const classes = useStyles();
  const [currentUser, setCurrentUser] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = async () => {
    await Auth.signOut();
    await localStorage.clear();
    return (window.location.href = "/");
  };

  const handleNav = () => {
    return (window.location.href = "/editor");
  };

  const handleBrowse = () => {
    return (window.location.href = "/");
  };

  const handleBankLink = async () => {
    handleToggleModal(!modalVisible);
    setAnchorEl(null);
  };

  const getCurrentUser = async () => {
    let userInfo = await Auth.currentUserInfo();
    setCurrentUser(userInfo);
  };

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <Grid container xs={12} style={{ width: "100%", marginBottom: 25 }}>
      <AppBar
        position="fixed"
        style={{
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
          // background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            className={classes.title}
            onClick={() => (window.location.href = "/")}
          >
            peerspend 💸
          </Typography>
          <Hidden mdDown smDown xsDown>
            <Typography variant="h6" className={classes.title}>
              see what they're earning, what they're spending, and how you
              compare
            </Typography>
          </Hidden>
          {currentUser ? (
            <div>
              <Button color="inherit" onClick={handleBrowse}>
                Browse
              </Button>
              <Button color="inherit" onClick={handleNav}>
                Submit
              </Button>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleBankLink}>Connect Bank</MenuItem>
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </Menu>
            </div>
          ) : (
            <div>
              <Button color="inherit" onClick={handleToggleAuthModal}>
                LOG IN
              </Button>
              <Button color="inherit" onClick={handleToggleAuthModal}>
                SIGN UP
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Grid>
  );
}
