import * as R from 'ramda';
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { ContentActions } from '../../actions/content';
import { ContentApis } from '../../apis/content';
import IArtist from '../../models/contents/artist';
import ILive, { ILives } from '../../models/contents/live';
import ISong, { ISongs } from '../../models/contents/song';
import { IContentState } from '../../models/ContentState';
import IArtistRequest from '../../models/request/ArtistRequest';
import ILiveRequest from '../../models/request/LiveRequest';
import ILivesRequest, { ITourRequest, ITourSummaryRequest } from '../../models/request/LivesRequest';
import IPRequest from '../../models/request/PRequest';
import ISongRequest, { ISongsRequest, ISongSummaryRequest } from '../../models/request/SongRequest';
import IWorksRequest from '../../models/request/WorksRequest';
import { infoFromDetail } from '../../utils/LiveUtils';
import { ReturnedType } from '../../utils/MiscUtils';
import { Encore } from '../../utils/SongUtils';

export interface ContentSaga {
  getArtist: (action: Action<IArtistRequest>) => IterableIterator<any>;
  getArtists: (action: Action<void>) => IterableIterator<any>;
  getWorks: (action: Action<IWorksRequest>) => IterableIterator<any>;
  getSong: (action: Action<ISongRequest>) => IterableIterator<any>;
  getSongs: (action: Action<ISongsRequest>) => IterableIterator<any>;
  getLives: (action: Action<ILivesRequest>) => IterableIterator<any>;
  getLive: (action: Action<ILiveRequest>) => IterableIterator<any>;

  prepareTopPage: (action: Action<void>) => IterableIterator<any>;
  prepareArtistPage: (action: Action<IArtistRequest>) => IterableIterator<any>;
  prepareWorksPage: (action: Action<IWorksRequest>) => IterableIterator<any>;
  prepareLiveListPage: (action: Action<ILivesRequest>) => IterableIterator<any>;
  prepareTourPage: (action: Action<ITourRequest>) => IterableIterator<any>;
  prepareSongPage: (action: Action<ISongRequest>) => IterableIterator<any>;
  prepareLivePage: (action: Action<ILiveRequest>) => IterableIterator<any>;
  prepareSongSummaryPage: (action: Action<ISongSummaryRequest>) => IterableIterator<any>;
  prepareTourSummaryPage: (action: Action<ITourSummaryRequest>) => IterableIterator<any>;

  postLive: (action: Action<IPRequest<ILive>>) => IterableIterator<any>;
}

const saga = (actions: ContentActions, apis: ContentApis) => ({
  getArtist: () =>
    function*(action: Action<IArtistRequest>): IterableIterator<any> {
      const req = action.payload;
      const res: ReturnedType<typeof apis.getArtists> = yield call(apis.getArtists);
      let artist: IArtist;
      if (Object.keys(res).includes(req.artistUid as string)) {
        artist = res[req.artistUid as string];
      } else throw {};
      yield put(actions.getArtist.done({ params: req, result: artist }));
    },
  getArtists: () =>
    function*(action: Action<void>): IterableIterator<any> {
      console.log('get artists');
      const req = action.payload;
      const res: ReturnedType<typeof apis.getArtists> = yield call(apis.getArtists);
      yield put(actions.getArtists.done({ params: req, result: res }));
    },
  getWorks: () =>
    function*(action: Action<IWorksRequest>): IterableIterator<any> {
      console.log('get works');
      const req = action.payload;
      const res: ReturnedType<typeof apis.getWorks> = yield call(apis.getWorks, req);
      const resSongs: ReturnedType<typeof apis.getSongs> = yield call(apis.getSongs, {
        artistUid: req.artistUid,
      });
      for (const workUid of Object.keys(res)) {
        res[workUid as string].songs_detail = R.filter((value: ISongs) => res.songs.includes(value.uid), resSongs);
      }
      yield put(actions.getWorks.done({ params: req, result: res }));
    },
  getSong: () =>
    function*(action: Action<ISongRequest>): IterableIterator<any> {
      console.log('get song');
      const req = action.payload;
      const res: ReturnedType<typeof apis.getSongs> = yield call(apis.getSongs, req);
      if (!Object.keys(res).includes(req.songUid as string)) throw {};
      yield put(actions.getSong.done({ params: req, result: res[req.songUid as string] }));
    },
  getSongs: () =>
    function*(action: Action<ISongsRequest>): IterableIterator<any> {
      console.log('get songs');
      const req = action.payload;
      let res: ReturnedType<typeof apis.getSongs> = yield call(apis.getSongs, req);
      if (req.workUid) {
        const workRes: ReturnedType<typeof apis.getWorks> = yield call(apis.getWorks, { artistUid: req.artistUid });
        const work = workRes[req.workUid as string];
        if (Object.keys(workRes).includes(req.workUid as string)) {
          res = Object.entries(res).reduce((prev, [uid, _work]) => {
            if (work.songs.includes(uid)) return { ...prev, [uid]: work };
            return prev;
          }, {});
        }
      }
      yield put(actions.getSongs.done({ params: req, result: res }));
    },
  getLives: () =>
    function*(action: Action<ILivesRequest>): IterableIterator<any> {
      console.log('get lives');
      const req = action.payload;
      const res: ReturnedType<typeof apis.getLives> = yield call(apis.getLives, req);
      yield put(actions.getLives.done({ params: req, result: res }));
    },
  getLive: () =>
    function*(action: Action<ILiveRequest>): IterableIterator<any> {
      console.log('get live');
      const req = action.payload;
      const res: ReturnedType<typeof apis.getLive> = yield call(apis.getLive, req);
      yield put(actions.getLive.done({ params: req, result: res }));
    },

  prepareTopPage: () =>
    function*(action: Action<void>): IterableIterator<any> {
      console.log('prepare top page');
      const req = action.payload;
      const result: IContentState = { artists: yield call(apis.getArtists) };
      if (!result.artists) throw {};

      yield put(actions.prepareTopPage.done({ params: req, result: result }));
    },
  prepareArtistPage: () =>
    function*(action: Action<IArtistRequest>): IterableIterator<any> {
      console.log('prepare artist page');
      const req = action.payload;
      const result: IContentState = { artist: yield call(apis.getArtist, req) };
      if (!result.artist) throw {};

      if (req.target && req.target.artist) result.artists = yield call(apis.getArtists);

      yield put(actions.prepareArtistPage.done({ params: req, result: result }));
    },
  prepareWorksPage: () =>
    function*(action: Action<IWorksRequest>): IterableIterator<any> {
      console.log('prepare works page');
      const req = action.payload;
      const result: IContentState = { works: yield call(apis.getWorks, req), songs: yield call(apis.getSongs, req) };
      if (!result.works) throw {};

      if (req.target && req.target.artist) result.artist = yield call(apis.getArtist, req);

      // songUid でフィルタリング
      if (req.songUid) {
        result.works = Object.entries(result.works).reduce(
          (prev, [curKey, curVal]) =>
            curVal.songs.includes(req.songUid as string) ? { ...prev, [curKey]: curVal } : { ...prev },
          {}
        );
      }

      yield put(actions.prepareWorksPage.done({ params: req, result: result }));
    },
  prepareLiveListPage: () =>
    function*(action: Action<ILivesRequest>): IterableIterator<any> {
      console.log('prepare live list page');
      const req = action.payload;
      const result: IContentState = { lives: yield call(apis.getLives, req) };
      if (!result.lives) throw {};

      if (req.target && req.target.artist) result.artist = yield call(apis.getArtist, req);

      yield put(actions.prepareLiveListPage.done({ params: req, result: result }));
    },
  prepareTourPage: () =>
    function*(action: Action<ITourRequest>): IterableIterator<any> {
      console.log('prepare tour page');
      const req = action.payload;
      const result: IContentState = {
        liveInfo: yield call(apis.getLiveInfo, { artistUid: req.artistUid, liveUid: req.tourUid }),
      };
      if (!result.liveInfo) throw {};
      result.liveList = [];

      for (let i = 0; i <= result.liveInfo.number; i = i + 1) {
        const liveUid = `${req.tourUid}_${i > 9 ? i : `0${i}`}`;
        const resLives = yield call(apis.getLive, { artistUid: req.artistUid, liveUid: liveUid });
        if (resLives) result.liveList.push(resLives);
      }

      if (req.target && req.target.artist) result.artist = yield call(apis.getArtist, req);
      if (req.target && req.target.lives) result.lives = yield call(apis.getLives, req);

      yield put(actions.prepareTourPage.done({ params: req, result: result }));
    },
  prepareSongPage: () =>
    function*(action: Action<ISongRequest>): IterableIterator<any> {
      console.log('prepare song page');
      const req = action.payload;
      const res: ReturnedType<typeof apis.getSongs> = yield call(apis.getSongs, req);
      console.log(yield call(apis.getArtist, req));
      if (!Object.keys(res).includes(req.songUid as string)) throw {};
      // artist
      let resArtist: ReturnedType<typeof apis.getArtists>;
      if (req.target && req.target.artist) {
        resArtist = yield call(apis.getArtists);
        if (!Object.keys(resArtist).includes(req.artistUid as string)) throw {};
      }
      const resLives: ReturnedType<typeof apis.getLives> = yield call(apis.getLives, { artistUid: req.artistUid });
      const newLives: ILives = {};
      for (const year of Object.keys(resLives)) {
        for (const liveUid of Object.keys(resLives[year])) {
          if (resLives[year][liveUid].is_tour) {
            for (let i = 1; i <= resLives[year][liveUid].number; i = i + 1) {
              const tourLiveUid = `${liveUid}_${i > 9 ? i : `0${i}`}`;
              const resLive: ReturnedType<typeof apis.getLive> = yield call(apis.getLive, {
                artistUid: req.artistUid,
                liveUid: tourLiveUid,
              });
              if (resLive.setlist.includes(req.songUid)) {
                if (!Object.keys(newLives).includes(year)) {
                  (newLives as object)[year] = { [tourLiveUid]: infoFromDetail(resLive) };
                } else {
                  newLives[year] = { ...newLives[year], [tourLiveUid]: infoFromDetail(resLive) };
                }
              }
            }
          } else {
            const resLive: ReturnedType<typeof apis.getLive> = yield call(apis.getLive, {
              artistUid: req.artistUid,
              liveUid: liveUid,
            });
            if (resLive.setlist.includes(req.songUid)) {
              if (!Object.keys(newLives).includes(year)) {
                (newLives as object)[year] = { [liveUid]: resLives[year][liveUid as string] };
              } else {
                newLives[year] = { ...newLives[year], [liveUid]: resLives[year][liveUid as string] };
              }
            }
          }
        }
      }
      yield put(
        actions.prepareSongPage.done({
          params: req,
          result:
            resArtist === undefined
              ? { song: { ...res[req.songUid as string], lives: newLives } }
              : {
                  song: { ...res[req.songUid as string], lives: newLives },
                  artist: resArtist[req.artistUid as string],
                },
        })
      );
    },
  prepareLivePage: () =>
    function*(action: Action<ILiveRequest>): IterableIterator<any> {
      console.log('prepare live page');
      const req = action.payload;
      const result: IContentState = { live: yield call(apis.getLive, req), songs: yield call(apis.getSongs, req) };
      if (!result.live || !result.songs) throw {};
      result.songList = [];

      let track_count = 1;
      for (const songUid of result.live.setlist) {
        let resSong: ISong | undefined = Encore;
        if (songUid !== 'encore') {
          resSong = yield call(apis.getSong, { artistUid: req.artistUid, songUid: songUid });
          track_count = track_count + 1;
        }
        if (!resSong) throw {};
        result.songList.push({ ...resSong, track_no: track_count });
      }

      // artist
      if (req.target && req.target.artist) result.artist = yield call(apis.getArtist, req);

      yield put(actions.prepareLivePage.done({ params: req, result: result }));
    },
  prepareSongSummaryPage: () =>
    function*(action: Action<ISongSummaryRequest>): IterableIterator<any> {
      console.log('prepare song summary page');
      const req = action.payload;
      const result: IContentState = {};

      const resSongs: ReturnedType<typeof apis.getSongs> = yield call(apis.getSongs, { artistUid: req.artistUid });

      if (req.target.songs) result.songs = resSongs;
      if (req.target.song && !Object.keys(resSongs).includes(req.songUid as string)) {
        result.song = resSongs[req.songUid as string];
      }
      if (req.target.works) result.works = yield call(apis.getWorks, { artistUid: req.artistUid });
      if (req.target.artist) {
        result.artists = yield call(apis.getArtists);
        if (result.artists) {
          if (!Object.keys(result.artists).includes(req.artistUid as string)) throw {};
          result.artist = result.artists[req.artistUid as string];
        }
      }

      yield put(actions.prepareSongSummaryPage.done({ params: req, result: result }));
    },
  prepareTourSummaryPage: () =>
    function*(action: Action<ITourSummaryRequest>): IterableIterator<any> {
      console.log('prepare tour summary page');
    },

  postLive: () =>
    function*(action: Action<IPRequest<ILive>>): IterableIterator<any> {
      console.log('post live');
      const req = action.payload;
      yield call(apis.postLive, req);
      yield put(actions.postLive.done({ params: req }));
    },
});

export default saga;
