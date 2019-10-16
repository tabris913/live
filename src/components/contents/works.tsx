import { Button, Col, Collapse, Divider, Input, List, Row, Spin } from 'antd';
import * as React from 'react';
import ISong from '../../models/contents/song';
import { MainProps, SongUid, WorkUid } from '../../models/Main';
import { toArtist } from '../../utils/ArtistUtils';
import { toSong } from '../../utils/SongUtils';

interface IState {
  searchWord: string;
  results: ISong[];
}

const Works = (props: MainProps<WorkUid>) => {
  const [localState, setLocalState] = React.useState<IState>({ searchWord: '', results: [] });

  const SearchArea = () => {
    const onSearch = () =>
      setLocalState({
        ...localState,
        results:
          props.content!.songs && localState.searchWord !== ''
            ? Object.values(props.content!.songs).filter(song => song.name.includes(localState.searchWord))
            : [],
      });

    return (
      <Row type="flex" style={{ marginBottom: 5 }}>
        <Col>
          <Input
            defaultValue={localState.searchWord}
            onChange={e => setLocalState({ ...localState, searchWord: e.target.value })}
            placeholder="曲検索"
          />
        </Col>
        <Col>
          <Button icon="search" type="primary" style={{ marginLeft: 5 }} onClick={onSearch}>
            Search
          </Button>
        </Col>
      </Row>
    );
  };

  const SearchResultArea = () => {
    const ListItem = ({ item }: { item: ISong }) => (
      <List.Item style={{ margin: 0 }}>
        <Button type="link" onClick={() => toSong(props.match.params.id, item.uid, props.history)}>
          {item.name}
        </Button>
      </List.Item>
    );

    return <List dataSource={localState.results} renderItem={item => <ListItem item={item} />} size="small" />;
  };

  const WorksArea = () => {
    const makeWorkCol = (songUid: SongUid) =>
      props.content && props.content.songs ? (
        <Col key={songUid as string}>
          <Button type="link" onClick={() => toSong(props.match.params.id, songUid, props.history)}>
            {Object.keys(props.content.songs).includes(songUid as string) &&
              props.content.songs[songUid as string].name}
          </Button>
        </Col>
      ) : (
        <></>
      );

    return (
      <Collapse style={{ overflowY: 'auto' }}>
        {props.content && props.content.works && props.content.songs ? (
          Object.values(props.content.works).map(work =>
            Object.keys(work).length > 0 ? (
              <Collapse.Panel header={work.name} key={work.uid as string}>
                <Row>{work.songs.map(makeWorkCol)}</Row>
              </Collapse.Panel>
            ) : (
              <></>
            )
          )
        ) : (
          <Spin />
        )}
      </Collapse>
    );
  };

  return (
    <>
      <SearchArea />
      {localState.results.length > 0 ? <SearchResultArea /> : <WorksArea />}
      <Divider />
      <Button type="primary" onClick={() => toArtist(props.match.params.id, props.history)} style={{ width: 200 }}>
        アーティストページへ
      </Button>
    </>
  );
};

export default Works;
