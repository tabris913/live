import { Button, Col, Collapse, Row, Spin } from 'antd';
import * as React from 'react';
import { MainProps, WorkUid } from '../../models/Main';
import { toSong } from '../../utils/SongUtils';

interface Props extends MainProps<WorkUid> {}

const Works = (props: Props) => {
  return props.content && props.content.works ? (
    <Collapse style={{ overflowY: 'auto' }}>
      {Object.values(props.content.works).map(work => (
        <Collapse.Panel header={work.name} key={work.uid as string}>
          <Row>
            {work.songs_detail &&
              Object.values(work.songs_detail).map(song => (
                <Col key={song.uid as string}>
                  <Button type="link" onClick={() => toSong(props.match.params.id, song.uid, props.history)}>
                    {song.name}
                  </Button>
                </Col>
              ))}
          </Row>
        </Collapse.Panel>
      ))}
    </Collapse>
  ) : (
    <Spin />
  );
};

export default Works;
