import { Spin } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Redux from 'redux';
import { liveActions } from '../../actions/content';
import LiveList from '../../components/contents/lives';
import PageName, { toPublicUrl } from '../../constants/PageName';
import { IContentState } from '../../models/ContentState';
import { IMatchParams, QueryType, Uid } from '../../models/Main';
import ILivesRequest from '../../models/request/LivesRequest';
import { IStoreState } from '../../reducers';
import Wireframe from '../wireframe/Wireframe';

interface IOwnProps extends RouteComponentProps<IMatchParams> {}

interface IStateProps {
  query: QueryType<Uid>;
  content: IContentState;
}

interface IDispatchProps {
  actions: {
    prepareLiveListPage: (req: ILivesRequest) => void;
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
      prepareLiveListPage: (req: ILivesRequest) => dispatch(liveActions.prepareLiveListPage.started(req)),
    },
  };
};

const LiveListPage = (props: Props) => {
  React.useState(() => {
    const isDifferentArtist = !props.content.artist || props.content.artist.uid !== props.match.params.id;
    props.actions.prepareLiveListPage({
      artistUid: props.match.params.id,
      target: { artist: isDifferentArtist },
    });
  });

  return props.content.artist && props.content.artist.uid === props.match.params.id ? (
    <Wireframe
      title={props.content.artist.name}
      breadcrump={[
        { hrefWithId: toPublicUrl(PageName.ARTIST, [props.match.params.id]), label: props.content.artist.name },
        { label: 'LIVES' },
      ]}
    >
      {props.content.lives ? <LiveList {...props} /> : <Spin />}
    </Wireframe>
  ) : (
    <Spin />
  );
};

export default withRouter(
  connect(
    mapState2Props,
    mapDispatch2Props
  )(LiveListPage)
);
