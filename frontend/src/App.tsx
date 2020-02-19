import React, { useReducer, useContext, useEffect } from "react";
import { AppContext } from "./store/AppContext";
import { MainReducer } from "./store/Reducer";
import Dashboard from "./screens/Dashboard";
import Amplify, { Auth } from "aws-amplify";
import { createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(",")
  }
});

Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_vJmNossoP",
    userPoolWebClientId: "fkml7i6tnn4o54j4kb8bi2bq3"
  }
});

function App() {
  const initialState = useContext(AppContext);
  const [state, dispatch] = useReducer(MainReducer, initialState);
  const value = { state, dispatch };

  const checkAuth = async () => {
    try {
      const auth = await Auth.currentAuthenticatedUser();
      if (auth.signInUserSession !== undefined) {
        await localStorage.setItem(
          "accessToken",
          auth.signInUserSession.idToken.jwtToken
        );
        await dispatch({
          type: "USER_LOGGED_IN",
          payload: {
            accessToken: auth.signInUserSession.idToken.jwtToken
          }
        });
      }
    } catch (error) {
      return false;
    }
    return;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    // @ts-ignore
    <AppContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <AppContext.Consumer>
          {(context: any) => <Dashboard />}
        </AppContext.Consumer>
      </MuiThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
