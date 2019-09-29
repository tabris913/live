import { IContent } from '../content';
import { SongUid } from '../Main';

export interface ISongs {
  [uid: string]: ISong;
}

export default interface ISong extends IContent<SongUid> {}
