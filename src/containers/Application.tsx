import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PageName, { toPublicUrl } from '../constants/PageName';

import * as Page from './pages';

import { LocaleProvider } from 'antd';
import jaJP from 'antd/lib/locale-provider/ja_JP';
import * as moment from 'moment-timezone';
import 'moment/locale/ja';
import '../App.css';
moment.locale('ja');
moment.tz.setDefault('Asia/Tokyo');

type MakeRoute = [PageName, React.ComponentClass, boolean];

const makeRoute = ([pageName, component, suffix]: MakeRoute) => (
  <Route exact={true} path={toPublicUrl(pageName, suffix ? [':id?'] : [])} component={component} key={pageName} />
);

const Application = () => (
  <LocaleProvider locale={jaJP}>
    <React.Fragment>
      <div className="App">
        <Switch>
          <Route path={toPublicUrl(PageName.TOP)} component={Page.TopPage} exact={true} />

          {/* ListPage */}
          {[[PageName.ARTIST, Page.ArtistPage, true], [PageName.WORKS, Page.WorksPage, true]]
            .map(e => e as MakeRoute)
            .map(e => makeRoute(e))}

          <Redirect to={toPublicUrl(PageName.TOP)} />
        </Switch>
      </div>
    </React.Fragment>
  </LocaleProvider>
);

export default Application;
