import { Button, Descriptions, List, Spin } from 'antd';
import * as React from 'react';
import { LiveUid, MainProps } from '../../models/Main';
import { toSong } from '../../utils/SongUtils';

const Live = (props: MainProps<LiveUid>) => {
  return props.content && props.content.live && props.content.songList ? (
    <>
      <Descriptions column={1}>
        <Descriptions.Item label="date">{props.content.live.date}</Descriptions.Item>
        <Descriptions.Item label="place">{props.content.live.place}</Descriptions.Item>
      </Descriptions>
      <List
        dataSource={props.content.songList}
        renderItem={item => (
          <List.Item>
            {item.uid === 'encore' ? (
              <>Encore</>
            ) : (
              <>
                {`${item.track_no! > 9 ? item.track_no! : `0${item.track_no!}`}`}.
                <Button type="link" onClick={() => toSong(props.match.params.id, item.uid, props.history)}>
                  {item.name}
                </Button>
              </>
            )}
          </List.Item>
        )}
        size="small"
        style={{ overflowY: 'auto' }}
      />
    </>
  ) : (
    <Spin />
  );
};

export default Live;
