import { IContent } from '../content';
import { ArtistUid, Uid } from '../Main';

export default interface IPRequest<T extends IContent<Uid>> {
  artistUid: ArtistUid;
  body: T;
}
