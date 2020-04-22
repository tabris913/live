import { Button, Col, Row, Spin } from 'antd';
import * as React from 'react';
import { ArtistUid, MainProps, SongUid } from '../../models/Main';

const colStyle: React.CSSProperties = { margin: 10, fontSize: 'large' };
const buttonStyle: React.CSSProperties = { width: 400, fontSize: 20 };

interface State {
  targetA: SongUid;
  targetB: SongUid;
  targetList: SongUid[];
  result: {
    [x: string]: { prefer: SongUid[]; same: SongUid[]; dislike: SongUid[] };
  };
  asked: Array<[SongUid, SongUid]>;
}

const initial: State = {
  targetA: '',
  targetB: '',
  targetList: [],
  result: {},
  asked: [],
};

const Choice = (props: MainProps<ArtistUid>) => {
  const [localState, setLocalState] = React.useState<State>(initial);

  const randomChoice = (list: SongUid[], avoidList?: SongUid[]) => {
    let next;

    do {
      next = list[Math.floor(Math.random() * list.length)];
    } while ((avoidList || []).includes(next));

    return next;
  };

  React.useState(() => {
    const list = props.content && props.content.songs ? Object.values(props.content.songs).map(song => song.uid) : [];
    const A = randomChoice(list);
    const B = randomChoice(list, [A]);

    setLocalState({ ...localState, targetA: A, targetB: B, targetList: list });
  });

  const select = (value: string) => {
    const check = () => {
      let toRemove: SongUid[] = [];
      Object.entries(result).forEach(([key, song]) => {
        if (song.prefer.length > 10) {
          toRemove = song.same.concat(song.dislike).concat(key);
        } else if (song.prefer.length + song.same.length > 10) {
          toRemove = song.dislike;
        }
      });
      nextList = nextList.filter(s => !toRemove.includes(s));
      result = Object.entries(result).reduce(
        (prev, [curK, curV]) => (toRemove.includes(curK) ? prev : { ...prev, [curK]: curV }),
        {}
      );
    };
    const localA = localState.targetA as string;
    const localB = localState.targetB as string;
    let nextA = localState.targetA;
    let nextB = localState.targetB;
    let nextList = localState.targetList;
    let result: State['result'] = { ...localState.result };
    if (value === 'A') {
      if (Object.keys(result).includes(localA)) result[localA].dislike.push(localB);
      else result[localA] = { prefer: [], same: [], dislike: [localB] };
      if (Object.keys(result).includes(localB)) result[localB].prefer.push(localA);
      else result[localB] = { prefer: [localA], same: [], dislike: [] };
      check();
      if (nextList.length > 0) nextA = randomChoice(nextList, [nextB, localA]);
    } else if (value === 'B') {
      if (Object.keys(result).includes(localB)) result[localB].dislike.push(localA);
      else result[localB] = { prefer: [], same: [], dislike: [localA] };
      if (Object.keys(result).includes(localA)) result[localA].prefer.push(localB);
      else result[localA] = { prefer: [localB], same: [], dislike: [] };
      check();
      if (nextList.length > 0) nextB = randomChoice(nextList, [nextA, localB]);
    } else if (value === 'C') {
      if (Object.keys(result).includes(localA)) result[localA].same.push(localB);
      else result[localA] = { prefer: [], same: [localB], dislike: [] };
      if (Object.keys(result).includes(localB)) result[localB].same.push(localA);
      else result[localB] = { prefer: [], same: [localA], dislike: [] };
    } else if (value === 'D') {
      nextList = nextList.filter(id => id !== localA);
      if (nextList.length > 0) nextA = randomChoice(nextList, [nextB]);
    } else if (value === 'E') {
      nextList = nextList.filter(id => id !== localB);
      if (nextList.length > 0) nextB = randomChoice(nextList, [nextA]);
    } else {
      nextList = nextList.filter(id => id !== localB && id !== localA);
      if (nextList.length > 0) {
        nextA = randomChoice(nextList);
        nextB = randomChoice(nextList, [nextA]);
      }
    }
    while (nextList && (localState.asked.includes([nextA, nextB]) || localState.asked.includes([nextB, nextA]))) {
      nextB = randomChoice(nextList, [nextB]);
    }
    setLocalState({
      targetA: nextA,
      targetB: nextB,
      result: result,
      targetList: nextList,
      asked: ([[localState.targetA, localState.targetB]] as Array<[SongUid, SongUid]>).concat(localState.asked),
    });
  };

  return props.content && props.content.songs && localState.targetA && localState.targetB ? (
    <Row style={{ textAlign: 'center', overflowY: 'auto' }}>
      {console.log(localState)}
      {localState.targetList.length > 0 ? (
        <>
          <Col style={colStyle}>好きな方を選んで下さい</Col>
          <Col style={colStyle}>A: 「{props.content.songs[localState.targetA as string].name}」</Col>
          <Col style={colStyle}>B: 「{props.content.songs[localState.targetB as string].name}」</Col>
          <Col style={colStyle}>
            <Button type="primary" style={buttonStyle} onClick={() => select('A')}>
              Aが好き
            </Button>
          </Col>
          <Col style={colStyle}>
            <Button type="primary" style={buttonStyle} onClick={() => select('B')}>
              Bが好き
            </Button>
          </Col>
          <Col style={colStyle}>
            <Button type="primary" style={buttonStyle} onClick={() => select('C')}>
              決められない
            </Button>
          </Col>
          <Col style={colStyle}>
            <Button type="primary" style={buttonStyle} onClick={() => select('D')}>
              Aを知らない
            </Button>
          </Col>
          <Col style={colStyle}>
            <Button type="primary" style={buttonStyle} onClick={() => select('E')}>
              Bを知らない
            </Button>
          </Col>
          <Col style={colStyle}>
            <Button type="primary" style={buttonStyle} onClick={() => select('F')}>
              両方知らない
            </Button>
          </Col>
          <Col style={colStyle}>
            最大であと {(localState.targetList.length * (localState.targetList.length - 1)) / 2} 回
          </Col>
        </>
      ) : (
        <>finished</>
      )}
    </Row>
  ) : (
    <Spin />
  );
};

export default Choice;
