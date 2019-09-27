import { Breadcrumb, Icon } from 'antd';
import { History } from 'history';
import * as React from 'react';

import PageName, { toPublicUrl } from '../../constants/PageName';
import { IBreadCrump, IBreadCrumpItem } from '../../models/wireframe/BreadCrump';
import { useColor } from '../../utils/HooksUtils';

const BreadCrumpItem = ({ label, key, open }: IBreadCrumpItem) => {
  const [color, setColor] = useColor('unset');

  return (
    <Breadcrumb.Item key={key}>
      <span
        onMouseOver={() => setColor('#55f')}
        onMouseLeave={() => setColor('unset')}
        style={{ color: color }}
        onClick={() => open()}
      >
        {label}
      </span>
    </Breadcrumb.Item>
  );
};

const breadCrump = (children: IBreadCrump[], history: History) => (
  <Breadcrumb style={{ margin: 0 }}>
    <BreadCrumpItem label={<Icon type="home" />} key="top" open={() => history.push(toPublicUrl(PageName.TOP))} />
    {children.map(({ href, label, hrefWithId }, idx) =>
      !!hrefWithId ? (
        <BreadCrumpItem label={label} key={idx} open={() => history.push(hrefWithId)} />
      ) : !!href ? (
        <BreadCrumpItem label={label} key={idx} open={() => history.push(toPublicUrl(href))} />
      ) : (
        <Breadcrumb.Item key={idx}>{label}</Breadcrumb.Item>
      )
    )}
  </Breadcrumb>
);

export default breadCrump;
