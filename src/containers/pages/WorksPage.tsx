import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Redux from 'redux';
import Works from '../../components/contents/works';
import IArtist from '../../models/contents/artist';
import { IMatchParams, QueryType, WorkUid } from '../../models/Main';
import { IStoreState } from '../../reducers';
import { getArtists } from '../../utils/ArtistUtils';
import Wireframe from '../wireframe/Wireframe';

interface IOwnProps extends RouteComponentProps<IMatchParams> {}

interface IStateProps {
  query: QueryType<WorkUid>;
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

const WorksPage = (props: Props) => {
  const [artist, setArtist] = React.useState<IArtist>();

  React.useState(() =>
    getArtists().then(fr => {
      fr.onload = () => setArtist(JSON.parse(fr.result as string)[props.match.params.id]);
    })
  );

  return artist ? (
    <Wireframe title={artist.name}>
      <Works {...props} />
    </Wireframe>
  ) : (
    <></>
  );
};

export default withRouter(
  connect(
    mapState2Props,
    mapDispatch2Props
  )(WorksPage)
);
