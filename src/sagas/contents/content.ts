import { call } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { ContentActions } from '../../actions/content';
import { ContentApis } from '../../apis/content';
import { IContent, IContentAdditionalState } from '../../models/content';
import { Uid } from '../../models/Main';
import IArtistRequest from '../../models/request/ArtistRequest';
import ILiveRequest from '../../models/request/LiveRequest';
import ILivesRequest from '../../models/request/LivesRequest';
import ISongRequest, { ISongsRequest } from '../../models/request/SongRequest';
import IWorksRequest from '../../models/request/WorksRequest';

export interface ContentSaga<T extends IContent<Uid>, A extends IContentAdditionalState> {
  getArtist: (action: Action<IArtistRequest>) => IterableIterator<any>;
  getArtists: (action: Action<void>) => IterableIterator<any>;
  getWorks: (action: Action<IWorksRequest>) => IterableIterator<any>;
  getSong: (action: Action<ISongRequest>) => IterableIterator<any>;
  getSongs: (action: Action<ISongsRequest>) => IterableIterator<any>;
  getLives: (action: Action<ILivesRequest>) => IterableIterator<any>;
  getLive: (action: Action<ILiveRequest>) => IterableIterator<any>;
}

const saga = <T extends IContent<Uid>, A extends IContentAdditionalState>(
  actions: ContentActions,
  apis: ContentApis
) => ({
  getArtist: () =>
    function*(action: Action<IArtistRequest>): IterableIterator<any> {
      console.log(`get artist`);
      const req = action.payload;
      const res = yield call(apis.getArtist, req);
      console.log(res);
      // yield put(actions.getArtist.done({ params: req, result: res }));
    },
  getArtists: () =>
    function*(action: Action<void>): IterableIterator<any> {
      console.log('get artists');
      const res = yield call(apis.getArtists);
      console.log(res);
      // yield put(actions.getArtists.done({ result: {} }));
    },
  getWorks: () =>
    function*(action: Action<IWorksRequest>): IterableIterator<any> {
      console.log('get works');
      yield null;
    },
  getSong: () =>
    function*(action: Action<ISongRequest>): IterableIterator<any> {
      console.log('get song');
      yield null;
    },
  getSongs: () =>
    function*(action: Action<ISongsRequest>): IterableIterator<any> {
      console.log('get songs');
      yield null;
    },
  getLives: () =>
    function*(action: Action<ILivesRequest>): IterableIterator<any> {
      console.log('get lives');
      yield null;
    },
  getLive: () =>
    function*(action: Action<ILiveRequest>): IterableIterator<any> {
      console.log('get live');
      yield null;
    },
});

export default saga;
