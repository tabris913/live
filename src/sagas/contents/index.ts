import { liveActions } from '../../actions/content';
import { liveApis } from '../../apis/content';
import { ContentName } from '../../constants/ContentName';
import saga, { ContentSaga } from './content';

// export { cardSaga, characterSaga, eventSaga, scoutSaga, unitSaga };

const sagas = saga(liveActions, liveApis);
export const liveSaga: ContentSaga = {
  getArtist: sagas.getArtist(),
  getArtists: sagas.getArtists(),
  getWorks: sagas.getWorks(),
  getSong: sagas.getSong(),
  getSongs: sagas.getSongs(),
  getLives: sagas.getLives(),
  getLive: sagas.getLive(),

  prepareTopPage: sagas.prepareTopPage(),
  prepareArtistPage: sagas.prepareArtistPage(),
  prepareWorksPage: sagas.prepareWorksPage(),
  prepareLiveListPage: sagas.prepareLiveListPage(),
  prepareTourPage: sagas.prepareTourPage(),
  prepareSongPage: sagas.prepareSongPage(),
  prepareLivePage: sagas.prepareLivePage(),
  prepareSongSummaryPage: sagas.prepareSongSummaryPage(),
  prepareTourSummaryPage: sagas.prepareTourSummaryPage(),

  postLive: sagas.postLive(),
};

// temp: ?
export const contentSagas: { [K in ContentName]?: ContentSaga } = {
  // card: cardSaga,
  // artist: {} as any,
};
