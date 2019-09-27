import { connectRouter, LocationChangeAction, RouterState } from 'connected-react-router';
import { History } from 'history';
import { combineReducers, Reducer } from 'redux';

import { IContentsState } from '../models/ContentState';
import * as contentsReducers from './contents';

export interface IStoreState {
  router: Reducer<RouterState, LocationChangeAction>;
  contents: IContentsState;
}

export default (history: History) =>
  combineReducers({
    router: connectRouter(history),
    contents: combineReducers({ ...contentsReducers }),
  });
