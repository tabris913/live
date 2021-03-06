import { Spin } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Redux from 'redux';
import { liveActions } from '../../actions/content';
import Works from '../../components/contents/works';
import PageName, { toPublicUrl } from '../../constants/PageName';
import { IContentState } from '../../models/ContentState';
import { IMatchParams, QueryType, WorkUid } from '../../models/Main';
import IWorksRequest from '../../models/request/WorksRequest';
import { IStoreState } from '../../reducers';
import Wireframe from '../wireframe/Wireframe';

interface IOwnProps extends RouteComponentProps<IMatchParams> {}

interface IStateProps {
  query: QueryType<WorkUid>;
  content: IContentState;
}

interface IDispatchProps {
  actions: {
    prepareWorksPage: (req: IWorksRequest) => void;
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
      prepareWorksPage: (req: IWorksRequest) => dispatch(liveActions.prepareWorksPage.started(req)),
    },
  };
};

const WorksPage = (props: Props) => {
  React.useState(() => {
    const isDifferentArtist = !props.content.artist || props.content.artist.uid !== props.match.params.id;
    props.actions.prepareWorksPage({
      artistUid: props.match.params.id,
      target: { artist: isDifferentArtist },
    });
  });

  return props.content.artist && props.content.artist.uid === props.match.params.id ? (
    <Wireframe
      title={props.content.artist.name}
      breadcrump={[
        { hrefWithId: toPublicUrl(PageName.ARTIST, [props.match.params.id]), label: props.content.artist.name },
        { label: 'WORKS' },
      ]}
    >
      {props.content.works ? <Works {...props} /> : <Spin />}
    </Wireframe>
  ) : (
    <Spin />
  );
};

export default withRouter(
  connect(
    mapState2Props,
    mapDispatch2Props
  )(WorksPage)
);
