import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import usePlaid from "../hooks/usePlaid";
import moment from "moment";
import SuccessModal from "./SuccessModal";
import ReactDOM from "react-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      borderRadius: 25
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    actionsContainer: {
      marginBottom: theme.spacing(2)
    },
    resetContainer: {
      padding: theme.spacing(3),
      borderRadius: 25
    }
  })
);

const StepperView = (props: any) => {
  const classes = useStyles(props);
  const [activeStep, setActiveStep]: any = React.useState(0);
  const [modalVisible, toggleModalVisible] = React.useState(false);
  const [entryId, setEntryId] = React.useState("");

  const handleToggleModal = () => {
    toggleModalVisible(!modalVisible);
  };

  const { submitEntry } = usePlaid();

  const content = props.editorContent;
  const setContent = props.setEditorContent;
  const { title } = props;

  React.useEffect(() => {}, []);

  // const editorContent = props.transactions;
  // get all dates added to editorContent
  const getSteps = () => {
    console.log(props.transactions);
    const categories: any = content.map((i: any) => i.paymentChannel);
    return categories;
  };

  // filter editorContent by editorContent[date]
  const getStepContent = (step: number) => {
    // setFocusedItem(step);

    let name = content[step].name;
    let amount = content[step].amount;
    return name + " " + "$" + amount;
  };

  const getTextContent = (step: number) => {
    // set the index of the item the stepper is focused on so we can edit that entry directly
    return content[step].notes;
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let items = [...content];
    let newItem = { ...items[activeStep] };
    newItem.notes = event.target.value;
    items[activeStep] = newItem;

    setContent(items);
  };

  const handleNext = () => {
    // @ts-ignore
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    // @ts-ignore
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    // show success modal and redirect to entry detail page
    const response: any = await submitEntry(title, content);
    if (response !== undefined) {
      const json = await response.json();
      const entryId = json.entry_id;
      setEntryId(entryId);
    }

    return handleToggleModal();
  };

  const steps = getSteps();

  const StepComponent = (props: any) => {
    const value = props.icon - 1;
    const item = content[value];
    const date = item.date;

    return <div>{moment(date, "YYYY-MM-DD").format("dddd, MMMM Do YYYY")}</div>;
  };

  return (
    <>
      {modalVisible
        ? ReactDOM.createPortal(
            <SuccessModal
              entryId={entryId}
              modalVisible={modalVisible}
              handleToggleModal={handleToggleModal}
            />,
            document.body
          )
        : null}
      {activeStep === steps.length ? (
        <Paper className={classes.resetContainer}>
          <Typography>Are you ready to submit your entry?</Typography>
          <Button
            disabled={content.length < 1}
            onClick={handleSubmit}
            className={classes.button}
          >
            Submit
          </Button>
          <Button onClick={handleBack} className={classes.button}>
            Go back
          </Button>
        </Paper>
      ) : (
        <Stepper
          style={{ borderRadius: 25 }}
          activeStep={activeStep}
          orientation="vertical"
        >
          {steps.map((label: any, index: any) => (
            <Step key={label} id={label}>
              <StepLabel StepIconComponent={StepComponent}>{label}</StepLabel>
              <StepContent>
                <Typography>{getStepContent(index)}</Typography>
                <div className={classes.actionsContainer}>
                  <div>
                    <TextField
                      style={{ width: "100%" }}
                      id="standard-multiline-flexible"
                      label="notes"
                      multiline
                      // rowsMax="4"
                      rows="10"
                      value={getTextContent(index)}
                      onChange={handleTextChange}
                    />
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      )}
    </>
  );
};

export default StepperView;
