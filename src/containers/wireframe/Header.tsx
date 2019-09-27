import { Col, Layout, Menu, Row } from 'antd';
import { History } from 'history';
import * as React from 'react';

import PageName, { toPublicUrl } from '../../constants/PageName';

const style: React.CSSProperties = {
  background: '#eee',
  // padding: '20px 0px 0px 10px',
  // borderBottom: 'solid 1px',
  // fontSize: '400%',
  // fontFamily: 'Monotype Corsiva',
  verticalAlign: 'middle',
  padding: 'unset',
  // height: 100,
};

// props from parent
interface IOwnProps {
  // logout: () => void;
}

// props of this component extracted from Store
interface IStateProps {}

// entire props of this component
type Props = IStateProps & IOwnProps & { history: History };

export const Header = (props: Props) => {
  return (
    <Layout.Header style={style}>
      <Menu theme="dark" defaultSelectedKeys={['0']} mode="horizontal" style={{ lineHeight: '40px' }}>
        <Row type="flex">
          {[{ label: 'Top', linkto: PageName.TOP }].map(({ label, linkto }, idx) => (
            <Col key={idx} xs={8} lg={4} style={{ textAlign: 'center', fontSize: 20 }}>
              <Menu.Item
                key={idx.toString()}
                onClick={() => props.history.push(toPublicUrl(linkto || PageName.UNDEFINED))}
              >
                {label}
              </Menu.Item>
            </Col>
          ))}
        </Row>
      </Menu>
      {/* <Menu theme="dark" defaultSelectedKeys={[]} mode="horizontal" style={{ lineHeight: '40px' }}>
        <Row>
          {[
            { label: 'Unit', linkto: PageName.UNIT_LIST },
            { label: 'Character', linkto: PageName.CHARACTER_LIST },
            { label: 'Card', linkto: PageName.CARD_LIST },
          ].map(({ label, linkto }, idx) => (
            <Col key={idx} xs={8} style={{ textAlign: 'center', fontSize: 20 }}>
              <Menu.Item
                key={idx.toString()}
                onClick={() => props.history.push(toPublicUrl(linkto || PageName.UNDEFINED))}
              >
                {label}
              </Menu.Item>
            </Col>
          ))}
        </Row>
      </Menu> */}
    </Layout.Header>
  );
};

export default Header;
