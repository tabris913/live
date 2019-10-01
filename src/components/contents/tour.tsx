import { Button, Col, List, Row, Spin } from 'antd';
import * as React from 'react';
import { MainProps, TourUid } from '../../models/Main';
import { toLive } from '../../utils/LiveUtils';

const Tour = (props: MainProps<TourUid>) => {
  return props.content && props.content.liveList ? (
    <>
      <Button type="primary" style={{ marginBottom: 5, width: 100 }}>
        Summary
      </Button>
      (ツアーのサマリを表示させる)
      <List
        dataSource={props.content.liveList}
        renderItem={item => (
          <List.Item style={{ overflowWrap: 'break-word' }}>
            <Button
              type="link"
              onClick={() => toLive(props.match.params.id, item.uid, props.history)}
              style={{ whiteSpace: 'unset', textAlign: 'left', marginTop: 5, marginBottom: 5 }}
            >
              <Row>
                <Col>[{item.date}]</Col>
                <Col>{item.name}</Col>
                <Col>({item.place})</Col>
              </Row>
            </Button>
          </List.Item>
        )}
      />
    </>
  ) : (
    <Spin />
  );
};

export default Tour;
