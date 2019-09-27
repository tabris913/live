import { ContentName } from '../constants/ContentName';
import { ContentActions } from './content';

// export { cardActions, characterActions, eventActions, scoutActions, unitActions };

export const contentActions: { [K in ContentName]: ContentActions<any, any> } = {
  // card: cardActions,
  '': {} as any,
};
