import { List } from 'antd';
import * as React from 'react';
import ILive, { ILives } from '../../models/contents/live';
import ISong from '../../models/contents/song';
import { MainProps, SongUid } from '../../models/Main';
import { getLives } from '../../utils/LivesUtils';
import { getSong } from '../../utils/SongUtils';

interface IState {
  song: ISong | undefined;
  lives: ILive[];
}

const Song = (props: MainProps<SongUid>) => {
  const [localState, setLocalState] = React.useState<IState>({ song: undefined, lives: [] });

  React.useState(() => {
    if (props.query.id) {
      getSong(props.match.params.id, props.query.id).then(fr => {
        fr.onload = () => {
          getLives(props.match.params.id).then(fr2 => {
            fr2.onload = () => {
              let lives: ILives = JSON.parse(fr2.result as string);
              lives = Object.entries(lives).reduce((prev, current) => {
                return { ...prev };
              }, {});
            };
          });
          setLocalState({ ...localState, song: JSON.parse(fr.result as string) });
        };
      });
    }
  });

  return (
    <>
      <List dataSource={[]} />
    </>
  );
};

export default Song;
