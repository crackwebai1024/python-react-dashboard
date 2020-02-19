import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
// import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// import CircularProgress from "@material-ui/core/CircularProgress";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
// import WarningIcon from "@material-ui/icons/Warning";
// import useStyles from "./styles";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";

const useStyles = makeStyles({
  MenuItem: {
    fontFamily: "Avenir Next",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dialogTitle: {
    fontFamily: "Avenir Next",
    color: "#f50057",
    fontWeight: "bold",
    padding: 25,
    textAlign: "center"
  },
  dialogContent: {},
  formDialog: {
    justifyContent: "center",
    padding: 50
  },
  progress: {
    padding: 100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  selectCurrency: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "Avenir Next"
  },
  inputLabel: {
    fontFamily: "Avenir Next"
  },
  successIcon: {
    fontSize: 100,
    justifyContent: "center",
    textAlign: "center",
    alignSelf: "center"
  },
  button: {
    textAlign: "center",
    width: "100%",
    marginTop: 30
  }
});

const DialogContainer = styled(Dialog)`
  flex-direction: column;
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

function SuccessModal({ entryId, modalVisible, handleToggleModal }: any) {
  const classes = useStyles();

  const handleNav = async () => {
    return (window.location.href = "/");
  };

  return (
    <DialogContainer open={modalVisible} onClose={handleToggleModal}>
      {/* **** success **** */}
      <DialogTitle className={classes.dialogTitle} id="form-dialog-title">
        Success
      </DialogTitle>
      <CheckCircleIcon
        color="primary"
        fontSize="large"
        className={classes.successIcon}
      />
      <Button onClick={() => handleNav()}>Browse</Button>
      {/* **** error ***** */}
      {/* <DialogContent>
        <Grid container direction="column" alignItems="center" justify="center">
          <Grid item xs={4}>
            <WarningIcon
              fontSize="large"
              color="error"
              className={classes.successIcon}
            />
          </Grid>
        </Grid>
      </DialogContent> */}
    </DialogContainer>
  );
}

export default SuccessModal;
