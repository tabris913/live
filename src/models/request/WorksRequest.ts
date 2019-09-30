import { ArtistUid } from '../Main';

export default interface IWorksRequest {
  artistUid: ArtistUid;
  target?: {
    artist: boolean;
  };
}
