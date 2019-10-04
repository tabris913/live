import { Button, Checkbox, List, Typography } from 'antd';
import React from 'react';
import { MainProps, TourUid } from '../../models/Main';
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
  console.log(localState);

  React.useState(() => {
    if (props.content) {
      const relatedWork =
        props.content.works &&
        props.content.liveInfo &&
        props.content.liveInfo.relatedWork &&
        Object.keys(props.content.works).includes(props.content.liveInfo.relatedWork as string)
          ? props.content.works[props.content.liveInfo.relatedWork as string]
          : undefined;
      console.log(relatedWork);
      if (props.content.songList) {
        setLocalState({
          ...localState,
          isFocused: props.content.songList.reduce(
            (prev, current) => ({
              ...prev,
              [current.uid as string]: relatedWork ? relatedWork.songs.includes(current.uid) : false,
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
              if (a.misc!.times < b.misc!.times) return 1;
              if (a.misc!.times > b.misc!.times) return -1;
              // 回数が同じなら uid 順
              return Number(a.uid.slice(-3)) < Number(b.uid.slice(-3)) ? -1 : 1;
            })}
          renderItem={item => (
            <List.Item>
              <Button type="link" onClick={() => toSong(props.match.params.id, item.uid, props.history)}>
                {item.name} ({item.misc!.times})
              </Button>
            </List.Item>
          )}
          size="small"
          style={{ overflowY: 'auto' }}
          bordered={true}
        />
      </>
    ) : (
      <></>
    );

  return (
    <>
      <TimePlayed />
      <p>曲順の法則性とかも表示したい</p>
      {/* memo.txt */}
    </>
  );
};

export default TourSummary;
