import { Divider, Layout, Typography } from 'antd';
import { History } from 'history';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Redux from 'redux';

import breadCrump from './BreadCrump';
import { Footer } from './Footer';
import Header from './Header';

import { IBreadCrump } from '../../models/wireframe/BreadCrump';
import { IStoreState } from '../../reducers';

interface IOwnProps extends RouteComponentProps<{}> {
  title?: string;
  children?: React.ReactNode;
  breadcrump?: IBreadCrump[];
}

interface IStateProps {}

interface IDispatchProps {}

type Props = IStateProps & IOwnProps & IDispatchProps & { history: History };

const mapState2Props = (state: IStoreState, ownProps: IOwnProps): IStateProps => ({});

const mapDispatch2Props = (dispatch: Redux.Dispatch, ownProps: IOwnProps) => {
  return {};
};

const Wireframe = (props: Props) => (
  <Layout style={{ height: '100vh' }}>
    <Header {...props} />
    <Divider style={{ marginTop: 10, marginBottom: 10 }} />
    <Layout style={{ padding: '0 20px' }}>
      {breadCrump(props.breadcrump || [], props.history)}
      {props.title && (
        <Typography.Title underline={true} level={3} style={{ marginBottom: 5 }}>
          {props.title}
        </Typography.Title>
      )}
      {props.children}
    </Layout>
    <Divider style={{ marginTop: 10, marginBottom: 10 }} />
    <Footer />
  </Layout>
);

export default withRouter(
  connect(
    mapState2Props,
    mapDispatch2Props
  )(Wireframe)
);
