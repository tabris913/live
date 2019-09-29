import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { ContentActions } from '../../actions/content';
import { IContent, IContentAdditionalState } from '../../models/content';
import { IContentState } from '../../models/ContentState';
import { Uid } from '../../models/Main';

export const contentReducerBuilder = <T extends IContent<Uid>, A extends IContentAdditionalState>(
  actions: ContentActions,
  initialValue: T
) => {
  const reducer = reducerWithInitialState<IContentState<T, A>>({}).caseWithAction(
    actions.getArtists.started,
    (state, action) => {
      console.log('reducer');
      return { ...state };
    }
  );

  return reducer;
};
