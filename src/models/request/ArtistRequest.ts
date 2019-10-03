import { ArtistUid } from '../Main';

export default interface IArtistRequest {
  artistUid: ArtistUid;
  target?: {
    artists?: boolean;
  };
}

export interface IArtistsRequest {}
