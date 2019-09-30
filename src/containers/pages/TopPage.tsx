import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Redux from 'redux';

import Wireframe from '../wireframe/Wireframe';

import { liveActions } from '../../actions/content';
import Top from '../../components/main/Top';
import { IContentState } from '../../models/ContentState';
import { IMatchParams, QueryType, Uid } from '../../models/Main';
import { IStoreState } from '../../reducers';

interface IOwnProps extends RouteComponentProps<IMatchParams> {}

interface IStateProps {
  query: QueryType<Uid>;
  content: IContentState;
}

interface IDispatchProps {
  actions: {
    prepareTopPage: () => void;
  };
}

type Props = IOwnProps & IStateProps & IDispatchProps;

const mapState2Props = (state: IStoreState, ownProps: IOwnProps): IStateProps => ({
  query: ownProps.location.search
    .replace(/^\?/, '')
    .split('&')
    .reduce((o, s) => ({ ...o, [s.replace(/=.+$/, '')]: s.replace(/^.+=/, '') }), {}),
  content: state.contents,
});

const mapDispatch2Props = (dispatch: Redux.Dispatch, ownProps: IOwnProps): IDispatchProps => {
  return {
    actions: {
      prepareTopPage: () => dispatch(liveActions.prepareTopPage.started()),
    },
  };
};

const TopPage = (props: Props) => {
  React.useState(() => {
    if (!props.content.artists) props.actions.prepareTopPage();
  });

  return (
    <Wireframe title="TOP">
      <Top {...props} />
    </Wireframe>
  );
};

export default withRouter(
  connect(
    mapState2Props,
    mapDispatch2Props
  )(TopPage)
);
