import { Spin } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Redux from 'redux';
import { liveActions } from '../../actions/content';
import Tour from '../../components/contents/tour';
import { IContentState } from '../../models/ContentState';
import { IMatchParams, QueryType, TourUid } from '../../models/Main';
import { ITourRequest } from '../../models/request/LivesRequest';
import { IStoreState } from '../../reducers';
import Wireframe from '../wireframe/Wireframe';

interface IOwnProps extends RouteComponentProps<IMatchParams> {}

interface IStateProps {
  query: QueryType<TourUid>;
  content: IContentState;
}

interface IDispatchProps {
  actions: {
    prepareTourPage: (req: ITourRequest) => void;
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
      prepareTourPage: (req: ITourRequest) => dispatch(liveActions.prepareTourPage.started(req)),
    },
  };
};

const TourPage = (props: Props) => {
  React.useState(() =>
    props.actions.prepareTourPage({
      artistUid: props.match.params.id,
      tourUid: props.query.id!,
    })
  );

  return props.content.liveInfo ? (
    <Wireframe title={`${props.content.liveInfo.name}`}>
      <Tour {...props} />
    </Wireframe>
  ) : (
    <Spin />
  );
};

export default withRouter(
  connect(
    mapState2Props,
    mapDispatch2Props
  )(TourPage)
);
