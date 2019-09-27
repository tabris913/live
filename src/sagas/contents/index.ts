import { ContentName } from '../../constants/ContentName';
import { ContentSaga } from './content';

// export { cardSaga, characterSaga, eventSaga, scoutSaga, unitSaga };

export const contentSagas: { [K in ContentName]: ContentSaga<any, any> } = {
  // card: cardSaga,
  '': {} as any,
};
