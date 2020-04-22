import { Button, Col, Row, Spin } from 'antd';
import * as React from 'react';
import { ArtistUid, MainProps } from '../../models/Main';
import { toLives } from '../../utils/LivesUtils';
import { toWorks } from '../../utils/WorksUtils';

const colStyle: React.CSSProperties = { margin: 10 };
const buttonStyle: React.CSSProperties = { width: 200, fontSize: 20 };

const Artist = (props: MainProps<ArtistUid>) =>
  props.content && props.content.artist ? (
    <Row style={{ textAlign: 'center', overflowY: 'auto' }}>
      <Col style={colStyle}>
        <Button type="primary" style={buttonStyle} onClick={() => toLives(props.match.params.id, props.history)}>
          Lives
        </Button>
      </Col>
      <Col style={colStyle}>
        <Button type="primary" style={buttonStyle} onClick={() => toWorks(props.match.params.id, props.history)}>
          Songs
        </Button>
      </Col>
      <Col style={colStyle}>
        <Button
          type="primary"
          style={buttonStyle}
          onClick={() => props.history.push(`/choice/${props.match.params.id}`)}
        >
          Choice
        </Button>
      </Col>
      {/* <Col style={colStyle}>
        <Button type="primary" style={buttonStyle}>
          Add Setlist
        </Button>
      </Col>
      <Col>(↑↑↑作成中↑↑↑)</Col> */}
    </Row>
  ) : (
    <Spin />
  );

export default Artist;
