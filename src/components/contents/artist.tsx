import { Button, Col, Row } from 'antd';
import * as React from 'react';
import { ArtistUid, MainProps } from '../../models/Main';
import { toWorks } from '../../utils/WorksUtils';

const colStyle: React.CSSProperties = { margin: 10 };
const buttonStyle: React.CSSProperties = { width: 200, fontSize: 20 };

const Artist = (props: MainProps<ArtistUid>) => (
  <Row>
    <Col style={colStyle}>
      <Button type="primary" style={buttonStyle}>
        Lives
      </Button>
    </Col>
    <Col style={colStyle}>
      <Button type="primary" style={buttonStyle} onClick={() => toWorks(props.match.params.id, props.history)}>
        Songs
      </Button>
    </Col>
  </Row>
);

export default Artist;
