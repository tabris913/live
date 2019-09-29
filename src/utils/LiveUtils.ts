import { History } from 'history';
import PageName, { toPublicUrl } from '../constants/PageName';
import ILive from '../models/contents/live';
import { ArtistUid, LiveUid } from '../models/Main';
import { parseText2Json } from './MiscUtils';

export const getLive = async (artistUid: ArtistUid, liveUid: LiveUid) =>
  parseText2Json(await (await fetch(`${process.env.PUBLIC_URL}/json/${artistUid}/lives/${liveUid}.json`)).blob());

export const convertLive = (live: ILive) => ({ ...live, date: new Date(live.date) });

export const toLive = (liveUid: LiveUid, history: History) => history.push(toPublicUrl(PageName.LIVE, [liveUid]));
