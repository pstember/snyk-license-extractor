import { Config } from '../lib/config';
import { RequestEngine } from './request';

export function isAuthed(config: Config) {
  const token: string = config.token || '';
  const api: string = config.API || '';
  return verifyAPI(token, api).then((res: any) => {
    return res.body.ok;
  });
}

export function verifyAPI(token: string, api: string) {

  const payload = {
    body: {
      api: token,
    },
    method: 'POST',
    url: api + '/verify/token',
    json: true,
  };

  return new Promise((resolve, reject) => {
    RequestEngine.makeRequest(payload, (error, res, body) => {
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
