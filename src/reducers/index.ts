import { connectRouter, LocationChangeAction, RouterState } from 'connected-react-router';
import { History } from 'history';
import { combineReducers, Reducer } from 'redux';

import { IContentState } from '../models/ContentState';
import * as contentsReducers from './contents';

export interface IStoreState {
  router: Reducer<RouterState, LocationChangeAction>;
  contents: IContentState;
}

export default (history: History) =>
  combineReducers({
    router: connectRouter(history),
    contents: contentsReducers.liveReducer,
  });
