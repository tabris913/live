// import { ICardState } from '../reducers/contents/card';
import { IContent, IContentAdditionalState } from './content';

export interface IContentState<T extends IContent, A extends IContentAdditionalState> {
  content?: T;
  listPage?: number;
  list?: T[];
  additional?: A;
}

export interface IContentsState {
  // card: ICardState;
}
