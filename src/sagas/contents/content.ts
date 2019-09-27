import { Action } from 'typescript-fsa';
import { ContentActions } from '../../actions/content';
import { ContentName } from '../../constants/ContentName';
import { IContent, IContentAdditionalState } from '../../models/content';
import { IContentRequest } from '../../models/request/ContentRequest';
import { IContentSaveRequest } from '../../models/request/ContentSaveRequest';
import { IListRequest } from '../../models/request/ListRequest';

export interface ContentSaga<T extends IContent, A extends IContentAdditionalState> {
  getContent: (action: Action<IContentRequest>) => IterableIterator<any>;
  saveContent: (action: Action<IContentSaveRequest<T>>) => IterableIterator<any>;
  getList: (action: Action<IListRequest>) => IterableIterator<any>;
  changeListPage: (action: Action<number>) => IterableIterator<any>;
  getHistory?: (action: Action<IContentRequest>) => IterableIterator<any>;
}

const saga = <T extends IContent, A extends IContentAdditionalState>(
  contentName: ContentName,
  actions: ContentActions<T, A>
) => ({
  getContent: () =>
    function*(action: Action<IContentRequest>): IterableIterator<any> {
      console.log(`get ${contentName} content`);
      yield null;
    },
  saveContent: () =>
    function*(action: Action<IContentSaveRequest<T>>): IterableIterator<any> {
      console.log(`save ${contentName} content`);
      yield null;
    },
  getList: () =>
    function*(action: Action<IListRequest>): IterableIterator<any> {
      console.log(`get ${contentName} list`);
      yield null;
    },
  changeListPage: () =>
    function*(action: Action<number>): IterableIterator<any> {
      console.log(`change page of ${contentName} list`);
      yield null;
    },
  getHistory: () =>
    function*(action: Action<IContentRequest>): IterableIterator<any> {
      console.log(`get history`);
      yield null;
    },
});

export default saga;
