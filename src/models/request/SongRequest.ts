import { ArtistUid, SongUid } from '../Main';

export default interface ISongRequest {
  artistUid: ArtistUid;
  songUid: SongUid;
}

export interface ISongsRequest {
  artistUid: ArtistUid;
}
