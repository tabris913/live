import { Spin } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Redux from 'redux';
import { liveActions } from '../../actions/content';
import Choice from '../../components/contents/choice';
import { IContentState } from '../../models/ContentState';
import { ArtistUid, IMatchParams, QueryType } from '../../models/Main';
import IChoiceRequest from '../../models/request/ChoiceRequest';
import { IStoreState } from '../../reducers';
import Wireframe from '../wireframe/Wireframe';

interface IOwnProps extends RouteComponentProps<IMatchParams> {}

interface IStateProps {
  query: QueryType<ArtistUid>;
  content: IContentState;
}

interface IDispatchProps {
  actions: {
    prepareChoicePage: (req: IChoiceRequest) => void;
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
      prepareChoicePage: (req: IChoiceRequest) => dispatch(liveActions.prepareChoicePage.started(req)),
    },
  };
};

const ChoicePage = (props: Props) => {
  React.useState(() => {
    const isDifferentArtist = !props.content.artist || props.content.artist.uid !== props.match.params.id;
    props.actions.prepareChoicePage({
      artistUid: props.match.params.id,
      target: { artist: isDifferentArtist },
    });
  });

  return props.content.artist && props.content.artist.uid === props.match.params.id && props.content.songs ? (
    <Wireframe title={props.content.artist.name} breadcrump={[{ label: props.content.artist.name }]}>
      <Choice {...props} />
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
  )(ChoicePage)
);
