import { Button, List, Spin } from 'antd';
import * as React from 'react';
import { MainProps, TourUid } from '../../models/Main';
import { toLive } from '../../utils/LiveUtils';

const Tour = (props: MainProps<TourUid>) => {
  return props.content && props.content.liveList ? (
    <List
      dataSource={props.content.liveList}
      renderItem={item => (
        <List.Item>
          <Button type="link" onClick={() => toLive(props.match.params.id, item.uid, props.history)}>
            [{item.date}] {item.name} ({item.place})
          </Button>
        </List.Item>
      )}
    />
  ) : (
    <Spin />
  );
};

export default Tour;
