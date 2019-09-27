import * as Q from 'querystring';

enum PageName {
  TOP = '/top',

  ARTIST = '/artist',
  WORKS = '/works',
  SONG = '/song',
  SONG_SUMMARY = '/song/summary',

  LIVE_LIST = '/lives',
  LIVE = '/live',
  LIVE_SUMMARY = '/live/summary',

  UNDEFINED = '',
}

// tslint:disable-next-line array-type
export const toPublicUrl = (page: PageName, suffixList?: (string | number)[], param?: any) => {
  const suffix = suffixList && suffixList.length > 0 ? `/${suffixList.join('/')}` : '';
  const stringifiedParam = param ? `?${Q.stringify(param)}` : '';
  return process.env.PUBLIC_URL + page + suffix + stringifiedParam;
};

export default PageName;
