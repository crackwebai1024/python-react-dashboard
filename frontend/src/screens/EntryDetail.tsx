import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Timeline, TimelineEvent } from "react-event-timeline";
import usePlaid from "../hooks/usePlaid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import { CardContent } from "@material-ui/core";
import Disqus from "disqus-react";
import styled from "styled-components";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      width: "100%"
    },
    modalContainer: {
      flex: 1
    },
    modalContent: {
      backgroundColor: "#F3F3F3",
      padding: 20
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    actionsContainer: {
      marginBottom: theme.spacing(2)
    },
    resetContainer: {
      padding: theme.spacing(3)
    },
    card: {
      margin: 20
      // justifyContent: "space-between"
    }
  })
);

const FeedItemContainer = styled.div`
  display: block;
  text-align: center;
`;

const CardContentContainer = styled(CardContent)`
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

// const GridContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-left: auto;
//   margin-right: auto;
// `;

// const GridItem = styled.div`
//   flex-direction: column;
//   display: block;
//   margin: 10px;
// `;

function EntryDetail({ modalVisible, handleToggleModal, entryId, props }: any) {
  const classes: any = useStyles(props);
  const [entry, setEntry]: any = React.useState({});
  const [transactions, setTransactions]: any = React.useState();
  const { getEntry }: any = usePlaid();

  const loadEntry = async () => {
    const pulledEntry = await getEntry(entryId);
    setEntry(pulledEntry);
    setTransactions(pulledEntry.transactions);
  };

  React.useEffect(() => {
    loadEntry();
  }, []);

  const getIcon = (category: string) => {
    switch (category) {
      case "Travel":
        return <i className="material-icons md-18">flight_takeoff</i>;
      case "Transfer":
        return <i className="material-icons md-18">compare_arrows</i>;
      case "Food and Drink":
        return <i className="material-icons md-18">fastfood</i>;
      case "Shops":
        return <i className="material-icons md-18">shopping_basket</i>;
      case "Recreation":
        return <i className="material-icons md-18">fitness_center</i>;
      case "Payment":
        return <i className="material-icons md-18">payment</i>;
      default:
        return <i className="material-icons md-18">card_travel</i>;
    }
  };

  const InfoGrid = () => {
    const item = entry;
    return (
      <FeedItemContainer>
        <Card className={classes.card}>
          <CardContentContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                alignSelf: "center",
                alignContent: "center",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  marginLeft: 10,
                  marginRight: 10
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
                  style={{ fontSize: 14, color: "rgba(102, 106, 112, 1)" }}
                >
                  income
                </Typography>
              </div>
              <div
                style={{
                  marginLeft: 10,
                  marginRight: 10
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
                  style={{ fontSize: 14, color: "rgba(102, 106, 112, 1)" }}
                >
                  occupation
                </Typography>
              </div>
              <div
                style={{
                  marginLeft: 10,
                  marginRight: 10
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
                  style={{ fontSize: 14, color: "rgba(102, 106, 112, 1)" }}
                >
                  location
                </Typography>
              </div>
            </div>
          </CardContentContainer>
        </Card>
      </FeedItemContainer>
    );
  };

  const TimelineComponent = () => {
    return (
      <Grid container xs={12} className={classes.modalContent}>
        <Grid item xs>
          <Typography
            style={{ textAlign: "left", marginLeft: 20, marginTop: 20 }}
            variant="h4"
          >
            {entry.title}
          </Typography>
        </Grid>
        <InfoGrid />
        <Grid item xs={12}>
          <Timeline>
            {transactions.map((item: any) => (
              <TimelineEvent
                key={item.id}
                title={item.name}
                subtitle={`$${item.amount}`}
                createdAt={item.date}
                icon={getIcon(item.category)}
              >
                {item.notes}
              </TimelineEvent>
            ))}
          </Timeline>
        </Grid>
        <Grid item xs={12} style={{ margin: 20 }}>
          <CommentComponent />
        </Grid>
      </Grid>
    );
  };

  const CommentComponent = () => {
    const disqusConfig = {
      url: "http://localhost:3000/",
      identifier: entry.id,
      title: entry.title,
      shortName: "smartshare-io"
    };
    return (
      <>
        <Disqus.DiscussionEmbed
          shortname={disqusConfig.shortName}
          config={disqusConfig}
        />
      </>
    );
  };

  return (
    <Dialog
      open={modalVisible}
      onClose={handleToggleModal}
      className={classes.modalContainer}
    >
      <div className={classes.main}>
        {transactions !== undefined ? (
          <TimelineComponent />
        ) : (
          <div style={{ alignSelf: "center", justifyContent: "center" }}>
            <CircularProgress />
          </div>
        )}
      </div>
    </Dialog>
  );
}

export default EntryDetail;
