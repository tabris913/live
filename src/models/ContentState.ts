// import { ICardState } from '../reducers/contents/card';
import { IContent, IContentAdditionalState } from './content';
import { Uid } from './Main';

export interface IContentState<T extends IContent<Uid>, A extends IContentAdditionalState> {
  content?: T;
  listPage?: number;
  list?: T[];
  additional?: A;
}

export interface IContentsState {
  // card: ICardState;
}
