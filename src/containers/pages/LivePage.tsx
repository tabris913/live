import { Spin } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Redux from 'redux';
import { liveActions } from '../../actions/content';
import Live from '../../components/contents/live';
import PageName, { toPublicUrl } from '../../constants/PageName';
import { IContentState } from '../../models/ContentState';
import { IMatchParams, LiveUid, QueryType } from '../../models/Main';
import ILiveRequest from '../../models/request/LiveRequest';
import { IStoreState } from '../../reducers';
import Wireframe from '../wireframe/Wireframe';

interface IOwnProps extends RouteComponentProps<IMatchParams> {}

interface IStateProps {
  query: QueryType<LiveUid>;
  content: IContentState;
}

interface IDispatchProps {
  actions: {
    prepareLivePage: (req: ILiveRequest) => void;
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
      prepareLivePage: (req: ILiveRequest) => dispatch(liveActions.prepareLivePage.started(req)),
    },
  };
};

const LivePage = (props: Props) => {
  React.useState(() => {
    const isDifferentArtist = !props.content.artist || props.content.artist.uid !== props.match.params.id;
    props.actions.prepareLivePage({
      artistUid: props.match.params.id,
      liveUid: props.query.id!,
      target: {
        artist: isDifferentArtist,
      },
    });
  });

  return props.content.live && props.content.artist ? (
    <Wireframe
      title={props.content.live.name}
      breadcrump={
        props.content.live.is_tour
          ? [
              { hrefWithId: toPublicUrl(PageName.ARTIST, [props.match.params.id]), label: props.content.artist.name },
              { hrefWithId: toPublicUrl(PageName.LIVE_LIST, [props.match.params.id]), label: 'LIVES' },
              {
                hrefWithId: toPublicUrl(PageName.TOUR, [props.match.params.id], {
                  id: props.content.live.uid.slice(0, -3),
                }),
                label: 'TOUR',
              },
            ]
          : [
              { hrefWithId: toPublicUrl(PageName.ARTIST, [props.match.params.id]), label: props.content.artist.name },
              { hrefWithId: toPublicUrl(PageName.LIVE_LIST, [props.match.params.id]), label: 'LIVES' },
            ]
      }
    >
      <Live {...props} />
    </Wireframe>
  ) : (
    <Spin />
  );
};

export default withRouter(
  connect(
    mapState2Props,
    mapDispatch2Props
  )(LivePage)
);
