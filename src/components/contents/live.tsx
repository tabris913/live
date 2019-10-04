import { Button, Descriptions, List, Spin, Divider } from 'antd';
import * as React from 'react';
import { LiveUid, MainProps } from '../../models/Main';
import { toSong } from '../../utils/SongUtils';
import { toTour } from '../../utils/LiveUtils';
import { toLives } from '../../utils/LivesUtils';

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
                {item.uid.startsWith('[unknown]') ? (
                  <Button type="link" style={{ color: 'unset' }}>
                    {item.name}
                  </Button>
                ) : (
                  <Button type="link" onClick={() => toSong(props.match.params.id, item.uid, props.history)}>
                    {item.name}
                  </Button>
                )}
              </>
            )}
          </List.Item>
        )}
        size="small"
        style={{ overflowY: 'auto' }}
      />
      <Divider />
      <Button
        type="primary"
        onClick={() =>
          props.content!.live!.is_tour
            ? toTour(props.match.params.id, props.content!.liveInfo!.uid, props.history)
            : toLives(props.match.params.id, props.history)
        }
        style={{ width: 200 }}
      >
        {props.content.live.is_tour ? 'ツアーページへ' : 'ライブ一覧へ'}
      </Button>
    </>
  ) : (
    <Spin />
  );
};

export default Live;
