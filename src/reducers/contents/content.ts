import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { ContentActions, liveActions } from '../../actions/content';

export const contentReducerBuilder = (actions: ContentActions) => {
  const reducer = reducerWithInitialState({})
    .caseWithAction(actions.getArtists.done, (state, action) => ({
      ...state,
      artists: action.payload.result,
    }))
    .caseWithAction(actions.getArtist.done, (state, action) => ({ ...state, artist: action.payload.result }))
    .caseWithAction(actions.getWorks.done, (state, action) => ({ ...state, works: action.payload.result }))
    .caseWithAction(actions.getSongs.done, (state, action) => ({ ...state, works: action.payload.result }))
    .caseWithAction(actions.getSong.done, (state, action) => ({ ...state, song: action.payload.result }))
    .caseWithAction(actions.getLives.done, (state, action) => ({ ...state, lives: action.payload.result }))
    .caseWithAction(actions.getLive.done, (state, action) => ({ ...state, live: action.payload.result }))

    .case(actions.prepareWorksPage.started, state => ({ ...state, works: undefined }))
    .case(actions.prepareLiveListPage.started, state => ({ ...state, lives: undefined }))
    .case(actions.prepareTourPage.started, state => ({ ...state, liveList: undefined }))
    .case(actions.prepareSongPage.started, state => ({ ...state, songList: undefined }))
    .casesWithAction(
      [
        actions.prepareTopPage.done,
        actions.prepareArtistPage.done,
        actions.prepareWorksPage.done,
        actions.prepareLiveListPage.done,
      ],
      (state, action) => ({ ...state, ...action.payload.result })
    )
    .casesWithAction(
      [actions.prepareTourPage.done, actions.prepareSongPage.done, actions.prepareLivePage.done],
      (state, action) => ({ ...state, ...action.payload.result })
    );

  return reducer;
};

export const liveReducer = contentReducerBuilder(liveActions);
