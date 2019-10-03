import { Spin } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Redux from 'redux';
import { liveActions } from '../../actions/content';
import TourSummary from '../../components/contents/tourSummary';
import PageName, { toPublicUrl } from '../../constants/PageName';
import { IContentState } from '../../models/ContentState';
import { IMatchParams, QueryType, TourUid } from '../../models/Main';
import { ITourSummaryRequest } from '../../models/request/LivesRequest';
import { IStoreState } from '../../reducers';
import Wireframe from '../wireframe/Wireframe';

interface IOwnProps extends RouteComponentProps<IMatchParams> {}

interface IStateProps {
  query: QueryType<TourUid>;
  content: IContentState;
}

interface IDispatchProps {
  actions: {
    prepareTourSummaryPage: (req: ITourSummaryRequest) => void;
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
      prepareTourSummaryPage: (req: ITourSummaryRequest) => dispatch(liveActions.prepareTourSummaryPage.started(req)),
    },
  };
};

const TourSummaryPage = (props: Props) => {
  React.useState(() => {
    const isDifferentArtist = !props.content.artist || props.content.artist.uid !== props.match.params.id;
    props.actions.prepareTourSummaryPage({
      artistUid: props.match.params.id,
      tourUid: props.query.id!,
      target: {
        artist: isDifferentArtist,
        lives: !props.content.lives,
      },
    });
  });

  return props.content.liveInfo && props.content.artist ? (
    <Wireframe
      title={`${props.content.liveInfo.name}`}
      breadcrump={[
        { hrefWithId: toPublicUrl(PageName.ARTIST, [props.match.params.id]), label: props.content.artist.name },
        { hrefWithId: toPublicUrl(PageName.LIVE_LIST, [props.match.params.id]), label: 'LIVES' },
        {
          hrefWithId: toPublicUrl(PageName.TOUR, [props.match.params.id], props.query.id),
          label: props.content.liveInfo.name,
        },
        { label: 'summary' },
      ]}
    >
      <TourSummary {...props} />
    </Wireframe>
  ) : (
    <Spin />
  );
};

export default withRouter(
  connect(
    mapState2Props,
    mapDispatch2Props
  )(TourSummaryPage)
);
