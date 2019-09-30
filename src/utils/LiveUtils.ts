import { History } from 'history';
import PageName, { toPublicUrl } from '../constants/PageName';
import ILive from '../models/contents/live';
import { ArtistUid, LiveUid, TourUid } from '../models/Main';
import { parseText2Json } from './MiscUtils';

export const getLive = async (artistUid: ArtistUid, liveUid: LiveUid) =>
  parseText2Json(await (await fetch(`${process.env.PUBLIC_URL}/json/${artistUid}/lives/${liveUid}.json`)).blob());

export const convertLive = (live: ILive) => ({ ...live, date: new Date(live.date) });

export const toLive = (artistUid: ArtistUid, liveUid: LiveUid, history: History) =>
  history.push(toPublicUrl(PageName.LIVE, [artistUid], { id: liveUid }));

export const toTour = (artistUid: ArtistUid, tourUid: TourUid, history: History) =>
  history.push(toPublicUrl(PageName.TOUR, [artistUid], { id: tourUid }));
