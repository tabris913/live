import { Button, Col, Row, Spin } from 'antd';
import * as R from 'ramda';
import * as React from 'react';
import { ArtistUid, MainProps, SongUid } from '../../models/Main';

const colStyle: React.CSSProperties = { margin: 10, fontSize: 'large' };
const buttonStyle: React.CSSProperties = { width: 400, fontSize: 20 };
const buttonStyle2: React.CSSProperties = { width: 195, fontSize: 20 };

interface State {
  targetA: SongUid;
  targetB: SongUid;
  targetList: SongUid[];
  result: {
    [x: string]: { prefer: SongUid[]; same: SongUid[]; dislike: SongUid[] };
  };
  asked: Array<[SongUid, SongUid]>;
  finished: boolean;
}

const initial: State = {
  targetA: '',
  targetB: '',
  targetList: [],
  result: {},
  asked: [],
  finished: false,
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
        if (song.prefer.length >= 10) {
          toRemove = song.same.concat(song.dislike).concat(key);
        }
        // else if (song.prefer.length + song.same.length >= 10) {
        //   toRemove = song.dislike;
        // }
      });
      nextList = nextList.filter(s => !toRemove.includes(s));
      // result自体から消す
      result = Object.entries(result).reduce(
        (prev, [curK, curV]) =>
          toRemove.includes(curK)
            ? prev
            : {
                ...prev,
                // 子要素からも消す
                [curK]: {
                  prefer: curV.prefer.filter(s => nextList.includes(s)),
                  same: curV.same.filter(s => nextList.includes(s)),
                  dislike: curV.dislike.filter(s => nextList.includes(s)),
                },
              },
        {}
      );

      const innerCheckSame = (id: SongUid, checked: SongUid[]) => {
        let newChecked = [...checked];
        for (const id2 of result[id as string].same) {
          if (!newChecked.includes(id2)) {
            newChecked.push(id2);
            newChecked = innerCheckSame(id2, newChecked);
          }
        }
        return newChecked;
      };
      const innerCheckDislike = (id: SongUid, checked: SongUid[]) => {
        let newChecked = [...checked];
        for (const id2 of result[id as string].dislike.concat(result[id as string].same)) {
          if (!newChecked.includes(id2)) {
            newChecked.push(id2);
            newChecked = innerCheckDislike(id2, newChecked);
          }
        }
        return newChecked;
      };
      const innerCheckPrefer = (id: SongUid, checked: SongUid[]) => {
        let newChecked = [...checked];
        for (const id2 of result[id as string].prefer.concat(result[id as string].same)) {
          if (!newChecked.includes(id2)) {
            newChecked.push(id2);
            newChecked = innerCheckPrefer(id2, newChecked);
          }
        }
        return newChecked;
      };
      // 先をつなげる
      for (const sid of Object.keys(result)) {
        // 中
        let checked: SongUid[] = [];
        result[sid].same = innerCheckSame(sid, []).filter(s => s !== sid);
        for (const id2 of result[sid].dislike) {
          checked.push(...innerCheckDislike(id2, checked));
        }
        result[sid].dislike = R.uniq(checked);
        checked = [];
        for (const id2 of result[sid].prefer) {
          checked.push(...innerCheckPrefer(id2, checked));
        }
        result[sid].prefer = R.uniq(checked);
      }
    };

    const like = (better: string, worse: string) => {
      console.log(better, worse);

      if (Object.keys(result).includes(better)) {
        result[better].dislike.push(worse);
        if (Object.keys(result).includes(worse)) {
          result[better].dislike.push(...result[worse].same.filter(s => s !== better));
          result[better].dislike.push(...result[worse].dislike.filter(s => s !== better));
        }
      } else {
        result[better] = { prefer: [], same: [], dislike: [worse] };
        if (Object.keys(result).includes(worse)) {
          result[better].dislike.push(...result[worse].same.filter(s => s !== better));
          result[better].dislike.push(...result[worse].dislike.filter(s => s !== better));
        }
      }
      if (Object.keys(result).includes(worse)) {
        result[worse].prefer.push(better);
        if (Object.keys(result).includes(better)) {
          result[worse].prefer.push(...result[better].same.filter(s => s !== worse));
          result[worse].prefer.push(...result[better].dislike.filter(s => s !== worse));
        }
      } else {
        result[worse] = { prefer: [better], same: [], dislike: [] };
        if (Object.keys(result).includes(better)) {
          result[worse].prefer.push(...result[better].same.filter(s => s !== worse));
          result[worse].prefer.push(...result[better].dislike.filter(s => s !== worse));
        }
      }
    };

    const localA = localState.targetA as string;
    const localB = localState.targetB as string;
    let nextA = localState.targetA;
    let nextB = localState.targetB;
    let nextList = localState.targetList;
    let nextFinished = false;
    let result: State['result'] = { ...localState.result };

    if (value === 'A') {
      like(localA, localB);
      check();
      if (nextList.length > 0) {
        if (!nextList.includes(nextB)) nextB = randomChoice(nextList);
        if (nextList.filter(s => s !== localA && s !== nextB).length > 0) {
          nextA = randomChoice(nextList, [nextB, localA]);
        }
      }
    } else if (value === 'B') {
      like(localB, localA);
      check();
      if (nextList.length > 0) {
        if (!nextList.includes(nextA)) nextA = randomChoice(nextList);
        if (nextList.filter(s => s !== nextA && s !== localB).length > 0) {
          nextB = randomChoice(nextList, [nextA, localB]);
        }
      }
    } else if (value === 'C') {
      if (Object.keys(result).includes(localA)) {
        result[localA].same.push(localB);
        if (Object.keys(result).includes(localB)) {
          result[localA].same.push(...result[localB].same.filter(s => s !== localA));
        }
      } else {
        result[localA] = { prefer: [], same: [localB], dislike: [] };
        if (Object.keys(result).includes(localB)) {
          result[localA].same.push(...result[localB].same.filter(s => s !== localA));
        }
      }
      if (Object.keys(result).includes(localB)) {
        result[localB].same.push(localA);
        if (Object.keys(result).includes(localA)) {
          result[localB].same.push(...result[localA].same.filter(s => s !== localB));
        }
      } else {
        result[localB] = { prefer: [], same: [localA], dislike: [] };
        if (Object.keys(result).includes(localA)) {
          result[localB].same.push(...result[localA].same.filter(s => s !== localB));
        }
      }
      check();
      if (nextList.length > 0) {
        if (!nextList.includes(nextA)) nextA = randomChoice(nextList);
        if (!nextList.includes(nextB)) nextB = randomChoice(nextList);
        if (nextList.filter(s => s !== nextA && s !== localB).length > 0) {
          nextB = randomChoice(nextList, [nextA, localB]);
        }
      }
    } else if (value === 'D') {
      nextList = nextList.filter(id => id !== localA);
      if (nextList.filter(s => s !== nextB).length > 0) nextA = randomChoice(nextList, [nextB]);
    } else if (value === 'E') {
      nextList = nextList.filter(id => id !== localB);
      if (nextList.filter(s => s !== nextA).length > 0) nextB = randomChoice(nextList, [nextA]);
    } else {
      nextList = nextList.filter(id => id !== localB && id !== localA);
      if (nextList.length > 0) {
        nextA = randomChoice(nextList);
        if (nextList.filter(s => s !== nextA).length > 0) nextB = randomChoice(nextList, [nextA]);
      }
    }
    while (nextList && (localState.asked.includes([nextA, nextB]) || localState.asked.includes([nextB, nextA]))) {
      nextB = randomChoice(nextList, [nextB]);
    }

    if (nextList.filter(s => s !== localA && s !== localB).length < 1) nextFinished = true;

    setLocalState({
      targetA: nextA,
      targetB: nextB,
      result: result,
      targetList: nextList,
      asked: R.uniq(
        ([[localState.targetA, localState.targetB]] as Array<[SongUid, SongUid]>)
          .concat(localState.asked)
          .filter(([valueA, valueB]) => nextList.includes(valueA) && nextList.includes(valueB))
      ),
      finished: nextFinished,
    });
  };

  return props.content && props.content.songs && localState.targetA && localState.targetB ? (
    <Row style={{ textAlign: 'center', overflowY: 'auto' }}>
      {console.log(localState)}
      {!localState.finished ? (
        <>
          <Col style={colStyle}>好きな方を選んで下さい</Col>
          <Col style={colStyle}>A: 「{props.content.songs[localState.targetA as string].name}」</Col>
          <Col style={colStyle}>B: 「{props.content.songs[localState.targetB as string].name}」</Col>
          <Col style={colStyle}>
            <Button type="primary" style={{ ...buttonStyle2, marginRight: 5 }} onClick={() => select('A')}>
              Aが好き
            </Button>
            <Button type="primary" style={{ ...buttonStyle2, marginLeft: 5 }} onClick={() => select('B')}>
              Bが好き
            </Button>
          </Col>
          <Col style={colStyle}>
            <Button type="primary" style={buttonStyle} onClick={() => select('C')}>
              決められない
            </Button>
          </Col>
          <Col style={colStyle}>
            <Button type="primary" style={{ ...buttonStyle2, marginRight: 5 }} onClick={() => select('D')}>
              Aを除外する
            </Button>
            <Button type="primary" style={{ ...buttonStyle2, marginLeft: 5 }} onClick={() => select('E')}>
              Bを除外する
            </Button>
          </Col>
          <Col style={colStyle}>
            <Button type="primary" style={buttonStyle} onClick={() => select('F')}>
              両方除外する
            </Button>
          </Col>
          <Col style={colStyle}>「除外する」 ... 知らない／思い出せない／絶対に入らない</Col>
          <Col style={colStyle}>
            最大であと{' '}
            {(localState.targetList.length * (localState.targetList.length - 1)) / 2 - localState.asked.length} 回
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
