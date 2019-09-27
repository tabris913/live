import { RouteComponentProps } from 'react-router-dom';
import { ContentName } from '../constants/ContentName';
import { IContent, IContentAdditionalState } from './content';
import { IContentsState } from './ContentState';
import { IContentRequest } from './request/ContentRequest';
import { IContentSaveRequest } from './request/ContentSaveRequest';
import { IListRequest } from './request/ListRequest';

export interface QueryType {
  id?: string;
  page?: number;
}

export interface IMatchParams {
  id: string;
  type: string;
}

export interface MainProps extends RouteComponentProps<IMatchParams> {
  query: QueryType;
  contents?: IContentsState;
}

export interface ListComponentProps<T extends IContent, A extends IContentAdditionalState> extends MainProps {
  saveContent: (content: IContentSaveRequest<T>) => void;
  getList: (req: IListRequest) => void;
  changeListPage: (req: number) => void;
  contentName: ContentName;
  pageSize?: number;
  headers?: (item: T) => JSX.Element;
  descriptions?: (props: { item: T }) => JSX.Element;
  filter?: (list?: T[]) => T[];
  selector?: ({ localState, setLocalState }: { localState: any; setLocalState: (o: any) => void }) => JSX.Element;
}

export interface MainContentProps<T extends IContent> extends MainProps {
  getContent: (req: IContentRequest) => void;
  getHistory?: (req: IContentRequest) => void;
}

export interface TitleProps<T extends IContent> extends MainContentProps<T> {}

export interface BodyProps<T extends IContent> extends MainContentProps<T> {}
