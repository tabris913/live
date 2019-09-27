import { ContentName } from '../../constants/ContentName';
import { ContentSaga } from './content';

// export { cardSaga, characterSaga, eventSaga, scoutSaga, unitSaga };

// temp: ?
export const contentSagas: { [K in ContentName]?: ContentSaga<any, any> } = {
  // card: cardSaga,
  // artist: {} as any,
};
