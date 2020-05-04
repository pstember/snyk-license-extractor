import { debug as debugModule } from 'debug';
import * as needle from 'needle';
import { parse, format } from 'url';
import * as querystring from 'querystring';
import * as zlib from 'zlib';
import { Agent } from 'http';
import { Payload } from './types';

const debug = debugModule('snyk-bulk-ignore');
const snykDebug = debugModule('snyk-bulk-ignore:request');

export function makeRequest(payload: Payload, extraOptions?): Promise<{ res: needle.NeedleResponse; body: any }> {
  return new Promise((resolve, reject) => {
        const body = payload.body;
        let data: needle.BodyData = null;

        delete payload.body;

        if (!payload.headers) {
          payload.headers = {};
        }

        if (body) {
          const json = JSON.stringify(body);
          if (json.length < 1e4) {
            debug(JSON.stringify(body, null, 2));
          }

          // always compress going upstream
          data = zlib.gzipSync(json, { level: 9 });

          snykDebug('sending request to:', payload.url);
          snykDebug('request body size:', json.length);
          snykDebug('gzipped request body size:', data.length);

          payload.headers['content-encoding'] = 'gzip';
          payload.headers['content-length'] = data.length;
        }

        const parsedUrl = parse(payload.url);

        if (
          parsedUrl.protocol === 'http:' &&
          parsedUrl.hostname !== 'localhost'
        ) {
          debug('forcing api request to https');
          parsedUrl.protocol = 'https:';
          payload.url = format(parsedUrl);
        }

        // prefer config timeout unless payload specified
        if (!payload.hasOwnProperty('timeout')) {
          payload.timeout =  1000 * Number(extraOptions && extraOptions.timeout || 300); // s -> ms
        }

        debug('request payload: ', JSON.stringify(payload));

        const method = (
          payload.method || 'get'
        ).toLowerCase() as needle.NeedleHttpVerbs;
        let url = payload.url;

        if (payload.qs) {
          url = url + '?' + querystring.stringify(payload.qs);
          delete payload.qs;
        }

        const options: needle.NeedleOptions = {
          json: payload.json,
          headers: payload.headers,
          timeout: payload.timeout,
          // eslint-disable-next-line @typescript-eslint/camelcase
          follow_max: 5,
        };

        if (extraOptions && extraOptions.ignoreUnknownCA || false) {
          debug('Using insecure mode (ignore unkown certificate authority)');
          options.rejectUnauthorized = false;
        }

        needle.request(method, url, data, options, (err: any, res: any, respBody: any) => {
          debug(err);
          debug(
            'response (%s): ',
            (res || {}).statusCode,
            JSON.stringify(respBody),
          );
          if (err) {
            return reject(err);
          }

          resolve({ res, body: respBody });
        });
      });
}
