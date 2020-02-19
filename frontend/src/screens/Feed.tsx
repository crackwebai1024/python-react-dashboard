import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import { CardContent } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import ReactDOM from "react-dom";
import EntryDetail from "./EntryDetail";
import usePlaid from "../hooks/usePlaid";
import Link from "@material-ui/core/Link";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import ChartHeader from "../components/ChartHeader";
import SliderView from "../components/SliderView";
// import Disqus from "disqus-react";

// @ts-ignore
const useStyles = makeStyles({
  navbar: {
    margin: 40,
    fontFamily: "Avenir Next"
  },
  settingsButton: {
    fontFamily: "Avenir Next"
  },
  card: {
    marginBottom: 10
  },
  transactionsHeader: {
    textAlign: "center",
    color: "gray",
    paddingBottom: 25
  },
  emptyTable: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  },
  buttonRow: {
    padding: 20
  },
  cardContent: {
    fontFamily: "Avenir Next"
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center"
  },
  title: {
    fontFamily: "Avenir Next",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center"
  },
  feedContainer: {
    // width: "70%",
    backgroundColor: "#f3f3f3",
    padding: 50
  },
  mainDiv: {},
  cardContentContainer: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  }
});

// const FeedContainer = styled(Grid)`
//   width: 70%;
//   background-color: #f3f3f3;
//   padding: 50px;
//   display: block;
//   margin-left: auto;
//   margin-right: auto;
//   text-align: center;
// `;

// const FeedItemContainer = styled.div``;

// const CardContentContainer = styled(CardContent)`
//   display: block;
//   margin-left: auto;
//   margin-right: auto;
// `;

const TransactionHeader = styled.div`
  text-align: flex-start;
  font-weight: bold;
  font-size: 24px;
  margin: 0px 0px 20px 0px;
`;

const HeaderView = styled(Grid)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FilterView = styled(Link)`
  text-align: flex-end;
  font-weight: bold;
  font-size: 24px;
  margin: 0px 10px 20px 0px;
  color: grey;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const BottomFeeder = styled.div`
  text-align: center;
`;

function Feed({ handleToggleAuthModal }: any) {
  const [modalVisible, toggleModalVisible]: any = React.useState(false);
  const [selectedEntryId, setSelectedEntryId]: any = React.useState("");
  const [selectedSalary, setSelectedSalary]: any = React.useState(0);

  const { getEntries, entryList, getPopular, chartData }: any = usePlaid();

  useEffect(() => {
    getEntries();
  }, [selectedSalary]);

  const handleClick = (item: any) => {
    setSelectedEntryId(item.entry_id);
    handleToggleModal();
  };

  const handleToggleModal = () => {
    toggleModalVisible(!modalVisible);
  };

  const handleSliderChange = (event: any, newValue: any) => {
    return setSelectedSalary(newValue);
  };

  const handleFilter = (filter: string) => {
    switch (filter) {
      case "popular":
        return getPopular();
      case "new":
        return getEntries();
      default:
        break;
    }
  };

  const submissions = entryList;

  const FeedItem = ({ item }: any) => {
    // const disqusConfig = {
    //   url: "http://localhost:3000/",
    //   identifier: item.entry_id,
    //   title: item.title,
    //   shortName: "smartshare-io"
    // };
    return (
      <div key={item.id} onClick={() => handleClick(item)}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <h2
                style={{
                  alignSelf: "flex-start",
                  color: "rgba(183, 26, 26, 1)",
                  marginLeft: 20,
                  marginBottom: 5
                }}
              >
                {item.title}
              </h2>
              {/* <div
                style={{
                  alignSelf: "flex-end",
                  marginBottom: 20,
                  color: "rgba(183, 26, 26, 1)"
                }}
              >
                <Disqus.CommentCount
                  shortname={disqusConfig.shortName}
                  config={disqusConfig}
                />
              </div> */}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignContent: "flex-start"
                // justifyContent: "space-between"
              }}
            >
              <div
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: 5
                }}
              >
                <Typography
                  style={{
                    fontWeight: "bold",

                    color: "rgba(102, 106, 112, 1)"
                  }}
                >
                  ${parseInt(item.income).toLocaleString("en-US")}
                </Typography>
                <Typography
                  style={{
                    fontSize: 14,
                    color: "rgba(102, 106, 112, 1)"
                  }}
                >
                  income
                </Typography>
              </div>
              <div
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: 5
                }}
              >
                <Typography
                  style={{
                    fontWeight: "bold",
                    color: "rgba(102, 106, 112, 1)"
                  }}
                >
                  {item.occupation}
                </Typography>
                <Typography
                  style={{
                    fontSize: 14,
                    color: "rgba(102, 106, 112, 1)"
                  }}
                >
                  occupation
                </Typography>
              </div>
              <div
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: 5
                }}
              >
                <Typography
                  style={{
                    fontWeight: "bold",
                    color: "rgba(102, 106, 112, 1)"
                  }}
                >
                  {item.location}
                </Typography>
                <Typography
                  style={{
                    fontSize: 14,
                    color: "rgba(102, 106, 112, 1)"
                  }}
                >
                  location
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const AnalyticsView = () => {
    const count = 102;
    return (
      <Grid
        style={{
          width: "90%",
          padding: 50,
          marginTop: 50,
          borderRadius: 25,
          backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
        container
      >
        <Grid item xs={12} md={12} lg={12}>
          <Typography
            variant="h4"
            style={{ textAlign: "center", marginBottom: 25 }}
          >
            Salary Data and Spending Trends
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
          <ChartHeader chartData={chartData} />
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
          <SliderView
            selectedSalary={selectedSalary}
            setSelectedSalary={setSelectedSalary}
            handleSliderChange={handleSliderChange}
          />
          <Typography
            variant="subtitle1"
            style={{ textAlign: "center", color: "gray" }}
          >
            Based on {count} salaries
          </Typography>
          <Button
            style={{
              width: "90%",
              margin: 25,
              padding: 15,
              borderRadius: 15,
              borderWidth: 5,
              justifyContent: "center",
              borderColor: "black"
            }}
            onClick={handleToggleAuthModal}
            variant="contained"
            color="secondary"
          >
            See how you compare
          </Button>
        </Grid>
      </Grid>
    );
  };

  const classes = useStyles();
  return (
    <Grid style={{ alignSelf: "center", justifyContent: "center" }} container>
      <AnalyticsView />
      {modalVisible
        ? ReactDOM.createPortal(
            <EntryDetail
              entryId={selectedEntryId}
              modalVisible={modalVisible}
              handleToggleModal={handleToggleModal}
            />,
            document.body
          )
        : null}
      <Grid item className={classes.feedContainer} xs={8} md={8} lg={8}>
        <HeaderView spacing={3}>
          <TransactionHeader>Today</TransactionHeader>
          <FilterContainer>
            <FilterView onClick={() => handleFilter("popular")}>
              Popular
            </FilterView>
            <FilterView>|</FilterView>
            <FilterView onClick={() => handleFilter("new")}>Newest</FilterView>
          </FilterContainer>
        </HeaderView>
        {submissions.map((item: any) => (
          <FeedItem item={item} id={item.entry_id} key={item.entry_id} />
        ))}
        <BottomFeeder>
          <Button
            style={{
              margin: 25,
              padding: 15,
              borderRadius: 15,
              borderWidth: 5,
              borderColor: "black"
            }}
            onClick={handleToggleAuthModal}
            variant="contained"
            color="secondary"
          >
            See how you compare
          </Button>

          {/* <Link
            onClick={() => (window.location.href = "http://elimernit.com")}
            style={{}}
          >
            made by smartshare in NYC
          </Link> */}

          <Typography
            onClick={() => (window.location.href = "http://elimernit.com")}
            style={{}}
          >
            made by smartshare in NYC 👋
          </Typography>
        </BottomFeeder>
      </Grid>
    </Grid>
  );
}

export default Feed;
