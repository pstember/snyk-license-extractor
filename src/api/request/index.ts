import { makeRequest as localRequest } from './request';

export class RequestEngine {
  private baseUrl: string;
  private token: string;

  private static instance: RequestEngine;

  private constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  public static initialize(baseUrl: string, token: string) {
    if (RequestEngine.instance) {
      RequestEngine.instance.baseUrl = baseUrl;
      RequestEngine.instance.token = token;
      //console.log('REQUEST ENGINE RESET');
    } else {
      RequestEngine.instance = new RequestEngine(baseUrl, token);
      //console.log('REQUEST ENGINE INIT');
    }
  }

  public static getInstance() : RequestEngine {
    //console.log('REQUEST ENGINE REQUESTED');
    if (RequestEngine.instance) {
      return RequestEngine.instance;
    }
    else {
      // throw new Error('RequestEngine not initiated');
      return RequestEngine.instance;
    }
  }


  public request(path: string, method: string, reqBody?: {}) {
    const payload = {
      headers: {
      Authorization: 'token ' + String(this.token),
      },
      body: reqBody,
      method,
      url: this.baseUrl + path,
      json: true,
    };

    return new Promise((resolve, reject) => {
      RequestEngine.internalMakeRequest(payload, (error, res, body) => {
        if (error) {
          return reject(error);
        }

        resolve({
          res,
          body,
        });
      });
    });
  }

  // A hybrid async function: both returns a promise and takes a callback
  public static makeRequest(
    payload: any,
    callback?: (err: Error | null, res?: any, body?: any) => void,
  ) {
    RequestEngine.internalMakeRequest(payload, callback);
  }

  // private require due to the following error if exported
  // error TS4058: Return type of exported function has or is using name 'core.NeedleResponse' 
  // from external module "/Users/pstember/Git/snyk-bulk-ignore/node_modules/@types/needle/index" but cannot be named.
  private static async internalMakeRequest(
    payload: any,
    callback?: (err: Error | null, res?: any, body?: any) => void,
  ) {
    try {
      const result = await localRequest(payload);
      // make callbacks and promises work
      if (callback) {
        callback(null, result.res, result.body);
      }
      return result;
    } catch (error) {
      if (callback) {
        return callback(error);
      }
      throw error;
    }
  }



}