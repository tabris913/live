import { IContent } from '../content';
import { SongUid, WorkUid } from '../Main';
import { ISongs } from './song';

export interface IWorks {
  [uid: string]: IWork;
}

export default interface IWork extends IContent<WorkUid> {
  date: string;
  songs: SongUid[];
  songs_detail?: ISongs;
}
