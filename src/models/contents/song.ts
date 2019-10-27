import { IContent } from '../content';
import { LiveUid, SongUid } from '../Main';

export interface ISongs {
  [uid: string]: ISong;
}

export default interface ISong extends IContent<SongUid> {
  track_no?: number;
  lives?: LiveUid[];
  misc?: {
    [x: string]: any;
  };
}
