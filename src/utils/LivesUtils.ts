import { History } from 'history';
import PageName, { toPublicUrl } from '../constants/PageName';
import { ArtistUid } from '../models/Main';
import { parseText2Json } from './MiscUtils';

export const getLives = async (artistUid: ArtistUid) =>
  parseText2Json(await (await fetch(`${process.env.PUBLIC_URL}/json/${artistUid}/lives.json`)).blob());

export const toLives = (artistUid: ArtistUid, history: History) =>
  history.push(toPublicUrl(PageName.LIVE_LIST, [artistUid]));
