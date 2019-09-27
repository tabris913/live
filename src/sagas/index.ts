import { all, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '../actions/types';
import { ContentName, ContentNames } from '../constants/ContentName';
import { IContent, IContentAdditionalState } from '../models/content';
import { snakeCase } from '../utils/MiscUtils';
import { contentSagas } from './contents';
import { ContentSaga } from './contents/content';

interface IListener extends ReturnType<typeof takeEvery> {}

const createListeners = <T extends IContent, A extends IContentAdditionalState>(
  contentName: ContentName,
  saga: ContentSaga<T, A>
) => {
  const listeners: IListener[] = [];

  Object.entries(saga).map(([key, value]) => {
    if (!value || typeof value !== 'function') return null;

    const pattern = `${contentName.toUpperCase()}_${snakeCase(key).toUpperCase()}`;
    listeners.push(takeEvery(`${ActionTypes[pattern]}`, value));
    return null;
  });

  return listeners;
};

export default function* rootSaga(): IterableIterator<any> {
  yield all([
    ...ContentNames.reduce(
      (names, name) => [...names, ...createListeners(name, contentSagas[name])],
      [] as IListener[]
    ),
  ]);
}
