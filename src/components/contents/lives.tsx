import { Button, Collapse, List, Spin } from 'antd';
import * as React from 'react';
import { LiveUid, MainProps } from '../../models/Main';
import { toLive, toTour } from '../../utils/LiveUtils';

const LiveList = (props: MainProps<LiveUid>) => {
  const [keys, setKeys] = React.useState<string[]>([]);

  React.useState(() => {
    if (props.content && props.content.lives) {
      setKeys(Object.keys(props.content.lives).sort((a, b) => (Number(a) < Number(b) ? 1 : -1)));
    }
  });

  return keys.length > 0 ? (
    <Collapse>
      {keys.map(year => (
        <Collapse.Panel header={year} key={year}>
          <List
            dataSource={Object.values(props.content!.lives![year])}
            renderItem={item => (
              <List.Item>
                <Button
                  type="link"
                  onClick={() => (item.is_tour ? toTour : toLive)(props.match.params.id, item.uid, props.history)}
                >
                  {item.name}
                </Button>
              </List.Item>
            )}
          />
        </Collapse.Panel>
      ))}
    </Collapse>
  ) : (
    <Spin />
  );
};

export default LiveList;
