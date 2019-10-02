import { ArtistUid, SongUid, TourUid } from '../Main';

export default interface ILivesRequest {
  artistUid: ArtistUid;
  songUid?: SongUid;
  target?: {
    artist: boolean;
  };
}

export interface ITourRequest {
  artistUid: ArtistUid;
  tourUid: TourUid;
  target?: {
    artist: boolean;
  };
}

export interface ITourSummaryRequest {
  artistUid: ArtistUid;
  tourUid: TourUid;
  target: {
    artist?: boolean;
  };
}
