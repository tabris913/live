import { ContentName } from '../../constants/ContentName';
import { IContent } from '../content';
import { Uid } from '../Main';

export interface IContentSaveRequest<T extends IContent<Uid>> {
  contentName: ContentName;
  content?: T;
}
