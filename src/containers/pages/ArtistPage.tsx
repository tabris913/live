import { Spin } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Redux from 'redux';
import { liveActions } from '../../actions/content';
import Artist from '../../components/contents/artist';
import { IContentState } from '../../models/ContentState';
import { ArtistUid, IMatchParams, QueryType } from '../../models/Main';
import IArtistRequest from '../../models/request/ArtistRequest';
import { IStoreState } from '../../reducers';
import Wireframe from '../wireframe/Wireframe';

interface IOwnProps extends RouteComponentProps<IMatchParams> {}

interface IStateProps {
  query: QueryType<ArtistUid>;
  content: IContentState;
}

interface IDispatchProps {
  actions: {
    prepareArtistPage: (req: IArtistRequest) => void;
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
      prepareArtistPage: (req: IArtistRequest) => dispatch(liveActions.prepareArtistPage.started(req)),
    },
  };
};

const ArtistPage = (props: Props) => {
  React.useState(() => {
    const isDifferentArtist = !props.content.artist || props.content.artist.uid !== props.match.params.id;
    if (isDifferentArtist) {
      props.actions.prepareArtistPage({
        artistUid: props.match.params.id,
        target: { artists: !props.content.artists },
      });
    }
  });

  return props.content.artist && props.content.artist.uid === props.match.params.id ? (
    <Wireframe title={props.content.artist.name} breadcrump={[{ label: props.content.artist.name }]}>
      <Artist {...props} />
    </Wireframe>
  ) : (
    <>
      <Spin />
    </>
  );
};

export default withRouter(
  connect(
    mapState2Props,
    mapDispatch2Props
  )(ArtistPage)
);
