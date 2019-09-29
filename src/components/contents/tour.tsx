import { Button, List } from 'antd';
import * as React from 'react';
import ILive, { ILiveInfo } from '../../models/contents/live';
import { LiveUid, MainProps } from '../../models/Main';
import { getLive } from '../../utils/LiveUtils';

interface Props extends MainProps<LiveUid> {
  info: ILiveInfo;
}

interface IState {
  lives: {
    [uids: string]: ILive;
  };
}

const Tour = (props: Props) => {
  const [localState, setLocalState] = React.useState<IState>({ lives: {} });

  React.useState(() => {
    for (let i = 1; i <= props.info.number; i = i + 1) {
      const liveUid = `${props.info.uid}_${i > 9 ? i : `0${i}`}`;
      getLive(props.match.params.id, liveUid).then(fr => {
        fr.onload = () => {
          if (!Object.keys(localState.lives).includes(liveUid)) {
            setLocalState({ ...localState, [liveUid]: JSON.parse(fr.result as string) });
          }
        };
      });
    }
  });

  return (
    <List
      dataSource={Object.values(localState.lives)}
      renderItem={item => (
        <List.Item>
          <Button type="link">
            [{item.date}] {item.name} ({item.place})
          </Button>
        </List.Item>
      )}
    />
  );
};

export default Tour;
