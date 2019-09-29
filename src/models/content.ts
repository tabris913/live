import { Uid } from './Main';

export interface IContent<T extends Uid> {
  uid: T;
  name: string;
}

export interface IContentAdditionalState {}
