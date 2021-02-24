import { TrackImage, LastFMResponseBody } from './types';
import { parseSong } from './lib';
import useSWR from 'swr';

/**
 * Use Last.fm
 * @param method The search type and params used to construct the request endpoint
 * @param token Your API token
 * @param interval Optional, this is the internal between each request
 * @param imageSize The size of the image
 */
export default class useLastFM {
  private readonly token: string;

  public constructor(token: string) {
    this.token = token;
  }

  public get(
    method: {
      query: {
        type: string;
        node: string;
      };
      param: string;
    },
    interval: number = 15 * 1000,
    imageSize: TrackImage['size'] = 'extralarge',
  ) {
    const endpoint = `//ws.audioscrobbler.com/2.0/?method=${method.query.type}.${method.query.node}&${method.query.type}=${method.param}&api_key=${this.token}&format=json&limit=1`;

    const { data: track = null, error } = useSWR<LastFMResponseBody, Error>(
      endpoint,
      { refreshInterval: interval },
    );
    if (error) {
      return {
        status: 'error',
        song: null,
      };
    }
    try {
      return parseSong(track, imageSize);
    } catch (e) {
      return {
        status: 'error',
        song: null,
      };
    }
  }
}

export * from './types';
