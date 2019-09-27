import { IContent } from '../content';
import ISong from './song';

export default interface IWork extends IContent {
  songs: ISong[];
}
