import { IContent } from '../content';
import { SongUid, WorkUid } from '../Main';

export interface IWorks {
  [uid: string]: IWork;
}

export default interface IWork extends IContent<WorkUid> {
  songs: SongUid[];
}
