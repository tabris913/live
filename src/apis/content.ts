import IArtistRequest from '../models/request/ArtistRequest';
import ILiveRequest from '../models/request/LiveRequest';
import ILivesRequest from '../models/request/LivesRequest';
import ISongRequest, { ISongsRequest } from '../models/request/SongRequest';
import IWorksRequest from '../models/request/WorksRequest';
import { API_BASE_URL, get } from './api';

const baseUrl = API_BASE_URL;

export interface ContentApis {
  getArtist: (req: IArtistRequest) => Promise<any>;
  getArtists: () => Promise<any>;
  getWorks: (req: IWorksRequest) => Promise<any>;
  getSong: (req: ISongRequest) => Promise<any>;
  getSongs: (req: ISongsRequest) => Promise<any>;
  getLives: (req: ILivesRequest) => Promise<any>;
  getLive: (req: ILiveRequest) => Promise<any>;
}

export const contentApisBuilder = () => {
  return {
    getArtist: (req: IArtistRequest): Promise<any> => {
      const url = `${baseUrl}/json/artists.json`;
      return get<IArtistRequest, any>(url, req);
    },
    getArtists: (): Promise<any> => {
      const url = `${baseUrl}/json/artists.json`;
      return get<void, any>(url, undefined);
    },
    getWorks: (req: IWorksRequest): Promise<any> => {
      const url = `${baseUrl}/json/${req.artistUid}/works.json`;
      return get<IWorksRequest, any>(url, req);
    },
    getSong: (req: ISongRequest): Promise<any> => {
      const url = `${baseUrl}/json/${req.artistUid}/songs.json`;
      return get<ISongRequest, any>(url, req);
    },
    getSongs: (req: ISongsRequest): Promise<any> => {
      const url = `${baseUrl}/json/${req.artistUid}/songs.json`;
      return get<ISongsRequest, any>(url, req);
    },
    getLives: (req: ILivesRequest): Promise<any> => {
      const url = `${baseUrl}/json/${req.artistUid}/lives.json`;
      return get<ILivesRequest, any>(url, req);
    },
    getLive: (req: ILiveRequest): Promise<any> => {
      const url = `${baseUrl}/json/${req.artistUid}/lives/${req.liveUid}.json`;
      return get<ILiveRequest, any>(url, req);
    },
  };
};

export const liveApis = contentApisBuilder();
