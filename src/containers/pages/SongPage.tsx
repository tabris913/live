import { Spin } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Redux from 'redux';
import { liveActions } from '../../actions/content';
import Song from '../../components/contents/song';
import { IContentState } from '../../models/ContentState';
import { IMatchParams, QueryType, SongUid } from '../../models/Main';
import ISongRequest from '../../models/request/SongRequest';
import { IStoreState } from '../../reducers';
import Wireframe from '../wireframe/Wireframe';

interface IOwnProps extends RouteComponentProps<IMatchParams> {}

interface IStateProps {
  query: QueryType<SongUid>;
  content: IContentState;
}

interface IDispatchProps {
  actions: {
    prepareSongPage: (req: ISongRequest) => void;
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
      prepareSongPage: (req: ISongRequest) => dispatch(liveActions.prepareSongPage.started(req)),
    },
  };
};

const SongPage = (props: Props) => {
  React.useState(() =>
    props.actions.prepareSongPage({
      artistUid: props.match.params.id,
      songUid: props.query.id!,
    })
  );

  return props.content.song ? (
    <Wireframe title={props.content.song.name}>
      <Song {...props} />
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
