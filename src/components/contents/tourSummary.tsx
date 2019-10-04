import { Button, Checkbox, Divider, List, Typography } from 'antd';
import React from 'react';
import IWork from '../../models/contents/work';
import { MainProps, TourUid } from '../../models/Main';
import { toTour } from '../../utils/LiveUtils';
import { toSong } from '../../utils/SongUtils';

interface State {
  containesSongsFocused: boolean;
  isFocused: {
    [uid: string]: boolean;
  };
}

const initialState: State = {
  containesSongsFocused: false,
  isFocused: {},
};

const TourSummary = (props: MainProps<TourUid>) => {
  const [localState, setLocalState] = React.useState<State>(initialState);

  React.useState(() => {
    if (props.content) {
      const relatedWorks: IWork[] = [];
      if (props.content.works && props.content.liveInfo && props.content.liveInfo.relatedWorks) {
        for (const relatedWork of props.content.liveInfo.relatedWorks) {
          if (Object.keys(props.content.works).includes(relatedWork as string)) {
            relatedWorks.push(props.content.works[relatedWork as string]);
          }
        }
      }
      if (props.content.songList) {
        setLocalState({
          ...localState,
          isFocused: props.content.songList.reduce(
            (prev, current) => ({
              ...prev,
              [current.uid as string]:
                relatedWorks.length > 0
                  ? relatedWorks.filter(relatedWork => relatedWork.songs.includes(current.uid)).length > 0
                  : false,
            }),
            {}
          ),
        });
      }
    }
  });

  const TimePlayed = () =>
    props.content && props.content.songList ? (
      <>
        <Typography.Title level={4}>曲ごとの演奏回数</Typography.Title>
        <Checkbox
          checked={localState.containesSongsFocused}
          onChange={e => setLocalState({ ...localState, containesSongsFocused: e.target.checked })}
        >
          フォーカス曲を含む
        </Checkbox>
        <List
          dataSource={props.content.songList
            .filter(song => (localState.containesSongsFocused ? true : !localState.isFocused[song.uid as string]))
            .sort((a, b) => {
              if (a.misc && b.misc) {
                if (a.misc!.times < b.misc!.times) return 1;
                if (a.misc!.times > b.misc!.times) return -1;
              }
              // 回数が同じなら uid 順
              return Number(a.uid.slice(-3)) < Number(b.uid.slice(-3)) ? -1 : 1;
            })}
          renderItem={item => (
            <List.Item>
              {item.uid.startsWith('[unknown]') ? (
                <Button type="link" style={{ color: 'unset' }}>
                  {item.name} (
                  {item.misc
                    ? `${item.misc.times} / ${(item.misc.times / props.content!.liveInfo!.number) * 100}%`
                    : '?'}
                  )
                </Button>
              ) : (
                <Button type="link" onClick={() => toSong(props.match.params.id, item.uid, props.history)}>
                  {item.name} (
                  {item.misc
                    ? `${item.misc.times}回 / ${((item.misc.times / props.content!.liveInfo!.number) * 100).toFixed(
                        2
                      )}%`
                    : '?'}
                  )
                </Button>
              )}
            </List.Item>
          )}
          size="small"
          bordered={true}
        />
      </>
    ) : (
      <></>
    );

  return (
    <div style={{ overflowY: 'auto' }}>
      <TimePlayed />
      <p>曲順の法則性とかも表示したい</p>
      {/* memo.txt */}
      <Divider />
      <Button
        type="primary"
        onClick={() => toTour(props.match.params.id, props.query.id!, props.history)}
        style={{ width: 200 }}
      >
        ツアーページへ
      </Button>
    </div>
  );
};

export default TourSummary;
