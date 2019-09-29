import { IContent } from '../content';
import { LiveUid, SongUid } from '../Main';

export interface ILives {
  [year: string]: ILiveInfo[];
}

export interface ILiveInfo extends IContent<LiveUid> {
  is_tour: boolean;
  number: number;
}

export default interface ILive extends IContent<LiveUid> {
  date: string;
  place: string;
  setlist: SongUid[];
}

export interface IConvertedLive extends Omit<ILive, 'date'> {
  date: Date;
}
