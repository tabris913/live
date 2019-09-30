import { all, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '../actions/types';
import { ContentName } from '../constants/ContentName';
import { IContent, IContentAdditionalState } from '../models/content';
import { Uid } from '../models/Main';
import { snakeCase } from '../utils/MiscUtils';
import { liveSaga } from './contents';
import { ContentSaga } from './contents/content';

interface IListener extends ReturnType<typeof takeEvery> {}

export const createListeners = <T extends IContent<Uid>, A extends IContentAdditionalState>(
  contentName: ContentName,
  saga2: ContentSaga
) => {
  const listeners: IListener[] = [];

  Object.entries(saga2).map(([key, value]) => {
    if (!value || typeof value !== 'function') return null;

    const pattern = `${contentName.toUpperCase()}_${snakeCase(key).toUpperCase()}`;
    listeners.push(takeEvery(`${ActionTypes[pattern]}`, value));
    return null;
  });

  return listeners;
};

export default function* rootSaga(): IterableIterator<any> {
  yield all([
    takeEvery(`${ActionTypes.GET_ARTIST}_STARTED`, liveSaga.getArtist),
    takeEvery(`${ActionTypes.GET_ARTISTS}_STARTED`, liveSaga.getArtists),
    takeEvery(`${ActionTypes.GET_WORKS}_STARTED`, liveSaga.getWorks),
    takeEvery(`${ActionTypes.GET_SONG}_STARTED`, liveSaga.getSong),
    takeEvery(`${ActionTypes.GET_SONGS}_STARTED`, liveSaga.getSongs),
    takeEvery(`${ActionTypes.GET_LIVES}_STARTED`, liveSaga.getLives),
    takeEvery(`${ActionTypes.GET_LIVE}_STARTED`, liveSaga.getLive),

    takeEvery(`${ActionTypes.PREPARE_TOP_PAGE}_STARTED`, liveSaga.prepareTopPage),
    takeEvery(`${ActionTypes.PREPARE_ARTIST_PAGE}_STARTED`, liveSaga.prepareArtistPage),
    takeEvery(`${ActionTypes.PREPARE_WORKS_PAGE}_STARTED`, liveSaga.prepareWorksPage),
    takeEvery(`${ActionTypes.PREPARE_LIVE_LIST_PAGE}_STARTED`, liveSaga.prepareLiveListPage),
    takeEvery(`${ActionTypes.PREPARE_TOUR_PAGE}_STARTED`, liveSaga.prepareTourPage),
    takeEvery(`${ActionTypes.PREPARE_SONG_PAGE}_STARTED`, liveSaga.prepareSongPage),
    takeEvery(`${ActionTypes.PREPARE_LIVE_PAGE}_STARTED`, liveSaga.prepareLivePage),
    // ...ContentNames.reduce(
    //   (names, name) => [...names, ...createListeners(name, contentSagas[name]!)],
    //   [] as IListener[]
    // ),
  ]);
}
