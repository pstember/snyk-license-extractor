import { RequestEngine } from './request';

export class BaseAPI {

  protected static requestEngine: RequestEngine;

  public static init(baseUrl: string, token: string){
      RequestEngine.initialize(baseUrl, token);
      this.requestEngine = RequestEngine.getInstance();

  }

}
