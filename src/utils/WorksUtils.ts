import { History } from 'history';
import PageName, { toPublicUrl } from '../constants/PageName';
import { ArtistUid, WorkUid } from '../models/Main';
import { parseText2Json } from './MiscUtils';

export const getWorks = async (artistUid: ArtistUid) =>
  parseText2Json(await (await fetch(`${process.env.PUBLIC_URL}/json/${artistUid}/works.json`)).blob());

export const getWork = async (artistUid: ArtistUid, workUid: WorkUid) => (await getWorks(artistUid))[workUid as string];

export const toWorks = (artistUid: ArtistUid, history: History) =>
  history.push(toPublicUrl(PageName.WORKS, [artistUid]));
