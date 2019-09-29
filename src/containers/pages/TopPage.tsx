import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Redux from 'redux';

import Wireframe from '../wireframe/Wireframe';

import { Actions } from '../../actions/content';
import Top from '../../components/main/Top';
import { IMatchParams, QueryType, Uid } from '../../models/Main';
import { IArtistsRequest } from '../../models/request/ArtistRequest';
import { IStoreState } from '../../reducers';

interface IOwnProps extends RouteComponentProps<IMatchParams> {}

interface IStateProps {
  query: QueryType<Uid>;
}

interface IDispatchProps {
  actions: {
    getArtists: (req: IArtistsRequest) => void;
  };
}

type Props = IOwnProps & IStateProps & IDispatchProps;

const mapState2Props = (state: IStoreState, ownProps: IOwnProps): IStateProps => ({
  query: ownProps.location.search
    .replace(/^\?/, '')
    .split('&')
    .reduce((o, s) => ({ ...o, [s.replace(/=.+$/, '')]: s.replace(/^.+=/, '') }), {}),
});

const mapDispatch2Props = (dispatch: Redux.Dispatch, ownProps: IOwnProps): IDispatchProps => {
  return {
    actions: {
      getArtists: (req: IArtistsRequest) => dispatch(Actions.getArtists.started),
    },
  };
};

const TopPage = (props: Props) => {
  props.actions.getArtists({});
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
