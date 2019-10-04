import { Button, Collapse, Divider, List, Spin, Typography } from 'antd';
import * as React from 'react';
import PageName, { toPublicUrl } from '../../constants/PageName';
import { LiveUid, MainProps } from '../../models/Main';
import { toLive } from '../../utils/LiveUtils';
import { toWorks } from '../../utils/WorksUtils';

const Song = (props: MainProps<LiveUid>) => {
  return props.content && props.content.song ? (
    <div style={{ overflowY: 'auto' }}>
      <div style={{ marginBottom: 10 }}>
        <Typography.Title level={4}>演奏されたライブ</Typography.Title>
        {!props.content.lives || Object.keys(props.content.lives).length === 0 ? (
          <>なし</>
        ) : (
          <Collapse style={{ overflowY: 'auto' }}>
            {Object.keys(props.content.lives)
              .sort((a, b) => (Number(a) < Number(b) ? 1 : -1))
              .map(year => (
                <Collapse.Panel header={year} key={year}>
                  <List
                    dataSource={Object.values(props.content!.lives![year])}
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
      </div>
      <div style={{ marginBottom: 10 }}>
        <Typography.Title level={4}>収録された作品</Typography.Title>
        {!props.content.works || Object.keys(props.content.works).length === 0 ? (
          <>なし</>
        ) : (
          <List
            dataSource={Object.values(props.content.works)}
            renderItem={item => <List.Item>{item.name}</List.Item>}
            size="small"
          />
        )}
      </div>

      <Button
        type="primary"
        style={{ marginTop: 5, width: 100 }}
        onClick={() =>
          props.history.push(toPublicUrl(PageName.SONG_SUMMARY, [props.match.params.id], { id: props.query.id }))
        }
      >
        Summary
      </Button>
      <Divider />
      <Button type="primary" onClick={() => toWorks(props.match.params.id, props.history)} style={{ width: 200 }}>
        作品一覧へ
      </Button>
    </div>
  ) : (
    <Spin />
  );
};

export default Song;
