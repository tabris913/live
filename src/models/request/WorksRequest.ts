import { ArtistUid, SongUid } from '../Main';

export default interface IWorksRequest {
  artistUid: ArtistUid;
  songUid?: SongUid;
  target?: {
    artist?: boolean;
  };
}
