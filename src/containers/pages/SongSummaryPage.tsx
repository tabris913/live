import { Spin } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Redux from 'redux';
import { liveActions } from '../../actions/content';
import SongSummary from '../../components/contents/songSummary';
import PageName, { toPublicUrl } from '../../constants/PageName';
import { IContentState } from '../../models/ContentState';
import { IMatchParams, QueryType, SongUid } from '../../models/Main';
import { ISongSummaryRequest } from '../../models/request/SongRequest';
import { IStoreState } from '../../reducers';
import Wireframe from '../wireframe/Wireframe';

interface IOwnProps extends RouteComponentProps<IMatchParams> {}

interface IStateProps {
  query: QueryType<SongUid>;
  content: IContentState;
}

interface IDispatchProps {
  actions: {
    prepareSongSummaryPage: (req: ISongSummaryRequest) => void;
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
      prepareSongSummaryPage: (req: ISongSummaryRequest) => dispatch(liveActions.prepareSongSummaryPage.started(req)),
    },
  };
};

const SongPage = (props: Props) => {
  React.useState(() => {
    const isDifferentSong = !props.content.song || props.content.song.uid !== props.query.id;
    const isDifferentArtist = !props.content.artist || props.content.artist.uid !== props.match.params.id;
    if (isDifferentSong || isDifferentArtist) {
      props.actions.prepareSongSummaryPage({
        artistUid: props.match.params.id,
        songUid: props.query.id!,
        target: { artist: isDifferentArtist, songs: !props.content.songs },
      });
    }
  });

  return props.content.song && props.content.artist ? (
    <Wireframe
      title={props.content.song.name}
      breadcrump={[
        { label: props.content.artist.name, hrefWithId: toPublicUrl(PageName.ARTIST, [props.match.params.id]) },
        { label: 'WORKS', hrefWithId: toPublicUrl(PageName.WORKS, [props.match.params.id]) },
        {
          label: props.content.song.name,
          hrefWithId: toPublicUrl(PageName.SONG, [props.match.params.id], props.query.id),
        },
        { label: 'summary' },
      ]}
    >
      <SongSummary {...props} />
    </Wireframe>
  ) : (
    <Spin />
  );
};

export default withRouter(
  connect(
    mapState2Props,
    mapDispatch2Props
  )(SongPage)
);
