import { ArtistUid, SongUid, WorkUid } from '../Main';

export default interface ISongRequest {
  artistUid: ArtistUid;
  songUid: SongUid;
  target?: {
    artist?: boolean;
  };
}

export interface ISongsRequest {
  artistUid: ArtistUid;
  workUid?: WorkUid;
}
