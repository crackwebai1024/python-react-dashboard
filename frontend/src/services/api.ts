import * as HttpStatus from "http-status-codes";
import { ConfigGlobal, ConfigGlobalLoader } from "../config/config";

export interface Context {
  headers: any;
}

const configGlobal: ConfigGlobal = ConfigGlobalLoader.config;
const API_BASE_URL = configGlobal.apiServicesUrlBase;

class ApiService {
  private static context: Context | undefined = undefined;
  // Private helpers
  private static _requestSucceeded(responseStatus: number) {
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

  private static async Get(
    baseUrl: string,
    resource: string,
    queryString?: any,
    headers?: any
  ) {
    if (headers === undefined) {
      headers = this.context && this.context.headers;
    }

    let response = await fetch(`${baseUrl}/${resource}`, {
      method: "GET",
      headers: headers ? headers : undefined
    });

    let requestSucceeded = this._requestSucceeded(response.status);
    if (!requestSucceeded) {
      return undefined;
    }

    return response;
  }

  private static async Post(
    baseUrl: string,
    resource: string,
    body?: any,
    headers?: any
  ) {
    if (headers === undefined) {
      headers = this.context && this.context.headers;
    }

    let response = await fetch(`${baseUrl}/${resource}/`, {
      method: "POST",
      headers: headers ? headers : undefined,
      body: JSON.stringify(body)
    });

    let requestSucceeded = this._requestSucceeded(response.status);
    if (!requestSucceeded) {
      return undefined;
    }

    return response;
  }

  public static setContext(context: Context) {
    this.context = context;
  }

  public static async Login(username: string, password: string) {
    let requestBody = {
      email: username,
      password: password
    };

    let response = await this.Post(
      API_BASE_URL,
      "identity/login",
      requestBody,
      {
        "Content-Type": "application/json"
      }
    );

    let responseJSON = undefined;
    if (response !== undefined) {
      responseJSON = await response.json();
    }

    return responseJSON;
  }

  public static async GetUserInfo() {
    let response = await this.Get(
      API_BASE_URL,
      `patient/patients/profile/`,
      undefined
    );

    let responseJSON = undefined;
    if (response !== undefined) {
      responseJSON = await response.json();
    }

    return responseJSON;
  }

  public static async GetEventTriggers(eventTypeId?: string) {
    let filter = "";

    if (eventTypeId) {
      filter = `?event_type_id=${eventTypeId}`;
    }

    let response = await this.Get(
      API_BASE_URL,
      `patient/event_triggers/${filter}`,
      undefined
    );

    let responseJSON = undefined;
    if (response !== undefined) {
      responseJSON = await response.json();
    }

    return responseJSON;
  }

  public static async GetEvents(startDate?: string) {
    let filter = "";

    if (startDate) {
      filter = `?start_date=${startDate}`;
    }

    let response = await this.Get(
      API_BASE_URL,
      `patient/events/${filter}`,
      undefined
    );

    let responseJSON = undefined;
    if (response !== undefined) {
      responseJSON = await response.json();
    }
    return responseJSON;
  }

  public static async GetEventTypes() {
    let response = await this.Get(
      API_BASE_URL,
      `patient/event_types/`,
      undefined
    );

    let responseJSON = undefined;
    if (response !== undefined) {
      responseJSON = await response.json();
    }
    return responseJSON;
  }

  public static async CreateEvent(payload: Event) {
    let response = await this.Post(API_BASE_URL, "patient/events", payload);
    let responseJSON = undefined;
    if (response !== undefined) {
      responseJSON = await response.json();
    }

    return responseJSON;
  }
}

export default ApiService;
