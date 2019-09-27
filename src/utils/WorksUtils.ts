import { History } from 'history';
import * as Works from '../constants/json/works.json';
import PageName, { toPublicUrl } from '../constants/PageName';
import IWork from '../models/contents/work';

export const getWorks = (artistUid: string): IWork[] | undefined => {
  for (const artist of Works.works) {
    if (artist.uid === artistUid) return artist.works;
  }
  return;
};

export const toWorks = (uid: string, history: History) => history.push(toPublicUrl(PageName.WORKS, [uid]));
