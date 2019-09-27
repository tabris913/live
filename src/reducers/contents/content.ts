import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { ContentActions } from '../../actions/content';
import { IContent, IContentAdditionalState } from '../../models/content';
import { IContentState } from '../../models/ContentState';

export const contentReducerBuilder = <T extends IContent, A extends IContentAdditionalState>(
  actions: ContentActions<T, A>,
  initialValue: T
) => {
  let reducer = reducerWithInitialState<IContentState<T, A>>({})
    .caseWithAction(actions.getContent, (state, action) => {
      switch (action.payload.contentName) {
        // case 'event':
        //   const eventAdditional: IEventAdditionalState = {
        //     ...state.additional,
        //     card: getEventScoutCard(action.payload.uid),
        //   };
        //   switch (action.payload.type) {
        //     case 'special':
        //       return {
        //         ...state,
        //         content: getSpecial(action.payload.uid) as any,
        //         type: action.payload.type,
        //         additional: eventAdditional as any,
        //       };
        //     case 'uc':
        //       console.log('get');
        //       return {
        //         ...state,
        //         content: getUnitCollection(action.payload.uid) as any,
        //         type: action.payload.type,
        //         additional: eventAdditional as any,
        //       };
        //     default:
        //       return {
        //         ...state,
        //         content: getEvent(action.payload.uid) as any,
        //         type: action.payload.type,
        //         additional: eventAdditional as any,
        //       };
        //   }
        // case 'scout':
        //   const scoutAdditional: IScoutAdditionalState = {
        //     ...state.additional,
        //     card: getEventScoutCard(action.payload.uid),
        //   };
        //   return { ...state, content: getScout(action.payload.uid) as any, additional: scoutAdditional as any };
        // case 'unit':
        //   return { ...state, content: getUnit(action.payload.uid) as any };
        // case 'character':
        //   const characterAdditional: ICharacterAdditionalState = {
        //     history: [],
        //     ...state.additional,
        //     event: getCharacterEvent(action.payload.uid),
        //     scout: getCharacterScout(action.payload.uid),
        //     card: getCharacterCard(action.payload.uid),
        //   };
        //   return { ...state, content: getCharacter(action.payload.uid), additional: characterAdditional as any };
        // case 'card':
        //   return { ...state, content: getCard(action.payload.uid) };
        default:
          return { ...state };
      }
    })
    .caseWithAction(actions.saveContent, (state, action) => {
      switch (action.payload.contentName) {
        // case 'event':
        //   const eventAdditional: IEventAdditionalState = {
        //     ...state.additional,
        //     card: action.payload.content ? getEventScoutCard(action.payload.content.uid) : [],
        //   };
        //   return { ...state, content: action.payload.content, additional: eventAdditional as any };
        // case 'scout':
        //   const scoutAdditional: IScoutAdditionalState = {
        //     ...state.additional,
        //     card: action.payload.content ? getEventScoutCard(action.payload.content.uid) : [],
        //   };
        //   return { ...state, content: action.payload.content, additional: scoutAdditional };
        // case 'unit':
        //   return { ...state, content: action.payload.content };
        // case 'character':
        //   const characterAdditional: ICharacterAdditionalState = action.payload.content
        //     ? {
        //         history: [],
        //         ...state.additional,
        //         event: getCharacterEvent(action.payload.content.uid),
        //         scout: getCharacterScout(action.payload.content.uid),
        //         card: getCharacterCard(action.payload.content.uid),
        //       }
        //     : { event: [], scout: [], card: [], history: [], ...state.additional };
        //   return { ...state, content: action.payload.content, additional: characterAdditional };
        // case 'card':
        //   return { ...state, content: action.payload.content };
        default:
          return { ...state };
      }
    })
    .caseWithAction(actions.getList, (state, action) => {
      switch (action.payload.contentName) {
        // case 'event':
        //   switch (action.payload.type) {
        //     case 'special':
        //       return { ...state, list: getSpecials() as any, type: action.payload.type };
        //     case 'uc':
        //       return { ...state, list: getUnitCollections() as any, type: action.payload.type };
        //     default:
        //       return { ...state, list: getEvents() as any, type: action.payload.type };
        //   }
        // case 'scout':
        //   return { ...state, list: getScouts() as any };
        // case 'unit':
        //   return { ...state, list: getUnits() };
        // case 'character':
        //   return { ...state, list: getCharacters() };
        // case 'card':
        //   return { ...state, list: getCards() };
        default:
          return { ...state };
      }
    })
    .caseWithAction(actions.changeListPage, (state, action) => ({ ...state, listPage: action.payload }));

  if (actions.getHistory) {
    reducer = reducer.caseWithAction(actions.getHistory, (state, action) => {
      // if (action.payload.contentName !== 'character') return state;

      // const characterAdditional: ICharacterAdditionalState = {
      //   event: [],
      //   scout: [],
      //   card: [],
      //   ...state.additional,
      //   history: getCharacterHistory(action.payload.uid),
      // };

      return { ...state }; // { ...state, additional: characterAdditional as any };
    });
  }

  return reducer;
};
