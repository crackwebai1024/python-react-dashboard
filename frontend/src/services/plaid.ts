import * as _ from "lodash";
import * as HttpStatus from "http-status-codes";
import { Auth } from "aws-amplify";

export default class ApiService {
  public _requestSucceeded(responseStatus: number) {
    let requestSucceeded: boolean = true;
    switch (responseStatus) {
      case HttpStatus.OK:
      case HttpStatus.CREATED:
        break;
      default:
        requestSucceeded = false;
    }
    return requestSucceeded;
  }

  public async GetAuth() {
    try {
      const response = await Auth.currentAuthenticatedUser();
      const token = response.signInUserSession.idToken.jwtToken;
      return token;
    } catch (error) {
      return false;
    }
  }

  public async TokenExchange(publicToken: string) {
    const authToken: any = await this.GetAuth();

    const url =
      "https://7o4jd3o0b1.execute-api.us-east-1.amazonaws.com/dev/plaid_link";

    const body = {
      public_token: publicToken
    };

    let response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(body)
    });

    const json = await response.json();
    console.log("json", json);
  }

  public async CreateEntry(payload: any) {
    const authToken: any = await this.GetAuth();

    const url =
      "https://7o4jd3o0b1.execute-api.us-east-1.amazonaws.com/dev/create_entry";

    let response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    let requestSucceeded = this._requestSucceeded(response.status);
    if (!requestSucceeded) {
      return undefined;
    }

    return response;
  }

  public async GetEntry(entryId: any) {
    const authToken: any = await this.GetAuth();

    const url =
      "https://7o4jd3o0b1.execute-api.us-east-1.amazonaws.com/dev/get_entry";

    let response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(entryId)
    });

    const json = await response.json();
    console.log("get entry response", json);

    return json;
  }

  public async GetFeed() {
    const authToken: any = await this.GetAuth();

    const url =
      "https://7o4jd3o0b1.execute-api.us-east-1.amazonaws.com/dev/get_feed";

    let response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      }
    });

    if (response.status !== HttpStatus.OK) {
      console.log("get feed error", response);
      return [];
    }

    const json = await response.json();
    console.log("get feed response", json);

    return json;
  }

  public async GetUserInfo() {
    const authToken: any = await this.GetAuth();

    const url =
      "https://7o4jd3o0b1.execute-api.us-east-1.amazonaws.com/dev/get_user_info";

    let response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    const json = await response.json();
    console.log(json);
    return json;
  }

  public async GetTransactions() {
    const authToken: any = await this.GetAuth();

    let response = await fetch(
      "https://7o4jd3o0b1.execute-api.us-east-1.amazonaws.com/dev/get_transactions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    );

    const transactions = await response.json();
    console.log(transactions);
    return transactions;

    // // Remove special transactions, like credit card payments and bank fees
    // const onlyPlaces = _.remove(
    //   transactions,
    //   (i: any) => i.transaction_type !== "special"
    // );

    // // Group array elements by category
    // const groupedCategories = _.chain(onlyPlaces)
    //   .groupBy("category")
    //   // Key is group name (category), value is array of objects (transactions)
    //   // .map((value: any, key: any) => ({
    //   //   category: key,
    //   //   amount: _.sum(_.map(value, "amount"))
    //   // }))
    //   .value();

    // // Order spending in descending order
    // const orderedCategories = _.orderBy(
    //   groupedCategories,
    //   ["amount"],
    //   ["desc"]
    // );
    // console.log('oc', orderedCategories)
    // return orderedCategories;
  }

  public async GetCategories() {
    let response = await fetch(
      "https://7o4jd3o0b1.execute-api.us-east-1.amazonaws.com/dev/get_categories",
      {
        method: "POST"
      }
    );

    const transactions = await response.json();
    console.log(transactions);
    return transactions;
  }
}
