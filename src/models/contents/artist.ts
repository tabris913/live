import { IContent } from '../content';
import { ArtistUid } from '../Main';

export interface IArtists {
  [uid: string]: IArtist;
}

export default interface IArtist extends IContent<ArtistUid> {}
