import { Button, Col, Collapse, Row } from 'antd';
import * as React from 'react';
import { MainProps } from '../../models/Main';
import { getWorks } from '../../utils/WorksUtils';

const Works = (props: MainProps) => {
  const works = getWorks(props.match.params.id);

  return works ? (
    <Collapse>
      {works.map(work => (
        <Collapse.Panel header={work.name} key={work.uid}>
          <Row>
            {work.songs.map(song => (
              <Col key={song.uid}>
                <Button type="link">{song.name}</Button>
              </Col>
            ))}
          </Row>
        </Collapse.Panel>
      ))}
    </Collapse>
  ) : (
    <></>
  );
};

export default Works;
