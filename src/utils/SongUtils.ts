import { History } from 'history';
import PageName, { toPublicUrl } from '../constants/PageName';
import { ArtistUid, SongUid } from '../models/Main';
import { parseText2Json } from './MiscUtils';

export const getSongs = async (artistUid: ArtistUid) =>
  parseText2Json(await (await fetch(`${process.env.PUBLIC_URL}/json/${artistUid}/songs.json`)).blob());

export const getSong = async (artistUid: ArtistUid, songUid: SongUid) => (await getSongs(artistUid))[songUid as string];

export const toSong = (songUid: SongUid, history: History) => history.push(toPublicUrl(PageName.SONG, [songUid]));
