import { Button, Col, Popover, Row } from 'antd';
import * as React from 'react';

import PageName, { toPublicUrl } from '../../constants/PageName';
import { IArtists } from '../../models/contents/artist';
import { ITopButton, MainProps, Uid } from '../../models/Main';
import { getArtists } from '../../utils/ArtistUtils';

// music
// cd
// book

interface IState {
  artists: IArtists;
  buttons: Array<ITopButton<Uid>>;
}

const Top = (props: MainProps<Uid>) => {
  const [localState, setLocalState] = React.useState<IState>({ artists: {}, buttons: [] });

  React.useState(() =>
    getArtists().then(fr => {
      fr.onload = () => {
        const artists: IArtists = JSON.parse(fr.result as string);
        setLocalState({
          ...localState,
          artists: artists,
          buttons: Object.values(artists).reduce(
            (preArtist, curArtist) =>
              preArtist.concat({
                label: curArtist.name,
                linkto: PageName.ARTIST,
                message: undefined,
                query: { id: curArtist.uid },
              }),
            [] as Array<ITopButton<Uid>>
          ),
        });
      };
    })
  );

  return (
    <Row style={{ overflowY: 'auto' }}>
      {localState.buttons.map(({ label, linkto, message, popOver, query }, idx) => (
        <>
          <Col style={{ padding: 5 }} key={idx}>
            <Popover content={popOver} trigger="click" placement="right">
              <Button
                type="link"
                style={{ fontSize: 30, height: '100%' }}
                onClick={
                  popOver
                    ? undefined
                    : () =>
                        props.history.push(
                          toPublicUrl(
                            linkto || PageName.UNDEFINED,
                            query && query.id ? [query.id as string] : undefined
                          )
                        )
                }
              >
                {label}
              </Button>
            </Popover>
          </Col>
          <Col style={{ paddingLeft: 25 }}>{message}</Col>
        </>
      ))}
    </Row>
  );
};

export default Top;
