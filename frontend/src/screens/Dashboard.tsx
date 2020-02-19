import React, { useReducer, useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { Route } from "react-router-dom";
import CreateEntry from "./CreateEntry";
import LinkModal from "../components/LinkModal";
import AuthModal from "../components/AuthModal";
import ReactDOM from "react-dom";
// import usePlaid from "../hooks/usePlaid";
import Feed from "./Feed";
import NavBar from "../components/NavBar";
import { AppContext } from "../store/AppContext";
import { MainReducer } from "../store/Reducer";
import { Auth } from "aws-amplify";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  image: {
    width: "50%",
    alignItems: "center"
  },
  footerContainer: {
    bottom: 0,
    position: "fixed",
    backgroundColor: "black",
    height: 100,
    width: "110%",
    display: "flex",
    flexDirection: "column"
  },
  rootView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  toolbar: {
    //
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

function Dashboard(props: any) {
  const classes = useStyles(props);
  const [modalVisible, toggleModalVisible] = useState(false);
  const [authModalVisible, toggleAuthModalVisible] = useState(false);

  const initialState = useContext(AppContext);
  // @ts-ignore
  const [state, dispatch] = useReducer(MainReducer, initialState);

  React.useEffect(() => {}, []);

  const handleToggleModal = () => {
    toggleModalVisible(!modalVisible);
  };

  const handleToggleAuthModal = () => {
    toggleAuthModalVisible(!authModalVisible);
  };

  const PrivateRoute = ({ component: Component, ...rest }: any) => {
    const [auth, setAuth]: any = useState(true);
    const checkAuth = async () => {
      try {
        const response = await Auth.currentAuthenticatedUser();
        const token = response.signInUserSession.idToken.jwtToken;
        if (token !== undefined) {
          return setAuth(true);
        }
      } catch (error) {
        return setAuth(false);
      }
    };

    useEffect(() => {
      checkAuth();
    }, [auth]);

    return (
      <Route
        {...rest}
        render={props =>
          auth ? (
            <CreateEntry />
          ) : (
            <Redirect
              to={{
                pathname: "/"
              }}
            />
          )
        }
      />
    );
  };

  return (
    <div style={{ backgroundColor: "#F3F3F3" }}>
      <NavBar
        modalVisible={modalVisible}
        authModalVisible={authModalVisible}
        handleToggleModal={handleToggleModal}
        handleToggleAuthModal={handleToggleAuthModal}
      />
      <div className={classes.rootView}>
        {modalVisible
          ? ReactDOM.createPortal(
              <LinkModal
                modalVisible={modalVisible}
                handleToggleModal={handleToggleModal}
              />,
              document.body
            )
          : null}
        {authModalVisible
          ? ReactDOM.createPortal(
              <AuthModal
                authModalVisible={authModalVisible}
                handleToggleAuthModal={handleToggleAuthModal}
              />,
              document.body
            )
          : null}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Router>
            <Switch>
              <Route
                path="/"
                exact={true}
                strict={true}
                render={props => (
                  <Feed handleToggleAuthModal={handleToggleAuthModal} />
                )}
              />
              <PrivateRoute path="/editor" component={PrivateRoute} />
            </Switch>
          </Router>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
