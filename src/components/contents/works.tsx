import { Button, Col, Collapse, Input, List, Row, Spin } from 'antd';
import * as React from 'react';
import ISong from '../../models/contents/song';
import { MainProps, WorkUid } from '../../models/Main';
import { toSong } from '../../utils/SongUtils';

interface IState {
  searchWord: string;
  results: ISong[];
}

const Works = (props: MainProps<WorkUid>) => {
  const [localState, setLocalState] = React.useState<IState>({ searchWord: '', results: [] });

  return props.content && props.content.works && props.content.songs ? (
    <>
      <Row type="flex" style={{ marginBottom: 5 }}>
        <Col>
          <Input
            defaultValue={localState.searchWord}
            onChange={e => setLocalState({ ...localState, searchWord: e.target.value })}
            placeholder="曲検索"
          />
        </Col>
        <Col>
          <Button
            icon="search"
            type="primary"
            style={{ marginLeft: 5 }}
            onClick={() =>
              setLocalState({
                ...localState,
                results:
                  props.content!.songs && localState.searchWord !== ''
                    ? Object.values(props.content!.songs).filter(song => song.name.includes(localState.searchWord))
                    : [],
              })
            }
          >
            Search
          </Button>
        </Col>
      </Row>
      {localState.results.length > 0 ? (
        <List
          dataSource={localState.results}
          renderItem={item => (
            <List.Item style={{ margin: 0 }}>
              <Button type="link" onClick={() => toSong(props.match.params.id, item.uid, props.history)}>
                {item.name}
              </Button>
            </List.Item>
          )}
          size="small"
        />
      ) : (
        <></>
      )}

      <Collapse style={{ overflowY: 'auto' }}>
        {Object.values(props.content.works).map(work => (
          <Collapse.Panel header={work.name} key={work.uid as string}>
            <Row>
              {work.songs.map(songUid => (
                <Col key={songUid as string}>
                  <Button type="link" onClick={() => toSong(props.match.params.id, songUid, props.history)}>
                    {console.log(
                      songUid,
                      Object.keys(props.content!.songs!).includes(songUid as string),
                      props.content!.songs![songUid as string].name
                    )}
                    {Object.keys(props.content!.songs!).includes(songUid as string) &&
                      props.content!.songs![songUid as string].name}
                  </Button>
                </Col>
              ))}
            </Row>
          </Collapse.Panel>
        ))}
      </Collapse>
    </>
  ) : (
    <Spin />
  );
};

export default Works;