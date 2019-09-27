import { History } from 'history';
import * as Artists from '../constants/json/artists.json';
import PageName, { toPublicUrl } from '../constants/PageName';
import IArtist from '../models/contents/artist';

export const getArtists = (): IArtist[] => Artists.artists;

/**
 * uid でアーティストを検索する
 * @param uid 識別子
 */
export const getArtist = (uid: string): IArtist | undefined => {
  for (const artist of Artists.artists) {
    if (artist.uid === uid) return artist;
  }
  // uid が一致するものがなければ undefined
  return;
};

export const toArtist = (uid: string, history: History) => history.push(toPublicUrl(PageName.ARTIST, [uid]));
