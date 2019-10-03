import { IContent } from '../content';
import { LiveUid, SongUid, TourUid, WorkUid } from '../Main';

export interface ILives {
  [year: string]: ILiveInfo[];
}

export interface ILiveInfo extends IContent<LiveUid | TourUid> {
  is_tour: boolean;
  number: number;
  relatedWork?: WorkUid;
}

export default interface ILive extends IContent<LiveUid> {
  date: string;
  place: string;
  setlist: SongUid[];
  is_tour: boolean;
}

export interface IConvertedLive extends Omit<ILive, 'date'> {
  date: Date;
}
