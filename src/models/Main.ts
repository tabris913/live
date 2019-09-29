import { RouteComponentProps } from 'react-router-dom';
import { ContentName } from '../constants/ContentName';
import PageName from '../constants/PageName';
import { IContent, IContentAdditionalState } from './content';
import { IContentsState } from './ContentState';
import { IContentRequest } from './request/ContentRequest';
import { IContentSaveRequest } from './request/ContentSaveRequest';
import { IListRequest } from './request/ListRequest';

// query
export interface QueryType<U extends Uid> {
  id?: U;
  page?: number;
}

export interface IMatchParams {
  id: string;
  type: string;
}

// uid
export interface Uid extends String {}
export interface ArtistUid extends Uid {}
export interface WorkUid extends Uid {}
export interface SongUid extends Uid {}
export interface TourUid extends Uid {}
export interface LiveUid extends Uid {}

// component

export interface MainProps<U extends Uid> extends RouteComponentProps<IMatchParams> {
  query: QueryType<U>;
  contents?: IContentsState;
}

export interface ListComponentProps<U extends Uid, T extends IContent<U>, A extends IContentAdditionalState>
  extends MainProps<U> {
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

export interface MainContentProps<U extends Uid, T extends IContent<U>> extends MainProps<U> {
  getContent: (req: IContentRequest) => void;
  getHistory?: (req: IContentRequest) => void;
}

export interface TitleProps<U extends Uid, T extends IContent<U>> extends MainContentProps<U, T> {}

export interface BodyProps<U extends Uid, T extends IContent<U>> extends MainContentProps<U, T> {}

export interface ITopButton<U extends Uid> {
  label: string;
  linkto: PageName;
  message: React.ReactNode | undefined;
  popOver?: React.ReactNode;
  query?: QueryType<U>;
}
