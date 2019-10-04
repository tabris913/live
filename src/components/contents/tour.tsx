import { Button, Col, Divider, List, Row, Spin } from 'antd';
import * as React from 'react';
import PageName, { toPublicUrl } from '../../constants/PageName';
import { MainProps, TourUid } from '../../models/Main';
import { toLives } from '../../utils/LivesUtils';
import { toLive } from '../../utils/LiveUtils';

const Tour = (props: MainProps<TourUid>) => {
  return props.content && props.content.liveList ? (
    <div style={{ overflowY: 'auto' }}>
      <List
        dataSource={props.content.liveList}
        renderItem={item => (
          <List.Item style={{ overflowWrap: 'break-word' }}>
            <Button
              type="link"
              onClick={() => toLive(props.match.params.id, item.uid, props.history)}
              style={{ whiteSpace: 'unset', textAlign: 'left', marginTop: 5, marginBottom: 5, height: '100%' }}
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
      <Button
        type="primary"
        style={{ marginBottom: 5, width: 100 }}
        onClick={() =>
          props.history.push(toPublicUrl(PageName.TOUR_SUMMARY, [props.match.params.id], { id: props.query.id }))
        }
      >
        Summary
      </Button>
      <Divider />
      <Button type="primary" onClick={() => toLives(props.match.params.id, props.history)} style={{ width: 200 }}>
        ライブ一覧へ
      </Button>
    </div>
  ) : (
    <Spin />
  );
};

export default Tour;
