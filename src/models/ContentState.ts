// import { ICardState } from '../reducers/contents/card';
import IArtist, { IArtists } from './contents/artist';
import ILive, { ILiveInfo, ILives } from './contents/live';
import ISong, { ISongs } from './contents/song';
import { IWorks } from './contents/work';

export interface IContentState {
  artist?: IArtist;
  artistList?: IArtist[];
  artists?: IArtists;
  works?: IWorks;
  song?: ISong;
  songList?: ISong[];
  songs?: ISongs;
  songsList?: ISongs[];
  live?: ILive;
  liveList?: ILive[];
  lives?: ILives;
  liveInfo?: ILiveInfo;
}

export interface IContentsState {
  // card: ICardState;
  content: IContentState;
}
