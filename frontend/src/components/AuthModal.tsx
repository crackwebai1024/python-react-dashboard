import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
// import { ConfigGlobal, ConfigGlobalLoader } from "../config/config";
import { Authenticator } from "aws-amplify-react";

// const configGlobal: ConfigGlobal = ConfigGlobalLoader.config;
const signUpConfig = {
  hiddenDefaults: ["phone_number"],
  signUpFields: [
    {
      label: "Occupation",
      key: "custom:Occupation",
      required: true,
      type: "string",
      custom: true
    },
    {
      label: "Income",
      key: "custom:Income",
      required: true,
      type: "number",
      custom: true
    },
    {
      label: "Location",
      key: "custom:City",
      required: true,
      type: "string",
      custom: true
    }
  ]
};

const handleAuthState = async (authState: any) => {
  switch (authState) {
    case "signedIn":
      return window.location.reload();
    case "signedOut":
      await localStorage.clear();
      return window.location.reload();
    default:
      return;
  }
};

function AuthModal({ authModalVisible, handleToggleAuthModal }: any) {
  return (
    <Dialog open={authModalVisible} onClose={handleToggleAuthModal}>
      <DialogContent
        style={{ padding: 50, alignSelf: "center", justifyContent: "center" }}
      >
        <Authenticator
          hideDefault={false}
          includeGreetings={false}
          signUpConfig={signUpConfig}
          onStateChange={(authState: any) => handleAuthState(authState)}
        ></Authenticator>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
