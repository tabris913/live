import { IArtists } from '../models/contents/artist';
import ILive, { ILives } from '../models/contents/live';
import IArtistRequest from '../models/request/ArtistRequest';
import ILiveRequest from '../models/request/LiveRequest';
import ILivesRequest from '../models/request/LivesRequest';
import IPRequest from '../models/request/PRequest';
import ISongRequest, { ISongsRequest } from '../models/request/SongRequest';
import IWorksRequest from '../models/request/WorksRequest';
import { API_BASE_URL, get, post } from './api';

const baseUrl = API_BASE_URL;

export interface ContentApis {
  getArtist: (req: IArtistRequest) => Promise<any>;
  getArtists: () => Promise<any>;
  getWorks: (req: IWorksRequest) => Promise<any>;
  getSong: (req: ISongRequest) => Promise<any>;
  getSongs: (req: ISongsRequest) => Promise<any>;
  getLives: (req: ILivesRequest) => Promise<any>;
  getLiveInfo: (req: ILiveRequest) => Promise<any>;
  getLive: (req: ILiveRequest) => Promise<any>;

  postLive: (req: IPRequest<ILive>) => Promise<any>;
}

export const contentApisBuilder = () => {
  const getArtists = (): Promise<any> => {
    const url = `${baseUrl}/json/artists.json`;
    return get<void, any>(url, undefined);
  };

  const getSongs = (req: ISongsRequest): Promise<any> => {
    const url = `${baseUrl}/json/${req.artistUid}/songs.json`;
    return get<ISongsRequest, any>(url, req);
  };

  const getWorks = (req: IWorksRequest): Promise<any> => {
    const url = `${baseUrl}/json/${req.artistUid}/works.json`;
    return get<IWorksRequest, any>(url, req);
  };

  const getLives = (req: ILivesRequest): Promise<any> => {
    const url = `${baseUrl}/json/${req.artistUid}/lives.json`;
    return get<ILivesRequest, any>(url, req);
  };

  return {
    getArtists: getArtists,
    getWorks: getWorks,
    getSongs: getSongs,
    getLives: getLives,
    getArtist: (req: IArtistRequest): Promise<any> => {
      return new Promise((resolve, reject) =>
        resolve(
          getArtists().then((artists: IArtists) =>
            Object.keys(artists).includes(req.artistUid as string) ? artists[req.artistUid as string] : undefined
          )
        )
      );
    },
    getSong: (req: ISongRequest): Promise<any> => {
      // return new Promise(resolve =>
      //   resolve(
      //     getSongs(req).then((songs: ISongs) =>
      //       Object.keys(songs).includes(req.songUid as string) ? songs[req.songUid as string] : undefined
      //     )
      //   )
      // );
      const url = `${baseUrl}/json/${req.artistUid}/songs/${req.songUid}.json`;
      return get<ISongRequest, any>(url, req);
    },
    getLiveInfo: (req: ILiveRequest): Promise<any> => {
      const year = req.liveUid.split('_')[0];
      const tourUid = req.liveUid
        .split('_')
        .slice(0, -1)
        .join('_');
      return new Promise(resolve =>
        resolve(
          getLives({ artistUid: req.artistUid }).then((lives: ILives) =>
            Object.keys(lives).includes(year)
              ? Object.keys(lives[year]).includes(req.liveUid as string)
                ? lives[year][req.liveUid as string]
                : Object.keys(lives[year]).includes(tourUid)
                ? lives[year][tourUid]
                : undefined
              : undefined
          )
        )
      );
    },
    getLive: (req: ILiveRequest): Promise<any> => {
      const url = `${baseUrl}/json/${req.artistUid}/lives/${req.liveUid}.json`;
      return get<ILiveRequest, any>(url, req);
    },

    postLive: (req: IPRequest<ILive>): Promise<any> => {
      const url = `${baseUrl}/json/${req.artistUid}/lives/${req.body.uid}.json`;
      return post<ILive, any>(url, req.body);
    },
  };
};

export const liveApis = contentApisBuilder();
