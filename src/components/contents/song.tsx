import { Button, Collapse, List, Spin, Typography } from 'antd';
import * as React from 'react';
import { LiveUid, MainProps } from '../../models/Main';
import { toLive } from '../../utils/LiveUtils';

const Song = (props: MainProps<LiveUid>) => {
  return props.content && props.content.song ? (
    <>
      <Typography.Title level={4}>演奏されたライブ</Typography.Title>
      {Object.keys(props.content.song.lives).length === 0 ? (
        <>なし</>
      ) : (
        <Collapse style={{ overflowY: 'auto' }}>
          {Object.keys(props.content.song.lives)
            .sort((a, b) => (Number(a) < Number(b) ? 1 : -1))
            .map(year => (
              <Collapse.Panel header={year} key={year}>
                <List
                  dataSource={Object.values(props.content!.song!.lives[year])}
                  renderItem={item => (
                    <List.Item>
                      <Button type="link" onClick={() => toLive(props.match.params.id, item.uid, props.history)}>
                        {item.name}
                      </Button>
                    </List.Item>
                  )}
                  size="small"
                />
              </Collapse.Panel>
            ))}
        </Collapse>
      )}
      <Button type="primary" style={{ marginTop: 5, width: 100 }}>
        Summary
      </Button>
      (曲のサマリを表示させる；ライヴのどのへんでやりやすいとか、前後はこういう曲が多いとか)
    </>
  ) : (
    <Spin />
  );
};

export default Song;
