import { ArtistUid, SongUid } from '../Main';

export default interface ILivesRequest {
  artistUid: ArtistUid;
  songUid?: SongUid;
}
