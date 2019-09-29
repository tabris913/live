import { History } from 'history';
import PageName, { toPublicUrl } from '../constants/PageName';
import { ArtistUid } from '../models/Main';
import { parseText2Json } from './MiscUtils';

export const getArtists = async () =>
  parseText2Json(await (await fetch(`${process.env.PUBLIC_URL}/json/artists.json`, { method: 'GET' })).blob());

export const getArtist = async (uid: ArtistUid) => (await getArtists())[uid as string];

export const toArtist = (uid: ArtistUid, history: History) => history.push(toPublicUrl(PageName.ARTIST, [uid]));
