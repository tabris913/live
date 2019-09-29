import { Button, Collapse, List } from 'antd';
import * as React from 'react';
import { ILives } from '../../models/contents/live';
import { LiveUid, MainProps } from '../../models/Main';
import { getLives } from '../../utils/LivesUtils';

interface IState {
  lives: ILives;
  keys: string[];
}

const LiveList = (props: MainProps<LiveUid>) => {
  const [localState, setLocalState] = React.useState<IState>({ lives: {}, keys: [] });

  React.useState(() => {
    getLives(props.match.params.id).then(fr => {
      fr.onload = () => {
        const lives = JSON.parse(fr.result as string);
        setLocalState({ lives: lives, keys: Object.keys(lives).sort((a, b) => (Number(a) < Number(b) ? 1 : -1)) });
      };
    });
  });

  return !!localState.lives ? (
    <Collapse>
      {localState.keys.map(year => (
        <Collapse.Panel header={year} key={year}>
          <List
            dataSource={localState.lives[year]}
            renderItem={item => (
              <List.Item>
                <Button type="link">{item.name}</Button>
              </List.Item>
            )}
          />
        </Collapse.Panel>
      ))}
    </Collapse>
  ) : (
    <></>
  );
};

export default LiveList;
