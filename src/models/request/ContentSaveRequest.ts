import { ContentName } from '../../constants/ContentName';
import { IContent } from '../content';

export interface IContentSaveRequest<T extends IContent> {
  contentName: ContentName;
  content?: T;
}
