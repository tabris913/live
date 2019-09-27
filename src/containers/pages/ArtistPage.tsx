import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Redux from 'redux';
import Artist from '../../components/contents/artist';
import { IMatchParams, QueryType } from '../../models/Main';
import { IStoreState } from '../../reducers';
import { getArtist } from '../../utils/ArtistUtils';
import Wireframe from '../wireframe/Wireframe';

interface IOwnProps extends RouteComponentProps<IMatchParams> {}

interface IStateProps {
  query: QueryType;
}

interface IDispatchProps {}

type Props = IOwnProps & IStateProps & IDispatchProps;

const mapState2Props = (state: IStoreState, ownProps: IOwnProps): IStateProps => ({
  query: ownProps.location.search
    .replace(/^\?/, '')
    .split('&')
    .reduce((o, s) => ({ ...o, [s.replace(/=.+$/, '')]: s.replace(/^.+=/, '') }), {}),
});

const mapDispatch2Props = (dispatch: Redux.Dispatch, ownProps: IOwnProps): IDispatchProps => {
  return {};
};

const ArtistPage = (props: Props) => {
  const artist = getArtist(props.match.params.id);
  return artist ? (
    <Wireframe title={artist.name}>
      <Artist {...props} />
    </Wireframe>
  ) : (
    <></>
  );
};

export default withRouter(
  connect(
    mapState2Props,
    mapDispatch2Props
  )(ArtistPage)
);
