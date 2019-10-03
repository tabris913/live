import { ArtistUid, LiveUid } from '../Main';

export default interface ILiveRequest {
  artistUid: ArtistUid;
  liveUid: LiveUid;
  target?: {
    artist?: boolean;
    liveInfo?: boolean;
  };
}
