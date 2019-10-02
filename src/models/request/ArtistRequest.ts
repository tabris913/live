import { ArtistUid } from '../Main';

export default interface IArtistRequest {
  artistUid: ArtistUid;
  target?: {
    artist?: boolean;
  };
}

export interface IArtistsRequest {}
