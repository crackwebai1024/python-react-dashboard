import { useState } from "react";
import ApiService from "../services/plaid";
import * as _ from "lodash";

const usePlaid = () => {
  const apiService = new ApiService();

  const [storedAccessToken, setStoredAccessToken]: any = useState(false);
  const [transactions, setTransactions]: any = useState([]);
  const [entryList, setEntryList]: any = useState([]);
  const [editorContent, setEditorContent]: any = useState([]);
  const [chartData, setChartData]: any = useState([]);
  const [title, setTitle]: any = useState("");
  const [entry]: any = useState([]);

  async function getEntry(entryId: string) {
    const payload = {
      entry_id: entryId
    };
    const entry: any = await apiService.GetEntry(payload);
    return entry;
  }

  async function getCategories() {
    const transactions: any = await getDefaultCategories();

    const getColor = () => {
      const color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
      return color;
    };

    const mapped = transactions.map((i: any) => ({
      title: i.name,
      value: parseInt(i.amount),
      color: getColor()
    }));

    return setChartData(mapped.slice(0, 5));
  }

  async function getEntries() {
    const entryList: any = await apiService.GetFeed();
    const newest = _.orderBy(entryList, ["date"], ["desc"]);
    return setEntryList(newest);
  }

  async function getPopular() {
    const entryList: any = await apiService.GetFeed();
    const newest = _.orderBy(entryList, ["date"], ["desc"]).reverse();
    return setEntryList(newest);
  }

  async function getUserInfo() {
    const userInfo: any = await apiService.GetUserInfo();
    return userInfo;
  }

  async function submitEntry(title: any, content: any) {
    const payload = {
      title: title,
      transactions: content
    };

    const response = await apiService.CreateEntry(payload);
    return response;
  }

  async function getTransactions() {
    const transactions: any = await apiService.GetTransactions();

    // Group array elements by category
    const groupedCategories = _.chain(transactions)
      .groupBy("name")
      // Key is group name (category), value is array of objects (transactions)
      .map((value, key) => ({
        name: key,
        amount: _.sum(_.map(value, "amount"))
      }))
      .value();

    // Order spending in descending order
    const orderedCategories = _.orderBy(
      groupedCategories,
      ["amount"],
      ["desc"]
    );

    return orderedCategories;
  }

  async function getDefaultCategories() {
    const transactions: any = await apiService.GetCategories();

    // Group array elements by category
    const groupedCategories = _.chain(transactions)
      .groupBy("name")
      // Key is group name (category), value is array of objects (transactions)
      .map((value, key) => ({
        name: key,
        amount: _.sum(_.map(value, "amount"))
      }))
      .value();

    // Order spending in descending order
    const orderedCategories = _.orderBy(
      groupedCategories,
      ["amount"],
      ["desc"]
    );

    return orderedCategories;
  }

  async function handleSuccess(publicToken: string, metadata: any) {
    // TODO: lambda function to exchange token and insert access token into users table
    const response: any = await apiService.TokenExchange(publicToken);
    if (!response) {
      return undefined;
    }

    // Load recent transactions if token exchange succeeds
    setTransactions(response);
    // And update our state so the transaction table is displayed
    return setStoredAccessToken(true);
  }

  async function handleExit() {
    // Do nothing
  }

  return {
    getTransactions,
    handleExit,
    handleSuccess,
    storedAccessToken,
    setStoredAccessToken,
    transactions,
    setTransactions,
    getUserInfo,
    editorContent,
    setEditorContent,
    submitEntry,
    getEntry,
    entry,
    title,
    setTitle,
    entryList,
    setEntryList,
    getEntries,
    getPopular,
    chartData,
    getCategories
  };
};

export default usePlaid;
