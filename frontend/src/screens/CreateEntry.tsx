import * as React from "react";
import { useState } from "react";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import usePlaid from "../hooks/usePlaid";
import StepperView from "../components/StepperView";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LinkModal from "../components/LinkModal";
import ReactDOM from "react-dom";
import styled from "styled-components";

const MainContainer = styled(Grid)`
  width: 80%;
  background-color: #f3f3f3;
  padding: 25px;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  marginbottom: 25px;
`;

const StepperContainer = styled(Grid)``;

const CreateEntry = (props: any) => {
  const [tableData, setTableData]: Array<any> = useState([]);
  // @ts-ignore
  const [selected, setSelected]: Array<any> = useState();
  const [modalVisible, toggleModalVisible] = React.useState(false);

  const {
    editorContent,
    setEditorContent,
    title,
    setTitle,
    getUserInfo,
    getTransactions
  }: any = usePlaid();

  const loadTransactions = async () => {
    const transactions = await getTransactions();
    return setTableData(transactions);
  };

  React.useEffect(() => {
    loadTransactions();
  }, []);

  const columns = [
    { title: "Date", field: "date" },
    { title: "Name", field: "name" },
    {
      title: "Category",
      field: "category"
    },
    { title: "Amount", field: "amount" }
  ];

  const handleSelected = (rows: any) => {
    const mappedRows: any = rows.map((i: any) => {
      return {
        name: i.name,
        date: i.date,
        amount: i.amount,
        category: i.category[0],
        notes: "",
        payment_channel: i.payment_channel
      };
    });

    const arr = [];
    arr.push(...mappedRows);

    setTitle(title);
    setEditorContent(arr);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleToggleModal = async () => {
    const userInfo = await getUserInfo();
    // show the link modal if the user has not connected plaid
    if (userInfo.plaid_token === null) {
      return toggleModalVisible(true);
    }
    toggleModalVisible(!modalVisible);
  };

  return (
    <MainContainer container spacing={3}>
      {modalVisible
        ? ReactDOM.createPortal(
            <LinkModal
              modalVisible={modalVisible}
              handleToggleModal={handleToggleModal}
            />,
            document.body
          )
        : null}
      <Grid item xs={12}>
        <Typography variant="h4" style={{ marginBottom: 30 }}>
          Create a new entry
        </Typography>
        <Typography variant="h6" style={{ marginBottom: 30, color: "gray" }}>
          Select your transactions on the left, and add notes on the right!
        </Typography>
        <FormControl
          style={{
            alignSelf: "center",
            alignContent: "center",
            justifyContent: "center",
            width: "75%",
            backgroundColor: "white"
          }}
        >
          <TextField
            value={title}
            onChange={handleTitleChange}
            id="standard-read-only-input"
            label="enter a title for your entry"
            variant="outlined"
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <MaterialTable
          style={{ borderRadius: 20, padding: 25 }}
          localization={{
            body: {
              editRow: {
                deleteText: "Are you sure?"
              }
            }
          }}
          // loading={loading}
          columns={columns}
          title=""
          data={tableData}
          options={{
            selection: true
          }}
          onSelectionChange={rows => handleSelected(rows)}
        />
      </Grid>
      <StepperContainer item xs={6}>
        <StepperView
          title={title}
          setTitle={title}
          editorContent={editorContent}
          setEditorContent={setEditorContent}
        />
      </StepperContainer>
    </MainContainer>
  );
};

export default CreateEntry;
