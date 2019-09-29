import IArtist, { IArtists } from '../models/contents/artist';
import IArtistRequest, { IArtistsRequest } from '../models/request/ArtistRequest';
import { API_BASE_URL, get } from './api';

const baseUrl = API_BASE_URL;

export interface ContentApis {
  getArtist: (req: IArtistRequest) => Promise<IArtist>;
  getArtists: (req: IArtistsRequest) => Promise<IArtists>;
}

export const contentApisBuilder = () => {
  return {
    getArtist: (req: IArtistRequest): Promise<IArtist> => {
      const url = `${baseUrl}/json/artists.json`;
      return get<IArtistRequest, IArtist>(url, req);
    },
    getArtists: (req: IArtistsRequest): Promise<IArtists> => {
      const url = `${baseUrl}/json/artists.json`;
      return get<IArtistsRequest, IArtists>(url, req);
    },
  };
};

export const Apis = contentApisBuilder();
