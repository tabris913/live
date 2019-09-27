import actionCreatorFactory, { ActionCreator } from 'typescript-fsa';
import { IContent, IContentAdditionalState } from '../models/content';
import { IContentRequest } from '../models/request/ContentRequest';
import { IContentSaveRequest } from '../models/request/ContentSaveRequest';
import { IListRequest } from '../models/request/ListRequest';

export interface ContentActions<T extends IContent, A extends IContentAdditionalState> {
  getContent: ActionCreator<IContentRequest>;
  saveContent: ActionCreator<IContentSaveRequest<T>>;
  getList: ActionCreator<IListRequest>;
  changeListPage: ActionCreator<number>;
  getHistory?: ActionCreator<IContentRequest>;
}

export const contentActionsBuilder = <T extends IContent, A extends IContentAdditionalState>(
  actionTypeMap: { [P in keyof ContentActions<T, A>]: string }
): ContentActions<T, A> => {
  const body: ContentActions<T, A> = {
    getContent: actionCreatorFactory()<IContentRequest>(actionTypeMap.getContent),
    saveContent: actionCreatorFactory()<IContentSaveRequest<T>>(actionTypeMap.saveContent),
    getList: actionCreatorFactory()<IListRequest>(actionTypeMap.getList),
    changeListPage: actionCreatorFactory()<number>(actionTypeMap.changeListPage),
  };

  if (actionTypeMap.getHistory) {
    body.getHistory = actionCreatorFactory()<IContentRequest>(actionTypeMap.getHistory);
  }

  return body;
};
