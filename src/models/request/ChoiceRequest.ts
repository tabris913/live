import { ArtistUid } from '../Main';

export default interface IChoiceRequest {
  artistUid: ArtistUid;
  target?: {
    artist?: boolean;
  };
}
