import { IContent } from '../content';
import { SongUid } from '../Main';
import { ILives } from './live';

export interface ISongs {
  [uid: string]: ISong;
}

export default interface ISong extends IContent<SongUid> {
  lives: ILives;
  track_no?: number;
}
