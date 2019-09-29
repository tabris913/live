import actionCreatorFactory, { AsyncActionCreators } from 'typescript-fsa';
import IArtist, { IArtists } from '../models/contents/artist';
import ILive, { ILives } from '../models/contents/live';
import ISong, { ISongs } from '../models/contents/song';
import { IWorks } from '../models/contents/work';
import IArtistRequest from '../models/request/ArtistRequest';
import ILiveRequest from '../models/request/LiveRequest';
import ILivesRequest from '../models/request/LivesRequest';
import ISongRequest, { ISongsRequest } from '../models/request/SongRequest';
import IWorksRequest from '../models/request/WorksRequest';
import { ActionTypes } from './types';

export interface ContentActions {
  getArtist: AsyncActionCreators<IArtistRequest, IArtist, any>;
  getArtists: AsyncActionCreators<void, IArtists, any>;
  getWorks: AsyncActionCreators<IWorksRequest, IWorks, any>;
  getSong: AsyncActionCreators<ISongRequest, ISong, any>;
  getSongs: AsyncActionCreators<ISongsRequest, ISongs, any>;
  getLives: AsyncActionCreators<ILivesRequest, ILives, any>;
  getLive: AsyncActionCreators<ILiveRequest, ILive, any>;
}

export const contentActionsBuilder = (actionTypeMap: { [P in keyof ContentActions]: string }): ContentActions => {
  const body: ContentActions = {
    getArtist: actionCreatorFactory().async<IArtistRequest, IArtist, any>(actionTypeMap.getArtist),
    getArtists: actionCreatorFactory().async<void, IArtists, any>(actionTypeMap.getArtists),
    getWorks: actionCreatorFactory().async<IWorksRequest, IWorks, any>(actionTypeMap.getWorks),
    getSong: actionCreatorFactory().async<ISongRequest, ISong, any>(actionTypeMap.getSong),
    getSongs: actionCreatorFactory().async<ISongsRequest, ISongs, any>(actionTypeMap.getSongs),
    getLives: actionCreatorFactory().async<ILivesRequest, ILives, any>(actionTypeMap.getLives),
    getLive: actionCreatorFactory().async<ILiveRequest, ILive, any>(actionTypeMap.getLives),
  };

  // if (actionTypeMap.getHistory) {
  //   body.getHistory = actionCreatorFactory()<IContentRequest>(actionTypeMap.getHistory);
  // }

  return body;
};

export const Actions = contentActionsBuilder({
  getArtist: ActionTypes.GET_ARTIST,
  getArtists: ActionTypes.GET_ARTISTS,
  getWorks: ActionTypes.GET_WORKS,
  getSong: ActionTypes.GET_SONG,
  getSongs: ActionTypes.GET_SONGS,
  getLives: ActionTypes.GET_LIVES,
  getLive: ActionTypes.GET_LIVE,
});
