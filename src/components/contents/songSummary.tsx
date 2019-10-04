import { Button, Divider, List, Typography } from 'antd';
import React from 'react';
import { MainProps, SongUid } from '../../models/Main';
import { toSong } from '../../utils/SongUtils';

interface State {
  timesEachTour: {
    [tourUid: string]: number;
  };
  neighbour: {
    front: {
      [songUid: string]: number;
    };
    back: {
      [songUid: string]: number;
    };
  };
}

const initialState: State = {
  timesEachTour: {},
  neighbour: { front: {}, back: {} },
};

const SongSummary = (props: MainProps<SongUid>) => {
  const [localState, setLocalState] = React.useState<State>(initialState);

  React.useState(() => {
    const timesEachTour = {};
    const front = {};
    const back = {};
    console.log(props.content);
    if (props.content && props.content.liveList) {
      if (props.content.lives) {
        for (const year of Object.keys(props.content.lives)) {
          for (const liveInfo of Object.values(props.content.lives[year])) {
            if (liveInfo.is_tour) {
              timesEachTour[liveInfo.uid as string] = props.content.liveList.filter(live =>
                live.uid.startsWith(liveInfo.uid as string)
              ).length;
            }
          }
        }
      }
      for (const live of props.content.liveList) {
        let uid: SongUid;
        switch (live.setlist.indexOf(props.query.id!)) {
          case 0:
            uid = live.setlist[1];
            if (uid === 'encore') uid = live.setlist[2];
            back[uid as string] = Object.keys(back).includes(uid as string) ? back[uid as string] + 1 : 1;
            break;
          case live.setlist.length - 1:
            uid = live.setlist[live.setlist.length - 2];
            if (uid === 'encore') uid = live.setlist[live.setlist.length - 3];
            front[uid as string] = Object.keys(front).includes(uid as string) ? front[uid as string] + 1 : 1;
            break;
          default:
            const index = live.setlist.indexOf(props.query.id!);
            let uid_front = live.setlist[index - 1];
            if (uid_front === 'encore') uid_front = live.setlist[index - 2];
            let uid_back = live.setlist[index + 1];
            if (uid_back === 'encore') uid_back = live.setlist[index + 2];
            back[uid_back as string] = Object.keys(back).includes(uid_back as string)
              ? back[uid_back as string] + 1
              : 1;
            front[uid_front as string] = Object.keys(front).includes(uid_front as string)
              ? front[uid_front as string] + 1
              : 1;
        }
      }
    }
    console.log(timesEachTour, front, back);
    setLocalState({ ...localState, timesEachTour: timesEachTour, neighbour: { front: front, back: back } });
  });

  const TimesEachTour = () => {
    return props.content ? (
      <>
        <Typography.Title level={4}>ツアーごとの演奏回数</Typography.Title>
        {props.content.lives && Object.keys(localState.timesEachTour).length > 0 ? (
          <List
            dataSource={Object.entries(localState.timesEachTour)}
            renderItem={([key, times]) => {
              const year = key.split('_')[0];
              return (
                <List.Item>
                  <Button type="link" style={{ whiteSpace: 'unset', textAlign: 'left' }}>
                    {props.content!.lives![year][key].name}
                  </Button>
                  ({times})
                </List.Item>
              );
            }}
            size="small"
          />
        ) : (
          <>なし</>
        )}
      </>
    ) : (
      <></>
    );
  };

  // ライブでやるときの位置
  const Position = () => <></>;

  // 前後
  const Neighbour = () => {
    return props.content ? (
      <>
        <Typography.Title level={4}>前後</Typography.Title>
        {localState.neighbour && props.content && props.content.songs ? (
          <>
            <Typography.Text style={{ fontSize: 16 }} strong={true}>
              前
            </Typography.Text>
            {Object.keys(localState.neighbour.front).length > 0 ? (
              <List
                dataSource={Object.entries(localState.neighbour.front).sort((a, b) => (a[1] < b[1] ? 1 : -1))}
                renderItem={([songUid, times]) =>
                  Object.keys(props.content!.songs!).includes(songUid) ? (
                    <List.Item>
                      <Button type="link">{props.content!.songs![songUid].name}</Button> ({times})
                    </List.Item>
                  ) : (
                    <></>
                  )
                }
                size="small"
              />
            ) : (
              <p>なし</p>
            )}
            <Typography.Text style={{ fontSize: 16 }} strong={true}>
              後
            </Typography.Text>
            {Object.keys(localState.neighbour.back).length > 0 ? (
              <List
                dataSource={Object.entries(localState.neighbour.back).sort((a, b) => (a[1] < b[1] ? 1 : -1))}
                renderItem={([songUid, times]) =>
                  Object.keys(props.content!.songs!).includes(songUid) ? (
                    <List.Item>
                      <Button type="link">{props.content!.songs![songUid].name}</Button> ({times})
                    </List.Item>
                  ) : (
                    <></>
                  )
                }
                size="small"
              />
            ) : (
              <p>なし</p>
            )}
          </>
        ) : (
          <>なし</>
        )}
      </>
    ) : (
      <></>
    );
  };

  return (
    <div style={{ overflowY: 'auto' }}>
      <TimesEachTour />
      <Position />
      <Neighbour />
      <Divider />
      <Button
        type="primary"
        onClick={() => toSong(props.match.params.id, props.query.id!, props.history)}
        style={{ width: 200 }}
      >
        楽曲ページへ
      </Button>
    </div>
  );
};

export default SongSummary;
