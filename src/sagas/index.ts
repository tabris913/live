import { all, takeEvery } from 'redux-saga/effects';

import { Actions } from '../actions/content';
import { ActionTypes } from '../actions/types';
import { Apis } from '../apis/content';
import { ContentName } from '../constants/ContentName';
import { IContent, IContentAdditionalState } from '../models/content';
import { Uid } from '../models/Main';
import { snakeCase } from '../utils/MiscUtils';
import saga, { ContentSaga } from './contents/content';

interface IListener extends ReturnType<typeof takeEvery> {}

export const createListeners = <T extends IContent<Uid>, A extends IContentAdditionalState>(
  contentName: ContentName,
  saga2: ContentSaga<T, A>
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
    takeEvery(`${ActionTypes.GET_ARTIST}_STARTED`, saga(Actions, Apis).getArtist),
    takeEvery(`${ActionTypes.GET_ARTISTS}_STARTED`, saga(Actions, Apis).getArtists),
    takeEvery(`${ActionTypes.GET_WORKS}_STARTED`, saga(Actions, Apis).getWorks),
    takeEvery(`${ActionTypes.GET_SONG}_STARTED`, saga(Actions, Apis).getSong),
    takeEvery(`${ActionTypes.GET_SONGS}_STARTED`, saga(Actions, Apis).getSongs),
    takeEvery(`${ActionTypes.GET_LIVES}_STARTED`, saga(Actions, Apis).getLives),
    takeEvery(`${ActionTypes.GET_LIVE}_STARTED`, saga(Actions, Apis).getLive),
    // ...ContentNames.reduce(
    //   (names, name) => [...names, ...createListeners(name, contentSagas[name]!)],
    //   [] as IListener[]
    // ),
  ]);
}
