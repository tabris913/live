import { Button, Col, Collapse, Row } from 'antd';
import * as React from 'react';
import ISong, { ISongs } from '../../models/contents/song';
import { IWorks } from '../../models/contents/work';
import { MainProps, WorkUid } from '../../models/Main';
import { getSongs } from '../../utils/SongUtils';
import { getWorks } from '../../utils/WorksUtils';

interface IState {
  works: IWorks | undefined;
  songs: {
    [workUid: string]: ISong[];
  };
}

const Works = (props: MainProps<WorkUid>) => {
  const [localState, setLocalState] = React.useState<IState>({ works: undefined, songs: {} });

  React.useState(() => {
    getSongs(props.match.params.id).then(fr => {
      fr.onload = () => {
        // @ts-ignore
        const songs: ISongs = JSON.parse(fr.result as string);
        getWorks(props.match.params.id).then(fr2 => {
          fr2.onload = () => {
            const works: IWorks = JSON.parse(fr2.result as string);
            setLocalState({
              ...localState,
              works: works,
              songs: Object.values(works).reduce(
                (prev, w) => ({ ...prev, [w.uid as string]: w.songs.map(songUid => songs[songUid as string]) }),
                {} as any
              ),
            });
          };
        });
      };
    });
  });

  return localState.works ? (
    <Collapse style={{ overflowY: 'auto' }}>
      {Object.values(localState.works).map(work => (
        <Collapse.Panel header={work.name} key={work.uid as string}>
          <Row>
            {localState.songs[work.uid as string].map(song => (
              <Col key={song.uid as string}>
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
