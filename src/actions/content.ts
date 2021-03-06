import actionCreatorFactory, { AsyncActionCreators } from 'typescript-fsa';
import { IContent } from '../models/content';
import IArtist, { IArtists } from '../models/contents/artist';
import ILive, { ILives } from '../models/contents/live';
import ISong, { ISongs } from '../models/contents/song';
import { IWorks } from '../models/contents/work';
import { IContentState } from '../models/ContentState';
import { Uid } from '../models/Main';
import IArtistRequest from '../models/request/ArtistRequest';
import IChoiceRequest from '../models/request/ChoiceRequest';
import ILiveRequest from '../models/request/LiveRequest';
import ILivesRequest, { ITourRequest, ITourSummaryRequest } from '../models/request/LivesRequest';
import IPRequest from '../models/request/PRequest';
import ISongRequest, { ISongsRequest, ISongSummaryRequest } from '../models/request/SongRequest';
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

  prepareTopPage: AsyncActionCreators<void, IContentState, any>;
  prepareArtistPage: AsyncActionCreators<IArtistRequest, IContentState, any>;
  prepareWorksPage: AsyncActionCreators<IWorksRequest, IContentState, any>;
  prepareLiveListPage: AsyncActionCreators<ILivesRequest, IContentState, any>;
  prepareTourPage: AsyncActionCreators<ITourRequest, IContentState, any>;
  prepareSongPage: AsyncActionCreators<ISongRequest, IContentState, any>;
  prepareLivePage: AsyncActionCreators<ILiveRequest, IContentState, any>;
  prepareSongSummaryPage: AsyncActionCreators<ISongSummaryRequest, IContentState, any>;
  prepareTourSummaryPage: AsyncActionCreators<ITourSummaryRequest, IContentState, any>;
  prepareChoicePage: AsyncActionCreators<IChoiceRequest, IContentState, any>;

  postLive: AsyncActionCreators<IPRequest<IContent<Uid>>, void, any>;
}

const AAC = actionCreatorFactory().async;

export const contentActionsBuilder = (actionTypeMap: { [P in keyof ContentActions]: string }): ContentActions => {
  const body: ContentActions = {
    getArtist: AAC<IArtistRequest, IArtist, any>(actionTypeMap.getArtist),
    getArtists: AAC<void, IArtists, any>(actionTypeMap.getArtists),
    getWorks: AAC<IWorksRequest, IWorks, any>(actionTypeMap.getWorks),
    getSong: AAC<ISongRequest, ISong, any>(actionTypeMap.getSong),
    getSongs: AAC<ISongsRequest, ISongs, any>(actionTypeMap.getSongs),
    getLives: AAC<ILivesRequest, ILives, any>(actionTypeMap.getLives),
    getLive: AAC<ILiveRequest, ILive, any>(actionTypeMap.getLive),

    prepareTopPage: AAC<void, IContentState, any>(actionTypeMap.prepareTopPage),
    prepareArtistPage: AAC<IArtistRequest, IContentState, any>(actionTypeMap.prepareArtistPage),
    prepareWorksPage: AAC<IWorksRequest, IContentState, any>(actionTypeMap.prepareWorksPage),
    prepareLiveListPage: AAC<ILivesRequest, IContentState, any>(actionTypeMap.prepareLiveListPage),
    prepareTourPage: AAC<ITourRequest, IContentState, any>(actionTypeMap.prepareTourPage),
    prepareSongPage: AAC<ISongRequest, IContentState, any>(actionTypeMap.prepareSongPage),
    prepareLivePage: AAC<ILiveRequest, IContentState, any>(actionTypeMap.prepareLivePage),
    prepareSongSummaryPage: AAC<ISongSummaryRequest, IContentState, any>(actionTypeMap.prepareSongSummaryPage),
    prepareTourSummaryPage: AAC<ITourSummaryRequest, IContentState, any>(actionTypeMap.prepareTourSummaryPage),
    prepareChoicePage: AAC<IChoiceRequest, IContentState, any>(actionTypeMap.prepareChoicePage),

    postLive: AAC<IPRequest<IContent<Uid>>, void, any>(actionTypeMap.postLive),
  };

  // if (actionTypeMap.getHistory) {
  //   body.getHistory = actionCreatorFactory()<IContentRequest>(actionTypeMap.getHistory);
  // }

  return body;
};

export const liveActions = contentActionsBuilder({
  getArtist: ActionTypes.GET_ARTIST,
  getArtists: ActionTypes.GET_ARTISTS,
  getWorks: ActionTypes.GET_WORKS,
  getSong: ActionTypes.GET_SONG,
  getSongs: ActionTypes.GET_SONGS,
  getLives: ActionTypes.GET_LIVES,
  getLive: ActionTypes.GET_LIVE,

  prepareTopPage: ActionTypes.PREPARE_TOP_PAGE,
  prepareArtistPage: ActionTypes.PREPARE_ARTIST_PAGE,
  prepareWorksPage: ActionTypes.PREPARE_WORKS_PAGE,
  prepareLiveListPage: ActionTypes.PREPARE_LIVE_LIST_PAGE,
  prepareTourPage: ActionTypes.PREPARE_TOUR_PAGE,
  prepareSongPage: ActionTypes.PREPARE_SONG_PAGE,
  prepareLivePage: ActionTypes.PREPARE_LIVE_PAGE,
  prepareSongSummaryPage: ActionTypes.PREPARE_SONG_SUMMARY_PAGE,
  prepareTourSummaryPage: ActionTypes.PREPARE_TOUR_SUMMERY_PAGE,
  prepareChoicePage: ActionTypes.PREPARE_CHOICE_PAGE,

  postLive: ActionTypes.POST_LIVE,
});
