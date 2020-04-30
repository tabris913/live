import { Button, Col, Row, Spin, Typography } from 'antd';
import * as d3 from 'd3';
import * as R from 'ramda';
import * as React from 'react';
import { ArtistUid, MainProps, SongUid } from '../../models/Main';

// tslint:disable-next-line: no-var-requires
const jsnx = require('jsnetworkx');

const colStyle: React.CSSProperties = { margin: 10, fontSize: 'large' };
const buttonStyle: React.CSSProperties = { width: 400, fontSize: 20 };
const buttonStyle2: React.CSSProperties = { width: 195, fontSize: 20 };

interface State {
  targetA: SongUid;
  targetB: SongUid;
  targetList: SongUid[];
  asked: string[];
  finished: boolean;
  work?: string;
  N: number;
  answer: Array<{ depth: number; songs: SongUid[] }>;
  G: any;
}

const initial: State = {
  targetA: '',
  targetB: '',
  targetList: [],
  asked: [],
  finished: false,
  N: 3,
  answer: [],
  G: new jsnx.DiGraph(),
};

const Choice = (props: MainProps<ArtistUid>) => {
  const [localState, setLocalState] = React.useState<State>(initial);

  const randomChoice = (list: SongUid[], avoidList?: SongUid[]) => {
    const targetlist = list.filter(su => !(avoidList || []).includes(su));

    return targetlist[Math.floor(Math.random() * targetlist.length)];
  };

  const calcC = (list: any[]) => (list.length * (list.length - 1)) / 2;

  React.useState(() => {
    const list = props.content && props.content.songs ? Object.values(props.content.songs).map(song => song.uid) : [];
    const A = randomChoice(list);
    const B = randomChoice(list, [A]);

    setLocalState({ ...localState, targetA: A, targetB: B, targetList: list });
  });

  React.useEffect(() => {
    if (props.content && props.content.works && localState.work !== undefined && localState.work !== 'all') {
      const list = props.content.works[localState.work].songs;
      const A = randomChoice(list);
      const B = randomChoice(list, [A]);

      setLocalState({ ...localState, targetA: A, targetB: B, targetList: list });
    }
  }, [localState.work]);

  React.useLayoutEffect(() => {
    if (localState.work && !localState.finished) {
      jsnx.draw(localState.G, {
        element: '#nx',
        withLabels: true,
        d3: d3,
        labels: (v: any) => props.content!.songs![v.node].name,
      });
    }
  });

  const select = (value: number) => {
    const like = (better: string, worse: string) => {
      if (!G.nodes().includes(better)) G.addNode(better, { songs: [better] });
      if (!G.nodes().includes(worse)) G.addNode(worse, { songs: [worse] });
      G.addEdge(better, worse, { weight: -1 });
    };

    const likeBoth = (a: string, b: string) => {
      if (G.nodes().includes(a)) {
        if (G.nodes().includes(b)) {
          G.node.get(a).songs.push(b);
          G.addEdgesFrom(G.successors(b).map((e: string) => [a, e]), { weight: -1 });
          G.addEdgesFrom(G.predecessors(b).map((e: string) => [e, a]), { weight: -1 });
          G.removeNode(b);
        } else G.node.get(a).songs.push(b);
        nextTarget = nextTarget.filter(su => su !== b);
      } else {
        if (G.nodes().includes(b)) {
          G.node.get(b).songs.push(a);
          nextTarget = nextTarget.filter(su => su !== a);
        } else {
          G.addNode(a, { songs: [a, b] });
          nextTarget = nextTarget.filter(su => su !== b);
        }
      }
    };

    const check = () => {
      let toRemove: string[] = [];
      G.nodes().forEach((node: string) => {
        const pre: string[] = [];
        const prefer: string[] = [];
        for (const key of jsnx.predecessor(G.reverse(), node).keys()) {
          if (key !== node) pre.push(key);
        }
        pre.forEach(p => prefer.push(...G.node.get(p).songs));
        if (prefer.length >= localState.N) toRemove.push(...G.node.get(node).songs);
      });
      toRemove = R.uniq(toRemove);
      G.removeNodesFrom(toRemove);
      nextTarget = nextTarget.filter(su => !toRemove.includes(su as string));

      const connected: string[] = [];
      G.nodes().forEach((s: string) => {
        G.nodes().forEach((t: string) => {
          if (s !== t && jsnx.hasPath(G, { source: s, target: t })) connected.push([s, t].sort().join());
        });
      });

      nextAsked = R.uniq([...connected]);
    };

    const answer = () => {
      const ans: State['answer'] = [];

      const s: string[] = [];
      const t: string[] = [];

      G.nodes().forEach((node: string) => {
        if (G.successors(node).length === 0) t.push(node);
        if (G.predecessors(node).length === 0) s.push(node);
      });
      if (s.length !== 1) throw Error();
      if (t.length !== 1) throw Error();

      let count = 1;
      // const p = jsnx.shortestPath(G);
      jsnx.shortestPath(G, { source: s[0], target: t[0], weight: 'weight' }).forEach((node: string) => {
        ans.push({ depth: count, songs: G.node.get(node).songs });
        count = count + G.node.get(node).songs.length;
      });

      return ans;
    };

    const targetA = localState.targetA as string;
    const targetB = localState.targetB as string;

    let nextA = localState.targetA;
    let nextB = localState.targetB;
    let nextTarget = [...localState.targetList];
    let nextAsked = [...localState.asked];
    const isDefined = false; // localState.targetList.length <= N;
    const G = localState.G;

    switch (value) {
      case 1:
        like(targetA, targetB);
        check();
        if (!isDefined && nextTarget.length > 0) {
          nextA = randomChoice(nextTarget, [nextA, nextB]);
          if (!nextTarget.includes(targetB)) nextB = randomChoice(nextTarget, [nextA]);
        }
        break;
      case 2:
        like(targetB, targetA);
        check();
        if (!isDefined && nextTarget.length > 0) {
          nextB = randomChoice(nextTarget, [nextA, nextB]);
          if (!nextTarget.includes(targetA)) nextA = randomChoice(nextTarget, [nextB]);
        }
        break;
      case 3:
        likeBoth(targetA, targetB);
        check();
        if (!isDefined && nextTarget.length > 1) {
          nextA = randomChoice(nextTarget, [targetA, targetB]);
          nextB = randomChoice(nextTarget, [nextA, targetB]);
        }
        break;
      case 4:
        if (G.nodes().includes(targetA)) G.removeNode(targetA);
        nextTarget = nextTarget.filter(su => su !== targetA);
        check();
        if (!isDefined && nextTarget.length > 0) {
          nextA = randomChoice(nextTarget, [targetB]);
        }
        break;
      case 5:
        if (G.nodes().includes(targetB)) G.removeNode(targetB);
        nextTarget = nextTarget.filter(su => su !== targetB);
        check();
        if (!isDefined && nextTarget.length > 0) {
          nextB = randomChoice(nextTarget, [targetA]);
        }
        break;
      default:
        if (G.nodes().includes(targetA)) G.removeNode(targetA);
        if (G.nodes().includes(targetB)) G.removeNode(targetB);
        nextTarget = nextTarget.filter(su => su !== targetB && su !== targetA);
        check();
        if (!isDefined && nextTarget.length > 1) {
          nextA = randomChoice(nextTarget);
          nextB = randomChoice(nextTarget, [nextA]);
        }
        break;
    }

    if (calcC(nextTarget) <= nextAsked.length) {
      setLocalState({
        ...localState,
        G: G,
        targetA: nextA,
        targetB: nextB,
        targetList: [],
        asked: [],
        finished: true,
        answer: nextTarget.length === 1 ? [] : answer(),
      });
      return;
    }

    while (
      nextAsked.includes([nextA, nextB].join()) ||
      nextAsked.includes([nextB, nextA].join()) ||
      ([nextA, nextB] as [SongUid, SongUid]).sort() === ([targetA, targetB] as [SongUid, SongUid]).sort()
    ) {
      nextA = randomChoice(nextTarget);
      nextB = randomChoice(nextTarget, [nextA]);
    }

    setLocalState({
      ...localState,
      G: G,
      targetA: nextA,
      targetB: nextB,
      targetList: nextTarget,
      asked: nextAsked,
    });
  };

  return props.content && props.content.songs && props.content.works && localState.targetA && localState.targetB ? (
    <Row style={{ textAlign: 'center', overflowY: 'auto' }}>
      {!localState.work ? (
        <>
          <Col>
            <Button onClick={() => setLocalState({ ...localState, work: 'all', N: 10 })} type="danger">
              すべて (10)
            </Button>
          </Col>
          {Object.values(props.content.works)
            .filter(w => w.kind && ['al', 'ba', 'ca'].includes(w.kind))
            .map((w, idx) => (
              <Col key={idx} style={{ margin: 5 }}>
                <Button onClick={() => setLocalState({ ...localState, work: w.uid as string })} type="primary">
                  {w.name} (3)
                </Button>
              </Col>
            ))}
        </>
      ) : !localState.finished ? (
        <>
          <Col style={colStyle}>好きな方を選んで下さい</Col>
          <Col style={colStyle}>A: 「{props.content.songs[localState.targetA as string].name}」</Col>
          <Col style={colStyle}>B: 「{props.content.songs[localState.targetB as string].name}」</Col>
          <Col style={colStyle}>
            <Button type="primary" style={{ ...buttonStyle2, marginRight: 5 }} onClick={() => select(1)}>
              Aが好き
            </Button>
            <Button type="primary" style={{ ...buttonStyle2, marginLeft: 5 }} onClick={() => select(2)}>
              Bが好き
            </Button>
          </Col>
          <Col style={colStyle}>
            <Button type="primary" style={buttonStyle} onClick={() => select(3)}>
              決められない
            </Button>
          </Col>
          <Col style={colStyle}>
            <Button type="primary" style={{ ...buttonStyle2, marginRight: 5 }} onClick={() => select(4)}>
              Aを除外する
            </Button>
            <Button type="primary" style={{ ...buttonStyle2, marginLeft: 5 }} onClick={() => select(5)}>
              Bを除外する
            </Button>
          </Col>
          <Col style={colStyle}>
            <Button type="primary" style={buttonStyle} onClick={() => select(6)}>
              両方除外する
            </Button>
          </Col>
          <Col style={colStyle}>「除外する」 ... 知らない／思い出せない／絶対に入らない</Col>
          <Col style={colStyle}>
            最大であと{' '}
            {(localState.targetList.length * (localState.targetList.length - 1)) / 2 - localState.asked.length} 回
          </Col>
          <Row justify="center" type="flex">
            <Col id="nx" span={9} />
          </Row>
        </>
      ) : (
        <>
          <Col>
            <Typography.Title level={2}>
              Your best songs {localState.work === 'all' ? 'of all' : `in ${props.content.works[localState.work].name}`}
            </Typography.Title>
          </Col>
          {localState.answer
            .sort((a, b) => (a.depth < b.depth ? -1 : 1))
            .map(e => (
              <Col key={e.depth}>
                <Typography.Title level={3}>
                  {e.depth}: {e.songs.map(s => props.content!.songs![s as string].name).join(', ')}
                </Typography.Title>
              </Col>
            ))}
          {localState.answer.length === 0 && <Typography.Title level={3}>測定不能です</Typography.Title>}
        </>
      )}
    </Row>
  ) : (
    <Spin />
  );
};

export default Choice;
